# Digital Twin System - Testing & Verification Guide

## Quick Start

### 1. Start Both Servers
```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# → Available at http://localhost:5173

# Terminal 2: Backend  
cd backend
npm run dev
# → Running on port 4000
```

### 2. Test User Flow

#### Landing Page
- Navigate to `http://localhost:5173`
- Should see professional SaaS landing page with laptop-focused messaging
- Features section mentions "Monitor → Analyze → Alert" workflow

#### Login
- Click "Start Your Twin" or login button
- AuthModal opens (overlay login form)
- Click login (mock authentication)

#### Onboarding
- OnboardingModal appears (2-step form)

**Step 1**: Device Model
```
Input: HP Spectre x360
Click: Continue →
```

**Step 2**: Hardware & Usage Details
```
RAM (GB): 16
Storage (GB): 512
Avg Daily Usage (hours): 8
Purchase Date: 2024-06-15
Click: Create Digital Twin
```

#### Home Page
- Redirects to `/home` after onboarding
- Displays:
  - Current Status: "Monitoring Active"
  - System Health: Badge showing "Low Risk" (green)
  - Health Score: e.g., "72/100"
  - Device config displayed: "HP Spectre x360", "16GB RAM, 512GB Storage", "~8 hours/day"
  - Health scoring explanation with 3 detailed steps
  - Current factors breakdown (anomaly score, age factor, usage factor)

---

## Module Navigation Tests

### System Monitor (`/system-monitor`)
**Expected**:
- 6 metric cards (CPU, RAM, disk, network, battery, uptime)
- 3 time-series charts (CPU, memory, network)
- Charts update every 2 seconds with new data points
- Max 12 points visible (rolling window)

**Verify**:
- Click "System Monitor" in sidebar
- Watch metrics update in real-time
- Charts show smooth 12-point rolling history

---

### Anomaly Analysis (`/anomaly-analysis`)
**Expected**:
- Current health score and risk level
- Detailed explanation of Isolation Forest
- Factor breakdown (anomaly score, age factor, usage factor)
- What anomalies mean and how detection works

**Verify**:
- Click "Anomaly Analysis" in sidebar
- Factors match those shown on Home page
- Explanation is clear and academic

---

### Alerts & Recommendations (`/alerts`)
**Expected**:
- Sample alerts with severity levels (Low, Medium, High)
- Color-coded badges (green, yellow, red)
- Actionable recommendations for each alert
- Alert types: Performance, Security, Maintenance

**Verify**:
- Click "Alerts & Recommendations"
- Alerts are visible with clear severity levels
- Recommendations are actionable text

---

### Model & Data (`/model-data`)
**Expected**:
- Model training date and parameters
- Dataset information (sample count, features)
- List of 11 monitored metrics
- Explanation of why offline training
- Hyperparameter details

**Verify**:
- Click "Model & Data"
- All model info is displayed
- Dataset features list is complete
- No hardcoded device details

---

### Device Profile (`/device-profile`)
**Expected**:
- Display mode shows device config (model, RAM, storage, usage, purchase date)
- "Edit Profile" button
- Clicking Edit opens form with all fields
- Save persists changes
- Changes affect health score calculation immediately

**Verify**:
1. Click "Device Profile" in sidebar
2. Verify device info shows (HP Spectre, etc.)
3. Click "Edit Profile"
4. Change daily usage to 12 hours
5. Click "Save Changes" → "Device profile updated successfully"
6. Go back to Home page
7. Verify factors have recalculated (usage factor should change)

---

## Health Scoring Verification

### Initial State (After Onboarding)
```
Purchase Date: 2024-06-15
Daily Usage: 8 hours
Device Age: ~20 months

Expected Factors:
- Age Factor: ≈ 0.95 (minimal degradation)
- Usage Factor: ≈ 0.93 (light usage)
```

### Test Case: Older Device, Heavy Usage
1. Go to Device Profile
2. Change:
   - Purchase Date: 2020-01-01 (5+ years old)
   - Daily Usage: 20 hours
3. Save and return to Home
4. Verify:
   - Age Factor: ≈ 0.85 (5 years old → 15% floor)
   - Usage Factor: ≈ 0.83 (20 hours → 17% reduction)
   - Health Score should be lower than initial

---

## Real-Time Telemetry

### Mock Data Streaming
- Located in `frontend/src/data/kaggleSample.js`
- 15 sample records with CPU, memory, disk, network, battery, uptime metrics
- System cycles through samples every 2 seconds
- Each sample has:
  - healthScore: 72-88 (mock anomaly score)
  - riskLevel: Low/Medium/High
  - anomaly: boolean flag

### Verify Streaming
1. Go to System Monitor page
2. Watch metric cards update every 2 seconds
3. Charts should show new points appearing and sliding left
4. Health score on Home/Anomaly Analysis updates with cycle

---

## Backend Integration (Ready for Next Phase)

### AI Service
**File**: `backend/src/services/aiService.js`
**Status**: Infrastructure ready

```javascript
// When implemented:
async function scoreMetrics(metricsObject) {
  // 1. Load isolation_forest.pkl
  // 2. Scale metrics with loaded scaler
  // 3. Predict anomaly score with model
  // 4. Return { anomaly_score, is_anomalous }
}
```

### Metrics Route
**File**: `backend/src/routes/metricRoutes.js`
**Status**: Ready for POST /api/metrics/analyze implementation

### Device Route
**File**: `backend/src/routes/deviceRoutes.js`
**Status**: Ready for device config persistence

### Next Steps for Backend
1. Implement aiService.js to load and use joblib model
2. Create /api/metrics/analyze endpoint
3. Add MongoDB persistence for device configs
4. Enable WebSocket for real-time updates

---

## Navigation & Routing

### Route Map
```
/                    → Landing page (public)
/features            → Features page (public)
/docs                → Documentation (public)
/login               → Login page (public, shows when logged out)
/home                → Home/Dashboard (authenticated)
/system-monitor      → Real-time metrics (authenticated)
/anomaly-analysis    → Isolation Forest results (authenticated)
/alerts              → Alerts & recommendations (authenticated)
/model-data          → AI model transparency (authenticated)
/device-profile      → Device configuration (authenticated)
```

### Sidebar Navigation
- Shows 6 items when authenticated
- Collapses on click
- Active route highlighted
- Each route corresponds to one module

---

## Component Tree

```
App
├── AuthModal (overlay when not authenticated)
├── OnboardingModal (overlay when authenticated but not onboarded)
├── AppLayout (persistent layout when authenticated)
│   ├── TopNav (header with nav links, user menu, logout)
│   ├── Sidebar (vertical nav, 6 modules)
│   ├── Routes
│   │   ├── Home
│   │   ├── SystemMonitor
│   │   ├── AnomalyAnalysis
│   │   ├── AlertsRecommendations
│   │   ├── ModelData
│   │   └── DeviceProfile
│   └── Footer
└── PublicLayout (when not authenticated)
    ├── TopNav (public nav: features, docs, login)
    └── Routes
        ├── Landing
        ├── Features
        └── Docs
```

---

## Testing Checklist

- [ ] Frontend loads without console errors
- [ ] Landing page displays with laptop-focused copy
- [ ] Login flow works (AuthModal → auth state change)
- [ ] Onboarding flow completes (2-step form → redirect to /home)
- [ ] Home page shows health score and device config
- [ ] System Monitor shows real-time metric updates (every 2 sec)
- [ ] Charts display with rolling 12-point window
- [ ] Anomaly Analysis shows factor breakdown
- [ ] Device Profile allows editing and saving
- [ ] Health score updates when device config changes
- [ ] All 6 sidebar links navigate correctly
- [ ] Logout clears auth state and device config
- [ ] No hardcoded device models in code (except default data)
- [ ] Health scoring math is transparent (shown to user)
- [ ] Backend servers start without errors

---

## File Locations for Review

### Architecture & Documentation
- [Digital Twin Architecture](./DIGITAL_TWIN_ARCHITECTURE.md) - Complete system overview

### Frontend Key Files
- [App Context](./frontend/src/context/AppContext.jsx) - State management
- [Health Scoring](./frontend/src/utils/healthScoring.js) - Score calculation logic
- [Home Page](./frontend/src/pages/Home.jsx) - Overview + scoring explanation
- [Device Profile](./frontend/src/pages/DeviceProfile.jsx) - Config management
- [Onboarding Modal](./frontend/src/components/OnboardingModal.jsx) - Device registration

### Backend Key Files
- [Training Script](./backend/ai/train/train_isolation_forest.py) - Model training
- [Trained Model](./backend/ai/model/isolation_forest.pkl) - Ready for inference
- [AI Service](./backend/src/services/aiService.js) - Model loading (ready for impl)

---

## Academic Viva Points

When presenting, emphasize:

1. **Clear Separation of Concerns**
   - ML model trained on general data, not device-specific
   - Device config stored separately
   - Health scoring combines both layers

2. **Personalization Without Retraining**
   - Device age and usage affect health expectations
   - Achieved via multiplicative factors, not model retraining
   - Respects privacy (no personal data in training)

3. **Unsupervised Learning**
   - Isolation Forest requires no labeled data
   - Learns normal behavior patterns automatically
   - Scales to any system without retraining

4. **Transparent Process**
   - Users see exact health score calculation
   - Factors breakdown visible in UI
   - Algorithm explanation in Anomaly Analysis page

5. **System Design**
   - Professional SaaS UX (dark theme, smooth transitions)
   - Real-time monitoring with 2-second updates
   - 6 coherent modules (Monitor → Analyze → Alert → Act)

---

## Troubleshooting

### Frontend Won't Load
```
Error: Module not found: healthScoring.js
→ Check: frontend/src/utils/healthScoring.js exists
→ Run: cd frontend && npm install
```

### Context Errors
```
Error: useApp must be used within AppProvider
→ Verify: App.jsx wraps entire app with <AppProvider>
```

### Health Score Always Same
```
→ Check: Telemetry interval is running (2 sec)
→ Verify: kaggleSample has varied healthScore values
→ Monitor: System Monitor page shows changing metrics
```

### Device Config Not Saving
```
→ Check: DeviceProfile calls updateDeviceConfig
→ Verify: AppContext.deviceConfig defined
→ Test: Edit device, check console for state changes
```

---

## Performance Notes

- Frontend updates every 2 seconds (configurable in AppContext useEffect)
- Charts retain last 12 data points (configurable in buildSeries)
- No database calls (mock data only currently)
- Health scoring computation is O(1) (simple arithmetic)
- State updates trigger efficient React re-renders via deps array

---

**System Status**: ✅ Ready for Academic Presentation
- Clean architecture with clear separation of concerns
- Fully functional frontend with real-time telemetry
- Backend infrastructure ready for ML integration
- Transparent algorithm with user-visible scoring factors
- Professional SaaS experience throughout
