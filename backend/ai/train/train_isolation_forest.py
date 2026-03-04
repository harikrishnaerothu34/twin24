"""
Isolation Forest Training Script for System Performance Anomaly Detection
==========================================================================

Purpose:
    Train an Isolation Forest model OFFLINE using historical system metrics
    from the Kaggle dataset. Automatically detects numeric columns and excludes
    non-numeric columns (e.g., Timestamp). The trained model is saved as a .pkl 
    file for later use in production anomaly detection.

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

# Path to the Kaggle CSV dataset (relative path)
CSV_PATH = "../data/unclean_cpu_metrics.csv"

# Output path for the trained model (relative path)
MODEL_OUTPUT_PATH = "../model/isolation_forest.pkl"

# Isolation Forest Hyperparameters
N_ESTIMATORS = 200          # Number of trees in the forest
CONTAMINATION = 0.05        # Expected proportion of anomalies (5%)
RANDOM_STATE = 42           # For reproducibility
MAX_SAMPLES = 'auto'        # Number of samples to draw for each tree

# Non-numeric columns to exclude from training
NON_NUMERIC_COLUMNS = ['Timestamp', 'timestamp', 'Date', 'date', 'Time', 'time', 'ID', 'id']

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
print("Data types:")
print(df.dtypes)
print()

# ============================================================================
# STEP 3: AUTOMATIC NUMERIC FEATURE DETECTION
# ============================================================================

print("[STEP 3] Automatically detecting numeric columns...")

# Identify numeric columns (automatically)
numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()

# Remove non-numeric columns that might be in numeric columns
columns_to_exclude = NON_NUMERIC_COLUMNS
numeric_columns = [col for col in numeric_columns if col not in columns_to_exclude]

# Also exclude any non-numeric columns from the dataframe
all_columns = df.columns.tolist()
non_numeric_identified = [col for col in all_columns if col not in numeric_columns]

if non_numeric_identified:
    print(f"Non-numeric columns detected and will be excluded:")
    for col in non_numeric_identified:
        print(f"  ✗ {col} ({df[col].dtype})")

print()
print(f"✓ Detected {len(numeric_columns)} numeric features for training:")
for feature in numeric_columns:
    print(f"  ✓ {feature}")
print()

# Extract numeric feature columns
X = df[numeric_columns].copy()

# ============================================================================
# STEP 4: HANDLING MISSING VALUES
# ============================================================================

print("[STEP 4] Handling missing values...")
missing_counts = X.isnull().sum()

if missing_counts.sum() > 0:
    print(f"Missing values detected in {(missing_counts > 0).sum()} columns:")
    for col in missing_counts[missing_counts > 0].index:
        pct = missing_counts[col] / len(X) * 100
        print(f"  - {col}: {missing_counts[col]} missing ({pct:.2f}%)")
    
    print("\nFilling missing values with column medians...")
    X = X.fillna(X.median())
    print("✓ Missing values handled successfully!")
else:
    print("✓ No missing values detected!")
print()

# ============================================================================
# STEP 5: HANDLING INFINITE VALUES
# ============================================================================

print("[STEP 5] Checking for infinite values...")
if np.isinf(X.values).any():
    print("⚠ Infinite values detected! Replacing with NaN and filling with median...")
    X = X.replace([np.inf, -np.inf], np.nan)
    X = X.fillna(X.median())
    print("✓ Infinite values handled!")
else:
    print("✓ No infinite values detected!")
print()

print(f"Dataset shape after cleaning: {X.shape}")
print(f"  - Samples (rows): {X.shape[0]}")
print(f"  - Features (columns): {X.shape[1]}")
print()

# ============================================================================
# STEP 6: FEATURE SCALING
# ============================================================================

print("[STEP 6] Normalizing features using StandardScaler...")
print("Why? Different metrics have different scales (e.g., CPU Usage: 0-100%, Temperature: 30-80°C)")
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
# STEP 7: TRAIN ISOLATION FOREST MODEL
# ============================================================================

print("[STEP 7] Training Isolation Forest model...")
print("Hyperparameters:")
print(f"  - n_estimators: {N_ESTIMATORS} (number of trees)")
print(f"  - contamination: {CONTAMINATION} (expected % of anomalies = {CONTAMINATION*100}%)")
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
# STEP 8: VALIDATE THE MODEL
# ============================================================================

print("[STEP 8] Validating model on training data...")

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
# STEP 9: SAVE THE TRAINED MODEL
# ============================================================================

print("[STEP 9] Saving trained model to disk...")

# Ensure the output directory exists
os.makedirs(os.path.dirname(MODEL_OUTPUT_PATH) or '.', exist_ok=True)

# Create a model package with both the model and the scaler
model_package = {
    'model': model,
    'scaler': scaler,
    'feature_columns': numeric_columns,
    'training_date': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S'),
    'n_samples_trained': len(X),
    'n_features': len(numeric_columns),
    'hyperparameters': {
        'n_estimators': N_ESTIMATORS,
        'contamination': CONTAMINATION,
        'max_samples': MAX_SAMPLES,
        'random_state': RANDOM_STATE
    }
}

# Save using joblib (efficient for scikit-learn models)
joblib.dump(model_package, MODEL_OUTPUT_PATH)

print(f"✓ Model saved successfully!")
print(f"  - File path: {MODEL_OUTPUT_PATH}")
print(f"  - File size: {os.path.getsize(MODEL_OUTPUT_PATH) / 1024:.2f} KB")
print()

# ============================================================================
# SUMMARY & USAGE INSTRUCTIONS
# ============================================================================

print("=" * 70)
print("🎉 TRAINING COMPLETE!")
print("=" * 70)
print()
print("📊 TRAINING SUMMARY:")
print(f"  - Dataset shape: {X.shape}")
print(f"  - Number of features used: {len(numeric_columns)}")
print(f"  - Number of training samples: {len(X)}")
print(f"  - Model saved to: {MODEL_OUTPUT_PATH}")
print()
print("📦 Model Package Contents:")
print("  1. Trained Isolation Forest model")
print("  2. StandardScaler (for feature normalization)")
print("  3. Feature column names (for future predictions)")
print("  4. Training metadata and hyperparameters")
print()
print("🔧 How to use this model in production:")
print()
print("  import joblib")
print("  import pandas as pd")
print("  ")
print(f"  # Load the model package")
print(f"  model_package = joblib.load('{MODEL_OUTPUT_PATH}')")
print("  model = model_package['model']")
print("  scaler = model_package['scaler']")
print("  feature_cols = model_package['feature_columns']")
print("  ")
print("  # Prepare new data (must have the same numeric features)")
print("  new_data = pd.DataFrame([...])")
print("  new_data_numeric = new_data[feature_cols]")
print("  ")
print("  # Scale the data")
print("  new_data_scaled = scaler.transform(new_data_numeric)")
print("  ")
print("  # Make predictions")
print("  prediction = model.predict(new_data_scaled)  # -1 = anomaly, 1 = normal")
print("  anomaly_score = model.decision_function(new_data_scaled)  # lower = more anomalous")
print()
print("=" * 70)
print()

print("=" * 70)
print("✓ Script execution completed successfully!")
print("=" * 70)

