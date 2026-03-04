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
import HealthBadge from "../components/HealthBadge.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import ChartCard from "../components/ChartCard.jsx";

const Dashboard = () => {
  const { metrics, series, health, monitoringActive, deviceModel } = useApp();

  return (
    <div className="space-y-8">
      <div className="card flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <SectionTitle title="Operational cockpit" subtitle="Dashboard" />
          <p className="mt-3 text-sm text-slate-400">
            Monitoring fleet health, utilization, and predictive readiness in real time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-2xl bg-white/5 px-4 py-3">
            <p className="text-xs text-slate-500">System health</p>
            <div className="mt-2">
              <HealthBadge level={health.risk} />
            </div>
            <p className="mt-2 text-xs text-slate-500">Score {health.score}/100</p>
          </div>
          <div className="rounded-2xl bg-white/5 px-4 py-3">
            <p className="text-xs text-slate-500">Active twins</p>
            <p className="mt-2 text-xl font-semibold text-white">214</p>
            <p className="mt-2 text-xs text-slate-500">
              {monitoringActive ? "Monitoring Active" : "Monitoring Standby"}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 px-4 py-3">
            <p className="text-xs text-slate-500">Primary model</p>
            <p className="mt-2 text-sm font-semibold text-white">
              {deviceModel || "Not registered"}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {health.anomaly ? "Anomaly flagged" : "No anomaly"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="CPU utilization" summary="Balanced processing with steady peaks">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series.cpu} margin={{ left: -10, right: 10 }}>
              <defs>
                <linearGradient id="cpuFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B8DEF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#5B8DEF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#536174" fontSize={11} />
              <YAxis stroke="#536174" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#0f141a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12
                }}
              />
              <Area type="monotone" dataKey="value" stroke="#5B8DEF" fill="url(#cpuFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Memory consumption" summary="Core services remain within threshold">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series.memory} margin={{ left: -10, right: 10 }}>
              <XAxis dataKey="time" stroke="#536174" fontSize={11} />
              <YAxis stroke="#536174" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#0f141a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#48B07F" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
