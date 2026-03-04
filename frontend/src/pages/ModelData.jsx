import StatusBadge from "../components/StatusBadge.jsx";

const ModelData = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white">Model & Data Details</h1>
        <p className="mt-2 text-sm text-slate-400">
          Technical architecture and dataset configuration for the TWIN24 predictive engine.
          Monitor algorithm performance and data freshness.
        </p>
      </div>

      {/* Model Overview Card */}
      <div className="card p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10">
              <span className="text-3xl">🤖</span>
            </div>
            <div>
              <StatusBadge status="ACTIVE ENGINE" variant="success" />
              <h2 className="mt-2 text-2xl font-bold text-white">Isolation Forest</h2>
              <p className="text-sm text-slate-400">Primary Anomaly Detection Algorithm</p>
            </div>
          </div>
          <button className="btn-primary">
            🔄 Retrain Model
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Training Type</p>
            <p className="mt-2 text-lg font-semibold text-white">Offline Training</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dataset Source</p>
            <p className="mt-2 text-lg font-semibold text-white">Kaggle</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Last Updated</p>
            <p className="mt-2 text-lg font-semibold text-white">Oct 24, 2023</p>
            <p className="text-xs text-slate-500">14:30 UTC</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Model Accuracy</p>
            <p className="mt-2 text-lg font-semibold text-green-400">98.42%</p>
            <p className="text-xs text-slate-500">Precision</p>
          </div>
        </div>
      </div>

      {/* Dataset Health */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Dataset Health</h3>
            <p className="text-sm text-slate-400">Monitor data quality and freshness</p>
          </div>
          <StatusBadge status="1.2 TB" variant="info" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Reliability</p>
            </div>
            <p className="mt-2 text-3xl font-bold text-green-400">99.8%</p>
            <p className="mt-1 text-xs text-slate-400">Validation passed</p>
          </div>

          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Consistency</p>
            </div>
            <p className="mt-2 text-3xl font-bold text-blue-400">94%</p>
            <p className="mt-1 text-xs text-slate-400">Schema compliance</p>
          </div>

          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Model Lineage</p>
            </div>
            <p className="mt-2 text-xl font-bold text-cyan-400">v1.2.4-stable</p>
            <p className="mt-1 text-xs text-slate-400">Current active version</p>
          </div>
        </div>
      </div>

      {/* Model Specifications */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Model Specifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-400">Contamination Rate</span>
              <span className="font-mono text-sm font-semibold text-white">0.85</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-400">Number of Estimators</span>
              <span className="font-mono text-sm font-semibold text-white">100</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-400">Max Samples</span>
              <span className="font-mono text-sm font-semibold text-white">Auto</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-400">Bootstrap Enabled</span>
              <span className="font-mono text-sm font-semibold text-white">False</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Training Dataset</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-400">Total Samples</span>
              <span className="font-mono text-sm font-semibold text-white">~15,000+</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-400">Features</span>
              <span className="font-mono text-sm font-semibold text-white">11</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-400">Source</span>
              <span className="font-mono text-sm font-semibold text-white">Kaggle</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-400">Scaling Method</span>
              <span className="font-mono text-sm font-semibold text-white">StandardScaler</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <span>📄</span> Technical Docs
          </h3>
          <p className="text-sm text-slate-400">
            Access comprehensive documentation on the Isolation Forest implementation, feature engineering pipeline, and model evaluation metrics.
          </p>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5">
            View Documentation →
          </button>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <span>🔗</span> API Reference
          </h3>
          <p className="text-sm text-slate-400">
            Integrate TWIN24's anomaly detection API into your own applications. RESTful endpoints with JSON responses.
          </p>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5">
            API Reference →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelData;
