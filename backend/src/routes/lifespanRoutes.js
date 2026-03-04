/**
 * Lifespan Estimation API Integration
 * Express.js route handler and API documentation
 */

import express from 'express';
import {
  estimateDeviceLifespan,
  estimateDeviceLifespanBatch,
  lifespanEstimationMiddleware
} from '../services/lifespanEstimationService.js';

const router = express.Router();

/**
 * POST /api/devices/estimate-lifespan
 *
 * Calculate lifespan estimation for a single device
 *
 * @body {Object} deviceData
 * @body {number} deviceData.storage_capacity - Storage in GB
 * @body {number} deviceData.purchase_year - Purchase year (YYYY)
 * @body {number} deviceData.daily_usage_hours - Daily usage hours (0-24)
 *
 * @response {Object} Lifespan estimation result
 * @response {number} device_age - Device age in years
 * @response {number} adjusted_expected_lifespan - Expected total lifespan
 * @response {number} remaining_life_years - Remaining years until EOL
 * @response {string} health_category - "Good" | "Moderate" | "Critical"
 * @response {Object} metadata - Additional calculation details
 *
 * @example
 * POST /api/devices/estimate-lifespan
 * Content-Type: application/json
 *
 * {
 *   "storage_capacity": 512,
 *   "purchase_year": 2021,
 *   "daily_usage_hours": 6
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "device_age": 5,
 *     "adjusted_expected_lifespan": 5.4,
 *     "remaining_life_years": 0.4,
 *     "health_category": "Critical",
 *     "metadata": { ... }
 *   }
 * }
 */
router.post('/estimate-lifespan', (req, res, next) => {
  try {
    const { storage_capacity, purchase_year, daily_usage_hours } = req.body;

    // Input validation
    if (
      storage_capacity === undefined ||
      purchase_year === undefined ||
      daily_usage_hours === undefined
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Missing required fields: storage_capacity, purchase_year, daily_usage_hours'
      });
    }

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
});

/**
 * POST /api/devices/estimate-lifespan/batch
 *
 * Calculate lifespan estimation for multiple devices
 *
 * @body {Array} devices - Array of device objects
 *
 * @response {Array} Results array with success/error status for each device
 *
 * @example
 * POST /api/devices/estimate-lifespan/batch
 * Content-Type: application/json
 *
 * {
 *   "devices": [
 *     {
 *       "storage_capacity": 512,
 *       "purchase_year": 2023,
 *       "daily_usage_hours": 3
 *     },
 *     {
 *       "storage_capacity": 256,
 *       "purchase_year": 2021,
 *       "daily_usage_hours": 7
 *     }
 *   ]
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "success": true,
 *       "deviceIndex": 0,
 *       "result": { ... }
 *     },
 *     {
 *       "success": true,
 *       "deviceIndex": 1,
 *       "result": { ... }
 *     }
 *   ]
 * }
 */
router.post('/estimate-lifespan/batch', (req, res, next) => {
  try {
    const { devices } = req.body;

    if (!Array.isArray(devices)) {
      return res.status(400).json({
        success: false,
        error: 'devices must be an array'
      });
    }

    if (devices.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'devices array cannot be empty'
      });
    }

    const results = estimateDeviceLifespanBatch(devices);

    return res.json({
      success: true,
      data: results
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/devices/lifespan-info
 *
 * Get information about lifespan calculation methodology
 *
 * @response {Object} Information about calculation logic
 */
router.get('/lifespan-info', (req, res) => {
  res.json({
    success: true,
    data: {
      baseline_lifespan_years: 6,
      usage_factors: {
        light: {
          threshold: '≤4 hours/day',
          reduction: 0
        },
        moderate: {
          threshold: '5-8 hours/day',
          reduction: '10%'
        },
        heavy: {
          threshold: '>8 hours/day',
          reduction: '20%'
        }
      },
      storage_factors: {
        limited: {
          threshold: '<256 GB',
          adjustment: '-5%'
        },
        standard: {
          threshold: '256-512 GB',
          adjustment: 'none'
        },
        large: {
          threshold: '>512 GB',
          adjustment: '+5%'
        }
      },
      health_categories: {
        good: 'remaining_life > 3 years',
        moderate: '1 ≤ remaining_life ≤ 3 years',
        critical: 'remaining_life < 1 year'
      }
    }
  });
});

export default router;
