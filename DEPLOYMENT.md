# Hugging Face Spaces Deployment Guide

## 🤗 Deploy to Hugging Face Spaces

This guide walks you through deploying the Face Recognition Attendance System to Hugging Face Spaces (free).

---

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐
│   Frontend      │────▶│  Backend API         │
│   (Vercel)      │     │  (Hugging Face)      │
│   React + Vite  │     │  FastAPI + face_rec  │
└─────────────────┘     └──────────────────────┘
```

---

## Step 1: Create Hugging Face Account

1. Go to [huggingface.co](https://huggingface.co)
2. Click **Sign Up** (free)
3. Verify your email

---

## Step 2: Create a New Space

1. Click your profile → **New Space**
2. Fill in:
   - **Space name**: `face-attendance-api`
   - **License**: MIT
   - **SDK**: Select **Docker**
   - **Hardware**: CPU basic (free)
   - **Visibility**: Public
3. Click **Create Space**

---

## Step 3: Push Backend to Space

```bash
# Clone your new space
git clone https://huggingface.co/spaces/YOUR_USERNAME/face-attendance-api
cd face-attendance-api

# Copy backend files
cp -r /path/to/face-attendance-system/backend/* .
cp /path/to/face-attendance-system/Dockerfile .

# Create README for HF
cat > README.md << 'EOF'
---
title: Face Attendance API
emoji: 🎯
colorFrom: purple
colorTo: blue
sdk: docker
pinned: false
---

# Face Recognition Attendance System API

FastAPI backend for face recognition attendance system.

## Endpoints

- `POST /api/students/register` - Register student
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/today` - Get today's attendance
- `GET /docs` - API documentation
EOF

# Push to Hugging Face
git add .
git commit -m "Initial deployment"
git push
```

---

## Step 4: Wait for Build

1. Go to your Space: `https://huggingface.co/spaces/YOUR_USERNAME/face-attendance-api`
2. Click **Logs** tab to monitor build progress
3. First build takes **10-15 minutes** (installing dlib)
4. Once complete, you'll see "Running on port 7860"

---

## Step 5: Get Your API URL

Your backend API is now live at:
```
https://YOUR_USERNAME-face-attendance-api.hf.space
```

Test it by visiting:
```
https://YOUR_USERNAME-face-attendance-api.hf.space/docs
```

---

## Step 6: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repo
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://YOUR_USERNAME-face-attendance-api.hf.space`
6. Click **Deploy**

---

## Step 7: Update Frontend API Base URL

Before deploying, update `frontend/src/utils/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    // ... rest of config
});
```

---

## 🎉 Done!

Your app is now live:
- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://YOUR_USERNAME-face-attendance-api.hf.space`
- **API Docs**: `https://YOUR_USERNAME-face-attendance-api.hf.space/docs`

---

## Troubleshooting

### Build fails with dlib error
- The Dockerfile includes all necessary dependencies
- If still failing, try using `python:3.10-bullseye` as base image

### Cold starts are slow
- HF Spaces sleeps after 48 hours of inactivity
- First request after sleep takes 30-60 seconds
- Consider Hugging Face Pro for always-on

### Database resets?
- HF Spaces has ephemeral storage
- For persistent data, use an external database like:
  - [Supabase](https://supabase.com) (free PostgreSQL)
  - [PlanetScale](https://planetscale.com) (free MySQL)

---

## Alternative: Deploy Everything to HF Spaces

You can also serve the frontend from the same Space using:

```dockerfile
# Combined Dockerfile (frontend + backend)
# Build frontend, serve with FastAPI static files
```

Let me know if you want this setup!
