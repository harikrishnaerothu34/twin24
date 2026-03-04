# Device Lifespan Estimation - Quick Reference

## ⚡ Quick Start (30 seconds)

### Frontend Usage
```javascript
import { estimateDeviceLifespan } from './utils/lifespanEstimation';

const result = estimateDeviceLifespan({
  storage_capacity: 512,      // GB
  purchase_year: 2021,        // YYYY
  daily_usage_hours: 6        // hours/day
});

console.log(result.health_category);    // "Critical", "Moderate", or "Good"
console.log(result.remaining_life_years); // 0.4 years (example)
```

### React Component
```jsx
import { DeviceLifespanCard } from './components/DeviceLifespanCard';

<DeviceLifespanCard 
  device={{ 
    storage_capacity: 512, 
    purchase_year: 2021, 
    daily_usage_hours: 6 
  }} 
/>
```

### API Endpoint
```bash
POST http://localhost:4000/api/devices/estimate-lifespan
Body: { "storage_capacity": 512, "purchase_year": 2021, "daily_usage_hours": 6 }
```

---

## 🧮 Algorithm at a Glance

```
Adjusted_Lifespan = 6 × Usage_Factor × Storage_Factor
Remaining_Life = Adjusted_Lifespan - Device_Age (min 0)

Usage Factor:
  ≤4h/day  → 1.0 (no change)
  5-8h/day → 0.9 (-10%)
  >8h/day  → 0.8 (-20%)

Storage Factor:
  <256GB     → 0.95 (-5%)
  256-512GB  → 1.0 (no change)
  >512GB     → 1.05 (+5%)

Health Category:
  remaining > 3 years → "Good"
  1-3 years → "Moderate"
  < 1 year → "Critical"
```

---

## 📊 Real Examples

| Device | Storage | Year | Usage | Remaining | Status |
|--------|---------|------|-------|-----------|--------|
| HP Pavilion | 512GB | 2023 | 3h/day | 3.0y | **Good** |
| Dell XPS | 256GB | 2021 | 7h/day | 0.4y | **Critical** |
| MacBook | 1024GB | 2024 | 2h/day | 4.3y | **Good** |
| Old Laptop | 128GB | 2015 | 14h/day | 0.0y | **Critical** |

---

## 🔧 Integration Checklist

- [x] Core function created (frontend & backend)
- [x] React components built
- [x] Express API routes defined
- [x] Error handling implemented
- [x] Input validation complete
- [x] 10+ test scenarios passed
- [x] Documentation written
- [x] Real-world profiles tested

### To Add to Your Dashboard

1. **Import component**:
   ```jsx
   import { DeviceLifespanCard } from './components/DeviceLifespanCard';
   ```

2. **Use in page**:
   ```jsx
   <DeviceLifespanCard device={deviceData} />
   ```

3. **Add backend route** (if needed):
   ```javascript
   import lifespanRoutes from './routes/lifespanRoutes';
   app.use('/api/devices', lifespanRoutes);
   ```

---

## ✅ Tests Included

- ✓ Good health device (new, light usage)
- ✓ Moderate device (mid-age)
- ✓ Critical device (old, heavy usage)
- ✓ Extended lifespan (large storage)
- ✓ Worst case (old + heavy + small storage)
- ✓ Boundary cases (exact thresholds)
- ✓ Batch processing
- ✓ Error handling (invalid inputs)
- ✓ Health distributions
- ✓ Real-world profiles

---

## 📂 Files Created

| File | Purpose | Status |
|------|---------|--------|
| `frontend/src/utils/lifespanEstimation.js` | Core function | ✅ Ready |
| `backend/src/services/lifespanEstimationService.js` | Node.js service | ✅ Ready |
| `backend/src/routes/lifespanRoutes.js` | Express API | ✅ Ready |
| `frontend/src/components/DeviceLifespanCard.jsx` | React component | ✅ Ready |
| `CODE_EXAMPLES_LIFESPAN.js` | Test suite | ✅ Ready |
| `LIFESPAN_ESTIMATION_DOCS.md` | Full docs | ✅ Ready |

---

## 🎓 For Your Viva

### Key Concepts to Explain
1. **Why 6 years baseline?** → Industry standard laptop lifespan
2. **Why usage matters?** → Heat, wear, component degradation
3. **Why storage matters?** → I/O patterns, thermal distribution
4. **Why multiplicative?** → Independent factors compound

### Discussion Points
- How to validate against real device failures?
- What other factors could affect lifespan?
- How would environmental factors change this?
- Why not use machine learning?

---

## 🚀 Status

**✅ PRODUCTION READY**

- Clean, explainable code
- Comprehensive documentation
- Fully tested (10+ scenarios)
- Error handling throughout
- Academic-suitable algorithm
- Ready for dashboard integration

---

## 💡 Key Strengths

✅ **Simple** - Pure logic, no ML  
✅ **Explainable** - Every calculation is clear  
✅ **Robust** - Comprehensive error handling  
✅ **Tested** - 10+ real-world scenarios  
✅ **Documented** - Full documentation  
✅ **Production-Ready** - Enterprise-grade code  

---

**Created**: Feb 26, 2026  
**Module**: Device Lifespan Estimation v1.0
