/**
 * System Lifespan Estimation Service - Backend
 * Node.js module - Simplified version with essential metrics only
 *
 * @module lifespanEstimationService
 * @author System Reliability Engineering
 * @date 2026
 */

/**
 * Calculate system lifespan estimation for a laptop device
 *
 * Returns only essential lifespan metrics without internal factors.
 *
 * @param {Object} deviceData - Device registration data
 * @param {number} deviceData.storage_capacity - Storage in GB
 * @param {number} deviceData.purchase_year - Purchase year (YYYY)
 * @param {number} deviceData.daily_usage_hours - Daily usage (0-24 hours)
 * @returns {Object} Simplified lifespan result
 * @throws {Error} If validation fails
 */
export function estimateDeviceLifespan(deviceData) {
  validateInput(deviceData);

  const {
    storage_capacity,
    purchase_year,
    daily_usage_hours
  } = deviceData;

  const currentYear = new Date().getFullYear();
  const device_age = currentYear - purchase_year;

  // Baseline lifespan
  const BASELINE_LIFESPAN = 6;

  // Apply usage factor
  const usage_factor = calculateUsageFactor(daily_usage_hours);

  // Apply storage factor
  const storage_factor = calculateStorageFactor(storage_capacity);

  // Calculate expected lifespan (rounded to 2 decimals)
  let expected_lifespan_years = BASELINE_LIFESPAN * usage_factor * storage_factor;
  expected_lifespan_years = Math.round(expected_lifespan_years * 100) / 100;

  // Calculate remaining life (never negative)
  let remaining_life_years = expected_lifespan_years - device_age;
  remaining_life_years = Math.max(0, remaining_life_years);
  remaining_life_years = Math.round(remaining_life_years * 100) / 100;

  // Determine health category
  const health_category = determineHealthCategory(remaining_life_years);

  return {
    device_age,
    expected_lifespan_years,
    remaining_life_years,
    health_category
  };
}

/**
 * Validate input data
 * @private
 */
function validateInput(deviceData) {
  if (!deviceData || typeof deviceData !== 'object') {
    throw new Error('Device data must be an object');
  }

  const { storage_capacity, purchase_year, daily_usage_hours } = deviceData;

  if (typeof storage_capacity !== 'number' || storage_capacity <= 0) {
    throw new Error(
      `Invalid storage_capacity: ${storage_capacity}. Must be positive number (GB)`
    );
  }

  const currentYear = new Date().getFullYear();
  if (
    typeof purchase_year !== 'number' ||
    !Number.isInteger(purchase_year) ||
    purchase_year < 1990 ||
    purchase_year > currentYear
  ) {
    throw new Error(
      `Invalid purchase_year: ${purchase_year}. Must be between 1990 and ${currentYear}`
    );
  }

  if (
    typeof daily_usage_hours !== 'number' ||
    daily_usage_hours < 0 ||
    daily_usage_hours > 24
  ) {
    throw new Error(
      `Invalid daily_usage_hours: ${daily_usage_hours}. Must be between 0 and 24`
    );
  }
}

/**
 * Calculate usage-based lifespan factor
 * @private
 */
function calculateUsageFactor(dailyUsageHours) {
  if (dailyUsageHours > 8) return 0.8;
  if (dailyUsageHours >= 5) return 0.9;
  return 1.0;
}

/**
 * Calculate storage-based lifespan factor
 * @private
 */
function calculateStorageFactor(storageCapacity) {
  if (storageCapacity < 256) return 0.95;
  if (storageCapacity > 512) return 1.05;
  return 1.0;
}

/**
 * Determine health category based on remaining life
 * @private
 */
function determineHealthCategory(remainingLife) {
  if (remainingLife > 3) return 'Good';
  if (remainingLife >= 1) return 'Moderate';
  return 'Critical';
}

/**
 * Process multiple devices
 * @param {Array} devices - Array of device data
 * @returns {Array} Results with success/error status
 */
export function estimateDeviceLifespanBatch(devices) {
  if (!Array.isArray(devices)) {
    throw new Error('Input must be an array');
  }

  return devices.map((device, index) => {
    try {
      return {
        success: true,
        deviceIndex: index,
        result: estimateDeviceLifespan(device)
      };
    } catch (error) {
      return {
        success: false,
        deviceIndex: index,
        error: error.message
      };
    }
  });
}

/**
 * Express middleware for lifespan estimation endpoint
 */
export function lifespanEstimationMiddleware(req, res, next) {
  try {
    const { storage_capacity, purchase_year, daily_usage_hours } = req.body;

    const result = estimateDeviceLifespan({
      storage_capacity,
      purchase_year,
      daily_usage_hours
    });

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

export default {
  estimateDeviceLifespan,
  estimateDeviceLifespanBatch,
  lifespanEstimationMiddleware
};
