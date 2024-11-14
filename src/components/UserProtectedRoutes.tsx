// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
interface ProtectedRouteProps {
  children: React.ReactNode;
  role: string; // required role to access the route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const token = Cookies.get("Usertoken");

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/user-login" />;
  }

  try {
    // Decode the token to get the user's role
    const decodedToken: any = jwtDecode(token);
    const userRole = decodedToken.role;

    // Check if the user role matches the required role
    if (userRole === role) {
      return <>{children}</>; // Render the protected component
    } else {
      // If role doesn’t match, redirect to a "not authorized" page or login
      return <Navigate to="/user-login" />;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/user-login" />;
  }
};

export default ProtectedRoute;
