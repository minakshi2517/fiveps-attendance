FROM python:3.10-slim-bullseye

# Install system dependencies for dlib and face_recognition
# Optimized: removed GUI libs, added --no-install-recommends, and clean steps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libboost-python-dev \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Hugging Face Spaces runs as user 1000
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY --chown=user backend/requirements.txt ./requirements.txt

# Install Python dependencies
# Optimized: Added --no-cache-dir
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY --chown=user backend/ .

# Create data directories with correct permissions
RUN mkdir -p data/face_encodings data/profile_images data/attendance_snapshots

# HF Spaces expects port 7860
EXPOSE 7860

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
