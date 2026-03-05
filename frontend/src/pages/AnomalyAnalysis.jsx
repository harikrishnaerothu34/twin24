import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../context/AppContext.jsx";
import RiskIndicator from "../components/RiskIndicator.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const AnomalyAnalysis = () => {
  const { health, metrics } = useApp();
  const [anomalyScore, setAnomalyScore] = useState(68);
  const [riskLevel, setRiskLevel] = useState("MEDIUM");
  const [riskColor, setRiskColor] = useState("amber");
  const [systemRecommendation, setSystemRecommendation] = useState("Enhanced monitoring for the next 24 hours");

  // Color map for tailwind classes
  const colorMap = {
    red: { bg: "from-red-500/10 to-red-500/5", text: "text-red-400" },
    amber: { bg: "from-amber-500/10 to-amber-500/5", text: "text-amber-400" },
    blue: { bg: "from-blue-500/10 to-blue-500/5", text: "text-blue-400" },
    green: { bg: "from-green-500/10 to-green-500/5", text: "text-green-400" }
  };

  // Calculate anomaly score based on metrics
  useEffect(() => {
    if (metrics && metrics.length > 0) {
      const cpu = metrics.find(m => m.title === "CPU Usage")?.value || 0;
      const ram = metrics.find(m => m.title === "RAM Usage")?.value || 0;
      const disk = metrics.find(m => m.title === "Disk Usage")?.value || 0;
      const network = metrics.find(m => m.title === "Network Usage")?.value || 0;

      // Calculate anomaly score based on metrics
      // Higher values = more anomalous
      const avgUsage = (cpu + ram + disk + network) / 4;
      const stdDev = Math.sqrt(
        ((cpu - avgUsage) ** 2 + (ram - avgUsage) ** 2 + (disk - avgUsage) ** 2 + (network - avgUsage) ** 2) / 4
      );

      // Anomaly score formula: base on deviation and peak values
      let score = Math.min(99, Math.round(avgUsage * 0.3 + stdDev * 0.4 + Math.max(cpu, ram, disk, network) * 0.3));
      
      // Add randomness for simulation
      score = score + (Math.random() * 10 - 5);
      score = Math.max(0, Math.min(100, Math.round(score)));

      setAnomalyScore(score);

      // Determine risk level
      let risk, color, recommendation;
      if (score >= 75) {
        risk = "CRITICAL";
        color = "red";
        recommendation = "⚠️ Immediate action required: System showing critical anomalies. Initiate emergency diagnostics and consider service restart.";
      } else if (score >= 50) {
        risk = "MEDIUM";
        color = "amber";
        recommendation = "📊 Enhanced monitoring recommended: Non-critical anomalies detected. Continue observation for next 24 hours.";
      } else if (score >= 25) {
        risk = "LOW";
        color = "blue";
        recommendation = "ℹ️ Normal operation: Slight variations detected but within expected parameters. No action needed.";
      } else {
        risk = "NORMAL";
        color = "green";
        recommendation = "✅ All systems optimal: Excellent performance metrics across all subsystems.";
      }

      setRiskLevel(risk);
      setRiskColor(color);
      setSystemRecommendation(recommendation);
    }
  }, [metrics]);

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
    { time: "23:00", score: 71 },
    { time: "Now", score: anomalyScore, highlight: true }
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
          <StatusBadge status={riskLevel} variant={riskColor === "red" ? "danger" : riskColor === "amber" ? "warning" : riskColor === "green" ? "success" : "info"} />
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
              <div className={`absolute inset-0 animate-pulse rounded-full bg-gradient-to-r ${colorMap[riskColor].bg} blur-2xl`} />
              <div className={`relative flex h-48 w-48 items-center justify-center rounded-full border-8 border-white/10 bg-gradient-to-br ${colorMap[riskColor].bg}`}>
                <div className="text-center">
                  <div className={`text-6xl font-bold ${colorMap[riskColor].text}`}>{anomalyScore}</div>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Anomaly Score
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">
              Last updated: just now
            </p>
          </div>

          {/* Risk Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Intelligent Risk Evaluation</h3>
              <p className="mt-2 text-sm text-slate-400">
                {systemRecommendation}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Risk Level</p>
                <p className={`mt-2 text-2xl font-bold ${colorMap[riskColor].text}`}>{riskLevel}</p>
                <p className="mt-1 text-xs text-slate-400">Current status</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Alert Count</p>
                <p className="mt-2 text-2xl font-bold text-white">{Math.round(anomalyScore / 20)}</p>
                <p className="mt-1 text-xs text-slate-400">Active alerts</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Confidence</p>
                <p className="mt-2 text-2xl font-bold text-white">{Math.round(health.score * 0.94)}%</p>
                <p className="mt-1 text-xs text-slate-400">Model certainty</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="btn-primary flex-1 transition-all hover:scale-105">
                📊 Review Details
              </button>
              <button className="btn-secondary flex-1 transition-all hover:scale-105">
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
