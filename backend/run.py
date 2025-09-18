#!/usr/bin/env python3
"""
Development server runner for MyFlix Backend API.

Provides a simple way to run the development server with
proper configuration and error handling.
"""

import os
import sys
import subprocess
from pathlib import Path


def main():
    """Run the FastAPI development server."""

    # Get the directory where this script is located
    backend_dir = Path(__file__).parent

    # Change to the backend directory
    os.chdir(backend_dir)

    # Check if virtual environment exists
    venv_path = backend_dir / ".venv"
    if not venv_path.exists():
        print("❌ Virtual environment not found at .venv/")
        print("Please create a virtual environment first:")
        print("python -m venv .venv")
        sys.exit(1)

    # Check if requirements are installed
    requirements_path = backend_dir / "requirements.txt"
    if requirements_path.exists():
        print("📦 Checking dependencies...")
        try:
            # Activate venv and check if fastapi is installed
            result = subprocess.run([
                str(venv_path / "bin" / "python"),
                "-c",
                (
                    "import fastapi; "
                    "print(f'FastAPI {fastapi.__version__} installed')"
                )
            ], capture_output=True, text=True)

            if result.returncode != 0:
                print("❌ Dependencies not installed. Installing now...")
                subprocess.run([
                    str(venv_path / "bin" / "pip"),
                    "install",
                    "-r",
                    "requirements.txt"
                ], check=True)
            else:
                print(f"✅ {result.stdout.strip()}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Error installing dependencies: {e}")
            sys.exit(1)

    print("🚀 Starting MyFlix Backend API...")
    print("📍 Backend server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🛑 Press Ctrl+C to stop the server")
    print("-" * 50)

    try:
        # Run the server using uvicorn
        subprocess.run([
            str(venv_path / "bin" / "uvicorn"),
            "main:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload",
            "--log-level", "info"
        ], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running server: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
