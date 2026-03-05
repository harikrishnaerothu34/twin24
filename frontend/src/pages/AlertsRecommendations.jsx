import { useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";

const initialAlerts = [
  {
    id: 1,
    title: "Database Connection Failure",
    description: "Master database node in US-EAST-1 is unreachable. Latency spiked to 2500ms before disconnect.",
    recommendation: "Failover to standby node 'db-secondary-02' immediately.",
    severity: "danger",
    time: "2 mins ago"
  },
  {
    id: 2,
    title: "High Memory Utilization",
    description: "Server Cluster 04 (Production) memory usage exceeded 85% threshold.",
    recommendation: "Initiate auto-scaling or clear redis-cache instance.",
    severity: "warning",
    time: "14 mins ago"
  },
  {
    id: 3,
    title: "Security Patch Available",
    description: "System kernel update (v5.15.0-72) is ready for deployment across fleet.",
    recommendation: "Schedule deployment during next maintenance window.",
    severity: "info",
    time: "09:12 AM"
  },
  {
    id: 4,
    title: "Unusual API Traffic Pattern",
    description: "200% increase in authentication requests originating from IP range 192.168.0.x.",
    recommendation: "Enable rate limiting for the identified subnet.",
    severity: "warning",
    time: "08:45 AM"
  },
  {
    id: 5,
    title: "Backup Successful",
    description: "Daily system snapshot 'SNAP-2023102.4' stored in S3 glacier cold storage.",
    recommendation: "Verify integrity of the latest restore point.",
    severity: "success",
    time: "Yesterday"
  }
];

const severityConfig = {
  danger: { variant: "danger", icon: "🚨", label: "CRITICAL" },
  warning: { variant: "warning", icon: "⚠️", label: "WARNING" },
  info: { variant: "info", icon: "ℹ️", label: "INFO" },
  success: { variant: "success", icon: "✓", label: "SUCCESS" }
};

const AlertsRecommendations = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Filter alerts
  const filteredAlerts = selectedFilter === "all" 
    ? initialAlerts 
    : initialAlerts.filter(alert => alert.severity === selectedFilter);

  // CSV export function
  const exportToCSV = () => {
    const headers = ["ID", "Title", "Severity", "Description", "Recommendation", "Time"];
    const rows = filteredAlerts.map(alert => [
      alert.id,
      alert.title,
      severityConfig[alert.severity].label,
      alert.description,
      alert.recommendation,
      alert.time
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `alerts-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Active Alerts</h1>
            <p className="mt-1 text-sm text-slate-400">
              Real-time system monitoring and event logging
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToCSV}
              className="btn-primary transition-all hover:scale-105"
            >
              📤 Export Log
            </button>
          </div>
        </div>
      </div>

      {/* Alert Filter Tabs */}
      <div className="card p-2">
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setSelectedFilter("all")}
            className={`flex-1 min-w-max rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedFilter === "all"
                ? "bg-blue-500/10 text-blue-400"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            All Notifications
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              selectedFilter === "all" ? "bg-blue-500/20" : "bg-white/5"
            }`}>{initialAlerts.length}</span>
          </button>
          <button 
            onClick={() => setSelectedFilter("danger")}
            className={`flex-1 min-w-max rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedFilter === "danger"
                ? "bg-red-500/10 text-red-400"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Critical
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              selectedFilter === "danger" ? "bg-red-500/20" : "bg-white/5"
            }`}>{initialAlerts.filter(a => a.severity === "danger").length}</span>
          </button>
          <button 
            onClick={() => setSelectedFilter("warning")}
            className={`flex-1 min-w-max rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedFilter === "warning"
                ? "bg-amber-500/10 text-amber-400"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Warning
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              selectedFilter === "warning" ? "bg-amber-500/20" : "bg-white/5"
            }`}>{initialAlerts.filter(a => a.severity === "warning").length}</span>
          </button>
          <button 
            onClick={() => setSelectedFilter("info")}
            className={`flex-1 min-w-max rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedFilter === "info"
                ? "bg-blue-500/10 text-blue-400"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Info
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              selectedFilter === "info" ? "bg-blue-500/20" : "bg-white/5"
            }`}>{initialAlerts.filter(a => a.severity === "info").length}</span>
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-slate-400">No alerts found for this filter</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const config = severityConfig[alert.severity];
            return (
              <div key={alert.id} className="card p-6 transition-all hover:border-white/20 cursor-pointer">
                <div className="flex flex-col gap-4">
                  {/* Alert Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-xl">
                        {config.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{alert.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">{alert.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={config.label} variant={config.variant} />
                      <span className="text-xs text-slate-500">{alert.time}</span>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Recommendation
                    </p>
                    <p className="mt-2 text-sm text-slate-300">{alert.recommendation}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">Showing {filteredAlerts.length} of {initialAlerts.length} alerts</p>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 transition-all">
              ←
            </button>
            <button className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-400">
              1
            </button>
            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 transition-all">
              2
            </button>
            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 transition-all">
              3
            </button>
            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 transition-all">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsRecommendations;
