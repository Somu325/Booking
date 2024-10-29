import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  LocalizationProvider,
  TimePicker,
  DatePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import axios from 'axios';
import { Domain_URL } from '../../config';
// import { WidthFull } from '@mui/icons-material';

// Helper functions
const convertTo12HourFormat = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
};

const convertTo24HourFormat = (time: string): string => {
  const [timePart, modifier] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const generateSlots = (date: string, startTime: string, endTime: string, duration: number) => {
  const slots: any[] = [];
  const startDateTime = new Date(`${date}T${convertTo24HourFormat(startTime)}`);
  const endDateTime = new Date(`${date}T${convertTo24HourFormat(endTime)}`);

  const totalTimeInHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
  if (totalTimeInHours > 12) {
    console.error('Error: The time range from start to end cannot exceed 12 hours.');
    return [];
  }

  let currentStartTime = startDateTime;
  const durationInMilliseconds = duration * 60 *  1000;

  while (currentStartTime < endDateTime) {
    const currentEndTime = new Date(currentStartTime.getTime() + durationInMilliseconds);

    if (currentEndTime <= endDateTime) {
      slots.push({
        date,
        startTime: convertTo12HourFormat(currentStartTime.toTimeString().substring(0, 5)),
        endTime: convertTo12HourFormat(currentEndTime.toTimeString().substring(0, 5)),
      });
    }

    currentStartTime = currentEndTime;
  }

  return slots;
};

const TimeSlotPicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [duration, setDuration] = useState<number>(60);
  const [category, setCategory] = useState<string>('General');
  const [comments, setComments] = useState<string>(''); 
  const [generatedSlots, setGeneratedSlots] = useState<any[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  const coachid = localStorage.getItem('coachId');

  const handleGenerateSlots = () => {
    if (!startTime || !endTime || !selectedDate) {
      setSnackbarMessage('Please fill in all fields to generate slots.');
      setSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const startTimeString = startTime.format('HH:mm');
    const endTimeString = endTime.format('HH:mm');

    if (startTime.isAfter(endTime)) {
      setSnackbarMessage('End time must be after start time.');
      setSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const newGeneratedSlots = generateSlots(selectedDate.format('YYYY-MM-DD'), startTimeString, endTimeString, duration);

    if (newGeneratedSlots.length === 0) {
      setSnackbarMessage('No valid slots generated! Please check your time range.');
      setSeverity('error');
      setOpenSnackbar(true);
    } else {
      setGeneratedSlots(newGeneratedSlots);
      setSnackbarMessage('Slots generated successfully!');
      setSeverity('success');
      setOpenSnackbar(true);
    }
  };

  const handleSubmitSlots = async () => {
    if (generatedSlots.length === 0) {
      setSnackbarMessage('No slots generated! Please generate slots before submitting.');
      setSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);
    try {
      for (const slot of generatedSlots) {
        const slotData = {
          coachId: coachid,
          startTime: convertTo24HourFormat(slot.startTime),
          endTime: convertTo24HourFormat(slot.endTime),
          duration: duration,
          date: selectedDate?.format('YYYY-MM-DDTHH:mm:ss[Z]'),
          status: 'available',
          slotType: category.toLowerCase(),
          comments: category === 'Personal' ? comments : '', 
        };

        const response = await axios.post(`${Domain_URL}/slot/createSlot`, slotData);
        if (response.status !== 201) {
          throw new Error('Error creating slot');
        }
      }

      setSnackbarMessage('Slots generated and saved successfully!');
      setSeverity('success');
      resetForm();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error submitting slots. Please try again.';
      setSnackbarMessage(errorMessage);
      setSeverity('error');
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setSelectedDate(null);
    setStartTime(null);
    setEndTime(null);
    setDuration(60);
    setCategory('General');
    setComments('');
    setGeneratedSlots([]);
  };

  const handleSnackbarClose = (reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400, boxShadow: 3, padding: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            Pick Your Time
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Category"
                select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setStartTime(null);
                  setEndTime(null);
                }}
                fullWidth
              >
                {['General', 'Personal'].map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {category === 'Personal' && (
              <Grid item xs={12}>
                <TextField
                  label="Comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                />
              </Grid>
            )}

         <Grid item xs={12}>
  <DatePicker
    label="Select Date"
    value={selectedDate}
    onChange={(newDate) => setSelectedDate(newDate)}
    sx={{
      width: '100%',
      '& .MuiInputBase-input': {
        paddingTop: '14px',   // Adjust top padding
        paddingBottom: '14px', // Adjust bottom padding
      },
      '& .MuiInputLabel-root': {
        transform: 'translate(14px, 12px) scale(1)',  // Adjust label position
      },
      '& .MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)', // Adjust label when focused
      },
    }}
    // inputFormat="MM/DD/YYYY"
    // renderInput={(params) => <TextField {...params} fullWidth />}
  />
</Grid>

<Grid item xs={12}>
  <TimePicker
    label="Start Time"
    value={startTime}
    onChange={(newTime) => setStartTime(newTime)}
    sx={{
      width: '100%',
      '& .MuiInputBase-input': {
        paddingTop: '14px',   // Adjust top padding
        paddingBottom: '14px', // Adjust bottom padding
      },
      '& .MuiInputLabel-root': {
        transform: 'translate(14px, 12px) scale(1)',  // Adjust label position
      },
      '& .MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)', // Adjust label when focused
      },
    }}
    // renderInput={(params) => <TextField {...params} fullWidth />}
  />
    </Grid>
    <Grid item xs={12}>
      <TimePicker
       label="End Time"
       value={endTime}
       onChange={(newTime) => setEndTime(newTime)}
        sx={{
        width: '100%',
        '& .MuiInputBase-input': {
        paddingTop: '14px',   // Adjust top padding
        paddingBottom: '14px', // Adjust bottom padding
      },
      '& .MuiInputLabel-root': {
        transform: 'translate(14px, 12px) scale(1)',  // Adjust label position
      },
      '& .MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)', // Adjust label when focused
         },
         }}
    // renderInput={(params) => <TextField {...params} fullWidth />}
         />
         </Grid>
        
            <Grid item xs={12} >
            <TextField
          disabled
          id="outlined-disabled"
          label="Duration"
          defaultValue="1HR"
          sx={{
            width: '100%'}}        />
            </Grid>



            <Grid item xs={12} container spacing={1}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleGenerateSlots}
                  disabled={isLoading}
                >
                  Generate Slots
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  color="success"
                  onClick={handleSubmitSlots}
                  disabled={isLoading}
                >
                  Submit Slots
                </Button>
              </Grid>
              {generatedSlots.length > 0 && (
            <List>
              {generatedSlots.map((slot, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={` ${slot.startTime} - ${slot.endTime}`}
                    secondary={category === 'Personal' ? comments : ''}
                  />
                </ListItem>
              ))}
            </List>
          )}

            </Grid>
          </Grid>
         <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => handleSnackbarClose()}>
          <Alert onClose={() => handleSnackbarClose()} severity={severity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default TimeSlotPicker;
