from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import pandas as pd, joblib, numpy as np, io, os, json
from auth import get_current_user
from database import get_db

router = APIRouter()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/model/model.pkl")
bundle = joblib.load(MODEL_PATH)
model  = bundle["model"]
scaler = bundle["scaler"]
features = bundle["features"]

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...), user=Depends(get_current_user)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    for f in features:
        if f not in df.columns:
            raise HTTPException(status_code=400, detail=f"Missing column: {f}")
    df.fillna(df.median(numeric_only=True), inplace=True)
    X = scaler.transform(df[features])
    preds = model.predict(X)
    probs = model.predict_proba(X)[:, 1]
    df["prediction"] = ["PASS" if p == 1 else "FAIL" for p in preds]
    df["confidence"] = (probs * 100).round(1)
    df["risk_level"] = ["Low" if p >= 0.7 else "Medium" if p >= 0.4 else "High" for p in probs]
    total   = len(df)
    passed  = int((preds == 1).sum())
    failed  = total - passed
    at_risk = int((probs < 0.4).sum())
    db = get_db()
    db.execute(
        "INSERT INTO uploads (user_id, filename, total, passed, failed, at_risk) VALUES (?,?,?,?,?,?)",
        (user["id"], file.filename, total, passed, failed, at_risk)
    )
    db.commit()
    db.close()
    return {
        "total": total, "passed": passed, "failed": failed, "at_risk": at_risk,
        "pass_rate": round(passed / total * 100, 1),
        "results": df[["prediction", "confidence", "risk_level"]].to_dict(orient="records")
    }
