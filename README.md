<div align="center">

# 🎓 EduMind AI

### AI-Powered Student Performance Prediction Platform

![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![XGBoost](https://img.shields.io/badge/XGBoost-99.5%25_Accuracy-FF6600?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

</div>

---

## ✨ What is EduMind AI?

**EduMind AI** is a full-stack machine learning web application that predicts whether a student will **pass or fail** based on key academic and personal factors — enabling educators to **intervene early** before outcomes become irreversible.

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🧠 AI Predictions | XGBoost + Random Forest ensemble, **99.5% accuracy** |
| ⚡ Live WebSocket | Real-time predictions, instant PASS/FAIL result |
| 📁 Bulk CSV Upload | Predict thousands of students at once |
| 📊 Dashboard | Animated charts, pass rate, confidence analytics |
| 🔐 JWT Auth | Secure login and register with bcrypt |
| 🎯 Risk Scoring | Low / Medium / High risk classification |

---

## 📊 ML Model Performance

| Model | Accuracy |
|-------|----------|
| ✅ Random Forest | **99.50%** |
| ✅ XGBoost | 99.45% |
| ✅ Logistic Regression | 99.35% |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Chart.js |
| Backend | FastAPI, Python, SQLite, WebSockets |
| ML | XGBoost, Random Forest, Scikit-learn |
| Auth | JWT, bcrypt |

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/predict` | Single prediction |
| `WS` | `/api/ws/predict` | WebSocket live prediction |
| `POST` | `/api/upload` | Bulk CSV upload |
| `GET` | `/api/dashboard` | Analytics data |

---

## ⚙️ Setup

### Backend
```bash
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn python-jose bcrypt python-multipart pandas scikit-learn xgboost joblib websockets aiofiles
python -m uvicorn backend.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Open
