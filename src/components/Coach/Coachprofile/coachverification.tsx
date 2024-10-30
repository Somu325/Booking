import { useState, useEffect } from 'react';
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
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import { Domain_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import { AccountCircle, VerifiedUser } from '@mui/icons-material';

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

// Define types for response data
interface SendOtpResponse {
  orderId: string;
}

interface VerifyOtpResponse {
  message: string;
}

// Main component
export default function CoachVerificationPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [coachId, setCoachId] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [showOtpSentModal, setShowOtpSentModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(true); // Set to true to show alert on load
  const [timer, setTimer] = useState<number>(0);
  const navigate = useNavigate();

  // Load coachId and email from localStorage
  useEffect(() => {
    const storedCoachId = localStorage.getItem('coachId');
    const storedEmail = localStorage.getItem('email');
    if (storedCoachId && storedEmail) {
      setCoachId(storedCoachId);
      setEmail(storedEmail);
    } else {
      setShowAlert(true);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Send OTP
  const handleSendOTP = async () => {
    if (!email) return;

    try {
      const response = await axios.post<SendOtpResponse>(`${Domain_URL}/send-otp1`, { email });
      if (response.data.orderId) {
        setOrderId(response.data.orderId);
        setShowOtpSentModal(true);
        setTimeout(() => setShowOtpSentModal(false), 3000);
        setTimer(120); // Set 2-minute timer
        setShowEmailModal(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setShowErrorModal(true);
    }
  };

  // Confirm OTP
  const confirmOtp = async () => {
    try {
      const response = await axios.post<VerifyOtpResponse>(`${Domain_URL}/verify-otp`, { email, otp, orderId });
      if (response.data.message === 'OTP Verified Successfully!') {
        await axios.put(`${Domain_URL}/coach/update/${coachId}`, { emailVerified: true });
        setShowSuccessModal(true);
        setIsVerified(true);
        setShowEmailModal(false);
        navigate('/Coach-Dashboard');
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setShowErrorModal(true);
    }
  };

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%), url(/verification.png)',
          padding: 4,
        }}
      >
        <Box sx={{ maxWidth: 800, margin: 'auto', textAlign: 'center' }}>
          <AccountCircle sx={{ fontSize: 80, color: 'primary.main' }} />
          <Typography level="h2" component="h1" sx={{ mt: 2 }}>{email}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
            <Typography sx={{ fontSize: '20px', fontWeight: '400', fontFamily: 'Arial' }}>
              {email}
            </Typography>
            {isVerified ? (
              <VerifiedUser sx={{ marginLeft: 1, color: 'success.main' }} />
            ) : (
              <Button
                variant="plain"
                color="primary"
                onClick={handleSendOTP}
                disabled={timer > 0}
                sx={{ marginLeft: 1, backgroundColor: 'skyblue', color: 'black' }}
              >
                {timer > 0 ? `Resend OTP (${timer}s)` : 'Verify Email'}
              </Button>
            )}
          </Box>

          {!isVerified && (
            <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '20px', fontWeight: '400', fontFamily: 'Arial' }}>
              <b>Your account is almost ready.</b>
            </Typography>
          )}

          {showAlert && (
            <Card variant="outlined" sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center', // Center horizontally
                  justifyContent: 'space-between', // Space between alert and button
                  height: '100%', // Allow the content to fill the card
                }}
              >
                <Alert color="warning" sx={{ mb: 2, fontSize: '20px', textAlign: 'center' }}>
                  <b>You cannot generate slots until your email is verified. Please verify your email/phone number to continue.</b>
                </Alert>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Button
                    onClick={() => setShowAlert(false)}
                    variant="outlined"
                    sx={{ backgroundColor: 'green', color: 'black', width: '80px', marginTop: 2 }} // Add marginTop for spacing
                  >
                    OK
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Email Verification Modal */}
          <Modal open={showEmailModal} onClose={null}>
            <ModalDialog
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
              <ModalClose onClick={() => setShowEmailModal(false)} />
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
                onClick={handleSendOTP}
                disabled={timer > 0}
                sx={{ width: '100%' }}
              >
                {timer > 0 ? `Resend OTP (${timer}s)` : 'Resend OTP'}
              </Button>
            </ModalDialog>
          </Modal>

          {/* OTP Sent Modal */}
          <Modal open={showOtpSentModal} onClose={null}>
            <ModalDialog
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
              <ModalClose onClick={() => setShowOtpSentModal(false)} />
              <Typography level="h4" color="success">OTP Sent Successfully!</Typography>
            </ModalDialog>
          </Modal>

          {/* Success Modal */}
          <Modal open={showSuccessModal} onClose={null}>
            <ModalDialog
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
              <ModalClose onClick={() => setShowSuccessModal(false)} />
              <Typography level="h4" color="success">OTP Verified Successfully!</Typography>
            </ModalDialog>
          </Modal>

          {/* Error Modal */}
          <Modal open={showErrorModal} onClose={null}>
            <ModalDialog
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
              <ModalClose onClick={() => setShowErrorModal(false)} />
              <Typography level="h4" color="danger">Incorrect OTP. Try Again!</Typography>
            </ModalDialog>
          </Modal>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
