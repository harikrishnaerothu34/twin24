import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../context/AppContext.jsx";
import RiskIndicator from "../components/RiskIndicator.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const AnomalyAnalysis = () => {
  const { health, metrics } = useApp();

  // Mock timeline data for anomaly history
  const timelineData = [
    { time: "00:00", score: 45 },
    { time: "04:00", score: 52 },
    { time: "08:00", score: 68 },
    { time: "10:00", score: 72 },
    { time: "12:00", score: 85 },
    { time: "14:00", score: 88 },
    { time: "16:00", score: 95 },
    { time: "18:00", score: 78 },
    { time: "20:00", score: 82 },
    { time: "23:00", score: 91 },
    { time: "Now", score: 68, highlight: true }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Anomaly Analysis</h1>
            <p className="mt-1 text-sm text-slate-400">
              Real-time AI surveillance and risk intelligence engine.
            </p>
          </div>
          <StatusBadge status="MEDIUM RISK" variant="warning" />
        </div>
      </div>

      {/* Main Risk Card */}
      <div className="card p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          {/* Risk Score Circle */}
          <div className="flex flex-col items-center justify-center">
            <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Anomaly Score
            </p>
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-amber-500/10 to-amber-500/5 blur-2xl" />
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-8 border-white/10 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                <div className="text-center">
                  <div className="text-6xl font-bold text-amber-400">68</div>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Anomaly Score
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">
              Last updated: 2 minutes ago
            </p>
          </div>

          {/* Risk Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Intelligent Risk Evaluation</h3>
              <p className="mt-2 text-sm text-slate-400">
                Our neural network has identified a non-critical anomaly in session{" "}
                <span className="font-mono text-cyan-400">TX-0042-B</span>. The detection is based on irregular API call patterns and a geographic mismatch between the known user profile and the current ingress point.
              </p>
              <p className="mt-3 font-semibold text-amber-400">
                System recommendation: Enhanced monitoring for the next 24 hours.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ingress Velocity</p>
                <p className="mt-2 text-2xl font-bold text-white">1.2 GB/s</p>
                <p className="mt-1 text-xs text-slate-400">+12% from baseline</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Origin Hotspot</p>
                <p className="mt-2 text-2xl font-bold text-white">Singapore</p>
                <p className="mt-1 text-xs text-slate-400">IP: 103.24.20.12</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Confidence</p>
                <p className="mt-2 text-2xl font-bold text-white">94.2%</p>
                <p className="mt-1 text-xs text-slate-400">High model certainty</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="btn-primary flex-1">
                📊 Review Details
              </button>
              <button className="btn-secondary flex-1">
                Mark as Safe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Anomaly History Timeline */}
      <div className="card p-6">
        <h3 className="mb-6 text-sm font-semibold text-white">Anomaly History Timeline</h3>
        <div className="flex items-center gap-4 mb-4">
          <button className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
            24h
          </button>
          <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:bg-white/5">
            7d
          </button>
          <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:bg-white/5">
            30d
          </button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={timelineData} margin={{ left: -10, right: 10, top: 10, bottom: 10 }}>
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
            <Bar 
              dataKey="score" 
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Current Metrics Contributing to Score */}
      <div className="grid gap-6 lg:grid-cols-3">
        {metrics.slice(0, 3).map((metric) => (
          <div key={metric.title} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{metric.title}</p>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">
              {metric.value}
              <span className="text-sm font-normal text-slate-400">{metric.unit}</span>
            </p>
            <p className="mt-2 text-xs text-slate-500">Within normal range</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnomalyAnalysis;
