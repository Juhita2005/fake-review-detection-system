import { useState, useRef } from "react";
import { PublicNavbar } from "@/components/PublicNavbar";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { analyzeCsv, type CsvAnalysisResult } from "@/lib/api";
import { motion } from "framer-motion";
import { Upload, Loader2, FileText, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

const chartTooltipStyle = {
  background: "hsl(225, 14%, 10%)",
  border: "1px solid hsl(225, 12%, 16%)",
  borderRadius: "8px",
  color: "hsl(210, 20%, 92%)",
};

export default function CsvAnalyzerPage() {
  const [result, setResult] = useState<CsvAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    try {
      const res = await analyzeCsv(file);
      setResult(res);
    } catch {
      toast.error("Failed to analyze CSV. Ensure it has a 'text' column.");
    } finally {
      setLoading(false);
    }
  };

  const pieData = result
    ? [
        { name: "Fake", value: result.fake_reviews },
        { name: "Genuine", value: result.genuine_reviews },
      ]
    : [];

  const barData = result
    ? [
        { name: "Fake", count: result.fake_reviews },
        { name: "Genuine", count: result.genuine_reviews },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">CSV Bulk Analyzer</h1>
          <p className="text-muted-foreground mb-8">Upload a CSV with a &quot;text&quot; column to analyze multiple reviews at once.</p>

          <div
            className="glass-card p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleUpload} />
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-muted-foreground">Analyzing {fileName}...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {fileName ? fileName : "Click to upload CSV file"}
                </p>
                <Button variant="outline" className="border-border text-foreground">
                  <FileText className="mr-2 h-4 w-4" /> Select File
                </Button>
              </div>
            )}
          </div>

          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Reviews" value={result.total_reviews} icon={BarChart3} />
                <StatCard title="Fake Reviews" value={result.fake_reviews} icon={AlertTriangle} color="destructive" />
                <StatCard title="Genuine Reviews" value={result.genuine_reviews} icon={CheckCircle} color="success" />
                <StatCard title="Fake %" value={`${result.fake_percentage}%`} icon={AlertTriangle} color="warning" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" strokeWidth={0}>
                          <Cell fill="hsl(0, 72%, 51%)" />
                          <Cell fill="hsl(142, 71%, 45%)" />
                        </Pie>
                        <Tooltip contentStyle={chartTooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Comparison</h3>
                  <div className="h-64">
                    <ResponsiveContainer>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 12%, 16%)" />
                        <XAxis dataKey="name" stroke="hsl(215, 12%, 50%)" fontSize={12} />
                        <YAxis stroke="hsl(215, 12%, 50%)" fontSize={12} />
                        <Tooltip contentStyle={chartTooltipStyle} />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          <Cell fill="hsl(0, 72%, 51%)" />
                          <Cell fill="hsl(142, 71%, 45%)" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
