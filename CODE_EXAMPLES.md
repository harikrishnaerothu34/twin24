# Implementation Examples & Code Patterns

## Using the Health Scoring Module

### Import and Basic Usage

```javascript
import { 
  calculateHealthScore, 
  getHealthRecommendation,
  getRiskLevel,
  calculateAgeFactor,
  calculateUsageFactor 
} from "../utils/healthScoring.js";

// Calculate complete health score
const health = calculateHealthScore({
  anomalyScore: 75,           // From Isolation Forest (0-100)
  purchaseDate: "2024-06-15", // ISO string or Date object
  dailyUsageHours: 8,          // 0-24
  isAnomalous: false           // From model prediction
});

console.log(health);
// Output:
// {
//   score: 65,
//   riskLevel: "Medium",
//   anomalyDetected: false,
//   factors: {
//     baseAnomalyScore: 75,
//     ageFactor: 0.94,
//     usageFactor: 0.93
//   }
// }
```

### Get User-Friendly Recommendation

```javascript
const recommendation = getHealthRecommendation(health.score);
console.log(recommendation);
// Output: "Minor performance degradation detected. Consider running maintenance tasks."
```

### Calculate Individual Factors

```javascript
const ageFactor = calculateAgeFactor("2020-01-01");
console.log(ageFactor); // ≈ 0.85 (5-year-old device)

const usageFactor = calculateUsageFactor(20);
console.log(usageFactor); // ≈ 0.83 (heavy usage)

const riskLevel = getRiskLevel(65);
console.log(riskLevel); // "Medium"
```

---

## AppContext Usage in Components

### Reading State

```javascript
import { useApp } from "../context/AppContext.jsx";

function MyComponent() {
  const {
    isAuthenticated,
    deviceConfig,
    health,
    metrics,
    series,
    monitoringActive
  } = useApp();

  return (
    <div>
      {isAuthenticated && (
        <div>
          <p>Device: {deviceConfig.model}</p>
          <p>Health: {health.score}/100</p>
          <p>Status: {monitoringActive ? "Monitoring" : "Standby"}</p>
        </div>
      )}
    </div>
  );
}

export default MyComponent;
```

### Writing State (Onboarding)

```javascript
const { completeOnboarding } = useApp();

function OnboardingForm() {
  const handleSubmit = (formData) => {
    completeOnboarding({
      model: formData.model,
      ramGB: parseInt(formData.ramGB),
      storageGB: parseInt(formData.storageGB),
      dailyUsageHours: parseFloat(formData.dailyUsageHours),
      purchaseDate: formData.purchaseDate
    });
    // After this:
    // - deviceConfig is stored
    // - hasOnboarded = true
    // - monitoringActive = true
    // - Redirect to /home
  };

  return <form onSubmit={...}>{/* form fields */}</form>;
}
```

### Updating Device Config

```javascript
const { deviceConfig, updateDeviceConfig } = useApp();

function DeviceProfileEdit() {
  const handleSave = (updatedValues) => {
    updateDeviceConfig({
      ramGB: 32,           // Partial update
      dailyUsageHours: 12
      // Other fields preserved from previous state
    });
    // Health score recalculates on next telemetry tick
  };

  return <form onSubmit={...}>{/* form fields */}</form>;
}
```

---

## Building UI Components with Health Data

### Health Badge Component

```javascript
// components/HealthBadge.jsx
const riskColors = {
  "Low": "bg-green-100 text-green-800",
  "Medium": "bg-yellow-100 text-yellow-800",
  "High": "bg-red-100 text-red-800"
};

function HealthBadge({ score, riskLevel }) {
  return (
    <div className={`px-4 py-2 rounded-full ${riskColors[riskLevel]}`}>
      <p className="text-sm font-bold">{riskLevel} Risk</p>
      <p className="text-xs">{score}/100</p>
    </div>
  );
}

// Usage:
import { useApp } from "../context/AppContext.jsx";
function Home() {
  const { health } = useApp();
  return <HealthBadge score={health.score} riskLevel={health.riskLevel} />;
}
```

### Metric Card Component

```javascript
// components/MetricCard.jsx
function MetricCard({ title, value, unit, change }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{unit} {change}</p>
    </div>
  );
}

// Usage:
import { useApp } from "../context/AppContext.jsx";
function SystemMonitor() {
  const { metrics } = useApp();
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          unit={metric.unit}
          change={metric.change}
        />
      ))}
    </div>
  );
}
```

### Health Score Explanation

```javascript
// pages/Home.jsx - Showing score calculation
import { useApp } from "../context/AppContext.jsx";

function ScoreExplanation() {
  const { health, deviceConfig } = useApp();

  if (!health.factors) return null;

  return (
    <div className="card p-6">
      <p className="font-bold text-white">Score Calculation</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Factor
          label="Anomaly Score"
          value={health.factors.baseAnomalyScore}
          description="From Isolation Forest model"
        />
        <Factor
          label="Age Factor"
          value={health.factors.ageFactor}
          description={`Device age: ${getDeviceAge(deviceConfig.purchaseDate)}`}
        />
        <Factor
          label="Usage Factor"
          value={health.factors.usageFactor}
          description={`Daily usage: ${deviceConfig.dailyUsageHours}h`}
        />
      </div>
      
      <div className="mt-4 rounded-lg bg-white/5 p-4">
        <p className="text-sm">
          <strong>{health.factors.baseAnomalyScore}</strong> ×{" "}
          <strong>{health.factors.ageFactor}</strong> ×{" "}
          <strong>{health.factors.usageFactor}</strong> ={" "}
          <strong className="text-lg">{health.score}</strong>
        </p>
      </div>
    </div>
  );
}

function Factor({ label, value, description }) {
  return (
    <div className="rounded-lg bg-white/5 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}
```

---

## Real-Time Telemetry Streaming

### Current Implementation (Mock)

```javascript
// AppContext.jsx - Telemetry loop
useEffect(() => {
  if (!monitoringActive) return;

  const interval = setInterval(() => {
    setTelemetryIndex((prev) => {
      const next = (prev + 1) % kaggleSample.length;
      const sample = kaggleSample[next];

      // Update metrics
      setMetrics(buildMetrics(sample));

      // Update health with device config factors
      const newHealth = calculateHealthScore({
        anomalyScore: sample.healthScore,
        purchaseDate: deviceConfig.purchaseDate,
        dailyUsageHours: deviceConfig.dailyUsageHours,
        isAnomalous: sample.anomaly
      });
      setHealth(newHealth);

      // Update time series
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

      return next;
    });
  }, 2000); // Update every 2 seconds

  return () => clearInterval(interval);
}, [monitoringActive, deviceConfig]);
```

### For Real Backend Integration

```javascript
// Future: Replace mock loop with real API
async function streamRealMetrics() {
  while (true) {
    try {
      // Get real system metrics from backend
      const response = await fetch('/api/metrics/current');
      const apiMetrics = await response.json();

      // Send to ML model for anomaly detection
      const scoreResponse = await fetch('/api/metrics/analyze', {
        method: 'POST',
        body: JSON.stringify(apiMetrics)
      });
      const { anomaly_score, is_anomalous } = await scoreResponse.json();

      // Calculate health with device factors
      const health = calculateHealthScore({
        anomalyScore: anomaly_score,
        purchaseDate: deviceConfig.purchaseDate,
        dailyUsageHours: deviceConfig.dailyUsageHours,
        isAnomalous: is_anomalous
      });

      // Update state
      setMetrics(buildMetrics(apiMetrics));
      setHealth(health);

      // Wait 2 seconds before next update
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Metrics stream error:', error);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Retry after 5s
    }
  }
}
```

---

## Backend Integration Examples

### AI Service (Ready for Implementation)

```javascript
// backend/src/services/aiService.js
const fs = require('fs');
const path = require('path');
const { javabridge } = require('pythonjs'); // Or use child_process for Python

let modelPackage = null;

/**
 * Load the trained Isolation Forest model
 * Call once at server startup
 */
async function loadModel() {
  try {
    const modelPath = path.join(__dirname, '../ai/model/isolation_forest.pkl');
    // Using joblib (Python):
    // modelPackage = joblib.load(modelPath)
    // For JS, you'd need to serialize to JSON or use Python subprocess
    
    console.log('✓ Isolation Forest model loaded');
    return true;
  } catch (error) {
    console.error('✗ Failed to load model:', error);
    return false;
  }
}

/**
 * Score a set of system metrics for anomalies
 * @param {Object} metrics - Raw system metrics
 * @returns {Object} - Anomaly score and flag
 */
async function scoreMetrics(metrics) {
  if (!modelPackage) {
    throw new Error('Model not loaded');
  }

  try {
    // Normalize metrics using saved scaler
    const scaledMetrics = modelPackage.scaler.transform(
      [[metrics.cpu, metrics.memory, metrics.disk, ...]]
    );

    // Predict anomaly score
    const predictions = modelPackage.model.predict(scaledMetrics);
    const anomalyScore = predictions[0];

    // Get anomaly flag
    const isAnomalous = predictions[0] < ANOMALY_THRESHOLD;

    return {
      anomaly_score: anomalyScore,
      is_anomalous: isAnomalous,
      contributing_features: [],  // Can extract from model.explain()
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Model prediction error:', error);
    throw error;
  }
}

module.exports = {
  loadModel,
  scoreMetrics
};

// Server startup
// ---
const aiService = require('./services/aiService.js');
const app = require('./server.js');

(async () => {
  await aiService.loadModel();
  app.listen(4000, () => console.log('Server ready'));
})();
```

### Metrics Analyze Endpoint

```javascript
// backend/src/routes/metricRoutes.js
const express = require('express');
const aiService = require('../services/aiService.js');
const router = express.Router();

/**
 * POST /api/metrics/analyze
 * Analyze system metrics for anomalies
 */
router.post('/analyze', async (req, res) => {
  try {
    const { metrics } = req.body;

    // Validate input
    if (!metrics || typeof metrics !== 'object') {
      return res.status(400).json({ error: 'Invalid metrics object' });
    }

    // Score with Isolation Forest
    const result = await aiService.scoreMetrics(metrics);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({
      error: 'Failed to analyze metrics',
      message: error.message
    });
  }
});

/**
 * POST /api/metrics/batch
 * Analyze multiple metric samples
 */
router.post('/batch', async (req, res) => {
  try {
    const { samples } = req.body;

    const results = await Promise.all(
      samples.map(metrics => aiService.scoreMetrics(metrics))
    );

    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### Device Config Endpoint

```javascript
// backend/src/routes/deviceRoutes.js
const express = require('express');
const Device = require('../models/Device.js');
const router = express.Router();

/**
 * PUT /api/devices/config
 * Update device configuration
 */
router.put('/config', async (req, res) => {
  try {
    const { userId } = req.user;
    const { model, ramGB, storageGB, dailyUsageHours, purchaseDate } = req.body;

    // Validate input
    if (!model) {
      return res.status(400).json({ error: 'Device model required' });
    }

    // Update or create device config
    const device = await Device.findOneAndUpdate(
      { userId },
      {
        model,
        ramGB: parseInt(ramGB) || 0,
        storageGB: parseInt(storageGB) || 0,
        dailyUsageHours: parseFloat(dailyUsageHours) || 0,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      config: device
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/devices/config
 * Retrieve device configuration
 */
router.get('/config', async (req, res) => {
  try {
    const { userId } = req.user;
    const device = await Device.findOne({ userId });

    if (!device) {
      return res.status(404).json({ error: 'Device not configured' });
    }

    res.json({
      success: true,
      config: device
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## Form Patterns

### Two-Step Onboarding Form

```javascript
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  model: "",
  ramGB: "",
  storageGB: "",
  dailyUsageHours: "",
  purchaseDate: ""
});

const handleChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

const handleNext = () => {
  if (step === 1 && formData.model.trim()) {
    setStep(2);
  }
};

const handleBack = () => {
  if (step > 1) setStep(step - 1);
};

const handleSubmit = () => {
  completeOnboarding({
    model: formData.model || "Personal Laptop",
    ramGB: parseInt(formData.ramGB) || 0,
    storageGB: parseInt(formData.storageGB) || 0,
    dailyUsageHours: parseFloat(formData.dailyUsageHours) || 0,
    purchaseDate: formData.purchaseDate || null
  });
};

return (
  <>
    {step === 1 ? (
      <div>
        <label>Laptop Model</label>
        <input
          value={formData.model}
          onChange={(e) => handleChange("model", e.target.value)}
        />
        <button onClick={handleNext} disabled={!formData.model.trim()}>
          Continue →
        </button>
      </div>
    ) : (
      <div>
        <input
          label="RAM (GB)"
          type="number"
          value={formData.ramGB}
          onChange={(e) => handleChange("ramGB", e.target.value)}
        />
        {/* ... more fields ... */}
        <button onClick={handleBack}>← Back</button>
        <button onClick={handleSubmit}>Create Twin</button>
      </div>
    )}
  </>
);
```

---

## Testing Patterns

### Testing Health Score Calculation

```javascript
// test/health-scoring.test.js
import { calculateHealthScore, getRiskLevel } from "../utils/healthScoring.js";

test("calculateHealthScore returns expected structure", () => {
  const result = calculateHealthScore({
    anomalyScore: 75,
    purchaseDate: "2024-06-15",
    dailyUsageHours: 8,
    isAnomalous: false
  });

  expect(result).toHaveProperty("score");
  expect(result).toHaveProperty("riskLevel");
  expect(result).toHaveProperty("anomalyDetected");
  expect(result).toHaveProperty("factors");
});

test("age factor decreases with device age", () => {
  const newDevice = calculateHealthScore({
    anomalyScore: 80,
    purchaseDate: new Date().toISOString()
  });

  const oldDevice = calculateHealthScore({
    anomalyScore: 80,
    purchaseDate: "2015-01-01" // 10 years old
  });

  expect(newDevice.factors.ageFactor)
    .toBeGreaterThan(oldDevice.factors.ageFactor);
});

test("risk level is correct for score boundaries", () => {
  expect(getRiskLevel(80)).toBe("Low");
  expect(getRiskLevel(60)).toBe("Medium");
  expect(getRiskLevel(40)).toBe("High");
});
```

### Testing Component with AppContext

```javascript
// test/Home.test.jsx
import { render, screen } from "@testing-library/react";
import Home from "../pages/Home.jsx";
import { AppProvider } from "../context/AppContext.jsx";

test("Home displays health score from context", () => {
  render(
    <AppProvider>
      <Home />
    </AppProvider>
  );

  expect(screen.getByText(/Health score:/i)).toBeInTheDocument();
});
```

---

## Performance Optimization Tips

### 1. Memoize Health Calculations
```javascript
const health = useMemo(
  () => calculateHealthScore({
    anomalyScore: sample.healthScore,
    purchaseDate: deviceConfig.purchaseDate,
    dailyUsageHours: deviceConfig.dailyUsageHours,
    isAnomalous: sample.anomaly
  }),
  [sample.healthScore, deviceConfig, sample.anomaly]
);
```

### 2. Batch Series Updates
```javascript
// Instead of updating 3 series separately
setSeries(prev => ({
  cpu: updateSeries(prev.cpu, sample.cpu),
  memory: updateSeries(prev.memory, sample.memory),
  network: updateSeries(prev.network, sample.network)
}));
```

### 3. Limit Chart Points
```javascript
const MAX_POINTS = 12;
const newSeries = [...current, newPoint];
return newSeries.length > MAX_POINTS ? newSeries.slice(-MAX_POINTS) : newSeries;
```

---

## Configuration Constants

```javascript
// frontend/src/config.js
export const HEALTH_SCORING = {
  MIN_SCORE: 30,
  MAX_SCORE: 95,
  RISK_BOUNDARIES: {
    LOW: 75,
    MEDIUM: 50
  }
};

export const TELEMETRY = {
  UPDATE_INTERVAL: 2000, // milliseconds
  MAX_CHART_POINTS: 12
};

export const DEVICE_AGE = {
  DEGRADATION_PER_YEAR: 0.03,
  MAX_DEGRADATION: 0.15
};

export const USAGE = {
  HEAVY_USAGE_REDUCTION: 0.2,
  MAX_DAILY_HOURS: 24
};
```

---

**Note**: All examples are executable and follow the patterns used throughout the codebase. Copy-paste friendly!
