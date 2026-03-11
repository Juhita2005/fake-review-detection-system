from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import sys
import os
from backend.database import SessionLocal, ReviewLog


# allow importing from ml folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.predict import predict_review

app = FastAPI(title="Fake Review Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home route
@app.get("/")
def home():
    return {"message": "Fake Review Detection API Running"}

@app.post("/detect-review")
def detect_review(review: str):

    result = predict_review(review)

    # save to database
    db = SessionLocal()

    log = ReviewLog(
        review_text=review,
        prediction=result["prediction"],
        fake_probability=result["fake_probability"]
    )

    db.add(log)
    db.commit()
    db.close()

    return result


# Bulk review detection
@app.post("/analyze-csv")
async def analyze_csv(file: UploadFile = File(...)):

    df = pd.read_csv(file.file)

    results = []

    db = SessionLocal()

    fake_count = 0
    genuine_count = 0

    for review in df["text"]:
        prediction = predict_review(review)

        log = ReviewLog(
          review_text=review,
          prediction=prediction["prediction"],
          fake_probability=prediction["fake_probability"]
        )

        db.add(log)

        if prediction["prediction"] == "Fake Review":
            fake_count += 1
        else:
            genuine_count += 1

        results.append(prediction)

    total_reviews = len(results)

    fake_percentage = (fake_count / total_reviews) * 100

    db.commit()
    db.close()

    return {
        "total_reviews": total_reviews,
        "fake_reviews": fake_count,
        "genuine_reviews": genuine_count,
        "fake_percentage": round(fake_percentage, 2),
        "results": results
    }

@app.get("/review-logs")
def get_review_logs():

    db = SessionLocal()

    logs = db.query(ReviewLog).order_by(ReviewLog.id.desc()).limit(50).all()

    db.close()

    return [
        {
            "id": log.id,
            "review_text": log.review_text,
            "prediction": log.prediction,
            "fake_probability": log.fake_probability
        }
        for log in logs
    ]