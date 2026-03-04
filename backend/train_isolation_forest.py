"""
Isolation Forest Training Script for System Performance Anomaly Detection
==========================================================================

Purpose:
    Train an Isolation Forest model OFFLINE using historical system metrics
    from a Kaggle dataset. The trained model is saved as a .pkl file for
    later use in production anomaly detection.

Author: ML Engineer
Date: 2026
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os
import warnings

warnings.filterwarnings('ignore')

# ============================================================================
# CONFIGURATION
# ============================================================================

# Path to the Kaggle CSV dataset
# Adjust this path based on where your dataset is stored
CSV_PATH = r"C:\Users\amma\Downloads\archive\Big_data_dataset.csv"

# Output path for the trained model
MODEL_OUTPUT_PATH = "isolation_forest.pkl"

# Features to use for anomaly detection
# These are numerical system performance metrics
FEATURE_COLUMNS = [
    'cpu_utilization',
    'memory_usage',
    'disk_io',
    'network_latency',
    'process_count',
    'thread_count',
    'context_switches',
    'cache_miss_rate',
    'temperature',
    'power_consumption',
    'uptime'
]

# Isolation Forest Hyperparameters
N_ESTIMATORS = 100          # Number of trees in the forest
CONTAMINATION = 0.1         # Expected proportion of anomalies (10%)
RANDOM_STATE = 42           # For reproducibility
MAX_SAMPLES = 'auto'        # Number of samples to draw for each tree

# ============================================================================
# STEP 1: LOAD THE DATASET
# ============================================================================

print("=" * 70)
print("ISOLATION FOREST TRAINING - SYSTEM PERFORMANCE ANOMALY DETECTION")
print("=" * 70)
print()

print("[STEP 1] Loading dataset from CSV...")
print(f"File path: {CSV_PATH}")

try:
    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(CSV_PATH)
    print(f"✓ Dataset loaded successfully!")
    print(f"  - Total records: {len(df)}")
    print(f"  - Total columns: {len(df.columns)}")
    print()
except FileNotFoundError:
    print(f"✗ Error: File not found at {CSV_PATH}")
    print("Please check the file path and try again.")
    exit(1)
except Exception as e:
    print(f"✗ Error loading dataset: {str(e)}")
    exit(1)

# ============================================================================
# STEP 2: DATA EXPLORATION
# ============================================================================

print("[STEP 2] Exploring dataset structure...")
print(f"Available columns: {list(df.columns)}")
print()
print("First few rows:")
print(df.head(3))
print()

# ============================================================================
# STEP 3: FEATURE SELECTION AND DATA CLEANING
# ============================================================================

print("[STEP 3] Selecting and cleaning features...")

# Check which features are available in the dataset
available_features = [col for col in FEATURE_COLUMNS if col in df.columns]
missing_features = [col for col in FEATURE_COLUMNS if col not in df.columns]

if missing_features:
    print(f"⚠ Warning: The following features are not in the dataset:")
    for feature in missing_features:
        print(f"  - {feature}")
    print()

print(f"Using {len(available_features)} features for training:")
for feature in available_features:
    print(f"  ✓ {feature}")
print()

# Extract feature columns
X = df[available_features].copy()

# Handle missing values
print("Checking for missing values...")
missing_counts = X.isnull().sum()
if missing_counts.sum() > 0:
    print("Missing values found:")
    for col, count in missing_counts.items():
        if count > 0:
            print(f"  - {col}: {count} missing ({count/len(X)*100:.2f}%)")
    
    # Fill missing values with median (robust to outliers)
    print("\nFilling missing values with column medians...")
    X = X.fillna(X.median())
    print("✓ Missing values handled successfully!")
else:
    print("✓ No missing values detected!")
print()

# Check for infinite values
print("Checking for infinite values...")
if np.isinf(X.values).any():
    print("⚠ Infinite values detected! Replacing with NaN and filling with median...")
    X = X.replace([np.inf, -np.inf], np.nan)
    X = X.fillna(X.median())
    print("✓ Infinite values handled!")
else:
    print("✓ No infinite values detected!")
print()

print(f"Final training data shape: {X.shape}")
print(f"  - Samples: {X.shape[0]}")
print(f"  - Features: {X.shape[1]}")
print()

# ============================================================================
# STEP 4: FEATURE SCALING
# ============================================================================

print("[STEP 4] Normalizing features using StandardScaler...")
print("Why? Different metrics have different scales (e.g., CPU: 0-100, uptime: 0-1000)")
print("Standardization ensures all features contribute equally to anomaly detection.")
print()

# Initialize the scaler
scaler = StandardScaler()

# Fit and transform the data
X_scaled = scaler.fit_transform(X)

print("✓ Features scaled successfully!")
print(f"  - Mean of each feature is now ~0")
print(f"  - Standard deviation of each feature is now ~1")
print()

# ============================================================================
# STEP 5: TRAIN ISOLATION FOREST MODEL
# ============================================================================

print("[STEP 5] Training Isolation Forest model...")
print("Hyperparameters:")
print(f"  - n_estimators: {N_ESTIMATORS} (number of trees)")
print(f"  - contamination: {CONTAMINATION} (expected % of anomalies)")
print(f"  - max_samples: {MAX_SAMPLES} (samples per tree)")
print(f"  - random_state: {RANDOM_STATE} (for reproducibility)")
print()

# Initialize Isolation Forest
model = IsolationForest(
    n_estimators=N_ESTIMATORS,
    contamination=CONTAMINATION,
    max_samples=MAX_SAMPLES,
    random_state=RANDOM_STATE,
    n_jobs=-1,  # Use all CPU cores for faster training
    verbose=0
)

# Train the model
print("Training in progress...")
model.fit(X_scaled)
print("✓ Model trained successfully!")
print()

# ============================================================================
# STEP 6: VALIDATE THE MODEL
# ============================================================================

print("[STEP 6] Validating model on training data...")

# Predict on training data (-1 = anomaly, 1 = normal)
predictions = model.predict(X_scaled)

# Get anomaly scores (lower = more anomalous)
anomaly_scores = model.decision_function(X_scaled)

# Count anomalies
n_anomalies = (predictions == -1).sum()
n_normal = (predictions == 1).sum()

print(f"Results on training data:")
print(f"  - Normal samples: {n_normal} ({n_normal/len(predictions)*100:.2f}%)")
print(f"  - Anomalies detected: {n_anomalies} ({n_anomalies/len(predictions)*100:.2f}%)")
print(f"  - Anomaly score range: [{anomaly_scores.min():.4f}, {anomaly_scores.max():.4f}]")
print()

# ============================================================================
# STEP 7: SAVE THE TRAINED MODEL
# ============================================================================

print("[STEP 7] Saving trained model...")

# Create a model package with both the model and the scaler
model_package = {
    'model': model,
    'scaler': scaler,
    'feature_columns': available_features,
    'training_date': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S'),
    'n_samples_trained': len(X),
    'hyperparameters': {
        'n_estimators': N_ESTIMATORS,
        'contamination': CONTAMINATION,
        'max_samples': MAX_SAMPLES,
        'random_state': RANDOM_STATE
    }
}

# Save using joblib (efficient for scikit-learn models)
joblib.dump(model_package, MODEL_OUTPUT_PATH)

print(f"✓ Model saved successfully to: {MODEL_OUTPUT_PATH}")
print(f"  - File size: {os.path.getsize(MODEL_OUTPUT_PATH) / 1024:.2f} KB")
print()

# ============================================================================
# STEP 8: USAGE INSTRUCTIONS
# ============================================================================

print("=" * 70)
print("TRAINING COMPLETE!")
print("=" * 70)
print()
print("📦 Model Package Contents:")
print("  1. Trained Isolation Forest model")
print("  2. StandardScaler (for feature normalization)")
print("  3. Feature column names")
print("  4. Training metadata")
print()
print("🔧 How to use this model in production:")
print()
print("  # Load the model")
print(f"  model_package = joblib.load('{MODEL_OUTPUT_PATH}')")
print("  model = model_package['model']")
print("  scaler = model_package['scaler']")
print()
print("  # Prepare new data (must have same features)")
print("  new_data = pd.DataFrame([{")
for i, feature in enumerate(available_features[:3]):
    print(f"      '{feature}': value{i+1},")
print("      ...  # include all features")
print("  }])")
print()
print("  # Scale the data")
print("  new_data_scaled = scaler.transform(new_data[model_package['feature_columns']])")
print()
print("  # Predict")
print("  prediction = model.predict(new_data_scaled)  # -1 = anomaly, 1 = normal")
print("  anomaly_score = model.decision_function(new_data_scaled)  # lower = more anomalous")
print()
print("=" * 70)
print()

# ============================================================================
# OPTIONAL: DISPLAY SAMPLE ANOMALIES
# ============================================================================

print("[OPTIONAL] Sample anomalies detected in training data:")
print()

# Get indices of top 5 anomalies
anomaly_indices = np.argsort(anomaly_scores)[:5]

for i, idx in enumerate(anomaly_indices, 1):
    print(f"Anomaly #{i} (index {idx}):")
    print(f"  Anomaly score: {anomaly_scores[idx]:.4f}")
    print(f"  Features:")
    for feature in available_features[:5]:  # Show first 5 features
        print(f"    {feature}: {X.iloc[idx][feature]:.2f}")
    print()

print("=" * 70)
print("Script execution completed successfully! ✓")
print("=" * 70)
