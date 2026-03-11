import { useState } from "react";
import { PublicNavbar } from "@/components/PublicNavbar";
import { ResultDisplay } from "@/components/ResultDisplay";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { detectReview, type DetectionResult } from "@/lib/api";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DetectPage() {
  const [review, setReview] = useState("");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!review.trim()) {
      toast.error("Please enter a review to analyze.");
      return;
    }
    setLoading(true);
    try {
      const res = await detectReview(review.trim());
      setResult(res);
    } catch {
      toast.error("Failed to connect to the API. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Review Detector</h1>
          <p className="text-muted-foreground mb-8">Paste any review text and our AI will analyze its authenticity.</p>

          <div className="glass-card p-6">
            <Textarea
              placeholder="Paste a product review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[140px] bg-secondary/50 border-border resize-none text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-4 w-full gradient-bg text-primary-foreground font-semibold"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Analyze Review
            </Button>
          </div>

          {result && <ResultDisplay result={result} />}
        </motion.div>
      </div>
    </div>
  );
}
