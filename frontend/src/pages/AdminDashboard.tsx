import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { getReviewLogs, type ReviewLog } from "@/lib/api";
import { exportDashboardToCSV, exportToPDF } from "@/lib/export";
import { motion } from "framer-motion";
import { BarChart3, AlertTriangle, CheckCircle, Activity, Download, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area,
} from "recharts";

const chartTooltipStyle = {
  background: "hsl(225, 14%, 10%)",
  border: "1px solid hsl(225, 12%, 16%)",
  borderRadius: "8px",
  color: "hsl(210, 20%, 92%)",
};

export default function AdminDashboard() {
  const [logs, setLogs] = useState<ReviewLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviewLogs()
      .then(setLogs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fakeCount = logs.filter((l) => l.prediction === "Fake Review").length;
  const genuineCount = logs.length - fakeCount;
  const fakeRate = logs.length ? `${((fakeCount / logs.length) * 100).toFixed(1)}%` : "0%";

  const pieData = [
    { name: "Fake", value: fakeCount },
    { name: "Genuine", value: genuineCount },
  ];

  const barData = [
    { name: "Fake", count: fakeCount },
    { name: "Genuine", count: genuineCount },
  ];

  const histBuckets = Array.from({ length: 10 }, (_, i) => {
    const lo = i * 0.1;
    const hi = lo + 0.1;
    const count = logs.filter((l) => l.fake_probability >= lo && l.fake_probability < hi).length;
    return { range: `${(lo * 100).toFixed(0)}-${(hi * 100).toFixed(0)}%`, count };
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of all analyzed reviews.</p>
        </div>
        {!loading && logs.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportDashboardToCSV({ total: logs.length, fake: fakeCount, genuine: genuineCount, fakeRate })}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading data...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Reviews" value={logs.length} icon={BarChart3} />
            <StatCard title="Fake Reviews" value={fakeCount} icon={AlertTriangle} color="destructive" />
            <StatCard title="Genuine Reviews" value={genuineCount} icon={CheckCircle} color="success" />
            <StatCard title="Fake Rate" value={fakeRate} icon={Activity} color="warning" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Fake vs Genuine</h3>
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
              <h3 className="font-semibold mb-4">Review Counts</h3>
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

            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Probability Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <AreaChart data={histBuckets}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 12%, 16%)" />
                    <XAxis dataKey="range" stroke="hsl(215, 12%, 50%)" fontSize={10} angle={-30} textAnchor="end" height={50} />
                    <YAxis stroke="hsl(215, 12%, 50%)" fontSize={12} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area type="monotone" dataKey="count" stroke="hsl(199, 89%, 48%)" fill="hsl(199, 89%, 48%)" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
