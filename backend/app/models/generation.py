"""
Image generation models for the MyFlix backend API.
Pydantic models for image generation requests and responses.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Literal, Optional

from pydantic import BaseModel, Field


class GenerationStatus(str, Enum):
    """Status of a generation job or individual result."""

    PENDING = "pending"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    COMPLETED = "completed"


class GenerationRequest(BaseModel):
    """Request model for creating a new image generation job."""

    prompt: str = Field(
        default="",
        min_length=1,
        max_length=500,
        description="Text prompt for image generation",
        example="A beautiful sunset over mountains",
    )
    num_images: int = Field(
        default=5,
        ge=1,
        description="Number of images to generate",
        example=5,
    )


class GenerationJobResponse(BaseModel):
    """Response model for job creation."""

    job_id: str = Field(
        default="",
        description="Unique identifier for the generation job",
        example="job_abc123",
    )


class GenerationResult(BaseModel):
    """Individual image generation result."""

    index: int = Field(
        default=0, description="Index of the image in the batch", example=0
    )
    status: GenerationStatus = Field(
        default=GenerationStatus.PENDING,
        description="Status of this individual generation",
        example=GenerationStatus.PENDING,
    )
    url: Optional[str] = Field(
        default=None,
        description="URL of the generated image (if successful)",
        example="https://replicate.delivery/xezq/guid/out-0.webp",
    )
    error: Optional[str] = Field(
        default=None,
        description="Error message (if failed)",
        example="Generation failed due to an unknown error",
    )
    started_at: Optional[datetime] = Field(
        default=None, description="When this generation started"
    )
    finished_at: Optional[datetime] = Field(
        default=None, description="When this generation finished"
    )


class GenerationJob(BaseModel):
    """Complete generation job with all results."""

    job_id: str = Field(
        default="", description="Unique identifier for the generation job"
    )
    prompt: str = Field(default="", description="Original prompt used for generation")
    num_images: int = Field(default=0, description="Total number of images requested")
    status: GenerationStatus = Field(
        default=GenerationStatus.PENDING, description="Overall status of the job"
    )
    results: list[GenerationResult] = Field(
        default_factory=list, description="Individual generation results"
    )
    created_at: datetime = Field(
        default=datetime.now(timezone.utc), description="When the job was created"
    )
    started_at: Optional[datetime] = Field(
        default=None, description="When the job started processing"
    )
    completed_at: Optional[datetime] = Field(
        default=None, description="When the job completed"
    )
    ttfi_ms: Optional[int] = Field(
        default=None, description="Time to first image in milliseconds"
    )
    total_ms: Optional[int] = Field(
        default=None, description="Total processing time in milliseconds"
    )


class ProgressEventData(BaseModel):
    """Data for progress events."""

    index: int = Field(default=0, description="Image index")
    status: GenerationStatus = Field(
        default=GenerationStatus.PENDING, description="Current status"
    )
    url: Optional[str] = Field(default=None, description="Image URL if ready")
    error: Optional[str] = Field(default=None, description="Error message if failed")


class DoneEventData(BaseModel):
    """Data for completion events."""

    status: Literal["done"] = Field(default="done", description="Job completion status")
    total: int = Field(default=0, description="Total number of images")
    ttfi_ms: Optional[int] = Field(default=None, description="Time to first image (ms)")
    total_ms: Optional[int] = Field(default=None, description="Total time (ms)")


class ErrorEventData(BaseModel):
    """Data for error events."""

    error: str = Field(default="", description="Error message")
    job_id: str = Field(default="", description="Job ID that failed")
