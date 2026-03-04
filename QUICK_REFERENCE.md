# Digital Twin System - Quick Reference

## System Overview

**What**: A real-time laptop monitoring system that detects anomalies using AI (Isolation Forest) and personalizes health scoring based on device age and usage patterns.

**Why**: Traditional monitoring is rule-based and inflexible. Our system learns normal behavior patterns unsupervised, then adjusts expectations for each specific device.

**Key Insight**: ML model (trained on general data) is separate from device configuration (user-specific). This keeps the system clean, privacy-respecting, and easy to adapt.

---

## Core Architecture

```
User Device Info          Isolation Forest Model
(Age, Usage)              (Anomaly Detection)
        ↓                          ↓
        └─────→ Health Scoring Logic ←─────┘
                       ↓
                Health Score (0-100)
                   + Risk Level
                   + Factors
```

**3 Layers**:
1. **ML** (Isolation Forest): Unsupervised anomaly detection on system metrics
2. **Config** (AppContext): User device details (model, age, usage hours, RAM, storage)
3. **Scoring** (Health Scoring): Combines #1 and #2 into personalized health score

---

## Health Score Formula

```
Health Score = (Anomaly Score) × (Age Factor) × (Usage Factor)

Age Factor: 0.85-1.0 (newer = higher, max 15% degradation allowed)
Usage Factor: 0.8-1.0 (light = higher, heavy use = 20% reduction)

Example:
  Anomaly: 75
  2-year-old device: Age Factor = 0.94
  8 hours/day: Usage Factor = 0.93
  Result: 75 × 0.94 × 0.93 = 65 (Medium Risk)
```

---

## 6 Modules

| Module | URL | Purpose |
|--------|-----|---------|
| **Home** | `/home` | Overview, health score, explanation |
| **System Monitor** | `/system-monitor` | Real-time metrics + charts |
| **Anomaly Analysis** | `/anomaly-analysis` | Isolation Forest results, factors |
| **Alerts** | `/alerts` | Actionable alerts + recommendations |
| **Model & Data** | `/model-data` | AI transparency, dataset info |
| **Device Profile** | `/device-profile` | Editable device configuration |

---

## Data Flow

```
1. Login (AuthModal)
2. Onboarding (2-step form)
   - Device model
   - RAM, storage, usage hours, purchase date
3. Start Monitoring (AppContext → telemetry stream)
4. Every 2 seconds:
   - Sample from mock Kaggle data
   - Pass to (future) Isolation Forest model
   - Adjust score by device factors
   - Update health badge, charts, alerts
5. Navigate modules to explore insights
6. Edit Device Profile → health score recalculates
7. Logout → clear all state
```

---

## File Structure

### Core Frontend Files
```
frontend/src/
├── context/AppContext.jsx          # State: auth, config, health, telemetry
├── utils/healthScoring.js          # Functions: calculate score, risk level, recommendation
├── components/OnboardingModal.jsx  # 2-step device registration form
├── pages/
│   ├── Home.jsx                    # Overview + scoring explanation
│   ├── SystemMonitor.jsx           # Real-time metrics
│   ├── AnomalyAnalysis.jsx         # Isolation Forest explanation
│   ├── AlertsRecommendations.jsx   # Sample alerts
│   ├── ModelData.jsx               # Dataset + model info
│   └── DeviceProfile.jsx           # Editable device config
└── data/kaggleSample.js            # 15-sample mock telemetry
```

---

## Key Code Patterns

### Use AppContext
```javascript
const { health, deviceConfig, metrics, completeOnboarding } = useApp();
```

### Calculate Health Score
```javascript
import { calculateHealthScore } from "../utils/healthScoring.js";

const newHealth = calculateHealthScore({
  anomalyScore: 75,
  purchaseDate: "2024-06-15",
  dailyUsageHours: 8,
  isAnomalous: false
});
// Returns: { score: 65, riskLevel: "Medium", factors: {...} }
```

### Update Device Config
```javascript
updateDeviceConfig({
  model: "HP Spectre",
  ramGB: 16,
  storageGB: 512,
  dailyUsageHours: 8,
  purchaseDate: "2024-06-15"
});
```

---

## About the ML Model

**Algorithm**: Isolation Forest
- Unsupervised (no labels needed)
- Good for high-dimensional anomaly detection
- Fast inference time
- Robust to noisy data

**Training**:
- Dataset: Kaggle system performance (~500 samples)
- Features: 11 numeric metrics (CPU, RAM, disk, network, battery, uptime, etc.)
- Preprocessing: StandardScaler normalization
- Parameters: 100 estimators, 10% contamination
- Storage: `backend/ai/model/isolation_forest.pkl` (joblib)

**Why Offline Training**?
- Model learned once from representative data
- No need for continuous retraining
- Privacy: User data not used for training
- Efficiency: Fast inference at edge

---

## Onboarding Flow (Detailed)

### Step 1: Device Model
- User enters laptop model name
- E.g., "HP Spectre x360", "MacBook Pro 16"
- Stored in AppContext.deviceConfig.model
- Used for display only, not in ML training

### Step 2: Hardware & Usage
- **RAM (GB)**: 1-256, stored as integer
- **Storage (GB)**: 1-2000, stored as integer  
- **Daily Usage (hours)**: 0-24, affects usage factor
- **Purchase Date**: YYYY-MM-DD, affects age factor

**OnSubmit**:
```javascript
completeOnboarding({
  model: "HP Spectre x360",
  ramGB: 16,
  storageGB: 512,
  dailyUsageHours: 8,
  purchaseDate: "2024-06-15"
});
// Stores in deviceConfig
// Starts monitoring
// Redirects to /home
```

---

## State Management (AppContext)

### Authentication
```javascript
isAuthenticated: false        // Set by login()
isLoginOpen: false            // Toggle auth modal
```

### Device
```javascript
deviceConfig: {
  model: "HP Spectre x360",
  ramGB: 16,
  storageGB: 512,
  dailyUsageHours: 8,
  purchaseDate: "2024-06-15"  // or null
}
deviceModel: string           // Shorthand from onboarding
```

### Monitoring
```javascript
monitoringActive: boolean     // true = telemetry streaming
hasOnboarded: boolean         // true = device configured
```

### Real-Time Data
```javascript
metrics: [                     // Current metric values
  { title: "CPU Usage", value: 45.2, unit: "%" },
  // ...
]

series: {                      // Time-series for charts
  cpu: [{ time: 1, value: 45.2 }, ...],
  memory: [...],
  network: [...]
}

health: {                      // Calculated per 2-second update
  score: 72,                   // 0-100
  riskLevel: "Low",            // Low|Medium|High
  anomalyDetected: false,      // boolean
  factors: {
    baseAnomalyScore: 75,      // From Isolation Forest
    ageFactor: 0.95,           // Device age
    usageFactor: 0.93          // Daily usage
  }
}
```

### UI
```javascript
isSidebarCollapsed: boolean
user: { name: "Mira Patel", role: "Ops Lead" }
```

---

## Health Score Ranges

```
80-100: Low Risk (Green)
  - System healthy
  - No immediate action needed
  - Routine monitoring sufficient

50-79: Medium Risk (Yellow)
  - Minor issues detected
  - Running processes should be reviewed
  - Disk space or updates recommended

0-49: High Risk (Red)
  - System showing significant stress
  - Immediate diagnostics recommended
  - Cleanup and updates highly advised
```

---

## Testing Quick Checks

✅ **Frontend loads**: `npm run dev` in frontend/
✅ **Backend runs**: `npm run dev` in backend/
✅ **AuthModal appears**: Unauthenticated → login button works
✅ **OnboardingModal appears**: After login → 2-step form
✅ **Health score displayed**: Home page shows numeric score + badge
✅ **Metrics update**: System Monitor shows new values every 2 sec
✅ **Device Profile editable**: Edit button works, Save persists state
✅ **Factor recalculation**: Change usage hours → health score updates
✅ **All 6 modules load**: No 404 errors when clicking sidebar items
✅ **Logout works**: Clears auth + device config

---

## Architectural Decisions

### Why Separate ML from Device Config?
- **ML is general**: Works on any system once trained
- **Config is personal**: Unique to each user's device
- **Flexibility**: Can update config without retraining model
- **Privacy**: Device details never mixed with training data
- **Scalability**: Same model works for millions of devices

### Why Isolation Forest?
- **Unsupervised**: No labels needed
- **Robust**: Works well with noisy real-world data
- **Efficient**: Fast inference and training
- **Interpretable**: Can show anomaly score to users
- **Practical**: Already used in production ML systems

### Why Health Score Factors?
- **Age Factor**: Older devices naturally degrade
- **Usage Factor**: Heavy usage correlates with higher stress
- **Not Retraining**: Avoids expensive model updates
- **Transparent**: Users understand adjustments
- **Flexible**: Easy to tune weights

---

## Next Steps for Integration

1. **Backend ML Service**: Load joblib model in aiService.js
2. **Inference API**: Implement `/api/metrics/analyze`
3. **Database**: Persist device configs in MongoDB
4. **WebSocket**: Stream real health scores instead of mock data
5. **Advanced Features**: Alert rules, maintenance recommendations, trend analysis

---

## Academic Presentation Outline

**Title**: "Digital Twin: AI-Powered Laptop Monitoring with Personalized Health Scoring"

**Problem** (2 min)
- Laptops generate continuous performance data
- Traditional monitoring is inflexible and rule-based
- "Normal" varies by device age and usage pattern

**Solution** (3 min)
- Isolation Forest model learns normal behavior (unsupervised)
- Device config factors personalize health scoring
- Clean separation: ML layer + context layer + scoring layer

**Implementation** (4 min)
- React frontend with 6-module interface
- Mock telemetry from Kaggle dataset (2-sec updates)
- Real-time charts, health badges, transparent scoring
- Backend infrastructure ready for model integration

**Results** (2 min)
- Users see personalized health scores with explanations
- Age and usage adjustments make insights actionable
- System is privacy-respecting (no personal data in training)

**Academic Rigor** (2 min)
- Unsupervised ML prevents label bias
- Separation of concerns improves maintainability
- Transparent algorithm builds user trust
- Scalable to multiple devices/users

**Demo** (3 min)
- Login flow
- Onboarding with device config
- Real-time metric updates
- Health score with factor breakdown

---

## Quick Commands

```bash
# Start frontend
cd frontend && npm run dev
# → http://localhost:5173

# Start backend  
cd backend && npm run dev
# → http://localhost:4000

# Kill all Node processes (if needed)
pkill node

# Check frontend errors
npm run lint:fix

# Check backend logs
npm run dev  # Watch mode shows all output
```

---

## Key Constants

```javascript
// Health score bounds
MIN_HEALTH_SCORE = 30      // System still operational
MAX_HEALTH_SCORE = 95      // Account for uncertainty

// Age degradation
DEGRADATION_PER_YEAR = 0.03  // 3% per year
MAX_DEGRADATION = 0.15       // 15% floor (5-year device)

// Usage factor
HEAVY_USAGE_REDUCTION = 0.2  // 20% reduction for 24hr/day usage

// Telemetry frequency
TELEMETRY_INTERVAL = 2000    // 2 seconds (milliseconds)

// Chart window
MAX_CHART_POINTS = 12        // Rolling 12-point history
```

---

## File Reference

| File | Purpose | Status |
|------|---------|--------|
| `DIGITAL_TWIN_ARCHITECTURE.md` | Complete system design | ✅ Done |
| `TESTING_GUIDE.md` | Test scenarios + verification | ✅ Done |
| `frontend/src/utils/healthScoring.js` | Score calculation logic | ✅ Done |
| `frontend/src/context/AppContext.jsx` | Global state | ✅ Done |
| `frontend/src/components/OnboardingModal.jsx` | Device registration | ✅ Done |
| `frontend/src/pages/DeviceProfile.jsx` | Config management | ✅ Done |
| `frontend/src/pages/Home.jsx` | Overview page | ✅ Done |
| `backend/ai/model/isolation_forest.pkl` | Trained model | ✅ Ready |
| `backend/ai/train/train_isolation_forest.py` | Training script | ✅ Done |
| `backend/src/services/aiService.js` | Model loading | ⏳ Ready for impl |
| `backend/src/routes/metricRoutes.js` | Inference API | ⏳ Ready for impl |

---

**System Status**: 🟢 Production-Ready for Demo & Academic Presentation
