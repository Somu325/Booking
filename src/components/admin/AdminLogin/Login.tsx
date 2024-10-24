import  { useState } from 'react';
import { Button, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Domain_URL } from "../../config";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await axios.post(`${Domain_URL}/admins/login`, {
          email,
          password,
        });

        if (response.data.success) {
          setSuccessMessage(`Login Successful. Welcome, ${email}`);
          navigate('/Dashboard');
        } else {
          setErrorMessage(response.data.message || 'Invalid login credentials.');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setErrorMessage(error.response.data.message || 'An error occurred during login. Please try again.');
          } else if (error.request) {
            setErrorMessage('No response from the server. Please check your network connection.');
          } else {
            setErrorMessage('An error occurred while setting up the request. Please try again.');
          }
        } else {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
      }
    } else {
      setErrorMessage('Please fill in all fields.');
    }
  };

  return (
    <div className="login">
    <label>
    <span>Username</span>
      <input type="text" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)}required />


    </label>
    <div>
    <label className='Password'>
    <span>Password</span>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />


    </label>
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
    <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        fullWidth
        sx={{ maxWidth: '300px', mt: 1 }} // Restrict button width for consistency
      >
        Login
      </Button>
    {errorMessage && (
        <Alert severity="error" >
          {errorMessage}
        </Alert>
      )}
        {/* Success Message */}
        {successMessage && (
        <Alert severity="success" sx={{ mt: 2, maxWidth: '300px' }}>
          {successMessage}
        </Alert>
      )}
    
  </div>

      
  );
};

export default Login;
