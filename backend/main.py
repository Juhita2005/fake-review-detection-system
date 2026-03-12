from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import sys
import os
from backend.database import SessionLocal, ReviewLog


# allow importing from ml folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.predict import predict_review

def generate_explanations(review, fake_prob, genuine_prob):
    
    explanations = []

    review_lower = review.lower()

    # Short review detection
    if len(review.split()) < 6:
        explanations.append("Review is very short and lacks detailed feedback")

    # Promotional language detection
    promotional_words = ["amazing", "perfect", "best", "must buy", "incredible", "awesome"]
    if any(word in review_lower for word in promotional_words):
        explanations.append("Contains overly promotional language")

    # Fake probability logic
    if fake_prob > 0.7:
        explanations.append("Language pattern similar to known fake reviews")

    # Genuine probability logic
    if genuine_prob > 0.7:
        explanations.append("Balanced and natural wording detected")

    if not explanations:
        explanations.append("Prediction generated using trained NLP model patterns")

    return explanations

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
def detect_review(review: str, category: str = "General"):

    result = predict_review(review)

    fake_prob = result["fake_probability"]
    genuine_prob = result["genuine_probability"]

    explanations = generate_explanations(review, fake_prob, genuine_prob)

    result["explanations"] = explanations

    # save to database
    db = SessionLocal()

    log = ReviewLog(
        review_text=review,
        prediction=result["prediction"],
        fake_probability=result["fake_probability"],
        category=category
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

        fake_prob = prediction["fake_probability"]
        genuine_prob = prediction["genuine_probability"]

        prediction["explanations"] = generate_explanations(review, fake_prob, genuine_prob)

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

@app.get("/fake-review-categories")
def fake_review_categories():

    db = SessionLocal()

    logs = db.query(ReviewLog).all()

    db.close()

    category_counts = {}

    for log in logs:
        if log.prediction == "Fake Review":

            category = log.category or "General"

            if category not in category_counts:
                category_counts[category] = 0

            category_counts[category] += 1

    return [
        {"category": k, "count": v}
        for k, v in category_counts.items()
    ]