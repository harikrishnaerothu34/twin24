import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { kaggleSample } from "../data/kaggleSample.js";
import { calculateHealthScore, getHealthRecommendation } from "../utils/healthScoring.js";
import { API_ENDPOINTS, apiFetch } from "../config/api.js";

const AppContext = createContext(null);

const initialUser = {
  name: "Mira Patel",
  role: "Ops Lead"
};

const buildSeries = (samples, key) =>
  samples.map((sample) => ({ time: sample.time, value: sample[key] }));

const buildMetrics = (sample) => [
  { title: "CPU Usage", value: sample.cpu, unit: "%", change: "Streaming" },
  { title: "RAM Usage", value: sample.memory, unit: "%", change: "Streaming" },
  { title: "Disk Usage", value: sample.disk, unit: "%", change: "Streaming" },
  { title: "Network Usage", value: sample.network, unit: "%", change: "Streaming" },
  { title: "Battery", value: sample.battery, unit: "%", change: "Backup ready" },
  { title: "Uptime", value: sample.uptime, unit: "%", change: "Rolling window" }
];

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [deviceModel, setDeviceModel] = useState("");
  const [user, setUser] = useState(initialUser);

  // Device configuration (from onboarding)
  const [deviceConfig, setDeviceConfig] = useState({
    model: "",
    ramGB: 0,
    storageGB: 0,
    dailyUsageHours: 0,
    purchaseDate: null
  });

  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [series, setSeries] = useState(() => {
    const seed = kaggleSample.slice(0, 8);
    return {
      cpu: buildSeries(seed, "cpu"),
      memory: buildSeries(seed, "memory"),
      network: buildSeries(seed, "network")
    };
  });
  const [metrics, setMetrics] = useState(buildMetrics(kaggleSample[0]));
  const [health, setHealth] = useState(() => {
    const sample = kaggleSample[0];
    return calculateHealthScore({
      anomalyScore: sample.healthScore,
      purchaseDate: null,
      dailyUsageHours: 0,
      isAnomalous: sample.anomaly
    });
  });

  useEffect(() => {
    if (!monitoringActive) {
      return undefined;
    }

    const interval = setInterval(() => {
      setTelemetryIndex((prev) => {
        const next = (prev + 1) % kaggleSample.length;
        const sample = kaggleSample[next];

        setSeries((current) => {
          const updateSeries = (items, value) => {
            const nextItems = [...items, { time: sample.time, value }];
            return nextItems.length > 12 ? nextItems.slice(-12) : nextItems;
          };

          return {
            cpu: updateSeries(current.cpu, sample.cpu),
            memory: updateSeries(current.memory, sample.memory),
            network: updateSeries(current.network, sample.network)
          };
        });

        setMetrics(buildMetrics(sample));
        
        // Use health scoring logic with device configuration
        const newHealth = calculateHealthScore({
          anomalyScore: sample.healthScore,
          purchaseDate: deviceConfig.purchaseDate,
          dailyUsageHours: deviceConfig.dailyUsageHours,
          isAnomalous: sample.anomaly
        });
        setHealth(newHealth);

        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [monitoringActive]);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const register = async (name, email, password, confirmPassword) => {
    if (!name || !email || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }

    if (name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, confirmPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      setIsLoginOpen(false);
      console.log('✅ Registration successful:', data.user.email);
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      if (error instanceof TypeError) {
        throw new Error("Server offline. Please make sure backend is running on http://localhost:4000");
      }
      throw error;
    }
  };

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    try {
      console.log('📤 Sending login request to backend:', { email, url: API_ENDPOINTS.LOGIN });
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      console.log('📥 Received response from backend:', { status: response.status, ok: response.ok });
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Login failed:', data.message);
        throw new Error(data.message || "Login failed");
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      setUser(data.user);
      setIsAuthenticated(true);
      setIsLoginOpen(false);
      console.log('✅ Login successful:', data.user.email);
    } catch (error) {
      console.error('❌ Login error:', error.message);
      if (error instanceof TypeError) {
        throw new Error("Server offline. Please make sure backend is running on http://localhost:4000");
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(initialUser);
    setHasOnboarded(false);
    setMonitoringActive(false);
    setDeviceModel("");
    setDeviceConfig({
      model: "",
      ramGB: 0,
      storageGB: 0,
      dailyUsageHours: 0,
      purchaseDate: null
    });
    setTelemetryIndex(0);
    setSeries({
      cpu: buildSeries(kaggleSample.slice(0, 8), "cpu"),
      memory: buildSeries(kaggleSample.slice(0, 8), "memory"),
      network: buildSeries(kaggleSample.slice(0, 8), "network")
    });
    setMetrics(buildMetrics(kaggleSample[0]));
    setHealth(
      calculateHealthScore({
        anomalyScore: kaggleSample[0].healthScore,
        purchaseDate: null,
        dailyUsageHours: 0,
        isAnomalous: kaggleSample[0].anomaly
      })
    );
  };

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const completeOnboarding = (config) => {
    // config = { model, ramGB, storageGB, dailyUsageHours, purchaseDate }
    setDeviceConfig(config);
    setDeviceModel(config.model);
    setHasOnboarded(true);
    setMonitoringActive(true);
    
    // Recalculate health with new device configuration
    const sample = kaggleSample[0];
    const newHealth = calculateHealthScore({
      anomalyScore: sample.healthScore,
      purchaseDate: config.purchaseDate,
      dailyUsageHours: config.dailyUsageHours,
      isAnomalous: sample.anomaly
    });
    setHealth(newHealth);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoginOpen,
      isSidebarCollapsed,
      hasOnboarded,
      monitoringActive,
      deviceModel,
      deviceConfig,
      user,
      metrics,
      series,
      health,
      openLogin,
      closeLogin,
      login,
      register,
      logout,
      completeOnboarding,
      updateDeviceConfig: (newConfig) => {
        setDeviceConfig((prev) => ({ ...prev, ...newConfig }));
      },
      toggleSidebar: () => setIsSidebarCollapsed((prev) => !prev)
    }),
    [
      isAuthenticated,
      isLoginOpen,
      isSidebarCollapsed,
      hasOnboarded,
      monitoringActive,
      deviceModel,
      deviceConfig,
      user,
      metrics,
      series,
      health
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
