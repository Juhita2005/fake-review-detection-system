import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE,
});

export interface DetectionResult {
  prediction: string;
  fake_probability: number;
  genuine_probability: number;
  explanations: string[];
}

export interface CsvAnalysisResult {
  total_reviews: number;
  fake_reviews: number;
  genuine_reviews: number;
  fake_percentage: number;
  results: DetectionResult[];
}

export interface ReviewLog {
  id: number;
  review_text: string;
  prediction: string;
  fake_probability: number;
  category: string;
}

export async function detectReview(review: string, category : string): Promise<DetectionResult> {
  const { data } = await api.post(
    `/detect-review?review=${encodeURIComponent(review)}&category=${encodeURIComponent(category)}`
  );
  // const { data } = await api.post("/detect-review", {
  //   review: review,
  //   category: category
  // });
  // const { data } = await api.post(`/detect-review?review=${encodeURIComponent(review)}`);
  return data;
}

export async function analyzeCsv(file: File): Promise<CsvAnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/analyze-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getReviewLogs(): Promise<ReviewLog[]> {
  const { data } = await api.get("/review-logs");
  return data;
}

export interface CategoryFakeCount {
  category: string;
  count: number;
}

export async function getFakeReviewCategories(): Promise<CategoryFakeCount[]> {
  const { data } = await api.get("/fake-review-categories");
  return data;
}
