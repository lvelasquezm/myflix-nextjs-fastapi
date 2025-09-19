"""
FastAPI router for image generation endpoints.
"""

import logging

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from app.models.generation import (
    GenerationJobResponse,
    GenerationRequest,
)
from app.services.generation_service import generation_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/generate", tags=["generation"])


@router.post(
    "/",
    response_model=GenerationJobResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Create an image generation job",
    description="""
    Create a new image generation job that will generate multiple images
    using Replicate API. Returns immediately with a job ID that can be
    used to stream progress updates.
    """,
)
async def create_generation_job(
    request: GenerationRequest,
) -> GenerationJobResponse:
    """
    Create a new image generation job.

    Args:
        request: Generation parameters including prompt and number of images

    Returns:
        GenerationJobResponse: Job ID for tracking progress

    Raises:
        HTTPException: If job creation fails
    """
    try:
        logger.info(
            f"Creating generation job for prompt: '{request.prompt}' "
            f"with {request.num_images} images"
        )

        job_id = generation_service.create_job(request)

        return GenerationJobResponse(job_id=job_id)

    except Exception as e:
        logger.error(f"Failed to create generation job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create generation job: {str(e)}",
        )


@router.get(
    "/{job_id}/stream",
    summary="Stream job progress",
    description="""
    Stream real-time progress updates for a generation job using
    Server-Sent Events.

    Events sent:
    - `progress`: Individual image completion updates
    - `done`: Job completion with timing metrics
    - `error`: Error notifications
    - `keepalive`: Periodic keep-alive messages

    The stream will automatically close when the job completes or fails.
    """,
)
async def stream_job_progress(job_id: str):
    """
    Stream job progress using Server-Sent Events.

    Args:
        job_id: Job ID to stream progress for

    Returns:
        StreamingResponse: SSE stream of job progress

    Raises:
        HTTPException: If job not found
    """
    # Check if job exists
    job = generation_service.get_job(job_id)
    if not job:
        msg = f"Job {job_id} not found"
        logger.info(msg)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=msg,
        )

    logger.info(f"Starting stream for job {job_id}")

    return StreamingResponse(
        generation_service.subscribe_to_job_stream(job_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control",
        },
    )
