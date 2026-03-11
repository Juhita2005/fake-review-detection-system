import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset

df = pd.read_csv("data/preprocessed_fake_reviews_detection_dataset.csv")
df = df.sample(20000, random_state=42)
# Remove unwanted column created during CSV export
if "Unnamed: 0" in df.columns:
    df = df.drop(columns=["Unnamed: 0"])

# Keep only necessary columns
df = df[["text_", "label"]]

# Convert text to string to avoid tokenizer errors
df["text_"] = df["text_"].astype(str)

# Convert labels to numeric
df["label"] = df["label"].map({"CG": 0, "OR": 1})

# Remove any missing values
df = df.dropna()

print("Dataset shape:", df.shape)
print(df.head())

label_encoder = LabelEncoder()
df["label"] = label_encoder.fit_transform(df["label"])
print(df["label"].value_counts())

train_texts, test_texts, train_labels, test_labels = train_test_split(
    df["text_"],
    df["label"],
    test_size=0.2,
    random_state=42
)

tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")

train_encodings = tokenizer(
    list(train_texts),
    truncation=True,
    padding=True,
    max_length=128
)

test_encodings = tokenizer(
    list(test_texts),
    truncation=True,
    padding=True,
    max_length=128
)

train_dataset = Dataset.from_dict({
    "input_ids": train_encodings["input_ids"],
    "attention_mask": train_encodings["attention_mask"],
    "labels": list(train_labels)
})

test_dataset = Dataset.from_dict({
    "input_ids": test_encodings["input_ids"],
    "attention_mask": test_encodings["attention_mask"],
    "labels": list(test_labels)
})

model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=2
)

training_args = TrainingArguments(
    output_dir="models/results",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=1,
    weight_decay=0.01,
    logging_dir="models/logs",
    logging_steps=100
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset
)

trainer.train()
results = trainer.evaluate()
print(results)

model.save_pretrained("models/fake_review_bert")
tokenizer.save_pretrained("models/fake_review_bert")
