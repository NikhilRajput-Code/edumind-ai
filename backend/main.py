from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from backend.database import init_db, get_db
from backend.auth import hash_password, verify_password, create_token
from backend.routes import predict, upload, dashboard
import os

app = FastAPI(title="EduMind AI", version="1.0.0")

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

static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(predict.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

class RegisterInput(BaseModel):
    name: str
    email: str
    password: str

class LoginInput(BaseModel):
    email: str
    password: str

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"message": "EduMind AI API running"}

@app.post("/api/auth/register")
def register(data: RegisterInput):
    db = get_db()
    existing = db.execute("SELECT id FROM users WHERE email=?", (data.email,)).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    db.execute("INSERT INTO users (name, email, password) VALUES (?,?,?)",
               (data.name, data.email, hash_password(data.password)))
    db.commit()
    user = db.execute("SELECT * FROM users WHERE email=?", (data.email,)).fetchone()
    db.close()
    token = create_token({"id": user["id"], "email": user["email"], "name": user["name"]})
    return {"token": token, "name": user["name"], "email": user["email"]}

@app.post("/api/auth/login")
def login(data: LoginInput):
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE email=?", (data.email,)).fetchone()
    db.close()
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"id": user["id"], "email": user["email"], "name": user["name"]})
    return {"token": token, "name": user["name"], "email": user["email"]}
