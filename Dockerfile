# Use Python 3.10
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies for dlib and opencv
RUN apt-get update && apt-get install -y \
    cmake \
    build-essential \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements first (for caching)
COPY backend/requirements.txt requirements.txt

# Install Python dependencies
# Pre-install cmake/numpy to help dlib build
RUN pip install --no-cache-dir cmake numpy

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend code
COPY backend/ .

# Create necessary directories for persistence
RUN mkdir -p data/faces data/attendance_snapshots

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
