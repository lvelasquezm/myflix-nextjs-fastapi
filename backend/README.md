# MyFlix Backend API

A FastAPI backend service with authentication functionality through JWT.

## Features

- 🚀 **FastAPI** - Modern, fast, web framework for building APIs
- 🔐 **JWT Authentication** - Secure token-based authentication
- 📝 **Pydantic Models** - Type-safe request/response validation
- 🔒 **Password Hashing** - Secure bcrypt password hashing (for demo users for now)
- 📚 **Auto Documentation** - Interactive API docs with Swagger UI

## Tech Stack

- **Framework**: FastAPI
- **Authentication**: JWT tokens with python-jose
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
│   ├── config.py          # Application configuration
│   └── security.py        # JWT and password utilities
├── models/
│   └── auth.py            # Pydantic models for auth
├── routers/
│   └── auth.py            # Authentication endpoints
└── services/
│   └── auth_service.py    # Authentication business logic
│.env                      # Non-secret environment variables
│main.py                   # FastAPI application configuration
│requirements.txt          # Python dependencies
└run.py                    # Backend server runner with some validations
```


## Testing the API

Visit the interactive API playground at at [http://localhost:8000/docs](http://localhost:8000/docs).

## Adding new endpoints

1. Create Pydantic models in `app/models/`
2. Implement business logic in `app/services/`
3. Create router endpoints in `app/routers/`
4. Register router in `main.py`
