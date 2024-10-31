// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Domain_URL } from '../../config';
// import Cookies from 'js-cookie'; // Include js-cookie for token handling
// import {
//   Box,
//   Button,
//   Input,
//   Container,
//   Link,
//   CircularProgress,
// } from '@mui/joy';
// import Email from '@mui/icons-material/Email'; // Email icon
// import Lock from '@mui/icons-material/Lock'; // Lock icon

// const Login: React.FC = () => {
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false); // Loading state
//   const [error, setError] = useState<string>(''); // Error state
//   const navigate = useNavigate(); // Initialize navigation

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEmail(e.target.value);
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true); // Enable loading state
//     setError(''); // Reset error message

//     try {
//       const response = await axios.post(
//         `${Domain_URL}/coach/coachLogin`,
//         { email, password },
//         { headers: { 'Content-Type': 'application/json' } }
//       );

//       console.log('Login successful:', response.data);

//       // Store coach data in local storage
//       localStorage.setItem('coachId', response.data.coach.coachId);
//       localStorage.setItem('email', response.data.coach.email);

//       // Store token in cookies (if provided)
//       if (response.data.token) {
//         Cookies.set('token', response.data.token, {
//           expires: 1, // 1-day expiration
//           secure: true, // Use HTTPS in production
//           sameSite: 'strict', // Prevent CSRF attacks
//         });
//         console.log('Token stored:', Cookies.get('token'));
//       }
//        if(response.data.coach.emailVerified === true){
//       navigate('/Coach-Dashboard');
      
//       }
//       else{
//        navigate('/Coach-Profile');

//       }

//       // Navigate to Coach Dashboard on success
//      // navigate('/Coach-Dashboard');
//     } catch (error) {
//       console.error('Login error:', error);
//       setError('Invalid email or password. Please try again.');
//     } finally {
//       setLoading(false); // Disable loading state
//     }
//   };

//   return (
//     <Container
//       maxWidth="sm"
//       sx={{
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginLeft: '350px',
//       }}
//     >
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: 3,
//           backgroundColor: 'background.body',
//           boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
//           borderRadius: '8px',
//           width: '400px',
//           minHeight: '400px',
//         }}
//       >

//         <h1 style={{ marginBottom: '16px', fontSize: '2rem' }}>
//           Welcome 
//         </h1>
//         <p style={{ marginBottom: '16px', color: 'gray' }}>
//           Sign in to continue
//         </p>


//         {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}

//         <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
//           <Input
//             fullWidth
//             placeholder="Email"
//             //type="email"
//             value={email}
//             onChange={handleEmailChange}
//             required
//             sx={{ mb: 2, backgroundColor: 'background.surface' }}
//             startDecorator={<Email />}
//           />
//           <Input
//             fullWidth
//             placeholder="Password"
//             type="password"
//             value={password}
//             onChange={handlePasswordChange}
//             required
//             sx={{ mb: 2, backgroundColor: 'background.surface' }}
//             startDecorator={<Lock />}
//           />
//           <Link href="/Email-Otpp" sx={{ display: 'block', mb: 2, textAlign: 'right' }}>
//             Forgot Password?
//           </Link>
//           <Button
//             type="submit"
//             fullWidth
//             variant="solid"
//             color="primary"
//             sx={{ mb: 2 }}
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size="sm" color="neutral" /> : 'Login'}
//           </Button>
//           <p style={{ textAlign: 'center', marginBottom: '16px' }}>
//             Don't have an account? <Link href="/Coach-signup">Sign Up</Link>
//           </p>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default Login;



"use client"

import  { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
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

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Enable loading state
    setError(''); // Reset error message
  
    try {
      const response = await axios.post(
        `${Domain_URL}/coach/coachLogin`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      console.log('Login successful:', response.data);
  
      // Store coach data in local storage
      localStorage.setItem('coachId', response.data.coach.coachId);
      localStorage.setItem('email', response.data.coach.email);
  
      // Store token in cookies (if provided)
      if (response.data.token) {
        Cookies.set('token', response.data.token, {
          expires: 1, // 1-day expiration
          secure: true, // Use HTTPS in production
          sameSite: 'strict', // Prevent CSRF attacks
        });
        console.log('Token stored:', Cookies.get('token'));
      }
  
      if (response.data.coach.emailVerified === true) {
        navigate('/Coach-Dashboard');
      } else {
        navigate('/coach-verify');
      }
  
    } catch (error) {
      console.error('Login error:', error);
  
      // Check for specific error responses
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status code outside the 2xx range
          if (error.response.status === 401) {
            setError('Incorrect Email OR Password');
          } else if (error.response.status === 404) {
            setError('You are not registered. Please sign up.');
          } else if (error.response.status === 500) {
            setError('The server is currently offline. Please try again later.');
          } else {
            setError('An unexpected error occurred. Please try again.');
          }
        } else if (error.request) {
          // Request was made but no response was received
          setError('No response from the server. Please check your connection.');
        } else {
          // Something happened in setting up the request
          setError('An error occurred while logging in. Please try again.');
        }
      } else {
        // Not an Axios error
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); // Disable loading state
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
                href="/Email-Otpp"
                variant="text"
                color="primary"
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
                  <Button component="a" href="/Coach-signup" variant="text" color="secondary">
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



