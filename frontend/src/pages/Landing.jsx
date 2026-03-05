import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const Landing = () => {
  const { openLogin } = useApp();

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="space-y-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Next-Gen Monitoring
              </span>
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-tight text-white lg:text-6xl">
              AI-Powered Laptop
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Digital Twin
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              A virtual mirror of your hardware. Get predictive health insights and enterprise-grade anomaly detection using neural telemetry.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/login" className="btn-primary transition-all hover:scale-105">
              Start Monitoring →
            </Link>
            <button 
              onClick={() => alert("📊 Demo features:\n✓ Real-time metrics\n✓ Anomaly detection\n✓ Health scoring\n✓ Alert system")}
              className="btn-ghost transition-all hover:scale-105"
            >
              View Demo
            </button>
          </div>

          <div className="flex items-center gap-6 border-t border-white/10 pt-6">
            <div className="flex items-center gap-8">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-[#0a0f1a] bg-gradient-to-br from-blue-500 to-cyan-500"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-400">
                Trusted by <span className="font-semibold text-white">2,000+</span> Hardware Engineers
              </p>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="card relative p-8">
          <div className="absolute right-4 top-4 flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="ml-2">VIRTUAL_DEVICE_01.098</span>
          </div>

          <div className="mt-8 flex items-center justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-2xl" />
              <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0f1a]">
                  <span className="text-4xl">💻</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white/5 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">CPU Temp</p>
              <p className="mt-1 text-lg font-bold text-cyan-400">42°C</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fan Load</p>
              <p className="mt-1 text-lg font-bold text-blue-400">64%</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Health</p>
              <p className="mt-1 text-lg font-bold text-green-400">Optimal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Real-Time Monitoring</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Continuous synchronization between physical assets and the cloud with millisecond latency.
          </p>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-lg font-semibold text-white">AI Anomaly Detection</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Deep learning algorithms identify micro-fluctuations and hardware irregularities before failure occurs.
          </p>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Lifespan Estimation</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Predictive modeling for battery wear, SSD longevity, and fan efficiency cycles based on actual usage patterns.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="card p-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-white">98%</p>
            <p className="mt-2 text-sm text-slate-400">System Health</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">99.9%</p>
            <p className="mt-2 text-sm text-slate-400">Network Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">0</p>
            <p className="mt-2 text-sm text-slate-400">Active Anomalies</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">Stable</p>
            <p className="mt-2 text-sm text-slate-400">Last Sync</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="card overflow-hidden p-8">
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ready to Optimize</p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              Turn your laptop into a smart, self-aware device.
            </h2>
            <p className="mt-3 text-slate-400">
              Register your device, enable monitoring, and start receiving real-time health insights.
            </p>
          </div>
          <Link to="/login" className="btn-primary whitespace-nowrap">
            Start Your Twin →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
