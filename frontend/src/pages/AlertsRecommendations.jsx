import StatusBadge from "../components/StatusBadge.jsx";

const alerts = [
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
            <button className="btn-secondary">
              🔍 Filter
            </button>
            <button className="btn-primary">
              📤 Export Log
            </button>
          </div>
        </div>
      </div>

      {/* Alert Tabs */}
      <div className="card p-2">
        <div className="flex gap-2">
          <button className="flex-1 rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
            All Notifications
            <span className="ml-2 rounded-full bg-blue-500/20 px-2 py-0.5 text-xs">24</span>
          </button>
          <button className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:bg-white/5">
            Critical
            <span className="ml-2 rounded-full bg-white/5 px-2 py-0.5 text-xs">9</span>
          </button>
          <button className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:bg-white/5">
            Warning
            <span className="ml-2 rounded-full bg-white/5 px-2 py-0.5 text-xs">8</span>
          </button>
          <button className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:bg-white/5">
            Maintenance
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <div key={alert.id} className="card p-6">
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
        })}
      </div>

      {/* Pagination */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">Showing 5 of 24 active alerts</p>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5">
              ←
            </button>
            <button className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-400">
              1
            </button>
            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5">
              2
            </button>
            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5">
              3
            </button>
            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsRecommendations;
