"""
Service for managing image generation jobs and Replicate API integration.
"""

import asyncio
import logging
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from typing import AsyncGenerator, Dict, List, Optional

import replicate

from app.core.config import settings
from app.models.generation import (
    DoneEventData,
    ErrorEventData,
    GenerationJob,
    GenerationRequest,
    GenerationResult,
    GenerationStatus,
    ProgressEventData,
)

logger = logging.getLogger(__name__)


class GenerationService:
    """Service for handling image generation jobs with Replicate."""

    _jobs: Dict[str, GenerationJob]
    _job_streams: Dict[str, List[asyncio.Queue]]
    _client: replicate.Client
    _executor: ThreadPoolExecutor

    def __init__(self):
        """Initialize the generation service."""
        # In-memory storage for jobs (in production, use Redis or database)
        self._jobs = {}
        self._job_streams = {}

        # Configure Replicate client
        self._client = replicate.Client(api_token=settings.REPLICATE_API_TOKEN)

        # Thread pool for concurrent Replicate calls
        self._executor = ThreadPoolExecutor(max_workers=10)

    def create_job(self, request: GenerationRequest) -> str:
        """
        Create a new generation job and return job ID.

        Args:
            request: Generation request parameters

        Returns:
            str: Unique job ID
        """
        job_id = f"job_{uuid.uuid4().hex[:12]}"

        # Initialize job in the pending state
        results = [
            GenerationResult(index=i, status=GenerationStatus.PENDING)
            for i in range(request.num_images)
        ]

        job = GenerationJob(
            job_id=job_id,
            prompt=request.prompt,
            num_images=request.num_images,
            model=request.model or settings.IMAGE_GEN_MODEL,
            status=GenerationStatus.PENDING,
            results=results,
            created_at=datetime.now(timezone.utc),
        )

        self._jobs[job_id] = job
        self._job_streams[job_id] = []

        logger.info(f"Created generation job {job_id} for {request.num_images} images")

        # Start processing asynchronously
        try:
            asyncio.create_task(self._process_job(job_id))
        except RuntimeError:
            # If no event loop is running, we'll process the job when the loop starts
            # This can happen during testing or initialization
            logger.warning(
                f"No event loop running, job {job_id} will start when loop is available"
            )
            pass

        return job_id

    def get_job(self, job_id: str) -> Optional[GenerationJob]:
        """Get job by ID."""
        return self._jobs.get(job_id)

    async def subscribe_to_job_stream(self, job_id: str) -> AsyncGenerator[str, None]:
        """
        Subscribe to job progress stream.

        Args:
            job_id: Job ID to stream

        Yields:
            str: Server-sent event formatted strings
        """
        if job_id not in self._jobs:
            error_msg = f'{{"error": "Job not found", "job_id": "{job_id}"}}'
            yield f"event: error\ndata: {error_msg}\n\n"
            return

        # Create a queue for this stream
        stream_queue = asyncio.Queue()
        self._job_streams[job_id].append(stream_queue)

        try:
            # Send initial job state
            job = self._jobs[job_id]
            for result in job.results:
                if result.status != GenerationStatus.PENDING:
                    event_data = ProgressEventData(
                        index=result.index,
                        status=result.status,
                        url=result.url,
                        error=result.error,
                    )
                    data_json = event_data.model_dump_json()
                    yield f"event: progress\ndata: {data_json}\n\n"

            # Stream updates
            while True:
                try:
                    event = await asyncio.wait_for(stream_queue.get(), timeout=30.0)
                    yield event

                    # Check if job is complete
                    current_job = self._jobs.get(job_id)
                    if current_job and current_job.status in [
                        GenerationStatus.COMPLETED,
                        GenerationStatus.FAILED,
                    ]:
                        break

                except asyncio.TimeoutError:
                    # Send keep-alive
                    yield "event: keepalive\ndata: {}\n\n"

        except Exception as e:
            logger.error(f"Error in job stream {job_id}: {e}")
            error_data = ErrorEventData(error=str(e), job_id=job_id)
            data_json = error_data.model_dump_json()
            yield f"event: error\ndata: {data_json}\n\n"
        finally:
            # Clean up stream
            if job_id in self._job_streams:
                try:
                    self._job_streams[job_id].remove(stream_queue)
                except ValueError:
                    pass

    async def _process_job(self, job_id: str) -> None:
        """
        Process a generation job by calling Replicate API concurrently.

        Args:
            job_id: Job ID to process
        """
        job = self._jobs[job_id]

        try:
            # Update job status
            job.status = GenerationStatus.RUNNING
            job.started_at = datetime.now(timezone.utc)

            logger.info(f"Starting job {job_id} with {job.num_images} images")

            # Create tasks for concurrent generation
            tasks = []
            for i in range(job.num_images):
                task = asyncio.create_task(
                    self._generate_single_image_async(job_id, i, job.prompt, job.model)
                )
                tasks.append(task)

            # Track timing
            start_time = datetime.now(timezone.utc)
            first_image_time = None
            completed_count = 0

            # Process results as they complete
            for task in asyncio.as_completed(tasks):
                try:
                    result = await task
                    completed_count += 1

                    # Update job result
                    job.results[result.index] = result

                    # Track first image time
                    if (
                        first_image_time is None
                        and result.status == GenerationStatus.SUCCEEDED
                    ):
                        first_image_time = datetime.now(timezone.utc)
                        time_diff = first_image_time - start_time
                        job.ttfi_ms = int(time_diff.total_seconds() * 1000)

                    # Broadcast progress
                    await self._broadcast_progress(job_id, result)

                    logger.info(f"Job {job_id}: Image {result.index} {result.status}")

                except Exception as e:
                    logger.error(f"Error processing image in job {job_id}: {e}")

            # Mark job as completed
            end_time = datetime.now(timezone.utc)
            job.status = GenerationStatus.COMPLETED
            job.completed_at = end_time
            job.total_ms = int((end_time - start_time).total_seconds() * 1000)

            # Send completion event
            await self._broadcast_completion(job_id)

            logger.info(f"Job {job_id} completed in {job.total_ms}ms")

        except Exception as e:
            logger.error(f"Job {job_id} failed: {e}")
            job.status = GenerationStatus.FAILED

            # Broadcast error
            error_data = ErrorEventData(error=str(e), job_id=job_id)
            await self._broadcast_event(job_id, "error", error_data.model_dump())

    async def _generate_single_image_async(
        self, job_id: str, index: int, prompt: str, model: str
    ) -> GenerationResult:
        """
        Generate a single image using Replicate API.

        Args:
            job_id: Job ID
            index: Image index
            prompt: Generation prompt
            model: Model to use

        Returns:
            GenerationResult: Result of the generation
        """
        result = GenerationResult(
            index=index,
            status=GenerationStatus.RUNNING,
            started_at=datetime.now(timezone.utc),
        )

        try:
            logger.info(f"Job {job_id}: Starting image {index} generation")

            # Call Replicate API asynchronously
            loop = asyncio.get_event_loop()
            output = await loop.run_in_executor(
                self._executor,
                lambda: self._client.run(model, input={"prompt": prompt}),
            )

            image_url = None

            # Replicate returns FileOutputs instead of URLs
            if isinstance(output, list) and len(output) > 0:
                logger.info(
                    f"Extracting URL for image {index} from FileOutput for job {job_id}"
                )
                image_url = output[0].url
            else:
                logger.info(
                    f"Trying to extract URL for image {index} from str(output) for job {job_id}"
                )
                image_url = str(output)

            if image_url and image_url != "None":
                result.status = GenerationStatus.SUCCEEDED
                result.url = image_url
                logger.info(f"Job {job_id}: Image {index} generated successfully")
            else:
                result.status = GenerationStatus.FAILED
                result.error = "No image URL returned from Replicate"
                logger.error(f"Job {job_id}: Image {index} failed - no URL")

        except Exception as e:
            result.status = GenerationStatus.FAILED
            result.error = str(e)
            logger.error(f"Job {job_id}: Image {index} failed - {e}")

        finally:
            result.finished_at = datetime.now(timezone.utc)

        return result

    async def _broadcast_progress(self, job_id: str, result: GenerationResult) -> None:
        """Broadcast progress update to all subscribers."""
        event_data = ProgressEventData(
            index=result.index,
            status=result.status,
            url=result.url,
            error=result.error,
        )
        await self._broadcast_event(job_id, "progress", event_data.model_dump())

    async def _broadcast_completion(self, job_id: str) -> None:
        """Broadcast job completion to all subscribers."""
        job = self._jobs[job_id]
        event_data = DoneEventData(
            total=job.num_images,
            ttfi_ms=job.ttfi_ms,
            total_ms=job.total_ms,
        )
        await self._broadcast_event(job_id, "done", event_data.model_dump())

    async def _broadcast_event(self, job_id: str, event_type: str, data: dict) -> None:
        """Broadcast event to all job subscribers."""
        if job_id not in self._job_streams:
            return

        import json

        event_string = f"event: {event_type}\ndata: {json.dumps(data)}\n\n"

        # Send to all subscribers
        for queue in self._job_streams[job_id]:
            try:
                await queue.put(event_string)
            except Exception as e:
                logger.error(f"Error broadcasting to stream: {e}")


# Global service instance
generation_service = GenerationService()
