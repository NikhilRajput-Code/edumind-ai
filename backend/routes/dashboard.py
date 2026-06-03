from fastapi import APIRouter, Depends
from auth import get_current_user
from database import get_db

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(user=Depends(get_current_user)):
    db = get_db()
    preds = db.execute(
        "SELECT result, confidence, created_at FROM predictions WHERE user_id=? ORDER BY created_at DESC LIMIT 50",
        (user["id"],)
    ).fetchall()
    uploads = db.execute(
        "SELECT * FROM uploads WHERE user_id=? ORDER BY created_at DESC LIMIT 10",
        (user["id"],)
    ).fetchall()
    db.close()
    total = len(preds)
    passed = sum(1 for p in preds if p["result"] == "PASS")
    avg_conf = round(sum(p["confidence"] for p in preds) / total, 1) if total else 0
    return {
        "total_predictions": total,
        "pass_count": passed,
        "fail_count": total - passed,
        "pass_rate": round(passed / total * 100, 1) if total else 0,
        "avg_confidence": avg_conf,
        "recent_predictions": [dict(p) for p in preds[:10]],
        "uploads": [dict(u) for u in uploads],
    }
