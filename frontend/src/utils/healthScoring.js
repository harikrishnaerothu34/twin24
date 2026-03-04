/**
 * Health Scoring Logic
 * 
 * This module combines three independent signals into a unified health score:
 * 1. Isolation Forest anomaly score (0-100, lower = more anomalous)
 * 2. Device age factor (newer laptops expected to perform better)
 * 3. Usage pattern factor (heavy users may show expected stress patterns)
 * 
 * The Isolation Forest model is trained ONLY on system performance datasets.
 * Device-specific details (purchase date, usage hours) are NOT used for training.
 * They are applied ONLY in the health scoring layer, post-prediction.
 */

/**
 * Calculate device age degradation factor
 * Older devices may naturally show higher anomaly scores
 * This factor adjusts expectations based on device lifecycle
 * 
 * @param {Date|string} purchaseDate - Purchase date of the device
 * @returns {number} Age factor (0.7-1.0, where 1.0 = new device)
 */
export const calculateAgeFactor = (purchaseDate) => {
  if (!purchaseDate) return 1.0;

  const purchase = new Date(purchaseDate);
  const today = new Date();
  const ageMonths = (today - purchase) / (1000 * 60 * 60 * 24 * 30);

  // Device degradation curve: 3% per year of ownership
  // After 5 years, factor floors at 0.85 (15% allowed degradation)
  const degradation = Math.min(ageMonths / 12 * 0.03, 0.15);
  return Math.max(1.0 - degradation, 0.85);
};

/**
 * Calculate usage intensity factor
 * High daily usage may correlate with higher system stress
 * This factor normalizes expected anomaly behavior for usage patterns
 * 
 * @param {number} dailyUsageHours - Average hours per day (0-24)
 * @returns {number} Usage factor (0.8-1.0, where 1.0 = light usage)
 */
export const calculateUsageFactor = (dailyUsageHours = 0) => {
  const normalizedUsage = Math.min(dailyUsageHours / 24, 1.0);
  // High usage (16+ hours/day) gets a 20% allowance
  // Light usage (0-2 hours/day) gets full factor
  return 1.0 - normalizedUsage * 0.2;
};

/**
 * Determine risk level based on health score
 * Risk levels guide user action priority
 * 
 * @param {number} healthScore - Health score (0-100)
 * @returns {string} Risk level: "Low" | "Medium" | "High"
 */
export const getRiskLevel = (healthScore) => {
  if (healthScore >= 75) return "Low";
  if (healthScore >= 50) return "Medium";
  return "High";
};

/**
 * Calculate overall health score from anomaly detection and device factors
 * 
 * FORMULA:
 * healthScore = anomalyScore × ageFactor × usageFactor
 * Then scaled to 0-100 range with floor at 30 (system still operating)
 * 
 * @param {Object} params - Scoring parameters
 * @param {number} params.anomalyScore - Raw anomaly score from Isolation Forest (0-100)
 * @param {Date|string} params.purchaseDate - Device purchase date
 * @param {number} params.dailyUsageHours - Average daily usage (0-24)
 * @param {boolean} params.isAnomalous - Flag from Isolation Forest (true if outlier)
 * @returns {Object} { score: number, riskLevel: string }
 */
export const calculateHealthScore = ({
  anomalyScore = 100,
  purchaseDate = null,
  dailyUsageHours = 0,
  isAnomalous = false
}) => {
  // If Isolation Forest flagged an anomaly, start with lower base
  let baseScore = isAnomalous ? Math.max(anomalyScore - 20, 40) : anomalyScore;

  // Apply device and usage factors
  const ageFactor = calculateAgeFactor(purchaseDate);
  const usageFactor = calculateUsageFactor(dailyUsageHours);
  
  // Combined health score
  const adjustedScore = baseScore * ageFactor * usageFactor;
  
  // Floor at 30 to indicate "system still operational despite issues"
  // Ceiling at 95 to account for measurement uncertainty
  const finalScore = Math.max(Math.min(adjustedScore, 95), 30);

  return {
    score: Math.round(finalScore),
    riskLevel: getRiskLevel(Math.round(finalScore)),
    anomalyDetected: isAnomalous,
    factors: {
      baseAnomalyScore: anomalyScore,
      ageFactor: parseFloat(ageFactor.toFixed(2)),
      usageFactor: parseFloat(usageFactor.toFixed(2))
    }
  };
};

/**
 * Generate health recommendation based on score and risk level
 * 
 * @param {number} score - Health score (0-100)
 * @returns {string} Actionable recommendation text
 */
export const getHealthRecommendation = (score) => {
  if (score >= 80) {
    return "System performing optimally. Continue normal monitoring.";
  }
  if (score >= 60) {
    return "Minor performance degradation detected. Consider running maintenance tasks.";
  }
  if (score >= 40) {
    return "System showing signs of stress. Review running processes and storage space.";
  }
  return "Critical issues detected. Recommended immediate system diagnostics and cleanup.";
};
