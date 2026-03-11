import { useState } from "react";
import { PublicNavbar } from "@/components/PublicNavbar";
import { ResultDisplay } from "@/components/ResultDisplay";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { detectReview, type DetectionResult } from "@/lib/api";
import { motion } from "framer-motion";
import { Star, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
  description: string;
}

const products: Product[] = [
  { id: 1, title: "Wireless Headphones Pro", category: "Electronics", price: "$149.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", description: "Premium wireless headphones with noise cancellation." },
  { id: 2, title: "Classic Leather Jacket", category: "Fashion", price: "$299.99", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop", description: "Genuine leather jacket with modern slim fit." },
  { id: 3, title: "Organic Green Tea Set", category: "Food & Beverage", price: "$34.99", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop", description: "Hand-picked organic green tea from Japan." },
  { id: 4, title: "Smart Watch Ultra", category: "Electronics", price: "$399.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop", description: "Advanced smartwatch with health monitoring." },
  { id: 5, title: "Running Shoes Elite", category: "Fashion", price: "$179.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", description: "Ultra-lightweight performance running shoes." },
  { id: 6, title: "Artisan Coffee Beans", category: "Food & Beverage", price: "$24.99", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop", description: "Single-origin specialty roasted coffee beans." },
];

function ProductCard({ product }: { product: Product }) {
  const [review, setReview] = useState("");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!review.trim()) {
      toast.error("Please write a review first.");
      return;
    }
    setLoading(true);
    try {
      const res = await detectReview(review.trim());
      setResult(res);
    } catch {
      toast.error("API connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover" loading="lazy" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-primary font-medium">{product.category}</span>
          <span className="font-bold">{product.price}</span>
        </div>
        <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{product.description}</p>

        <div className="flex gap-0.5 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="h-4 w-4 fill-warning text-warning" />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full border-border text-foreground"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Review Form" : "Write a Review"}
        </Button>

        {expanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
            <Textarea
              placeholder="Write your review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="bg-secondary/50 border-border resize-none text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full gradient-bg text-primary-foreground"
              size="sm"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit & Detect
            </Button>
            {result && <ResultDisplay result={result} />}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function DemoShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-2">Demo Shop</h1>
        <p className="text-muted-foreground mb-8">Submit reviews on demo products — each review is analyzed by our AI in real-time.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
