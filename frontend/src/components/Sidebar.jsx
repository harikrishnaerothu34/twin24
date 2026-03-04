import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const navItems = [
  { label: "Dashboard", path: "/home", icon: "🏠" },
  { label: "Monitor", path: "/system-monitor", icon: "📊" },
  { label: "Analysis", path: "/anomaly-analysis", icon: "🔍" },
  { label: "Alerts", path: "/alerts", icon: "🔔" },
  { label: "Model", path: "/model-data", icon: "🤖" },
  { label: "Profile", path: "/device-profile", icon: "💻" }
];

const Sidebar = () => {
  const { isAuthenticated, isSidebarCollapsed } = useApp();

  if (!isAuthenticated || isSidebarCollapsed) {
    return null;
  }

  return (
    <aside className="hidden w-64 lg:block">
      <div className="card p-4">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Quick Nav</p>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
