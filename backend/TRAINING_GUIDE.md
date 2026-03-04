# Isolation Forest Training Guide

## 📋 Overview
This guide will help you train an Isolation Forest model for anomaly detection using your Kaggle system performance dataset.

## 🚀 Quick Start

### Step 1: Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Run the Training Script
```bash
python train_isolation_forest.py
```

### Step 3: Find Your Trained Model
After successful execution, you'll find:
- `isolation_forest.pkl` - Your trained model (ready to use)

## 📊 What the Script Does

1. **Loads CSV Data** - Reads your Kaggle dataset from Downloads
2. **Selects Features** - Uses 11 numerical metrics (CPU, memory, disk, etc.)
3. **Cleans Data** - Handles missing/infinite values safely
4. **Scales Features** - Normalizes data using StandardScaler
5. **Trains Model** - Fits Isolation Forest with 100 trees
6. **Validates** - Tests on training data to verify
7. **Saves Model** - Exports as `.pkl` file with metadata

## 🎓 For Academic Viva

### Key Concepts to Explain:

**Q: What is Isolation Forest?**
- Unsupervised ML algorithm for anomaly detection
- Works by isolating anomalies through random partitioning
- Anomalies are easier to isolate (require fewer splits)

**Q: Why offline training?**
- Training is computationally expensive
- Requires historical data to learn normal patterns
- Model can be reused many times once trained

**Q: What are the hyperparameters?**
- `n_estimators=100`: Number of trees in the forest
- `contamination=0.1`: Expected 10% of data are anomalies
- `random_state=42`: Ensures reproducible results

**Q: Why StandardScaler?**
- Different metrics have different scales (CPU: 0-100, uptime: 0-1000)
- Prevents features with larger values from dominating
- Ensures fair contribution from all features

**Q: How to use the model?**
```python
import joblib
import pandas as pd

# Load model
pkg = joblib.load('isolation_forest.pkl')
model = pkg['model']
scaler = pkg['scaler']

# Prepare new data
data = pd.DataFrame([{
    'cpu_utilization': 85.5,
    'memory_usage': 92.3,
    # ... other features
}])

# Scale and predict
data_scaled = scaler.transform(data[pkg['feature_columns']])
prediction = model.predict(data_scaled)  # -1=anomaly, 1=normal
score = model.decision_function(data_scaled)  # negative=anomaly
```

## 📈 Expected Output

```
ISOLATION FOREST TRAINING - SYSTEM PERFORMANCE ANOMALY DETECTION
=================================================================

[STEP 1] Loading dataset from CSV...
✓ Dataset loaded successfully!
  - Total records: XXXX
  - Total columns: 12

[STEP 2] Exploring dataset structure...
...

[STEP 7] Saving trained model...
✓ Model saved successfully to: isolation_forest.pkl

TRAINING COMPLETE!
```

## 🔧 Troubleshooting

**Error: File not found**
- Update `CSV_PATH` in the script to match your file location

**Error: Module not found**
- Run: `pip install -r requirements.txt`

**Low anomaly detection**
- Adjust `contamination` parameter (0.05 to 0.2)
- Check if your data actually contains anomalies

**Memory issues**
- Reduce `n_estimators` (try 50 instead of 100)
- Use smaller sample of data for training

## 📝 Model Output Contents

The `.pkl` file contains:
- ✅ Trained Isolation Forest model
- ✅ StandardScaler (fitted on training data)
- ✅ Feature column names (ensures correct order)
- ✅ Training metadata (date, hyperparameters, sample count)

## ⚡ Next Steps

1. Train the model: `python train_isolation_forest.py`
2. Integrate into your Node.js backend (using Python child process)
3. Create API endpoint that calls the model
4. Send real-time metrics from frontend for anomaly detection

## 📚 References

- [Isolation Forest Paper](https://cs.nju.edu.cn/zhouzh/zhouzh.files/publication/icdm08b.pdf)
- [Scikit-learn Documentation](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html)
- [Anomaly Detection Guide](https://scikit-learn.org/stable/modules/outlier_detection.html)
