
"use client"

import React, { useState } from 'react'
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
} from '@mui/joy'
import { Visibility, VisibilityOff, Person, Email, Phone, Lock } from '@mui/icons-material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

// Replace with your actual API URL
import { Domain_URL } from '../config';

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
})

export default function RegistrationForm() {
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!email || !mobileNumber || !password || !confirmPassword) {
      setError('Email, mobile number, and passwords are required.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const userData = { email, name, mobileNumber, password }

    try {
      const response = await axios.post(`${Domain_URL}/user/signup`, userData)
      if (response.status === 201) {
        setSuccess('User registered successfully!')
        setTimeout(() => navigate('/user-login'), 2000)
      }
    } catch (error) {
      setError('Email already registered.')
      console.error(error)
    }
  }

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
            Create Account
          </Typography>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Email <Typography component="span" color="danger">*</Typography></FormLabel>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              startDecorator={<Email />}
            />
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Name (Optional)</FormLabel>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              startDecorator={<Person />}
            />
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Mobile Number <Typography component="span" color="danger">*</Typography></FormLabel>
            <Input
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              type="tel"
              required
              startDecorator={<Phone />}
            />
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Password <Typography component="span" color="danger">*</Typography></FormLabel>
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              required
              startDecorator={<Lock />}
              endDecorator={
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />
          </FormControl>

          <FormControl sx={{ mb: 3 }}>
            <FormLabel>Confirm Password <Typography component="span" color="danger">*</Typography></FormLabel>
            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? 'text' : 'password'}
              required
              startDecorator={<Lock />}
              endDecorator={
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />
          </FormControl>

          <Button type="submit" fullWidth sx={{ mt: 2, py: 1.5 }}>
            Sign Up
          </Button>

          {error && (
            <Alert color="danger" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert color="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <Typography level="body-md" sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <Typography
              component="a"
              href="/user-login"
              fontWeight="bold"
              color="primary"
            >
              Log In
            </Typography>
          </Typography>
        </Box>
      </Box>
    </CssVarsProvider>
  )
}
