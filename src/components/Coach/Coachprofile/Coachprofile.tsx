
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Paper,
  Grid,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  AccountCircle,
  Phone,
  Star,
  CheckCircle,
  Edit,
  Email,
  ArrowBack,
  LockClock,
} from '@mui/icons-material';
import axios from 'axios';
import { Domain_URL } from '../../config';
import { useNavigate } from 'react-router-dom';

interface CoachData {
  name: string;
  age: string;
  phoneNumber: string;
  sport: string;
  bio: string;
  email: string;
  gender: string;
  emailVerified: boolean;
}

interface SendOtpResponse {
  orderId: string;
}

interface VerifyOtpResponse {
  message: string;
}

export default function Component() {
  const [coachId, setCoachId] = useState<string | null>(null);
  const [coachDetails, setCoachDetails] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedDetails, setUpdatedDetails] = useState<Partial<CoachData>>({});
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // New state variables for OTP functionality
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [orderId, setOrderId] = useState('');
  const [timer, setTimer] = useState(120);
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    const storedCoachId = localStorage.getItem('coachId');
    if (storedCoachId) {
      setCoachId(storedCoachId);
    }
  }, []);

  const fetchCoachData = async (coachId: string) => {
    try {
      const response = await axios.get(`${Domain_URL}/coach/coaches/${coachId}`);
      return response.data as CoachData;
    } catch (error) {
      console.error('Error fetching coach data:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadCoachData = async () => {
      if (coachId) {
        setLoading(true);
        const data = await fetchCoachData(coachId);
        if (data) {
          setCoachDetails(data);
          setIsEmailVerified(data.emailVerified);
        } else {
          setSnackbar({ open: true, message: 'Coach not found.', severity: 'error' });
        }
        setLoading(false);
      }
    };
    loadCoachData();
  }, [coachId]);

  const handleUpdateProfile = async () => {
    if (coachId) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { emailVerified, ...dataToUpdate } = { ...coachDetails, ...updatedDetails };
        
        // Check if email has been changed
        if (dataToUpdate.email !== coachDetails?.email) {
          // If email has changed, show OTP modal
          setShowOtpModal(true);
          await handleSendOTP(dataToUpdate.email);
        } else {
          // If email hasn't changed, update profile directly
          await axios.put(`${Domain_URL}/coach/update/${coachId}`, dataToUpdate);
          setSnackbar({ open: true, message: 'Profile updated successfully.', severity: 'success' });
          setEditMode(false);

          const data = await fetchCoachData(coachId);
          if (data) {
            setCoachDetails(data);
            setIsEmailVerified(data.emailVerified);
          }
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setSnackbar({ open: true, message: 'Failed to update profile. Please try again.', severity: 'error' });
        console.error('Update profile error:', error.response || error.message);
      }
    } else {
      setSnackbar({ open: true, message: 'Coach ID is not defined.', severity: 'error' });
    }
  };

  const handleInputChange = (field: keyof CoachData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedDetails(prevDetails => ({
      ...prevDetails,
      [field]: event.target.value,
    }));
  };

  // Send OTP
  const handleSendOTP = async (email: string) => {
    try {
      const response = await axios.post<SendOtpResponse>(`${Domain_URL}/send-otp1`, { email });
      if (response.data.orderId) {
        setOrderId(response.data.orderId);
        setIsOtpSent(true);
        setTimer(120); // Set 2-minute timer
        setSnackbar({ open: true, message: 'OTP sent successfully.', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to send OTP.', severity: 'error' });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setSnackbar({ open: true, message: 'Error sending OTP.', severity: 'error' });
    }
  };

  // Confirm OTP
  const confirmOtp = async () => {
    try {
      const response = await axios.post<VerifyOtpResponse>(`${Domain_URL}/verify-otp`, { email: updatedDetails.email, otp, orderId });
      if (response.data.message === 'OTP Verified Successfully!') {
        await axios.put(`${Domain_URL}/coach/update/${coachId}`, { ...updatedDetails, emailVerified: true });
        setSnackbar({ open: true, message: 'Email verified and profile updated successfully.', severity: 'success' });
        setIsEmailVerified(true);
        setShowOtpModal(false);
        setEditMode(false);
        alert("New email verified. Please login with your new email and the same password.");
        navigate('/Coach-login');
      } else {
        setSnackbar({ open: true, message: 'Invalid OTP. Please try again.', severity: 'error' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setSnackbar({ open: true, message: 'Error verifying OTP.', severity: 'error' });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading Profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: '8px' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/Coach-Dashboard')}
        variant="outlined"
        color="primary"
        sx={{
          mb: 2,
          backgroundColor: '#0B6BCB',
          color: 'white',
          width: { xs: '100%', sm: 'auto' },
          '&:hover': {
            backgroundColor: '#0D8CEB',
          },
        }}
      >
        Back to Dashboard
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <AccountCircle sx={{ fontSize: 96, color: 'text.secondary' }} />
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>{coachDetails?.name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body1" sx={{ mr: 1, color: 'black' }}>{coachDetails?.email}</Typography>
          {isEmailVerified && <CheckCircle color="success" />}
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 3, maxWidth: '700px', mx: 'auto', borderRadius: '8px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Phone sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ color: 'black' }}>
                Phone: {coachDetails?.phoneNumber || ' '}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Star sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ color: 'black' }}>
                Sport: {coachDetails?.sport || ' '}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Star sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ color: 'black' }}>
                Bio: {coachDetails?.bio || 'N/A'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Email sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ color: 'black' }}>
                Gender: {coachDetails?.gender || 'N/A'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setEditMode(!editMode)}
                size="small"
                startIcon={<Edit />}
                sx={{ textTransform: 'none' }}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {editMode && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Edit Profile</Typography>
            <TextField
              label="Name"
              fullWidth
              value={updatedDetails.name || coachDetails?.name}
              onChange={handleInputChange('name')}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              inputProps={{ style: { fontSize: '1.2rem' } }}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={updatedDetails.phoneNumber || coachDetails?.phoneNumber}
              onChange={handleInputChange('phoneNumber')}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              inputProps={{ style: { fontSize: '1.2rem' } }}
            />
             <TextField
              label="Email"
              fullWidth
              value={updatedDetails.email || coachDetails?.email}
              onChange={handleInputChange('email')}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              inputProps={{ style: { fontSize: '1.2rem' } }}
            />
            <TextField
              label="Sport"
              fullWidth
              value={updatedDetails.sport || coachDetails?.sport}
              onChange={handleInputChange('sport')}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              inputProps={{ style: { fontSize: '1.2rem' } }}
            />
            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={4}
              value={updatedDetails.bio || coachDetails?.bio}
              onChange={handleInputChange('bio')}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              inputProps={{ style: { fontSize: '1.2rem' } }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateProfile}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Dialog 
        open={showOtpModal} 
        onClose={() => setShowOtpModal(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            height:'fit-content'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: 'primary.main',
          textAlign: 'center',
          pb: 2
        }}>
          Verify Your Email
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            An OTP has been sent to your new email address. Please enter it below to verify.
          </Typography>
          <TextField
            autoFocus
           
            id="otp"
            label="Enter OTP"
            type="text"
            fullWidth
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{ mb: 3 ,paddingBottom:'3px' }}
          />
          {timer > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <LockClock sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" 
              color="text.secondary">
                Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', px: 3, pb: 3 }}>
          <Button 
            onClick={confirmOtp} 
            disabled={!otp || timer === 0}
            variant="contained"
            fullWidth
            sx={{ mb: 2, py: 1.5, borderRadius: '8px' }}
          >
            Verify OTP
          </Button>
          {timer === 0 ? (
            <Button 
              onClick={() => handleSendOTP(updatedDetails.email!)}
              variant="outlined"
              fullWidth
              sx={{ py: 1.5, borderRadius: '8px' }}
            >
              Resend OTP
            </Button>
          ) : (
            <Button 
              onClick={() => setShowOtpModal(false)}
              variant="outlined"
              fullWidth
              sx={{ py: 1.5, borderRadius: '8px' }}
            >
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
