
'use client'

import { useState, useEffect } from 'react'
import { Box, Typography, Input, Button, Alert, CssVarsProvider, extendTheme } from '@mui/joy'
import { Email, Lock, ArrowForward, ArrowBack } from '@mui/icons-material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { Domain_URL } from '../../config'

//Custom theme configuration for Material-UI Joy

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
    },
  },
  components: {
    JoyInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
          },
        },
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
})


// Mock UserContext hook for setting user email
const useUserContext = () => ({
  setUserEmail: (email: string) => console.log('Setting user email:', email),
})

export default function SendEmailOTP() {
  // State variables for form inputs and UI control
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOTPSent, setIsOTPSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)

  // Custom hook for setting user email
  const { setUserEmail } = useUserContext()
  // Hook for programmatic navigation
  const navigate = useNavigate()

  // Effect hook for managing the resend OTP timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  // Function to handle sending OTP
  const handleSendOTP = async () => {
    // Input validation
    if (!email) {
      setError('Please enter your email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Invalid email format')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // API call to send OTP
     
      const response = await axios.post(`${Domain_URL}/api/send-otp1`, { email })
      
      if (response.data.orderId) {
        setOrderId(response.data.orderId)
        setIsOTPSent(true)
        setSuccess('OTP sent successfully to your email')
        localStorage.setItem('email', email)
        setTimer(120) // Set timer for 2 minutes
      } else {
        setError('Failed to send OTP')
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Function to handle OTP verification
  const handleVerifyOTP = async () => {
    // Input validation
    if (!otp) {
      setError('Please enter the OTP')
      return
    }

    if (!orderId) {
      setError('Order ID is missing')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // API call to verify OTP
      const response = await axios.post(`${Domain_URL}/api/verify-otp`, {
        email,
        otp,
        orderId,
      })

      if (response.data.message === 'OTP Verified Successfully!') {
        setUserEmail(email)
        navigate('/ResetPassword')
      } else {
        setError(response.data.error || 'Invalid OTP or email')
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  // Function to navigate back to login page
  const handleBackToLogin = () => {
    navigate('/user-login')
  }

  return (
    <CssVarsProvider theme={theme}>
      <Box
        sx={{
          // Styles for the main container
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Box
          sx={{
            // Styles for the form container
            width: '90%',
            maxWidth: 450,
            p: 4,
            borderRadius: '16px',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          {/* Title of the form */}
          <Typography level="h3" component="h1" sx={{ mb: 3, textAlign: 'center', fontWeight: 800, color: 'primary.700' }}>
            {!isOTPSent ? 'Reset Password' : 'Verify OTP'}
          </Typography>
          {/* Description text */}
          <Typography level="body-md" sx={{ mb: 4, textAlign: 'center', color: 'neutral.600' }}>
            {!isOTPSent ? 'Enter your email to receive a one-time password' : `Enter the OTP sent to ${email}`}
          </Typography>
          {!isOTPSent ? (
            <>
              {/* Email input field */}
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                startDecorator={<Email sx={{ color: 'primary.500' }} />}
                sx={{ mb: 3 }}
              />
              {/* Send OTP button */}
              <Button
                fullWidth
                loading={loading}
                disabled={loading || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                onClick={handleSendOTP}
                endDecorator={<ArrowForward />}
                sx={{ py: 1.5, bgcolor: 'primary.600', '&:hover': { bgcolor: 'primary.700' } }}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </>
          ) : (
            <>
              {/* OTP input field */}
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                startDecorator={<Lock sx={{ color: 'primary.500' }} />}
                sx={{ mb: 3 }}
              />
              {/* Verify OTP button */}
              <Button
                fullWidth
                loading={loading}
                disabled={loading || !otp}
                onClick={handleVerifyOTP}
                endDecorator={<ArrowForward />}
                sx={{ py: 1.5, bgcolor: 'primary.600', '&:hover': { bgcolor: 'primary.700' } }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              {/* Resend OTP timer or button */}
              {timer > 0 ? (
                <Typography level="body-sm" sx={{ mt: 2, textAlign: 'center', color: 'primary.600' }}>
                  Resend OTP in {timer} seconds
                </Typography>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleSendOTP}
                  sx={{ mt: 2, py: 1.5 }}
                >
                  Resend OTP
                </Button>
              )}
            </>
          )}
          {/* Error message display */}
          {error && (
            <Alert color="danger" variant="soft" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
          {/* Success message display */}
          {success && (
            <Alert color="success" variant="soft" sx={{ mt: 3 }}>
              {success}
            </Alert>
          )}
          {/* Back to Login button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleBackToLogin}
            startDecorator={<ArrowBack />}
            sx={{ mt: 3, py: 1.5 }}
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    </CssVarsProvider>
  )
}


