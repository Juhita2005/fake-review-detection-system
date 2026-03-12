import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login — in production use proper auth
    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("adminAuth", "true");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid credentials. Try admin / admin123");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      {/* <Link
         to="/"
         className="absolute top-6 left-6 text-sm text-muted-foreground hover:text-primary transition"
      >
         ← Back to Home
      </Link> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-full bg-primary/10 p-3 mb-3">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">ReviewGuard AI Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 bg-secondary/50 border-border text-foreground"
              placeholder="admin"
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-secondary/50 border-border text-foreground"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full gradient-bg text-primary-foreground font-semibold">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">Demo: admin / admin123</p>
      </motion.div>
    </div>
  );
}
