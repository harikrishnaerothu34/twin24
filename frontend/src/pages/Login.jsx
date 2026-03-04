import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import Landing from "./Landing.jsx";

const Login = () => {
  const { openLogin, isAuthenticated } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      openLogin();
    }
  }, [openLogin, isAuthenticated]);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Landing />;
};

export default Login;
