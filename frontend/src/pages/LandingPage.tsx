import { Link } from "react-router-dom";
import { PublicNavbar } from "@/components/PublicNavbar";
import { motion } from "framer-motion";
import { Shield, Zap, BarChart3, ShoppingBag, ArrowRight, Brain, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Brain, title: "AI-Powered Detection", desc: "Advanced ML models trained on thousands of reviews to identify fake patterns." },
  { icon: FileText, title: "Bulk CSV Analysis", desc: "Upload CSV files with hundreds of reviews and get instant analysis results." },
  { icon: BarChart3, title: "Rich Analytics", desc: "Visualize detection results with interactive charts and probability distributions." },
  { icon: Lock, title: "Admin Dashboard", desc: "Comprehensive admin panel with review logs, charts, and real-time monitoring." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm mb-8">
              <Shield className="h-4 w-4" />
              AI-Powered Review Intelligence
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Detect <span className="gradient-text">Fake Reviews</span> Instantly
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Protect your platform with cutting-edge machine learning. Analyze individual reviews or bulk CSV uploads in real-time.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-bg text-primary-foreground font-semibold px-8 animate-pulse-glow">
                <Link to="/detect">
                  <Zap className="mr-2 h-5 w-5" />
                  Try AI Detector
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary">
                <Link to="/demo-shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Demo Shop
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything You Need</h2>
            <p className="mt-3 text-muted-foreground">A complete toolkit for review authenticity verification.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 group hover:border-primary/30 transition-colors"
              >
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="glass-card glow-border p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">Analyze your first review in seconds. No sign-up required.</p>
            <Button asChild size="lg" className="gradient-bg text-primary-foreground font-semibold">
              <Link to="/detect">
                Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 ReviewGuard AI. Built with machine learning.
        </div>
      </footer>
    </div>
  );
}
