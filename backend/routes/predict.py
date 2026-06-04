from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, Query
from pydantic import BaseModel
import joblib, numpy as np, json, os, asyncio
from backend.auth import get_current_user, decode_token
from backend.database import get_db

router = APIRouter()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/model/model.pkl")
bundle = joblib.load(MODEL_PATH)
model    = bundle["model"]
scaler   = bundle["scaler"]
features = bundle["features"]

class StudentInput(BaseModel):
    student_name: str = "Unknown"
    study_hours: float
    attendance: float
    prev_grade: float
    assignments_done: float
    sleep_hours: float
    family_income: int
    parent_education: int
    internet_access: int
    extracurricular: int
    gender: int

def run_prediction(data: dict):
    row = [float(data[f]) for f in features]
    row_scaled = scaler.transform([row])
    pred = model.predict(row_scaled)[0]
    prob = float(model.predict_proba(row_scaled)[0][1])
    risk = "High" if prob < 0.4 else "Medium" if prob < 0.7 else "Low"
    return {
        "result": "PASS" if pred == 1 else "FAIL",
        "confidence": round(prob * 100, 1),
        "risk_level": risk,
        "pass_probability": round(prob * 100, 1),
        "fail_probability": round((1 - prob) * 100, 1),
    }

@router.post("/predict")
def predict(student: StudentInput, user=Depends(get_current_user)):
    result = run_prediction(student.dict())
    db = get_db()
    db.execute(
        "INSERT INTO predictions (user_id, student_name, input_data, result, confidence) VALUES (?,?,?,?,?)",
        (user["id"], student.student_name, json.dumps(student.dict()), result["result"], result["confidence"])
    )
    db.commit()
    db.close()
    return result

@router.websocket("/ws/predict")
async def ws_predict(websocket: WebSocket, token: str = Query(...)):
    payload = decode_token(token)
    if not payload:
        await websocket.close(code=1008)
        return
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            parsed = json.loads(data)
            await websocket.send_text(json.dumps({"status": "processing"}))
            await asyncio.sleep(0.4)
            result = run_prediction(parsed)
            # Save to DB
            db = get_db()
            db.execute(
                "INSERT INTO predictions (user_id, student_name, input_data, result, confidence) VALUES (?,?,?,?,?)",
                (payload["id"], parsed.get("student_name","Unknown"), json.dumps(parsed), result["result"], result["confidence"])
            )
            db.commit()
            db.close()
            await websocket.send_text(json.dumps(result))
    except WebSocketDisconnect:
        pass
