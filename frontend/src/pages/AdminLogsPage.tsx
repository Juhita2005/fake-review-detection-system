import { useEffect, useMemo, useState } from "react";
import { getReviewLogs, type ReviewLog } from "@/lib/api";
import { exportLogsToCSV, exportToPDF } from "@/lib/export";
import { motion } from "framer-motion";
import { FileText, ShieldAlert, ShieldCheck, Search, Download, FileDown, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ReviewLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "fake" | "genuine">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    getReviewLogs()
      .then(setLogs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = logs;
    if (categoryFilter !== "all") {
      result = result.filter((l) => l.category === categoryFilter);
    }
    if (filter === "fake") result = result.filter((l) => l.prediction === "Fake Review");
    if (filter === "genuine") result = result.filter((l) => l.prediction !== "Fake Review");
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.review_text.toLowerCase().includes(q));
    }
    return result;
  }, [logs, filter, search, categoryFilter]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Logs</h1>
          <p className="text-muted-foreground">All reviews analyzed by the system.</p>
        </div>
        {!loading && logs.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportLogsToCSV(filtered)}>
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

      {/* Search & Filter Bar */}
      {!loading && logs.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary/50 border-border"
            />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="fake">Fake Only</SelectItem>
              <SelectItem value="genuine">Genuine Only</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
              <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        {loading ? (
          <p className="p-8 text-muted-foreground">Loading logs...</p>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {logs.length === 0 ? "No reviews found. Analyze some reviews first." : "No reviews match your search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Review Text</TableHead>
                  <TableHead className="text-muted-foreground">Prediction</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground text-right">Fake Prob.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((log) => {
                  const isFake = log.prediction === "Fake Review";
                  return (
                    <TableRow key={log.id} className="border-border">
                      <TableCell className="font-mono text-muted-foreground text-sm">
                        {log.id}
                      </TableCell>

                      <TableCell className="max-w-xs truncate text-sm">
                        {log.review_text}
                      </TableCell>

                      <TableCell>
                        <span 
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                            isFake
                              ? "bg-destructive/10 text-destructive"
                              : "bg-success/10 text-success"
                          }`}
                        >
                          {isFake ? <ShieldAlert className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                          {log.prediction}
                        </span>
                      </TableCell>

                      <TableCell className="text-sm">
                        <span className="px-2 py-1 text-xs rounded bg-secondary text-muted-foreground">
                          {log.category}
                        </span>
                      </TableCell>

                      <TableCell className="text-right font-mono text-sm">
                        {(log.fake_probability * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {!loading && logs.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {logs.length} reviews
        </p>
      )}
    </motion.div>
  );
}
