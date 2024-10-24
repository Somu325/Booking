import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from '../../config';

// const ${Domain_URL} = 'http://localhost:4000/api';

const SendOtpp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isOTPSent, setIsOTPSent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${Domain_URL}/send-otp1`, { email });
      if (response.data.orderId) {
        setOrderId(response.data.orderId);
        setIsOTPSent(true);
        setSuccess('OTP sent successfully to your email');
        localStorage.setItem('email', email);
      } else {
        setError('Failed to send OTP');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    if (!orderId) {
      setError('Order ID is missing');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${Domain_URL}/verify-otp`, {
        email,
        otp,
        orderId,
      });

      if (response.data.message === 'OTP Verified Successfully!') {
        navigate('/Reset-password');
      } else {
        setError(response.data.error || 'Invalid OTP or email');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ background: 'linear-gradient(45deg, #6A11CB 30%, #2575FC 90%)' }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: 400,
          padding: 3,
          borderRadius: 2,
          bgcolor: 'white',
          boxShadow: 3,
        }}
      >
        {!isOTPSent ? (
          <>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Send OTP
            </Typography>
            <TextField
              label="Enter your email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading || !email}
              onClick={handleSendOTP}
            >
              {loading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Verify OTP
            </Typography>
            <TextField
              label="Enter OTP"
              variant="outlined"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading || !otp}
              onClick={handleVerifyOTP}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>
          </>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default SendOtpp;
