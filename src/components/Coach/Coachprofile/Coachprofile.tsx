import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Modal,
  Paper,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  AccountCircle,
  Cake,
  Phone,
  Star,
  CheckCircle,
  Edit,
} from '@mui/icons-material';
import axios from 'axios';
import { Domain_URL } from "../../config";


interface CoachData {
  name: string;
  age: string;
  phoneNumber: string;
  profession: string;
  bio: string;
  email: string;
  gender: string;
  experience: string;
  emailVerified: boolean;
}

export default function CoachProfile() {
  const [coachId, setCoachId] = useState<string | null>(null);
  const [coachDetails, setCoachDetails] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [orderId, setOrderId] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState<Partial<CoachData>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Fetch coach ID from localStorage if available
  useEffect(() => {
    const storedCoachId = localStorage.getItem('coachId');
    if (storedCoachId) {
      setCoachId(storedCoachId);
    }
  }, []);

  const fetchCoachData = async (coachId: string) => {
    try {
      const response = await axios.get(`${Domain_URL}/coach/coaches/${coachId}`);
      return response.data;
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

  const handleSendOTP = async () => {
    if (!coachDetails?.email) return;

    setOtpLoading(true);
    try {
      const response = await axios.post(`${Domain_URL}/send-otp1`, { email: coachDetails.email });
      if (response.data.orderId) {
        setOrderId(response.data.orderId);
        setShowOtpModal(true); // Open OTP modal here
        setSnackbar({ open: true, message: 'OTP sent successfully to your email', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to send OTP', severity: 'error' });
      }
    } catch (error: any) {
      setSnackbar({ open: true, message: 'Failed to send OTP. Please try again.', severity: 'error' });
      console.error('Send OTP error:', error.response || error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setSnackbar({ open: true, message: 'Please enter the OTP', severity: 'error' });
      return;
    }

    setVerifyLoading(true);

    try {
      const response = await axios.post(`${Domain_URL}/verify-otp`, { email: coachDetails?.email, otp, orderId });
      if (response.data.message === 'OTP Verified Successfully!') {
        const updatedData = { emailVerified: true };
        await axios.put(`Domain_URL/coach/update/${coachId}`, updatedData);

        setIsEmailVerified(true);
        setSnackbar({ open: true, message: 'Email verified successfully.', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Invalid OTP or email', severity: 'error' });
      }
    } catch (error: any) {
      setSnackbar({ open: true, message: 'Failed to verify OTP. Please try again.', severity: 'error' });
      console.error('Verify OTP error:', error.response || error.message);
    } finally {
      setVerifyLoading(false);
      setShowOtpModal(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (coachId) {
      try {
        const { emailVerified, ...dataToUpdate } = { ...coachDetails, ...updatedDetails };
        await axios.put(`${Domain_URL}/coach/update/${coachId}`, dataToUpdate);
        setSnackbar({ open: true, message: 'Profile updated successfully.', severity: 'success' });
        setEditMode(false);

        const data = await fetchCoachData(coachId);
        if (data) {
          setCoachDetails(data);
          setIsEmailVerified(data.emailVerified);
        }
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading Profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <AccountCircle sx={{ fontSize: 96, color: 'text.secondary' }} />
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>{coachDetails?.name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body1" sx={{ mr: 1 }}>{coachDetails?.email}</Typography>
          {!isEmailVerified ? (
            <Button variant="contained" color="primary" onClick={handleSendOTP} disabled={otpLoading}>
              {otpLoading ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          ) : (
            <CheckCircle color="success" />
          )}
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Cake sx={{ mr: 1 }} />
              <Typography variant="body1">Age: {coachDetails?.age || ' '}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 1 }} />
              <Typography variant="body1">Phone: {coachDetails?.phoneNumber || ' '}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ mr: 1 }} />
              <Typography variant="body1">Profession: {coachDetails?.profession || ' '}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Edit />}
        onClick={() => setEditMode(true)}
      >
        Edit Profile
      </Button>

     
      <Modal open={editMode} onClose={() => setEditMode(false)}>
        <Paper sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          p: 4,
          width: '400px',
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Edit Profile</Typography>

          <TextField
            fullWidth
            label="Name"
            value={updatedDetails.name || coachDetails?.name || ''}
            onChange={handleInputChange('name')}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Age"
            value={updatedDetails.age || coachDetails?.age || ''}
            onChange={handleInputChange('age')}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={updatedDetails.phoneNumber || coachDetails?.phoneNumber || ''}
            onChange={handleInputChange('phoneNumber')}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Profession"
            value={updatedDetails.profession || coachDetails?.profession || ''}
            onChange={handleInputChange('profession')}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProfile}
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
        </Paper>
      </Modal>

    
      <Modal open={showOtpModal} onClose={() => setShowOtpModal(false)}>
        <Paper sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          p: 4,
          width: '300px',
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Verify OTP</Typography>
          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleVerifyOTP}
            disabled={verifyLoading}
          >
            {verifyLoading ? <CircularProgress size={24} /> : 'Verify'}
          </Button>
        </Paper>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
