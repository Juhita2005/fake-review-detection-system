# AI Fake Review Detection System

An AI-powered web application that detects fake product reviews using a fine-tuned DistilBERT NLP model.  
The system allows users to analyze individual reviews or bulk datasets and provides an interactive dashboard with analytics.

---

# Features

### Single Review Analysis
Users can paste a product review and instantly receive:
- Fake or Genuine prediction
- Fake probability score
- Genuine probability score
- Visual pie chart representation

### Bulk CSV Analysis
Upload a dataset of reviews and the system will:
- Analyze all reviews
- Count fake and genuine reviews
- Calculate fake review percentage
- Generate downloadable CSV report

### Detection History
All analyzed reviews are stored in a local SQLite database and displayed in the dashboard history table.

### Interactive Dashboard
A clean and responsive UI built using:
- React
- Material UI
- Recharts

---

# Tech Stack

### Backend
- Python
- FastAPI
- Transformers (DistilBERT)
- PyTorch
- Pandas
- SQLAlchemy
- SQLite

### Frontend
- React
- Axios
- Material UI
- Recharts

---

# Project Structure


fake_review_project/
│
├── backend/
│ ├── main.py
│ ├── model/
│ ├── database.py
│ ├── models.py
│ └── requirements.txt
│
├── frontend/
│ ├── src/
│ ├── package.json
│ └── public/
│
├── dataset/
│
└── README.md


---

# Installation Guide

## 1 Clone Repository


git clone https://github.com/YOUR_USERNAME/fake-review-detector.git

cd fake-review-detector


---

# Backend Setup (FastAPI)

Navigate to backend folder:


cd backend


Create virtual environment:


python -m venv venv


Activate environment:

Windows

venv\Scripts\activate


Linux / Mac

source venv/bin/activate


Install dependencies:


pip install -r requirements.txt


Run the FastAPI server:


uvicorn main:app --reload


Backend runs at:


http://127.0.0.1:8000


API documentation:


http://127.0.0.1:8000/docs


---

# Frontend Setup (React)

Navigate to frontend folder:


cd frontend


Install dependencies:


npm install


Run the React app:


npm start


Frontend runs at:


http://localhost:3000


---

# CSV Dataset Format

CSV file must contain a column named:


text


Example:


text
This product is amazing!
Worst product ever
Best purchase of my life


---

# API Endpoints

### Detect Single Review


POST /detect-review


Parameters:


review = review text


---

### Bulk CSV Analysis


POST /analyze-csv


Upload CSV file containing reviews.

---

### Review Logs


GET /review-logs


Returns previously analyzed reviews stored in SQLite.

---

# Database

Instead of Supabase, this project uses a **local SQLite database** via **SQLAlchemy**.

This database stores:

- Review text
- Prediction result
- Fake probability score

SQLite file is created automatically when the backend runs.

---

# Future Improvements

Possible enhancements:

- Dark mode dashboard
- User authentication
- Admin moderation panel
- Fake review trend analytics
- Model retraining interface
- Cloud database integration

---

# Author

Developed as part of an AI/ML project for fake review detection.
<!-- Fake Product Review Detection & Monitoring System
Project Overview

The Fake Product Review Detection and Monitoring System is a Machine Learning powered platform that detects fraudulent or spam product reviews using Natural Language Processing (NLP).

The system uses a fine-tuned Transformer model (DistilBERT) to classify product reviews as Fake or Genuine and provides a monitoring dashboard for analysis.

This project simulates how e-commerce platforms identify and remove fake reviews to maintain trust and transparency.

Objectives

• Detect fake product reviews using machine learning
• Monitor review authenticity through a dashboard
• Flag suspicious reviews automatically
• Simulate fake review removal from platforms
• Provide analytics and visualization of review authenticity

Tech Stack
Machine Learning
| Technology               | Usage                           |
| ------------------------ | ------------------------------- |
| Python                   | ML model development            |
| PyTorch                  | Deep learning framework         |
| HuggingFace Transformers | Pretrained BERT models          |
| DistilBERT               | Fake review classification      |
| Scikit-learn             | Data preprocessing & evaluation |
| NLTK                     | Text preprocessing              |


Backend
| Technology | Usage              |
| ---------- | ------------------ |
| FastAPI    | Backend API        |
| Python     | Server logic       |
| Supabase   | Database & storage |


Frontend
| Technology          | Usage              |
| ------------------- | ------------------ |
| React.js            | Web interface      |
| Chart.js / Recharts | Data visualization |
| TailwindCSS         | Modern UI styling  |

Database

The system uses Supabase (PostgreSQL) for storing:

• Review data
• Detection results
• Monitoring analytics

Supabase provides:

• Managed PostgreSQL database
• REST API
• Authentication (optional)

Dataset

Dataset Used:

Fake Reviews Dataset

Dataset Size:

40,432 reviews

Distribution:

20,216 Genuine Reviews
20,216 Fake Reviews

Columns:
| Column   | Description      |
| -------- | ---------------- |
| category | Product category |
| rating   | Review rating    |
| label    | Fake or Genuine  |
| text_    | Review text      |

Machine Learning Model

Model Used:

DistilBERT (Transformer Architecture)

Reason for choosing DistilBERT:

• Faster than BERT
• Lightweight transformer
• High NLP performance
• Suitable for text classification

Model Training

Training Setup:

Dataset size used: 20,000 samples
Epochs: 1
Max sequence length: 128
Batch size: 16
Optimizer: AdamW

Training time: ~1.5 hours on CPU

Loss after training: ~0.25 evaluation loss

Expected accuracy: ~88–92%

Project Workflow
Dataset
   ↓
Text Preprocessing
   ↓
Tokenization (BERT tokenizer)
   ↓
Model Training (DistilBERT)
   ↓
Model Evaluation
   ↓
Fake Review Detection Engine
   ↓
Backend API
   ↓
React Dashboard


System Architecture
User
   ↓
React Frontend
   ↓
FastAPI Backend
   ↓
DistilBERT Model
   ↓
Supabase Database

Key Features
1) Review Scanner

Users can input any review text and instantly detect whether the review is:

Fake
Genuine

The system also provides a confidence score.

2) Bulk Review Analysis

Users can upload CSV files containing multiple reviews.

The system automatically:

• Scans all reviews
• Detects fake reviews
• Generates a report

3) Fake Review Monitoring Dashboard

Dashboard displays:

• Total reviews scanned
• Fake reviews detected
• Genuine reviews detected
• Fake review percentage

Visualized using:

• Pie charts
• Bar charts
• Trend graphs

4) Fake Review Removal Simulation

If a review is detected as fake:

System flags the review
Review marked as "Removed"

This simulates moderation systems used by platforms like Amazon.

5) Dark Themed Modern UI

Frontend includes:

• Dark themed interface
• Interactive charts
• Smooth user experience

****Installation Guide****

Clone the repository:

git clone https://github.com/YOUR_USERNAME/fake-review-detection-system.git

1) Navigate to project: cd fake-review-detection-system

2) Install Python Dependencies
pip install -r requirements.txt

3) Train Model
python ml/train_bert_model.py

4) Run Backend Server
uvicorn backend.main:app --reload

5) Run Frontend
cd frontend
npm install
npm start


Future Improvements

• Real-time review monitoring
• Integration with e-commerce APIs
• Advanced spam detection techniques
• User authentication system
• Deployment on cloud platforms

 -->
