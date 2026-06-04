# 🎓 EduMind AI — Student Performance Prediction SaaS

> AI-powered full-stack platform that predicts whether a student will **PASS or FAIL** using Machine Learning — enabling educators to intervene early before outcomes become irreversible.

🌐 **Live Demo:** [https://edumind-ai-nikhil.netlify.app](https://edumind-ai-nikhil.netlify.app)
📡 **API Docs:** [https://edumind-ai-wib1.onrender.com/docs](https://edumind-ai-wib1.onrender.com/docs)
💻 **GitHub:** [https://github.com/NikhilRajput-Code/edumind-ai](https://github.com/NikhilRajput-Code/edumind-ai)

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page]https://ibb.co/xtW19Z3c

### 📊 Dashboard
![Dashboard]https://ibb.co/B2bXqYKQ

### 🧠 Live Prediction
![Prediction]https://ibb.co/rGJxZ8Px

### 📁 Bulk Upload
![Upload]https://ibb.co/1YJKsRXy

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 AI Predictions | XGBoost + Random Forest ensemble, **99.5% accuracy** |
| ⚡ Live WebSocket | Real-time predictions, instant PASS/FAIL result |
| 📁 Bulk CSV Upload | Predict thousands of students at once |
| 📊 Dashboard | Animated charts, pass rate, confidence analytics |
| 🔐 JWT Auth | Secure login and register with bcrypt |
| 🎯 Risk Scoring | Low / Medium / High risk classification |

---

## 📊 ML Model Performance

| Model | Accuracy |
|---|---|
| ✅ Random Forest | **99.50%** |
| ✅ XGBoost (Tuned) | **99.45%** |
| ✅ Logistic Regression | 99.35% |

### Feature Importance
| Feature | Importance |
|---|---|
| assignments_done | 0.35 ⭐ highest |
| study_hours | 0.22 |
| prev_grade | 0.20 |
| attendance | 0.18 |
| sleep_hours | 0.05 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Chart.js |
| Backend | FastAPI, Python, SQLite, WebSockets |
| ML | XGBoost, Random Forest, Scikit-learn, Pandas, NumPy |
| Auth | JWT (python-jose), bcrypt, passlib |
| Deployment | Netlify (frontend) + Render (backend) |
| CI/CD | GitHub → Render auto-deploy |

---

## 🗂️ Project Structure
edumind/
├── backend/
│   ├── main.py              # FastAPI app + auth routes
│   ├── auth.py              # JWT token logic
│   ├── database.py          # SQLite setup
│   ├── ml/model/model.pkl   # Trained XGBoost model
│   └── routes/
│       ├── predict.py       # /predict + WebSocket
│       ├── upload.py        # /upload CSV
│       └── dashboard.py     # /dashboard analytics
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Predict.jsx
│       │   └── Upload.jsx
│       └── components/
│           └── Navbar.jsx
├── requirements.txt
├── render.yaml
└── .python-version
---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + get JWT token |
| POST | `/api/predict` | Single student prediction |
| WS | `/api/ws/predict` | WebSocket live prediction |
| POST | `/api/upload` | Bulk CSV prediction |
| GET | `/api/dashboard` | Analytics data |

---

## ⚙️ Local Setup

### Backend
```bash
git clone https://github.com/NikhilRajput-Code/edumind-ai.git
cd edumind-ai
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## 👨‍💻 Built By

**Nikhil Rajput** — MCA Student, HBTU Kanpur
📧 nikhilrajput7017@gmail.com
🔗 [LinkedIn](https://linkedin.com) | [GitHub](https://github.com/NikhilRajput-Code)

---

⭐ If you found this useful, give it a star!
