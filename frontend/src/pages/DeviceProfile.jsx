import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const DeviceProfile = () => {
  const { deviceConfig, updateDeviceConfig } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(deviceConfig);
  const [saveMessage, setSaveMessage] = useState("");

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateDeviceConfig(editForm);
    setIsEditing(false);
    setSaveMessage("Device profile updated successfully");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleCancel = () => {
    setEditForm(deviceConfig);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const calculateLifespan = () => {
    if (!deviceConfig.purchaseDate) return null;

    const purchaseYear = new Date(deviceConfig.purchaseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const deviceAge = currentYear - purchaseYear + new Date().getMonth() / 12;

    const baseLifespan = 5.0;
    const usageMultiplier = deviceConfig.dailyUsageHours > 8 ? 0.85 : 1.0;
    const expectedLifespan = baseLifespan * usageMultiplier;
    const remainingLife = Math.max(0, expectedLifespan - deviceAge);
    const remainingPercent = (remainingLife / expectedLifespan) * 100;

    return {
      deviceAge: deviceAge.toFixed(1),
      expectedLifespan: expectedLifespan.toFixed(1),
      remainingLife: remainingLife.toFixed(1),
      remainingPercent: Math.round(remainingPercent),
      healthStatus: remainingPercent > 70 ? "optimal" : remainingPercent > 40 ? "good" : "moderate"
    };
  };

  const lifespan = calculateLifespan();

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Device Profile</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your hardware specifications and monitor lifespan analytics for your digital twin.
            </p>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              Edit Profile
            </button>
          )}
        </div>
        {saveMessage && (
          <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {saveMessage}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="card p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">Edit Hardware Specifications</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Laptop Model *
              </label>
              <input
                type="text"
                className="input-field mt-2 w-full"
                placeholder="e.g. MacBook Pro M2 Max"
                value={editForm.model}
                onChange={(e) => handleEditChange("model", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Purchase Date
              </label>
              <input
                type="date"
                className="input-field mt-2 w-full"
                value={editForm.purchaseDate || ""}
                onChange={(e) => handleEditChange("purchaseDate", e.target.value || null)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">RAM (GB)</label>
              <input
                type="number"
                className="input-field mt-2 w-full"
                placeholder="16"
                value={editForm.ramGB}
                onChange={(e) => handleEditChange("ramGB", parseInt(e.target.value, 10) || 0)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Storage (GB)</label>
              <input
                type="number"
                className="input-field mt-2 w-full"
                placeholder="512"
                value={editForm.storageGB}
                onChange={(e) => handleEditChange("storageGB", parseInt(e.target.value, 10) || 0)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Daily Usage (hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                className="input-field mt-2 w-full"
                placeholder="8"
                value={editForm.dailyUsageHours}
                onChange={(e) => handleEditChange("dailyUsageHours", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={handleCancel} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary flex-1">
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="mb-4 text-sm font-semibold text-white">Hardware Specifications</h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Device Model</p>
                <p className="mt-2 text-lg font-semibold text-white">{deviceConfig.model || "Not configured"}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">RAM</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {deviceConfig.ramGB ? `${deviceConfig.ramGB} GB` : "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Storage</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {deviceConfig.storageGB ? `${deviceConfig.storageGB} GB` : "—"}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Purchase Date</p>
                <p className="mt-2 text-lg font-semibold text-white">{formatDate(deviceConfig.purchaseDate)}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Daily Usage</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {deviceConfig.dailyUsageHours ? `${deviceConfig.dailyUsageHours} hrs/day` : "—"}
                </p>
              </div>
            </div>
          </div>

          {lifespan && (
            <div className="card p-6">
              <h3 className="mb-4 text-sm font-semibold text-white">Lifespan Estimation</h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Device Age</p>
                  <p className="mt-2 text-3xl font-bold text-blue-400">{lifespan.deviceAge}</p>
                  <p className="text-xs text-slate-400">Years</p>
                </div>

                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expected Life</p>
                  <p className="mt-2 text-3xl font-bold text-cyan-400">{lifespan.expectedLifespan}</p>
                  <p className="text-xs text-slate-400">Years</p>
                </div>

                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Remaining Life</p>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-4xl font-bold text-white">{lifespan.remainingPercent}%</p>
                      <p className="mt-1 text-xs text-slate-400">{lifespan.remainingLife} years remaining</p>
                    </div>
                    <StatusBadge
                      status={lifespan.healthStatus.toUpperCase()}
                      variant={lifespan.healthStatus === "optimal" ? "success" : "warning"}
                    />
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all"
                      style={{ width: `${lifespan.remainingPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">About Digital Twin Profiling</h3>
        <div className="space-y-3 text-sm text-slate-400">
          <p>
            Your digital twin is a personalized model of your laptop&apos;s normal behavior. The Isolation Forest AI model
            is trained on general system performance datasets to learn what normal looks like.
          </p>
          <p>
            Your device-specific details (model, age, usage) are used to adjust the anomaly detection baseline so results
            reflect your device context.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeviceProfile;
