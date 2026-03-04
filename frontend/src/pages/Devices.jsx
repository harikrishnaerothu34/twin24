import SectionTitle from "../components/SectionTitle.jsx";
import { devices } from "../data/mockData.js";

const statusStyle = {
  Healthy: "text-[color:var(--success)] bg-[color:var(--success)]/15",
  Warning: "text-[color:var(--warning)] bg-[color:var(--warning)]/15",
  Attention: "text-[color:var(--danger)] bg-[color:var(--danger)]/15"
};

const Devices = () => {
  return (
    <div className="space-y-8">
      <div className="card p-6">
        <SectionTitle title="Device fleet" subtitle="Devices" />
        <p className="mt-3 text-sm text-slate-400">
          Status overview for operational twins and edge nodes running in production.
        </p>
      </div>

      <div className="card p-6">
        <div className="grid gap-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="grid gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 md:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr]"
            >
              <div>
                <p className="text-sm font-semibold text-white">{device.name}</p>
                <p className="text-xs text-slate-500">{device.id}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Location</p>
                <p className="text-sm text-slate-300">{device.location}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Uptime</p>
                <p className="text-sm text-slate-300">{device.uptime}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Load</p>
                <p className="text-sm text-slate-300">{device.load}</p>
              </div>
              <div className="flex items-center">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[device.status]}`}>
                  {device.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Devices;
