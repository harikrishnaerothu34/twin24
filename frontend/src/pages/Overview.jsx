import { useApp } from "../context/AppContext.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import HealthBadge from "../components/HealthBadge.jsx";

const Overview = () => {
  const { health, monitoringActive, deviceModel } = useApp();

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <SectionTitle title="Operations overview" subtitle="Overview" />
        <p className="mt-3 text-sm text-slate-400">
          High-level health indicators and monitoring readiness for your active digital twins.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Monitoring state</p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {monitoringActive ? "Monitoring Active" : "Standby"}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {deviceModel ? `Primary model: ${deviceModel}` : "Device registration pending"}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Current risk</p>
          <div className="mt-4">
            <HealthBadge level={health.risk} />
          </div>
          <p className="mt-3 text-sm text-slate-400">Health score: {health.score}/100</p>
        </div>
        <div className="card p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Advisory</p>
          <p className="mt-3 text-sm text-slate-300">
            {health.anomaly
              ? "Isolation Forest flagged an anomaly. Review alerts for response."
              : "Systems remain within expected operational thresholds."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
