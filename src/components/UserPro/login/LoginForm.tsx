
"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, CircularProgress, Alert, IconButton, InputAdornment } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {  EnvelopeFill, LockFill, EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import { Domain_URL } from '../config';

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
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await axios.post(`${Domain_URL}/user/login`, {
        email,
        password,
      })

      console.log('Login successful:', data)
      localStorage.setItem('email', data.user.email)
      localStorage.setItem('userId', data.user.userId)

      navigate('/screen')
    } catch (error) {
      console.error('Login failed:', error)
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

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
              <Button
                component="a"
                href="/Sendotp"
                variant="text"
                color="primary"
                className="mb-3"
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
                className="mb-3"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
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
  )
}
