import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import Toast from "./Toast.jsx";

const AuthModal = () => {
  const { isLoginOpen, closeLogin, login, register } = useApp();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginOpen) {
    return null;
  }

  const validateLoginForm = () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    return true;
  };

  const validateRegisterForm = () => {
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return false;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      console.log('📤 Submitting login form:', { email });
      await login(email, password);
      setEmail("");
      setPassword("");
      setSuccess("✅ Login successful! Redirecting to dashboard...");
      console.log('✅ Login successful, redirecting to /system-monitor');
      
      // Show success message then redirect
      setTimeout(() => {
        setSuccess(null);
        window.location.href = '/system-monitor';
      }, 1500);
    } catch (err) {
      console.error('❌ Login submission error:', err.message);
      const errorMsg = err.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      console.log('📤 Submitting registration form:', { email, name });
      await register(name, email, password, confirmPassword);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSuccess("✅ Account created successfully! Redirecting to dashboard...");
      console.log('✅ Registration successful, redirecting to /system-monitor');
      
      // Show success message then redirect
      setTimeout(() => {
        setSuccess(null);
        setIsRegisterMode(false);
        window.location.href = '/system-monitor';
      }, 1500);
    } catch (err) {
      console.error('❌ Registration submission error:', err.message);
      const errorMsg = err.message || "Registration failed. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setIsRegisterMode(!isRegisterMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="card w-full max-w-md p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Secure access</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {isRegisterMode ? "Create Account" : "Sign In"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeLogin}
            className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
            disabled={isLoading}
          >
            Close
          </button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={isRegisterMode ? handleRegisterSubmit : handleLoginSubmit}>
          {isRegisterMode && (
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Full Name</label>
              <input
                type="text"
                className="input-field mt-2 w-full"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          )}
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Email</label>
            <input
              type="email"
              className="input-field mt-2 w-full"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Password</label>
            <input
              type="password"
              className="input-field mt-2 w-full"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          {isRegisterMode && (
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Confirm Password</label>
              <input
                type="password"
                className="input-field mt-2 w-full"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          )}
          {error && (
            <div className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (isRegisterMode ? "Creating Account..." : "Signing in...") : (isRegisterMode ? "Create Account" : "Sign In")}
          </button>
        </form>
        {success && (
          <div className="mt-4 rounded bg-green-500/10 px-3 py-3 text-sm text-green-400 border border-green-500/30 text-center animate-in fade-in">
            {success}
          </div>
        )}
        <div className="mt-4 text-center text-xs text-slate-500">
          {isRegisterMode ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                disabled={isLoading}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                disabled={isLoading}
              >
                Register
              </button>
            </>
          )}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Credentials are validated against the backend server.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
