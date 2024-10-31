
"use client"

import  { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EnvelopeFill, LockFill, EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
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
});

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const { data } = await axios.post(`${Domain_URL}/user/login`, {
        email,
        password,
      });
      console.log('Login successful:', data);
  
      // Store user information in localStorage
      localStorage.setItem('email', data.user.email);
      localStorage.setItem('userId', data.user.id);
      console.log("id is", localStorage.getItem('userId'));
      console.log("verified is", data.user.verified);
  
      // Set the cookie with the user token (assuming your backend sends it)
      if (data.token) {
        Cookies.set('token', data.token, {
          expires: 1, // Cookie expires in 1 day
          secure: true, // Set to true in production (for HTTPS)
          sameSite: 'strict', // Helps prevent CSRF attacks
        });
        console.log('Token stored in cookie:', Cookies.get('token'));
      }
  
      if (data.user.verified === false) {
        navigate('/verifyemail');
      } else {
        navigate('/screen');
      }
    } catch (error) {
      console.error('Login failed:', error);
  
      // Check for specific error responses
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status code outside the 2xx range
          if (error.response.status === 401) {
            setError('Incorrect email or password.');
          } else if (error.response.status === 404) {
            setError('You are not registered. Please sign up.');
          } else if (error.response.status === 500) {
            setError('The server is currently offline. Please try again later.');
          } else {
            setError('An unexpected error occurred. Please try again.');
          }
        } else if (error.request) {
          // Request was made but no response was received
          setError('The server is currently offline. Please try again later.');
        } else {
          // Something happened in setting up the request
          setError('An error occurred while logging in. Please try again.');
        }
      } else {
        // Not an Axios error
        setError('An error occurred. Please try again later.');
      }
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
            <img src="/cric.jpg" alt="Description" width={100} height={100} style={{ marginBottom: '16px' }} />
            <Typography component="h1" variant="h4" fontWeight="bold" style={{ marginBottom: '16px' }}>
              Welcome
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" style={{ marginBottom: '16px' }}>
              Sign in to continue your journey
            </Typography>
            {error && <Alert severity="error" style={{ borderRadius: '50px', marginBottom: '16px' }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                placeholder="Enter Email.."
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

              <Button
                component="a"
                href="/Sendotp"
                variant="text"
               // color="primary"
                sx={{ textAlign: 'right', display: 'block', mt: 1 }}
              >
                Forgot Password?
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Button component="a" href="/SignUp" variant="text" color="secondary">
                    Sign Up
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );

}


