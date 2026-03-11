import type { ReviewLog } from "./api";

export function exportLogsToCSV(logs: ReviewLog[], filename = "review-logs.csv") {
  const headers = ["ID", "Review Text", "Prediction", "Fake Probability"];
  const rows = logs.map((l) => [
    l.id,
    `"${l.review_text.replace(/"/g, '""')}"`,
    l.prediction,
    (l.fake_probability * 100).toFixed(1) + "%",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csv, filename, "text/csv");
}

export function exportDashboardToCSV(stats: {
  total: number;
  fake: number;
  genuine: number;
  fakeRate: string;
}) {
  const csv = [
    "Metric,Value",
    `Total Reviews,${stats.total}`,
    `Fake Reviews,${stats.fake}`,
    `Genuine Reviews,${stats.genuine}`,
    `Fake Rate,${stats.fakeRate}`,
  ].join("\n");
  downloadBlob(csv, "dashboard-analytics.csv", "text/csv");
}

export function exportToPDF() {
  window.print();
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
