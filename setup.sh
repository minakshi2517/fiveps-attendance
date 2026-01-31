#!/bin/bash

# Face Recognition Attendance System - Setup Script
# This script helps install dependencies and start the system

set -e

echo "🚀 Face Recognition Attendance System - Setup"
echo "=============================================="
echo ""

# Check if CMake is installed
echo "📋 Checking prerequisites..."
if ! command -v cmake &> /dev/null; then
    echo "❌ CMake is not installed!"
    echo ""
    echo "CMake is required for the face_recognition library."
    echo "Please install it using one of these methods:"
    echo ""
    echo "  macOS:        brew install cmake"
    echo "  Ubuntu:       sudo apt install cmake"
    echo "  CentOS:       sudo yum install cmake"
    echo "  Windows:      Download from cmake.org"
    echo ""
    exit 1
else
    echo "✅ CMake is installed: $(cmake --version | head -n1)"
fi

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed!"
    exit 1
else
    echo "✅ Python is installed: $(python3 --version)"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    exit 1
else
    echo "✅ Node.js is installed: $(node --version)"
fi

echo ""
echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies (this may take a few minutes)..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "✅ Backend setup complete!"
echo ""

# Setup frontend
cd ../frontend
echo "📦 Setting up frontend..."

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""

# Instructions
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "To start the system:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "📚 For more information, see README.md"
echo ""
