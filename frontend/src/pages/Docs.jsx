const Docs = () => {
  return (
    <div className="space-y-8">
      <div className="card p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Docs</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Implementation guide</h1>
        <p className="mt-3 text-sm text-slate-400">
          Reference integration readiness, telemetry schemas, and operational workflows.
        </p>
      </div>
      <div className="card p-6">
        <div className="grid gap-4">
          {[
            "Telemetry schema overview",
            "Digital twin lifecycle",
            "Anomaly response playbooks",
            "API authentication and SSO"
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4"
            >
              <span className="text-sm text-slate-300">{item}</span>
              <span className="text-xs text-slate-500">Draft</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Docs;
