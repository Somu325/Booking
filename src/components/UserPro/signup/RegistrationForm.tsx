
"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  IconButton,
  CssVarsProvider,
  extendTheme,
} from '@mui/joy';
import { Visibility, VisibilityOff, Person, Email, Phone, Lock } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Assume Domain_URL is imported from a config file
import { Domain_URL } from '../../config';

// Custom theme
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#e0f2f1',
          100: '#b2dfdb',
          200: '#80cbc4',
          300: '#4db6ac',
          400: '#26a69a',
          500: '#009688',
          600: '#00897b',
          700: '#00796b',
          800: '#00695c',
          900: '#004d40',
        },
      },
    },
  },
  components: {
    JoyInput: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default function Component() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mobileNumberError, setMobileNumberError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = re.test(email);
    setEmailError(isValid ? null : 'Please enter a valid email address.');
    return isValid;
  };

  const validateMobileNumber = (number: string) => {
    if (number.length > 11) return;

    setMobileNumber(number);

    if (number.length < 11) {
      setMobileNumberError('Please enter a valid phone number.');
      return false;
    } else {
      setMobileNumberError(null);
      return true;
    }
  };

  const validateName = (name: string) => {
    const isValid = /^[A-Za-z\s]+$/.test(name) && name.length >= 2 && name.length <= 50;
    setNameError(isValid ? null : 'Name should contain only alphabets');
    return isValid;
  };

  const validatePassword = (password: string) => {
    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password);
    setPasswordError(isValid ? null : 'Password should contain 8-16 characters.');
    return isValid;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    const isMatch = confirmPassword === password;
    setConfirmPasswordError(isMatch ? null : 'Enter the same password.');
    return isMatch;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !mobileNumber || !password || !confirmPassword) {
      setError('All fields except name are required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (name && !validateName(name)) {
      setError('Name should be between 2 and 50 alphabetic characters.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Please enter a valid password.');
      return;
    }

    if (!validateConfirmPassword(confirmPassword)) {
      setError('Please make sure your passwords match.');
      return;
    }

    const userData = { email, name, mobileNumber, password };

    try {
      const response = await axios.post(`${Domain_URL}/user/signup`, userData);
 
  if (response.status === 201) {
    setSuccess(' User registered successfully!');
    setTimeout(() => navigate('/user-login'), 2000);
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  if (error.response) {
    // Handle specific status codes
    const { status } = error.response;

    if (status === 400) {
      setError('This email is already registered.');
    } else if (status === 404) {
      setError('The gateway is incorrect. Please check the URL.');
    } else if (status === 500) {
      setError('The server is currently offline. Please try again later.');
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
  } else if (error.request) {
    // Network error or no response received
    setError('No response from the server. Please check your connection.');
  } else {
    // Any other errors (like code issues)
    //setError(`An error occurred: ${error.message}`);
  }
  
  console.error('Error during sign-up:', error);
}
};

  return (
    <CssVarsProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 2,
          background: 'url("/placeholder.svg?height=1080&width=1920") no-repeat center center fixed',
          backgroundSize: 'cover',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
            borderRadius: 'xl',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'lg',
          }}
        >
          
          <Typography level="h4" component="h1" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
            Create an Account
          </Typography>

          {error && (
            <Alert color="danger" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert color="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}


          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Email <Typography component="span" color="danger">*</Typography></FormLabel>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              type="email"
              required
              startDecorator={<Email />}
            />
            {emailError && (
              <Typography color="danger" fontSize="sm">
                {emailError}
              </Typography>
            )}
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateName(e.target.value);
              }}
              startDecorator={<Person />}
            />
            {nameError && (
              <Typography color="danger" fontSize="sm">
                {nameError}
              </Typography>
            )}
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Mobile Number <Typography component="span" color="danger">*</Typography></FormLabel>
            <Input
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => validateMobileNumber(e.target.value)}
              type="tel"
              required
              startDecorator={<Phone />}
            />
            {mobileNumberError && (
              <Typography color="danger" fontSize="sm">
                {mobileNumberError}
              </Typography>
            )}
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Password <Typography component="span" color="danger">*</Typography></FormLabel>
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => {
                if (e.target.value.length <= 16) {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }
              }}
              type={showPassword ? 'text' : 'password'}
              required
              startDecorator={<Lock />}
              endDecorator={
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />
            {passwordError && (
              <Typography color="danger" fontSize="sm">
                {passwordError}
              </Typography>
            )}
          </FormControl>

          <FormControl sx={{ mb: 3 }}>
            <FormLabel>Confirm Password <Typography component="span" color="danger">*</Typography></FormLabel>
            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                if (e.target.value.length <= 16) {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }
              }}
              type={showConfirmPassword ? 'text' : 'password'}
              required
              startDecorator={<Lock />}
              endDecorator={
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />
            {confirmPasswordError && (
              <Typography color="danger" fontSize="sm">
                {confirmPasswordError}
              </Typography>
            )}
          </FormControl>

          <Button type="submit" fullWidth color="primary" sx={{ mb: 2 }}>
            Sign Up
          </Button>
          <Typography level="body-md" sx={{ mt: 3, textAlign: 'center' }}>
           Already have an account?{' '}
            <Typography
              component="a"
              href="/user-login"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 'bold' }}
            >
              Log In
            </Typography>
         </Typography>

        </Box>
      </Box>
    </CssVarsProvider>
  );
}
