from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from backend.database import init_db, get_db
from backend.auth import (
    hash_password,
    verify_password,
    create_token,
    create_reset_token,
    verify_reset_token
)
from backend.routes import predict, upload, dashboard
import os

app = FastAPI(title="EduMind AI", version="1.0.0")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://edumind-ai-nikhil.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- STATIC FILES ----------------
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# ---------------- ROUTERS ----------------
app.include_router(predict.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

# ---------------- DB INIT ----------------
@app.on_event("startup")
def startup():
    init_db()

# ---------------- SCHEMAS ----------------
class RegisterInput(BaseModel):
    name: str
    email: str
    password: str

class LoginInput(BaseModel):
    email: str
    password: str

class ForgotPasswordInput(BaseModel):
    email: str

class ResetPasswordInput(BaseModel):
    token: str
    new_password: str

# ---------------- ROOT ----------------
@app.get("/")
def root():
    return {"message": "EduMind AI API running"}

# ---------------- REGISTER ----------------
@app.post("/api/auth/register")
def register(data: RegisterInput):
    db = get_db()

    existing = db.execute(
        "SELECT id FROM users WHERE email=?",
        (data.email,)
    ).fetchone()

    if existing:
        db.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    db.execute(
        "INSERT INTO users (name, email, password) VALUES (?,?,?)",
        (data.name, data.email, hash_password(data.password))
    )

    db.commit()

    user = db.execute(
        "SELECT * FROM users WHERE email=?",
        (data.email,)
    ).fetchone()

    db.close()

    token = create_token({
        "id": user["id"],
        "email": user["email"],
        "name": user["name"]
    })

    return {
        "token": token,
        "name": user["name"],
        "email": user["email"]
    }

# ---------------- LOGIN ----------------
@app.post("/api/auth/login")
def login(data: LoginInput):
    db = get_db()

    user = db.execute(
        "SELECT * FROM users WHERE email=?",
        (data.email,)
    ).fetchone()

    db.close()

    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({
        "id": user["id"],
        "email": user["email"],
        "name": user["name"]
    })

    return {
        "token": token,
        "name": user["name"],
        "email": user["email"]
    }

# ---------------- FORGOT PASSWORD ----------------
@app.post("/api/auth/forgot-password")
def forgot_password(data: ForgotPasswordInput):
    db = get_db()

    user = db.execute(
        "SELECT * FROM users WHERE email=?",
        (data.email,)
    ).fetchone()

    db.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = create_reset_token(data.email)

    return {
        "message": "Reset token generated",
        "token": token
    }

# ---------------- RESET PASSWORD ----------------
@app.post("/api/auth/reset-password")
def reset_password(data: ResetPasswordInput):
    email = verify_reset_token(data.token)

    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    db = get_db()

    db.execute(
        "UPDATE users SET password=? WHERE email=?",
        (hash_password(data.new_password), email)
    )

    db.commit()
    db.close()

    return {
        "message": "Password reset successful"
    }




