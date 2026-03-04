const Features = () => {
  return (
    <div className="space-y-8">
      <div className="card p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Features</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Operational clarity by design</h1>
        <p className="mt-3 text-sm text-slate-400">
          Explore the modules that keep digital twin programs calm, predictable, and audit-ready.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Telemetry governance",
            body: "Unified pipelines keep device signals consistent, validated, and compliant."
          },
          {
            title: "Predictive posture",
            body: "Health scoring and anomaly flags remain visible without alert fatigue."
          },
          {
            title: "Executive visibility",
            body: "Share operational summaries that align operations and leadership."
          }
        ].map((item) => (
          <div key={item.title} className="card p-6">
            <p className="text-lg font-semibold text-white">{item.title}</p>
            <p className="mt-3 text-sm text-slate-400">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
