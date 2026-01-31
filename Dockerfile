# Use a base image with dlib and face_recognition pre-installed
FROM animcogn/face_recognition:cpu

# Set working directory
WORKDIR /app

# Install system dependencies for OpenCV (headless needs fewer, but good to have basics)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Copy Optimized HF requirements
COPY backend/requirements_hf.txt requirements.txt

# Install dependencies (No face-recognition or dlib here, they are in base)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend code
COPY backend/ .

# Create necessary directories for persistence
RUN mkdir -p data/faces data/attendance_snapshots

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
