export const metrics = [
  { title: "CPU Usage", value: 62, unit: "%", change: "Stable across clusters" },
  { title: "RAM Usage", value: 71, unit: "%", change: "Peak window in 2h" },
  { title: "Disk Usage", value: 53, unit: "%", change: "Capacity healthy" },
  { title: "Network Usage", value: 38, unit: "%", change: "Traffic normalized" },
  { title: "Battery", value: 89, unit: "%", change: "Backup readiness" },
  { title: "Uptime", value: 99.97, unit: "%", change: "Rolling 30-day" }
];

export const cpuTrend = [
  { time: "09:00", value: 42 },
  { time: "09:10", value: 46 },
  { time: "09:20", value: 51 },
  { time: "09:30", value: 58 },
  { time: "09:40", value: 55 },
  { time: "09:50", value: 61 },
  { time: "10:00", value: 64 }
];

export const memoryTrend = [
  { time: "09:00", value: 58 },
  { time: "09:10", value: 63 },
  { time: "09:20", value: 60 },
  { time: "09:30", value: 67 },
  { time: "09:40", value: 72 },
  { time: "09:50", value: 70 },
  { time: "10:00", value: 74 }
];

export const devices = [
  {
    id: "DT-84A",
    name: "Thermal Node West",
    location: "Frankfurt Plant",
    status: "Healthy",
    uptime: "76 days",
    load: "62%"
  },
  {
    id: "DT-12C",
    name: "Edge Gateway 3",
    location: "Rotterdam Hub",
    status: "Warning",
    uptime: "14 days",
    load: "81%"
  },
  {
    id: "DT-77B",
    name: "Predictive Array 5",
    location: "Oslo Facility",
    status: "Healthy",
    uptime: "121 days",
    load: "54%"
  },
  {
    id: "DT-09F",
    name: "Cooling Grid 2",
    location: "Munich Center",
    status: "Attention",
    uptime: "9 days",
    load: "88%"
  }
];

export const alerts = [
  {
    id: "AL-431",
    title: "Vibration spike detected",
    source: "Predictive Array 5",
    severity: "Medium",
    time: "8 min ago"
  },
  {
    id: "AL-428",
    title: "Cooling delta outside threshold",
    source: "Cooling Grid 2",
    severity: "High",
    time: "22 min ago"
  },
  {
    id: "AL-420",
    title: "Gateway latency elevated",
    source: "Edge Gateway 3",
    severity: "Low",
    time: "1 hour ago"
  }
];
