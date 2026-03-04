import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

const OnboardingModal = () => {
  const { isAuthenticated, hasOnboarded, completeOnboarding } = useApp();
  const [formData, setFormData] = useState({
    model: "",
    ramGB: "",
    storageGB: "",
    dailyUsageHours: "",
    purchaseDate: ""
  });
  const [step, setStep] = useState(1);

  if (!isAuthenticated || hasOnboarded) {
    return null;
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step === 1 && formData.model.trim()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (formData.model.trim()) {
      completeOnboarding({
        model: formData.model || "Personal Laptop",
        ramGB: parseInt(formData.ramGB) || 0,
        storageGB: parseInt(formData.storageGB) || 0,
        dailyUsageHours: parseFloat(formData.dailyUsageHours) || 0,
        purchaseDate: formData.purchaseDate || null
      });
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
      <div className="card w-full max-w-2xl p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Onboarding</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Initialize your digital twin</h2>
        <p className="mt-2 text-sm text-slate-400">
          Provide laptop specifications to personalize monitoring and health scoring.
        </p>

        {step === 1 ? (
          <>
            <div className="mt-8">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Laptop Model *</label>
              <input
                className="input-field mt-2 w-full"
                placeholder="e.g., HP Spectre x360, MacBook Pro 16"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
              />
              <p className="mt-2 text-xs text-slate-500">
                Device name or model identifier (not used for AI training)
              </p>
            </div>

            <button
              type="button"
              className="btn-primary mt-8 w-full"
              onClick={handleNext}
              disabled={!formData.model.trim()}
            >
              Continue →
            </button>
          </>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">RAM (GB)</label>
                <input
                  type="number"
                  className="input-field mt-2 w-full"
                  placeholder="16"
                  value={formData.ramGB}
                  onChange={(e) => handleChange("ramGB", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Storage (GB)</label>
                <input
                  type="number"
                  className="input-field mt-2 w-full"
                  placeholder="512"
                  value={formData.storageGB}
                  onChange={(e) => handleChange("storageGB", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Avg Daily Usage (hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  className="input-field mt-2 w-full"
                  placeholder="8"
                  min="0"
                  max="24"
                  value={formData.dailyUsageHours}
                  onChange={(e) => handleChange("dailyUsageHours", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Purchase Date</label>
                <input
                  type="date"
                  className="input-field mt-2 w-full"
                  value={formData.purchaseDate}
                  onChange={(e) => handleChange("purchaseDate", e.target.value)}
                />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              These details personalize your digital twin but are separate from the AI anomaly detection model,
              which is trained only on system performance metrics.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={handleBack}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
                onClick={handleSubmit}
              >
                Create Digital Twin
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
