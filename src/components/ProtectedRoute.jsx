
// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../components/context/AuthContext"; 

// const ProtectedRoute = ({ children }) => {
//   const { token, loading } = useAuth();

//   if (loading) return <div>Checking authentication...</div>;

//   if (!token) return <Navigate to="/login" />;

//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const onboardingStatus = user?.onboardingStatus?.toLowerCase();
//   const path = window.location.pathname;
//   const isOnboardingRoute = path.startsWith("/onboarding");

//   if (
//     (onboardingStatus === "pending" || onboardingStatus === "inprogress") &&
//     !isOnboardingRoute
//   ) {
//     return <Navigate to="/onboarding/personal-info" replace />;
//   }

//   if (onboardingStatus === "completed" && isOnboardingRoute) {
//     return <Navigate to="/home" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import React from "react";
import { Navigate } from "react-router-dom";
import { getToken} from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const onboardingStatus = user?.onboardingStatus?.toLowerCase();
  const path = window.location.pathname;

  if (!token) return <Navigate to="/login" />;

  const isOnboardingRoute = path.startsWith("/onboarding");

  if ((onboardingStatus === "pending" || onboardingStatus === "inprogress") && !isOnboardingRoute) {
    return <Navigate to="/onboarding/personal-info" replace />;
  }

  if (onboardingStatus === "completed" && isOnboardingRoute) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;