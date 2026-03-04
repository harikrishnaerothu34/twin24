/**
 * Device Lifespan Estimation Component
 * React component for displaying simplified device lifespan information
 */

import React, { useState, useEffect } from 'react';
import { estimateDeviceLifespan } from '../utils/lifespanEstimation';

/**
 * DeviceLifespanCard Component
 *
 * Displays simplified device lifespan metrics:
 * - Device age
 * - Expected lifespan
 * - Remaining lifespan
 * - Health status with color coding
 *
 * @component
 * @param {Object} props
 * @param {Object} props.device - Device data
 * @param {number} props.device.storage_capacity - Storage in GB
 * @param {number} props.device.purchase_year - Purchase year
 * @param {number} props.device.daily_usage_hours - Daily usage hours
 * @param {string} props.device.model - Device model name (optional)
 *
 * @example
 * <DeviceLifespanCard
 *   device={{
 *     model: 'HP Pavilion',
 *     storage_capacity: 512,
 *     purchase_year: 2021,
 *     daily_usage_hours: 6
 *   }}
 * />
 */
export function DeviceLifespanCard({ device }) {
  const [lifespanData, setLifespanData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const result = estimateDeviceLifespan(device);
      setLifespanData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLifespanData(null);
    }
  }, [device]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 font-semibold">Error calculating lifespan</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!lifespanData) {
    return <div className="bg-gray-100 rounded-lg p-4">Loading lifespan data...</div>;
  }

  const {
    device_age,
    expected_lifespan_years,
    remaining_life_years,
    health_category
  } = lifespanData;

  // Determine color based on health category
  const getHealthColor = (category) => {
    switch (category) {
      case 'Good':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          badge: 'bg-green-100 text-green-800'
        };
      case 'Moderate':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      case 'Critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const colors = getHealthColor(health_category);

  // Get health icon and recommendation
  const getHealthInfo = (category, remaining) => {
    switch (category) {
      case 'Good':
        return {
          icon: '✓',
          recommendation:
            'Device is in excellent condition. No immediate action needed.'
        };
      case 'Moderate':
        return {
          icon: '⚠',
          recommendation:
            'Plan for replacement within 1-3 years. Monitor health metrics closely.'
        };
      case 'Critical':
        return {
          icon: '⚠⚠',
          recommendation:
            'Device nearing end-of-life. Plan for replacement soon.'
        };
      default:
        return { icon: '?', recommendation: '' };
    }
  };

  const { icon, recommendation } = getHealthInfo(health_category, remaining_life_years);

  return (
    <div className={`border rounded-lg p-6 ${colors.bg} ${colors.border}`}>
      {/* Header with health badge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {device.model || 'Device Lifespan Estimation'}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}>
          {icon} {health_category}
        </span>
      </div>

      {/* Main metrics grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Device Age */}
        <div className="bg-white rounded p-3 border border-gray-200">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Device Age</p>
          <p className="text-2xl font-bold text-gray-900">{device_age}</p>
          <p className="text-xs text-gray-500">years</p>
        </div>

        {/* Expected Lifespan */}
        <div className="bg-white rounded p-3 border border-gray-200">
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Expected Lifespan</p>
          <p className="text-2xl font-bold text-gray-900">
            {expected_lifespan_years.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">years</p>
        </div>

        {/* Remaining Life */}
        <div className={`rounded p-3 border ${colors.border} bg-white`}>
          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Remaining Life</p>
          <p className={`text-2xl font-bold ${colors.text}`}>
            {remaining_life_years.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">years</p>
        </div>
      </div>

      {/* Recommendation box */}
      <div className={`bg-white border-l-4 rounded p-3 ${colors.border}`}>
        <p className={`text-sm font-semibold ${colors.text}`}>
          {health_category === 'Good'
            ? 'Status'
            : health_category === 'Moderate'
              ? 'Recommendation'
              : 'Urgent Recommendation'}
        </p>
        <p className="text-sm text-gray-700 mt-1">{recommendation}</p>
      </div>
    </div>
  );
}

/**
 * LifespanComparison Component
 *
 * Compare lifespan between multiple devices
 *
 * @component
 * @param {Object} props
 * @param {Array} props.devices - Array of device objects
 */
export function LifespanComparison({ devices }) {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const lifespanResults = devices.map((device) =>
        estimateDeviceLifespan(device)
      );
      setResults(lifespanResults);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [devices]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 font-semibold">Error processing devices</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return <div className="text-gray-500">No devices to compare</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Device Lifespan Comparison</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Device</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">Age</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">Expected</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">Remaining</th>
              <th className="px-4 py-2 text-center font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => {
              const result = results[index];
              const colors = getHealthColor(result.health_category);

              return (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {device.model || `Device ${index + 1}`}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {result.device_age}
                    {' '}
                    y
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {result.expected_lifespan_years.toFixed(1)}
                    {' '}
                    y
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${colors.text}`}>
                    {result.remaining_life_years.toFixed(1)}
                    {' '}
                    y
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors.badge}`}>
                      {result.health_category}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Utility function for color selection
 * @private
 */
function getHealthColor(category) {
  switch (category) {
    case 'Good':
      return {
        badge: 'bg-green-100 text-green-800',
        text: 'text-green-700'
      };
    case 'Moderate':
      return {
        badge: 'bg-yellow-100 text-yellow-800',
        text: 'text-yellow-700'
      };
    case 'Critical':
      return {
        badge: 'bg-red-100 text-red-800',
        text: 'text-red-700'
      };
    default:
      return {
        badge: 'bg-gray-100 text-gray-800',
        text: 'text-gray-700'
      };
  }
}

// Default export
export default DeviceLifespanCard;
