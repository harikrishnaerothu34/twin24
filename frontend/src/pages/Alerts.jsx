import SectionTitle from "../components/SectionTitle.jsx";
import { alerts } from "../data/mockData.js";

const severityStyle = {
  Low: "text-[color:var(--success)] bg-[color:var(--success)]/15",
  Medium: "text-[color:var(--warning)] bg-[color:var(--warning)]/15",
  High: "text-[color:var(--danger)] bg-[color:var(--danger)]/15"
};

const Alerts = () => {
  return (
    <div className="space-y-8">
      <div className="card p-6">
        <SectionTitle title="Alert queue" subtitle="Alerts" />
        <p className="mt-3 text-sm text-slate-400">
          Escalations based on thresholds and predictive anomaly signals.
        </p>
      </div>

      <div className="card p-6">
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-4"
            >
              <div>
                <p className="text-sm font-semibold text-white">{alert.title}</p>
                <p className="text-xs text-slate-500">{alert.source}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">{alert.time}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityStyle[alert.severity]}`}>
                  {alert.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
