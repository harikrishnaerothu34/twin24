import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useApp } from "../context/AppContext.jsx";
import MetricCard from "../components/MetricCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const SystemMonitor = () => {
  const { metrics, series, health, monitoringActive, deviceConfig } = useApp();

  return (
    <div className="space-y-6">
      {/* Device Header */}
      <div className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {deviceConfig.model || "MacBook Pro 16"}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <StatusBadge 
                status={monitoringActive ? "Monitoring Active" : "Standby"} 
                variant={monitoringActive ? "success" : "default"} 
              />
              <span className="text-sm text-slate-500">
                Last sync: {monitoringActive ? "2 min ago" : "—"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Health Score</p>
              <p className="mt-1 text-3xl font-bold text-white">
                {health.score}
                <span className="ml-1 text-sm font-normal text-green-400">+2%</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid - 2x2 */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.slice(0, 4).map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Charts Grid - 2 columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* CPU Chart */}
        <ChartCard title="CPU Usage" summary="Processing load over time" icon="💻">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series.cpu} margin={{ left: -10, right: 10, top: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="#475569" 
                fontSize={11} 
                tickLine={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={11} 
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12
                }}
                cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fill="url(#cpuGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* RAM Chart */}
        <ChartCard title="RAM Usage" summary="Memory allocation trend" icon="🧠">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series.memory} margin={{ left: -10, right: 10, top: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="#475569" 
                fontSize={11} 
                tickLine={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={11} 
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12
                }}
                cursor={{ stroke: "#06b6d4", strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#06b6d4" 
                strokeWidth={2}
                fill="url(#ramGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Disk Usage */}
        <ChartCard title="Disk Usage" summary="Storage utilization" icon="💾">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series.disk || series.cpu} margin={{ left: -10, right: 10, top: 10, bottom: 10 }}>
              <XAxis 
                dataKey="time" 
                stroke="#475569" 
                fontSize={11} 
                tickLine={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={11} 
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Network Activity */}
        <ChartCard title="Network Activity" summary="Upload & download rates" icon="📡">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series.network || series.memory} margin={{ left: -10, right: 10, top: 10, bottom: 10 }}>
              <XAxis 
                dataKey="time" 
                stroke="#475569" 
                fontSize={11} 
                tickLine={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={11} 
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent System Logs */}
      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Recent System Logs</h3>
        <div className="space-y-2">
          {[
            { time: "12:44:02 PM", component: "Thermal Engine", event: "Temperature spike detected in Core 4", severity: "WARNING" },
            { time: "12:42:15 PM", component: "Network Interface", event: "Successfully reconnected to 'TWIN_GUEST_5G'", severity: "INFO" },
            { time: "12:40:55 PM", component: "Security Agent", event: "Nightly system integrity check complete", severity: "SUCCESS" }
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 text-sm">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-slate-500">{log.time}</span>
                <span className="text-slate-400">{log.component}</span>
                <span className="text-slate-300">{log.event}</span>
              </div>
              <StatusBadge 
                status={log.severity} 
                variant={log.severity === "WARNING" ? "warning" : log.severity === "INFO" ? "info" : "success"} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
