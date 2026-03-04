import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import SystemMonitor from "./pages/SystemMonitor.jsx";
import AnomalyAnalysis from "./pages/AnomalyAnalysis.jsx";
import AlertsRecommendations from "./pages/AlertsRecommendations.jsx";
import ModelData from "./pages/ModelData.jsx";
import DeviceProfile from "./pages/DeviceProfile.jsx";
import Features from "./pages/Features.jsx";
import Docs from "./pages/Docs.jsx";
import PublicLayout from "./components/PublicLayout.jsx";
import AppLayout from "./components/AppLayout.jsx";
import AuthModal from "./components/AuthModal.jsx";
import OnboardingModal from "./components/OnboardingModal.jsx";
import { useApp } from "./context/AppContext.jsx";

const App = () => {
  const { isAuthenticated } = useApp();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Landing />
            </PublicLayout>
          }
        />
        <Route
          path="/features"
          element={
            <PublicLayout>
              <Features />
            </PublicLayout>
          }
        />
        <Route
          path="/docs"
          element={
            <PublicLayout>
              <Docs />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Home />
              </AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/system-monitor"
          element={
            isAuthenticated ? (
              <AppLayout>
                <SystemMonitor />
              </AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/anomaly-analysis"
          element={
            isAuthenticated ? (
              <AppLayout>
                <AnomalyAnalysis />
              </AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/alerts"
          element={
            isAuthenticated ? (
              <AppLayout>
                <AlertsRecommendations />
              </AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/model-data"
          element={
            isAuthenticated ? (
              <AppLayout>
                <ModelData />
              </AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/device-profile"
          element={
            isAuthenticated ? (
              <AppLayout>
                <DeviceProfile />
              </AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AuthModal />
      <OnboardingModal />
    </>
  );
};

export default App;
