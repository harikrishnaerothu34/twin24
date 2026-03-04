import { useApp } from "../context/AppContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const Home = () => {
  const { health, monitoringActive, deviceModel, deviceConfig } = useApp();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Real-time monitoring, anomaly detection, and system health analysis powered by Isolation Forest AI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monitoring Status</p>
            <div className={`h-2 w-2 rounded-full ${monitoringActive ? "bg-green-500 animate-pulse" : "bg-slate-500"}`} />
          </div>
          <p className="text-2xl font-bold text-white">
            {monitoringActive ? "Active" : "Standby"}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {deviceModel || "Device not configured"}
          </p>
        </div>

        <div className="card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">System Health</p>
          <p className="mt-3 text-4xl font-bold text-white">{health.score}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-white/10">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all" 
                style={{ width: `${health.score}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Anomaly Status</p>
          <div className="mt-3">
            <StatusBadge 
              status={health.anomalyDetected ? "DETECTED" : "NORMAL"} 
              variant={health.anomalyDetected ? "warning" : "success"} 
            />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {health.anomalyDetected ? "Unusual patterns detected" : "All systems nominal"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <p className="text-sm font-semibold text-white">Digital Twin Overview</p>
          <div className="mt-3 space-y-3 text-sm text-slate-400">
            <p>
              A digital representation of your <strong>{deviceModel || "laptop"}</strong> that continuously monitors system
              performance and detects anomalies.
            </p>
            {deviceConfig.purchaseDate && (
              <p>
                Device age: <strong>{new Date(deviceConfig.purchaseDate).toLocaleDateString()}</strong>
              </p>
            )}
            {deviceConfig.ramGB > 0 && (
              <p>
                Configuration: <strong>{deviceConfig.ramGB}GB RAM, {deviceConfig.storageGB}GB Storage</strong>
              </p>
            )}
            {deviceConfig.dailyUsageHours > 0 && (
              <p>
                Usage pattern: <strong>~{deviceConfig.dailyUsageHours} hours/day</strong>
              </p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <p className="text-sm font-semibold text-white">Isolation Forest AI Model</p>
          <div className="mt-3 space-y-2 text-sm text-slate-400">
            <p>✓ Trained on system performance datasets</p>
            <p>✓ 100 estimators, 10% contamination threshold</p>
            <p>✓ Monitors CPU, memory, disk, and network metrics</p>
            <p>✓ Device configuration adjusts health expectations</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <p className="text-sm font-semibold text-white">How Health Score is Calculated</p>
        <div className="mt-4 space-y-4 text-sm text-slate-400">
          <div className="rounded-lg border border-white/10 p-4">
            <p className="font-semibold text-white">Step 1: Isolation Forest Analysis</p>
            <p className="mt-1">
              The AI model analyzes system metrics (CPU, RAM, disk, network) and produces an anomaly score.
              This is independent of your device model—it learns what "normal" performance looks like across systems.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 p-4">
            <p className="font-semibold text-white">Step 2: Device-Specific Adjustment</p>
            <p className="mt-1">
              Your device's age and usage pattern are applied as adjustment factors.
              Older devices or heavily-used systems get adjusted expectations for what constitutes "healthy" behavior.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 p-4">
            <p className="font-semibold text-white">Step 3: Final Health Score</p>
            <p className="mt-1">
              The final score (0–100) combines anomaly detection with device context to provide a
              personalized view of your laptop's health.
            </p>
          </div>
        </div>
        {health.factors && (
          <div className="mt-4 rounded-lg bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Current Factors</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">Anomaly Score</p>
                <p className="mt-1 font-semibold text-white">{health.factors.baseAnomalyScore}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Age Factor</p>
                <p className="mt-1 font-semibold text-white">{health.factors.ageFactor}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Usage Factor</p>
                <p className="mt-1 font-semibold text-white">{health.factors.usageFactor}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
