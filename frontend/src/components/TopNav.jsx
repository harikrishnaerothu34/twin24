import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const marketingNav = [
  { label: "Home", path: "/" },
  { label: "Features", path: "/features" },
  { label: "Docs", path: "/docs" }
];

const appNav = [
  { label: "Home", path: "/home" },
  { label: "System Monitor", path: "/system-monitor" },
  { label: "Anomaly Analysis", path: "/anomaly-analysis" },
  { label: "Alerts", path: "/alerts" },
  { label: "Model & Data", path: "/model-data" },
  { label: "Device Profile", path: "/device-profile" }
];

const TopNav = () => {
  const {
    isAuthenticated,
    openLogin,
    logout,
    user,
    monitoringActive
  } = useApp();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = isAuthenticated ? appNav : marketingNav;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0f1a]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <span className="text-lg font-bold text-white">T</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-white">TWIN24</span>
            <span className="text-xs font-medium text-slate-500">Digital Twin</span>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Monitoring Status Badge */}
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 md:flex">
                <span className={`h-2 w-2 rounded-full ${monitoringActive ? "bg-green-500" : "bg-slate-500"}`} />
                <span className="text-xs font-medium text-slate-300">
                  {monitoringActive ? "ACTIVE" : "STANDBY"}
                </span>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition-all hover:bg-white/10"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-semibold text-white">
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <span className="hidden text-sm font-medium text-white md:inline">{user.name}</span>
                </button>
                
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#0f1826]/95 p-2 shadow-xl backdrop-blur-xl">
                    <div className="border-b border-white/10 px-3 py-2">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.role}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button type="button" onClick={openLogin} className="btn-primary text-sm">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
