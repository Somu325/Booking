import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface DecodedToken {
  role: string;
  exp: number;
}

const ProtectedCoachRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = Cookies.get('Coachtoken'); // Cookie for coach

  console.log('Token:', token); // Debugging token
  
  if (!token) {
    console.log('No token found, redirecting to /Coach-login');
    return <Navigate to="/Coach-login" />;
  }

  try {
    // Decode token to check role
    const decodedToken: DecodedToken = jwtDecode(token);
    console.log('Decoded Token:', decodedToken); // Debugging decoded token

    const coachRole = decodedToken.role;
    
    // Check if the role is coach
    if (coachRole !== 'coach') {
      console.log('User is not a coach, redirecting to /Coach-login');
      return <Navigate to="/Coach-login" />;
    }

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      console.log('Token expired, redirecting to /Coach-login');
      return <Navigate to="/Coach-login" />;
    }

    // Allow access to the protected route
    return <>{children}</>; // Render children components
  } catch (error) {
    console.error('Error decoding token:', error);
    return <Navigate to="/Coach-login" />;
  }
};

export default ProtectedCoachRoute;
