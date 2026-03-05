const Docs = () => {
  const generatePDF = () => {
    // Create a simple PDF-like text file for demonstration
    const pdfContent = `
TWIN24 Digital Twin - Implementation Guide
Generated: ${new Date().toISOString()}

TABLE OF CONTENTS
1. Telemetry Schema Overview
2. Digital Twin Lifecycle
3. Anomaly Response Playbooks
4. API Authentication and SSO

1. TELEMETRY SCHEMA OVERVIEW
=============================
The system collects the following metrics:
- CPU Usage (%)
- RAM Usage (%)
- Disk Usage (%)
- Network Usage (%)
- Battery Level (%)
- System Uptime (%)

Update Frequency: Every 2 seconds
Data Retention: 30 days rolling window

2. DIGITAL TWIN LIFECYCLE
==========================
Phase 1: Initialization
- Device profile creation
- Historical data ingestion
- Model calibration

Phase 2: Monitoring
- Real-time metric collection
- Anomaly detection
- Health score calculation

Phase 3: Alerting
- Alert generation
- Recommendation engine
- Notification dispatch

3. ANOMALY RESPONSE PLAYBOOKS
==============================
Low Risk (Score 0-25):
- Continue normal monitoring
- No immediate action required

Medium Risk (Score 25-50):
- Enhanced monitoring enabled
- 24-hour observation period

High Risk (Score 50-75):
- Immediate diagnostics initiated
- Administrator notification

Critical Risk (Score 75-100):
- Emergency protocols activated
- Service restart recommended
- Full system diagnostics required

4. API AUTHENTICATION AND SSO
=============================
All API endpoints require JWT authentication.
Token expires after 12 hours.
Refresh tokens available for extended sessions.

For more information, visit: https://twin24.dev
Support: support@twin24.dev

Copyright (c) 2024 TWIN24 Digital Twin Platform
    `;

    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "implementation-guide.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Docs</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Implementation guide</h1>
            <p className="mt-3 text-sm text-slate-400">
              Reference integration readiness, telemetry schemas, and operational workflows.
            </p>
          </div>
          <button
            onClick={generatePDF}
            className="btn-primary whitespace-nowrap transition-all hover:scale-105"
          >
            📥 Download PDF
          </button>
        </div>
      </div>
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Documentation Sections</h2>
        <div className="grid gap-4">
          {[
            { title: "Telemetry schema overview", icon: "📊" },
            { title: "Digital twin lifecycle", icon: "🔄" },
            { title: "Anomaly response playbooks", icon: "📋" },
            { title: "API authentication and SSO", icon: "🔐" }
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-blue-500/30 hover:bg-blue-500/10 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-slate-300">{item.title}</span>
              </div>
              <button 
                onClick={generatePDF}
                className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
              >
                📄 View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Docs;
