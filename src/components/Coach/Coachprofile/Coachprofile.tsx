
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

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [orderId, setOrderId] = useState('');
  const [timer, setTimer] = useState(120);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  // State for storing validation error specific to the email field
const [emailError, setEmailError] = useState<string | null>(null); 

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
    if (!coachId) {
      setSnackbar({ open: true, message: 'Coach ID is not defined.', severity: 'error' });
      return;
    }
  
    try {
      const { emailVerified, ...dataToUpdate } = { ...coachDetails, ...updatedDetails };
  
      // Validate name
      if (!dataToUpdate.name || !/^[a-zA-Z0-9\s]+$/.test(dataToUpdate.name)) {
        setSnackbar({ open: true, message: 'Please enter a valid name (alphanumeric characters only).', severity: 'error' });
        return;
      }
  
      // Validate phone number
      if (!dataToUpdate.phoneNumber || !/^[1-9]\d{9}$/.test(dataToUpdate.phoneNumber)) {
        setSnackbar({ open: true, message: 'Please enter a valid 10-digit phone number.', severity: 'error' });
        return;
      }
  
      // Validate email
      if (!dataToUpdate.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(dataToUpdate.email)) {
        setSnackbar({ open: true, message: 'Please enter a valid email address.', severity: 'error' });
        return;
      }
  
      // If email is changed, trigger OTP verification
      if (dataToUpdate.email !== coachDetails?.email) {
        setShowOtpModal(true);
        await handleSendOTP(dataToUpdate.email as string);
        return;
      }
  
      // Update profile on the server
      await axios.put(`${Domain_URL}/coach/update/${coachId}`, dataToUpdate);
      setSnackbar({ open: true, message: 'Profile updated successfully.', severity: 'success' });
      setEditMode(false);
  
      // Fetch updated data
      const data = await fetchCoachData(coachId);
      if (data) {
        setCoachDetails(data);
        setIsEmailVerified(data.emailVerified);
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setSnackbar({ open: true, message: 'Email already registered. Please use a different email.', severity: 'error' });
      } else {
        setSnackbar({ open: true, message: 'Failed to update profile. Please try again.', severity: 'error' });
      }
      console.error('Update profile error:', error.response || error.message);
    }
  };
  
  const handleInputChange = (field: keyof CoachData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (field === 'name') {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        setNameError('Name should contain only alphabets');
      } else if (value.length < 2) {
        setNameError('Name must be at least 2 characters');
      } else {
        setNameError(null);
      }
    }

    // Function to validate an email address format
    const validateEmail = (email: string) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };


    if (field === 'email') {
      if (!validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError(null);
      }
    }
    
    
    

    if (field === 'phoneNumber') {
      if (!/^[1-9]\d{9}$/.test(value)) {
        setPhoneError('Please enter a valid 10-digit phone number that does not start with 0');
      } else {
        setPhoneError(null);
      }
    }

    setUpdatedDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSendOTP = async (email: string) => {
    try {
      const response = await axios.post<SendOtpResponse>(`${Domain_URL}/api/send-otp2`, { email });
      if (response.data.orderId) {
        setOrderId(response.data.orderId);
        setIsOtpSent(true);
        setTimer(120);
        setSnackbar({ open: true, message: 'OTP sent successfully.', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to send OTP.', severity: 'error' });
        alert('This email is already registered')
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
     // setSnackbar({ open: true, message: 'Error sending OTP.', severity: 'error' });
     alert('This email is already registered');
    }
  };

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
    <Box sx={{ p: 10,  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', borderRadius: '8px' }}>
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

      <Paper elevation={2} sx={{ p: 2, borderRadius: '5px', bgcolor: 'background.default' }}>
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
              <Box
                  sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  width: '100%',
                  overflow: 'hidden',
                  paddingRight: '8px',         // Adds right padding to avoid text cutoff
                  boxSizing: 'border-box',     // Ensures padding is accounted within the Box width
                  }}
                >
              <Star sx={{ mr: 1, flexShrink: 0 }} />
              <Typography
                variant="body1"
                      sx={{
                        color: 'black',
                        whiteSpace: 'normal',         // Allows wrapping within the grid
                        wordBreak: 'break-word',      // Breaks long words to fit within the container
                        width: '100%',                // Occupies full width of the parent Box
                        overflowWrap: 'anywhere',     // Breaks text at any point to avoid overflow
                        lineHeight: 1.5,
                      }}
                    >
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
          <Box mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={updatedDetails.name ?? coachDetails?.name ?? ''}
                  onChange={handleInputChange('name')}
                   
              disabled={!editMode}
              error={!!nameError}
              helperText={nameError}
                />
                
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  value={updatedDetails.phoneNumber ?? coachDetails?.phoneNumber ?? ''}
                  onChange={handleInputChange('phoneNumber')}
                  disabled={!editMode}
                  error={!!phoneError}
                  helperText={phoneError}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                  <TextField
                    label="Sport"
                    variant="outlined"
                    fullWidth
                    value={coachDetails?.sport } // Display current sport (non-editable)
   
                    select
                    SelectProps={{
                    native: true,
                  }}
                  >
                <option value="Cricket" >Cricket</option>
                {/* Add more sport options as necessary */}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={updatedDetails.email ?? coachDetails?.email ?? ''}
                  onChange={handleInputChange('email')}
                  error={!!emailError}
                  helperText={emailError}
                />
              </Grid>
            </Grid>

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
                Save Changes
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={showOtpModal} onClose={() => setShowOtpModal(false)}>
        <DialogTitle>Email Verification</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter OTP"
            variant="outlined"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Resend OTP in {timer} seconds
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOtpModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmOtp} color="primary">
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


