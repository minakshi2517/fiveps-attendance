# 🎯 Face Recognition Attendance System

A modern, AI-powered attendance management system using advanced face recognition technology with GPS-based location verification. Built with **React + FastAPI + SQLite** featuring a stunning glassmorphism UI design.

![FaceAuth](https://img.shields.io/badge/AI-Face%20Recognition-blue)
![Python](https://img.shields.io/badge/Python-3.10+-green)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-Modern-009688)

---

## 🌟 Key Features

### 🔐 AI-Powered Face Recognition
- Real-time face detection and recognition with 98%+ accuracy
- Multi-face encoding support for improved reliability
- Live camera feed with bounding box overlays
- Confidence score display for each recognition

### 📍 GPS Location Verification
- Geofencing to ensure attendance from authorized locations
- Dual-coordinate verification (device GPS + image metadata)
- Visual location matching status display
- Interactive map integration with Leaflet

### 👨‍💼 Admin Dashboard
- Secure password-protected admin panel
- Student registration with photo capture
- Attendance history and analytics
- System reset and student management tools

### 🎨 Modern UI/UX
- Glassmorphism design with smooth animations
- Responsive design for all devices
- Dark mode interface
- Framer Motion animations throughout

---

## 🏗️ Architecture

```
face-attendance-system/
├── backend/                 # FastAPI Python Backend
│   ├── app.py              # Application entry point
│   ├── config.py           # Configuration settings
│   ├── models.py           # SQLAlchemy ORM models
│   ├── schemas.py          # Pydantic validation schemas
│   ├── database.py         # Database connection
│   ├── routes/             # API endpoints
│   │   ├── admin.py        # Admin authentication routes
│   │   ├── students.py     # Student CRUD operations
│   │   └── attendance.py   # Attendance marking routes
│   └── utils/              # Utility functions
│       ├── face_recognition_utils.py  # Face AI logic
│       └── security.py     # JWT & password hashing
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # API clients & animations
│   └── public/             # Static assets
│
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Webcam for face recognition

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MohammadFayasKhan/face-attendance-system.git
cd face-attendance-system
```

2. **Setup Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

4. **Run the Application**
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python -m uvicorn app:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs

---

## 📸 How It Works

### 1. Student Registration
1. Admin logs in with password `786`
2. Navigate to Student Management
3. Enter student details (Name, UID)
4. Capture face photo via webcam
5. System encodes facial features using 128-point embedding

### 2. Attendance Marking
1. Student faces the camera on Dashboard
2. System detects and recognizes face in real-time
3. GPS location is verified against registered coordinates
4. Attendance is marked with timestamp and location data

### 3. Admin Controls
- View today's attendance records
- Download attendance reports
- Reset daily attendance
- Delete students from system

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/students/register` | Register new student with face |
| `GET` | `/api/students` | Get all registered students |
| `DELETE` | `/api/students/{id}` | Delete a student |
| `POST` | `/api/attendance/mark` | Mark attendance with face |
| `GET` | `/api/attendance/today` | Get today's attendance |
| `POST` | `/api/admin/login` | Admin authentication |

---

## 🛡️ Security Features

- **JWT Authentication** for admin sessions
- **Password Hashing** with bcrypt
- **CORS Protection** for API endpoints
- **Input Validation** with Pydantic schemas
- **SQL Injection Prevention** via SQLAlchemy ORM

---

## 🎯 Use Cases

1. **Educational Institutions** - Automated class attendance
2. **Corporate Offices** - Employee check-in/check-out
3. **Events & Conferences** - Attendee verification
4. **Secure Facilities** - Access control logging

---

## 👨‍💻 Developer

**Mohammad Fayas Khan**

- 📧 Email: fayaskhanmohammad@gmail.com
- 💼 LinkedIn: [mohammadfayaskhan](https://www.linkedin.com/in/mohammadfayaskhan/)
- 🐙 GitHub: [MohammadFayasKhan](https://github.com/MohammadFayasKhan)
- 🏆 LeetCode: [fayaskhanx](https://leetcode.com/u/fayaskhanx/)
- 📷 Instagram: [@fayaskhanx](https://www.instagram.com/fayaskhanx)

---

## 📄 License

This project is open-source and available under the MIT License.

---

<p align="center">
  Built with ❤️ using React, FastAPI, and Face Recognition AI
</p>
