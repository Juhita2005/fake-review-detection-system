import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { DetectionResult } from "@/lib/api";

interface Props {
  result: DetectionResult;
}

export function ResultDisplay({ result }: Props) {
  const isFake = result.prediction === "Fake Review";
  const data = [
    { name: "Fake", value: +(result.fake_probability * 100).toFixed(1) },
    { name: "Genuine", value: +(result.genuine_probability * 100).toFixed(1) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 mt-6"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className={`rounded-full p-4 ${isFake ? "bg-destructive/10" : "bg-success/10"}`}>
            {isFake ? (
              <ShieldAlert className="h-8 w-8 text-destructive" />
            ) : (
              <ShieldCheck className="h-8 w-8 text-success" />
            )}
          </div>
          <div className="text-center">
            <p className={`text-lg font-bold ${isFake ? "text-destructive" : "text-success"}`}>
              {result.prediction}
            </p>
            <p className="text-xs text-muted-foreground mt-1">AI Confidence</p>
          </div>
        </div>

        {/* Chart */}
        <div className="w-48 h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill="hsl(0, 72%, 51%)" />
                <Cell fill="hsl(142, 71%, 45%)" />
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(225, 14%, 10%)",
                  border: "1px solid hsl(225, 12%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(210, 20%, 92%)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Fake Probability:</span>
            <span className="font-mono font-semibold">{(result.fake_probability * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span className="text-muted-foreground">Genuine Probability:</span>
            <span className="font-mono font-semibold">{(result.genuine_probability * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
