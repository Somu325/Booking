

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CssVarsProvider,
  extendTheme,
  Box,
  Button,
  Typography,
  Input,
  Modal,
  CssBaseline,
  Alert,
  Card,
  CardContent,
} from '@mui/joy';
import { AccountCircle, VerifiedUser } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import { Domain_URL } from '../../config';

// Interfaces for TypeScript
interface User {
  userId: string;
  name: string;
  age: number;
  mobileNumber: string;
  email: string;
  gender: string;
  password: string;
  verified: boolean;
  children?: { childId: string; name: string; age: number; gender: string }[];
}

interface EmailVerificationData {
  orderId: string;
}

// Custom theme configuration
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: { body: 'rgba(255, 255, 255, 0.8)' },
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
      },
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: { borderRadius: '12px', textTransform: 'none', fontWeight: 600 },
      },
    },
    JoyInput: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(255, 255, 255, 0.5)' },
      },
    },
  },
});

// Error boundary to handle component errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Typography color="danger">Something went wrong. Please try again later.</Typography>;
    }
    return this.props.children;
  }
}

// Main component
export default function VerifyProfile({ userEmail = '' }: { userEmail?: string }) {
  const [email, setEmail] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailVerificationData, setEmailVerificationData] = useState<EmailVerificationData>({ orderId: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showOtpSentModal, setShowOtpSentModal] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(localStorage.getItem('email'));
    }
  }, []);

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${Domain_URL}/user/email/${userEmail || email}`);
      const data: User = response.data;
      if (data) {
        setUserData(data);
        setIsEmailVerified(data.verified ?? false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail, email]);

  useEffect(() => {
    if (!isEmailVerified) {
      setShowAlert(true);
    } else {
      navigate('/screen');
    }
  }, [isEmailVerified, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Verify email by sending OTP
  const verifyEmail = async () => {
    try {
      const response = await axios.post(`${Domain_URL}/api/send-otp1`, { email: userData?.email });
      setEmailVerificationData(response.data);
      setShowOtpSentModal(true);
      setTimeout(() => setShowOtpSentModal(false), 3000);
      setTimer(120); // Set 2-minute timer
      setShowEmailModal(true); // Open the email modal after sending OTP
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  };

  // Confirm OTP and update verification status
  const confirmOtp = async () => {
    try {
      const response = await axios.post(`${Domain_URL}/api/verify-otp`, {
        email: userData?.email,
        otp,
        orderId: emailVerificationData.orderId,
      });

      if (response.status === 200) {
        await updateVerifiedStatus();
        setShowSuccessModal(true);
        setIsEmailVerified(true);
        setShowEmailModal(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setShowErrorModal(true);
    }
  };

  const updateVerifiedStatus = async () => {
    try {
      await axios.put(`${Domain_URL}/user/email/${userData?.email}`, { verified: true });
    } catch (error) {
      console.error('Error updating verified status:', error);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <ErrorBoundary>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%), url(/verfication.png)', padding: 4 }}>
          <Box sx={{ maxWidth: 800, margin: 'auto', textAlign: 'center' }}>
            <AccountCircle sx={{ fontSize: 80, color: 'primary.main' }} />
            <Typography level="h2" component="h1" sx={{ mt: 2 }}>{userData?.name || 'User'}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1, fontSize: '20px', fontWeight: '400', fontFamily: 'Arial' }}>
              <Typography sx={{ fontSize: '20px', fontWeight: '400', fontFamily: 'Arial' }}>{userData?.email || userEmail || email}</Typography>
              {isEmailVerified ? (
                <VerifiedUser sx={{ marginLeft: 1, color: 'success.main' }} />
              ) : (
                <Button 
                  variant="plain" 
                  color="primary" 
                  onClick={verifyEmail} 
                  disabled={timer > 0}
                  sx={{ marginLeft: 1, backgroundColor:'skyblue' , color: 'black' }}
                >
                  {timer > 0 ? `Resend OTP (${timer}s)` : 'Verify Email'}
                </Button>
              )}
            </Box>

            {!isEmailVerified && (
              <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '20px', fontWeight: '400', fontFamily: 'Arial' }}>
                <b>Your account is almost ready.</b>
              </Typography>
            )}

            {showAlert && (
              <Card variant="outlined" sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <CardContent>
                  <Alert color="warning" sx={{ mb: 2, fontSize:'20px'}}>
                    <b>You cannot book a slot until your email/phone number is verified. Please verify your email/phone number to continue.</b>
                  </Alert>
                  <Button onClick={handleCloseAlert} variant="outlined" sx={{ backgroundColor: 'green',color:'black', width:'80px',marginLeft:'350px'}}>OK</Button>
                </CardContent>
              </Card>
            )}

            <Modal open={showEmailModal} onClose={() => setShowEmailModal(false)}>
              <ModalDialog sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <ModalClose />
                <Typography level="h4">Verify Your Email</Typography>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Input 
                    placeholder="Enter OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)}
                    sx={{ width: '100%', mb: 2 }}
                  />
                  <Button onClick={confirmOtp} sx={{ width: '100%' }}>Verify OTP</Button>
                </Box>
                <Button 
                  onClick={verifyEmail} 
                  disabled={timer > 0}
                  sx={{ width: '100%' }}
                >
                  {timer > 0 ? `Resend OTP (${timer}s)` : 'Resend OTP'}
                </Button>
              </ModalDialog>
            </Modal>

            <Modal open={showOtpSentModal} onClose={() => setShowOtpSentModal(false)}>
              <ModalDialog sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <ModalClose />
                <Typography level="h4" color="success">OTP Sent Successfully!</Typography>
              </ModalDialog>
            </Modal>

            <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
              <ModalDialog sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <ModalClose />
                <Typography level="h4" color="success">OTP Verified Successfully!</Typography>
              </ModalDialog>
            </Modal>

            <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)}>
              <ModalDialog sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <ModalClose />
                <Typography level="h4" color="danger">Incorrect OTP. Try Again!</Typography>
              </ModalDialog>
            </Modal>
          </Box>
        </Box>
      </CssVarsProvider>
    </ErrorBoundary>
  );
}