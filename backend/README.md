# MyFlix Backend

A FastAPI backend service with JWT authentication and AI-powered image generation using Replicate API. Features real-time progress streaming and concurrent image processing for optimal performance.

## Features

- 🚀 **FastAPI** - Modern, fast, web framework for building APIs
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🎨 **AI Image Generation** - Powered by Replicate API with real-time progress tracking
- 📡 **Server-Sent Events** - Live streaming of image generation progress
- ⚡ **Concurrent Processing** - Generate multiple images simultaneously
- 📊 **Performance Metrics** - Track TTFI (Time to First Image) and total batch time
- 📝 **Pydantic Models** - Type-safe request/response validation
- 🔒 **Password Hashing** - Secure bcrypt password hashing (for demo users for now)
- 📚 **Auto Documentation** - Interactive API docs with Swagger UI

## Tech Stack

- **Framework**: FastAPI
- **Authentication**: JWT tokens with python-jose
- **AI Image Generation**: Replicate API with flux-schnell model (although configurable via env vars)
- **Real-time Communication**: Server-Sent Events (SSE)
- **Concurrency**: asyncio with ThreadPoolExecutor
- **Password Hashing**: bcrypt via passlib
- **Validation**: Pydantic models
- **Python**: 3.11.13 (set in `.python-version`, managed via `pyenv`)

## Getting Started

### Prerequisites

1. In a terminal, if you're at the root, go to the `backend` folder:
```bash
$ cd backend
```

2. Python 3.11.13 (specified in `.python-version`). The preferred method is to use a
Python version manager like [pyenv](https://github.com/pyenv/pyenv) to avoid collisions
with other installed Python versions. You can see the installation instructions
[here](https://github.com/pyenv/pyenv?tab=readme-ov-file#installation).
After installing it, just run:
```bash
$ pyenv install
$ pyenv local
```

3. Make sure to activate the virtual environment located at `.venv/`:
```bash
$ source .venv/bin/activate
```

4. Make a copy of the `.env.local.example` file and rename it to `.env.local`.
This file is used to store secret keys on a per-env basis. It should contain
an environment variable called `REPLICATE_API_TOKEN`, please set the value of that env
var to a proper Replicate API key, otherwise you won't be able to generate images
using the `Generate` option in the UI via the Replicate client in the backend.

### Local development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start the development server (via the `run.py` server runner):
```bash
python run.py
```

3. The server will start at [http://localhost:8000](http://localhost:8000)

4. Optionally, visit the API docs at [http://localhost:8000/docs](http://localhost:8000/docs)


## Project Structure

```
app/
├── core/
│   ├── config.py                # Application configuration
│   ├── logging.py               # Logging configuration
│   └── security.py              # JWT and password utilities
├── models/
│   ├── auth.py                  # Pydantic models for auth
│   └── generation.py            # Pydantic models for image generation
├── routers/
│   ├── auth.py                  # Authentication endpoints
│   └── generation.py            # Image generation endpoints
└── services/
│   ├── auth_service.py          # Authentication business logic
│   └── generation_service.py    # Image generation with Replicate
│.env                            # Non-secret environment variables
│.env.local                      # Per-env secret environment variables
│main.py                         # FastAPI application configuration
│requirements.txt                # Python dependencies
└run.py                          # Backend server runner with some validations
```


## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password to get JWT token (uses pre-canned users)

### AI Image Generation
- `POST /api/generate/` - Create new image generation job
  - **Request**: `{ "prompt": "A beautiful sunset", "num_images": 5 }`
  - **Response**: `{ "job_id": "job_abc123" }`
- `GET /api/generate/{job_id}/stream` - Stream real-time progress via Server-Sent Events
  - **Events**: `progress`, `done`, `error`, `keepalive`

### Performance Metrics
Each generation job tracks:
- **TTFI (Time to First Image)**: How long until the first image completes
- **Total Batch Time**: Total time for all images to complete
- **Individual Image Status**: Track each image's progress independently

## Testing the API

Visit the interactive API playground at [http://localhost:8000/docs](http://localhost:8000/docs).

## Adding new endpoints

1. Create Pydantic models in `app/models/`
2. Implement business logic in `app/services/`
3. Create router endpoints in `app/routers/`
4. Register router in `main.py`
