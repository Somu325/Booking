// import  { useState } from 'react';
// import { Button, Alert } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';
// import { Domain_URL } from "../../config";

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   // Function to handle login
//   const handleLogin = async () => {
//     if (email && password) {
//       try {
//         const response = await axios.post(`${Domain_URL}/admins/login`, {
//           email,
//           password,
//         });

//         if (response.data.success) {
//           setSuccessMessage(`Login Successful. Welcome, ${email}`);
//           navigate('/Dashboard');
//         } else {
//           setErrorMessage(response.data.message || 'Invalid login credentials.');
//         }
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           if (error.response) {
//             setErrorMessage(error.response.data.message || 'An error occurred during login. Please try again.');
//           } else if (error.request) {
//             setErrorMessage('No response from the server. Please check your network connection.');
//           } else {
//             setErrorMessage('An error occurred while setting up the request. Please try again.');
//           }
//         } else {
//           setErrorMessage('An unexpected error occurred. Please try again.');
//         }
//       }
//     } else {
//       setErrorMessage('Please fill in all fields.');
//     }
//   };

//   return (
//     <div className="login">
//     <label>
//     <span>Username</span>
//       <input type="text" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)}required />


//     </label>
//     <div>
//     <label className='Password'>
//     <span>Password</span>
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />


//     </label>
//     {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//     </div>
//     <Button
//         variant="contained"
//         color="primary"
//         onClick={handleLogin}
//         fullWidth
//         sx={{ maxWidth: '300px', mt: 1 }} // Restrict button width for consistency
//       >
//         Login
//       </Button>
//     {errorMessage && (
//         <Alert severity="error" >
//           {errorMessage}
//         </Alert>
//       )}
//         {/* Success Message */}
//         {successMessage && (
//         <Alert severity="success" sx={{ mt: 2, maxWidth: '300px' }}>
//           {successMessage}
//         </Alert>
//       )}
    
//   </div>

      
//   );
// };

// export default Login;


import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, CircularProgress, Alert, IconButton, InputAdornment } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {  EnvelopeFill, LockFill, EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import { Domain_URL } from '../../config';
import Cookies from 'js-cookie'; 

const theme = createTheme({
  palette: {
    primary: {
      main: '#6C63FF',
    },
    secondary: {
      main: '#FF6584',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '50px',
          },
        },
      },
    },
  },
})

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const { data } = await axios.post(`${Domain_URL}/admins/login`, {
        email,
        password,
      });
  
      console.log('Login successful:', data);
  
      // Assuming the token is sent in the response, set the token in a cookie
      if (data.token) {
        Cookies.set('token', data.token, {
          expires: 1, // Cookie expires in 1 day
          secure: true, // Set to true in production (for HTTPS)
          sameSite: 'strict', // Helps prevent CSRF attacks
        });
  
        // Get the token to confirm it's set
        const token = Cookies.get('token');
        console.log('Token stored in cookie:', token);
      }
  
      // Store admin details in localStorage if needed
      localStorage.setItem('email', data.admin.email);
      localStorage.setItem('userId', data.admin.adminId);
  
      // Navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          //background: 'url("/placeholder.svg?height=1080&width=1920") no-repeat center center fixed',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          backgroundSize: 'cover',
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
               backgroundColor: 'rgba(255, 255, 255, 0.8)',
              
              backdropFilter: 'blur(10px)',
              padding: 4,
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }}
          >
            {/* {/ <Person size={64} color="#6C63FF" className="mb-4" /> /} */}
            <img src="/cric.jpg" alt="Description" className="text-primary mb-4" width={100} height={100} />
            <Typography component="h1" variant="h4" className="mb-4" fontWeight="bold">
              Welcome Back!
            </Typography>
            <Typography variant="subtitle1" className="mb-4" color="text.secondary">
              Sign in to continue your journey
            </Typography>
            {error && <Alert severity="error" className="mb-4" sx={{ borderRadius: '50px' }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                placeholder="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EnvelopeFill color="#6C63FF" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockFill color="#6C63FF" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <EyeSlashFill color="#6C63FF" /> : <EyeFill color="#6C63FF" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* <Button
                component="a"
                href="/Sendotp"
                variant="text"
                color="primary"
                className="mb-3"
                sx={{ textAlign: 'right', display: 'block', mt: 1 }}
              >
                Forgot Password?
              </Button> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                className="mb-3"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
              {/* <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Button component="a" href="/SignUp" variant="text" color="secondary">
                    Sign Up
                  </Button>
                </Typography>
              </Box> */}
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

