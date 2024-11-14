import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

interface DecodedToken {
  role: string;
  exp: number;
}

const ProtectedAdminRoute = () => {
  const token = Cookies.get('admintoken');

  // Check if token is missing
  if (!token) {
    return <Navigate to="/Adminlogin" />;
  }

  try {
    // Decode the token to check the role and expiration
    const decodedToken = jwtDecode<DecodedToken>(token);

    // Check if the role is "admin"
    if (decodedToken.role !== 'admin') {
      return <Navigate to="/Adminlogin" />;
    }

    // Check if the token has expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      return <Navigate to="/Adminlogin" />;
    }

    // If role and expiration are valid, render the protected component
    return <Outlet />;
  } catch (error) {
    console.error('Error decoding token:', error);
    return <Navigate to="/Adminlogin" />;
  }
};

export default ProtectedAdminRoute;
