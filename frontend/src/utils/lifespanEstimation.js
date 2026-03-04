/**
 * System Lifespan Estimation Module
 * Simplified version - Returns only essential lifespan metrics
 *
 * @module lifespanEstimation
 * @author System Reliability Engineering
 * @date 2026
 */

/**
 * Calculate system lifespan estimation for a laptop device
 *
 * Returns only final lifespan metrics without internal factors.
 *
 * @param {Object} deviceData - Device information
 * @param {number} deviceData.storage_capacity - Storage capacity in GB
 * @param {number} deviceData.purchase_year - Purchase year in YYYY format
 * @param {number} deviceData.daily_usage_hours - Average daily usage in hours
 *
 * @returns {Object} Simplified lifespan result
 * @returns {number} result.device_age - Device age in years
 * @returns {number} result.expected_lifespan_years - Expected total lifespan
 * @returns {number} result.remaining_life_years - Years of remaining life
 * @returns {string} result.health_category - "Good" | "Moderate" | "Critical"
 *
 * @throws {Error} If invalid input parameters
 *
 * @example
 * const result = estimateDeviceLifespan({
 *   storage_capacity: 512,
 *   purchase_year: 2021,
 *   daily_usage_hours: 6
 * });
 * // Output: { device_age: 5, expected_lifespan_years: 5.4, remaining_life_years: 0.4, health_category: 'Critical' }
 */
function estimateDeviceLifespan(deviceData) {
  // Input validation
  if (!deviceData || typeof deviceData !== 'object') {
    throw new Error('Invalid device data: must be an object');
  }

  const { storage_capacity, purchase_year, daily_usage_hours } = deviceData;

  if (typeof storage_capacity !== 'number' || storage_capacity <= 0) {
    throw new Error(`Invalid storage_capacity: ${storage_capacity}. Must be positive number.`);
  }

  const currentYear = new Date().getFullYear();
  if (
    typeof purchase_year !== 'number' ||
    !Number.isInteger(purchase_year) ||
    purchase_year < 1990 ||
    purchase_year > currentYear
  ) {
    throw new Error(
      `Invalid purchase_year: ${purchase_year}. Must be between 1990 and ${currentYear}.`
    );
  }

  if (
    typeof daily_usage_hours !== 'number' ||
    daily_usage_hours < 0 ||
    daily_usage_hours > 24
  ) {
    throw new Error(
      `Invalid daily_usage_hours: ${daily_usage_hours}. Must be between 0 and 24.`
    );
  }

  // Calculate device age
  const device_age = currentYear - purchase_year;

  // Baseline lifespan
  const BASELINE_LIFESPAN = 6;

  // Calculate usage factor
  let usage_factor;
  if (daily_usage_hours > 8) {
    usage_factor = 0.8;
  } else if (daily_usage_hours >= 5) {
    usage_factor = 0.9;
  } else {
    usage_factor = 1.0;
  }

  // Calculate storage factor
  let storage_factor;
  if (storage_capacity < 256) {
    storage_factor = 0.95;
  } else if (storage_capacity > 512) {
    storage_factor = 1.05;
  } else {
    storage_factor = 1.0;
  }

  // Calculate expected lifespan
  let expected_lifespan_years = BASELINE_LIFESPAN * usage_factor * storage_factor;
  expected_lifespan_years = Math.round(expected_lifespan_years * 100) / 100;

  // Calculate remaining life
  let remaining_life_years = expected_lifespan_years - device_age;
  remaining_life_years = Math.max(0, remaining_life_years);
  remaining_life_years = Math.round(remaining_life_years * 100) / 100;

  // Determine health category
  let health_category;
  if (remaining_life_years > 3) {
    health_category = 'Good';
  } else if (remaining_life_years >= 1) {
    health_category = 'Moderate';
  } else {
    health_category = 'Critical';
  }

  return {
    device_age,
    expected_lifespan_years,
    remaining_life_years,
    health_category
  };
}

/**
 * Process multiple devices and return lifespan estimations
 *
 * @param {Array<Object>} devices - Array of device objects
 * @returns {Array<Object>} Array of lifespan results
 *
 * @example
 * const devices = [
 *   { storage_capacity: 256, purchase_year: 2021, daily_usage_hours: 6 },
 *   { storage_capacity: 512, purchase_year: 2020, daily_usage_hours: 10 }
 * ];
 * const results = estimateDeviceLifespanBatch(devices);
 */
function estimateDeviceLifespanBatch(devices) {
  if (!Array.isArray(devices)) {
    throw new Error('Input must be an array of device objects');
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

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    estimateDeviceLifespan,
    estimateDeviceLifespanBatch
  };
}

// ES6 export
export { estimateDeviceLifespan, estimateDeviceLifespanBatch };
