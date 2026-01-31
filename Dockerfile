# Use Miniconda (Reliable pre-built binaries for dlib/scipy/numpy)
FROM continuumio/miniconda3

# Set working directory
WORKDIR /app

# Install system libraries for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Create a conda environment with Python 3.9
# We install dlib from conda-forge which provides pre-compiled binaries for Linux
# This bypasses the compilation timeout/memory issues
RUN conda install -y -c conda-forge python=3.9 dlib "cmake>=3.18" numpy

# Use the conda environment's pip
# Install other dependencies
COPY backend/requirements_hf.txt requirements.txt

# Install remaining dependencies (fastapi, opencv, etc.) via pip
# Note: we already have numpy and dlib from conda
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend code
COPY backend/ .

# Create necessary directories
RUN mkdir -p data/faces data/attendance_snapshots

# Expose port (HF default)
EXPOSE 7860

# Run with python from base environment (Miniconda installs to /opt/conda)
# We use 'python -m uvicorn' to ensure we use the conda python
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
