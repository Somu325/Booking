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

export default function CoachProfile() {
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

  useEffect(() => {
    const storedCoachId = localStorage.getItem('coachId');
    if (storedCoachId) {
      setCoachId(storedCoachId);
    }
  }, []);

  const fetchCoachData = async (coachId: string) => {
    try {
      const response = await axios.get(`${Domain_URL}/coach/coaches/${coachId}`);
      return response.data as CoachData; // Cast response data to CoachData
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
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: '8px' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/Coach-Dashboard')}
        variant="outlined"
        color="primary" // Changed to primary
        sx={{
          mb: 2,
          backgroundColor: '#0B6BCB',
          color: 'white',
          width: { xs: '100%', sm: 'auto' },
          '&:hover': {
            backgroundColor: '#0D8CEB', // lighter blue for hover
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
              value={updatedDetails.name || coachDetails?.name} // Added optional chaining
              onChange={handleInputChange('name')}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              inputProps={{ style: { fontSize: '1.2rem' } }}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={updatedDetails.phoneNumber || coachDetails?.phoneNumber} // Added optional chaining
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
              value={updatedDetails.sport || coachDetails?.sport} // Added optional chaining
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
              value={updatedDetails.bio || coachDetails?.bio} // Added optional chaining
              onChange={handleInputChange('bio')}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              inputProps={{ style: { fontSize: '1.2rem' } }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary" // Changed to primary
                onClick={handleUpdateProfile}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

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
