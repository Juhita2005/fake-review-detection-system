import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification

# Load trained model
MODEL_PATH = "models/fake_review_bert"

tokenizer = DistilBertTokenizer.from_pretrained(MODEL_PATH)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)

model.eval()


def predict_review(review_text):

    inputs = tokenizer(
        review_text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    probabilities = torch.softmax(logits, dim=1)

    fake_score = probabilities[0][1].item()
    genuine_score = probabilities[0][0].item()

    prediction = "Fake Review" if fake_score > genuine_score else "Genuine Review"

    return {
        "review": review_text,
        "prediction": prediction,
        "fake_probability": round(fake_score, 3),
        "genuine_probability": round(genuine_score, 3)
    }


# Test the model locally
if __name__ == "__main__":

    sample_review = "This is the best product ever!!! Buy now!!! 100% recommended!!! Amazing amazing amazing!!!"

    result = predict_review(sample_review)

    print("\nPrediction Result:")
    print(result)