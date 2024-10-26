import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import './Login.css';
import { Domain_URL } from '../../config';
import Cookies from 'js-cookie';

const Loginn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>(''); // State to hold error messages
  const navigate = useNavigate(); // Initialize useNavigate hook

  

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${Domain_URL}/coach/coachLogin`, { email, password });
      console.log('Login successful:', response.data);
  
      // Store the coach's email and ID in localStorage
      localStorage.setItem('coachId', response.data.coach.coachId);
      localStorage.setItem('email', response.data.coach.email);
      
      // Set the cookie with the token (assuming your backend sends it)
      if (response.data.token) {
        Cookies.set('token', response.data.token, {
          expires: 1, // Cookie expires in 1 day
          secure: true, // Set to true in production (for HTTPS)
          sameSite: 'strict', // Helps prevent CSRF attacks
        });
        console.log('Token stored in cookie:', Cookies.get('token'));
      }
  
      // Navigate to the Coach Dashboard after successful login
      navigate('/Coach-Dashboard'); // Change '/Coach-Dashboard' to your actual route
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="icon-container">
          <img src="/path-to-your-icon.png" alt="Login icon" className="login-icon" />
        </div>
        <h2>Welcome Back!</h2>
        <p>Sign in to continue</p>
        
        {/* Display the error message */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <a href="/Email-Otpp" className="forgot-password">Forgot Password?</a>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="signup-link">Don't have an account? <a href="/Coach-Signup">Sign Up</a></p> {/* Update link to /signup */}
      </div>
    </div>
  );
};

export default Loginn;
