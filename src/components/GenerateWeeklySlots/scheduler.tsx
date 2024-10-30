import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import moment from 'moment';
import { Domain_URL } from '../config';

interface Slot {
  slotId: string;
  date: string; // Keep as string to match API response
  startTime: string;
  endTime: string;
  duration: number;
  slotType: string;
  coachId: string; // Added for completeness based on your data
}

const Schedule = () => {
  const [startTime, setStartTime] = useState('09:00');
  const [errorMessage, setErrorMessage] = useState('');
  const [endTime, setEndTime] = useState('10:00');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().add(7, 'days').format('YYYY-MM-DD'));
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [slotType, setSlotType] = useState('general');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly'>('daily');
  const [comment, setComment] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset relevant states when schedule type changes
  const handleScheduleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScheduleType = e.target.value as 'daily' | 'weekly';
    setScheduleType(newScheduleType);
    // Resetting states
    setSlots([]);            // Clear slots
    setSuccessMessage('');   // Clear success message
    setDaysOfWeek([]);      // Clear selected days of the week if switching to daily
    if (newScheduleType === 'daily') {
      setDate(moment().format('YYYY-MM-DD')); // Reset date to today
    } else {
      setStartDate(moment().format('YYYY-MM-DD')); // Reset start date
      setEndDate(moment().add(7, 'days').format('YYYY-MM-DD')); // Reset end date
    }
  };
  const coachid = localStorage.getItem('coachId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the payload
    const payload = {
        coachId: coachid,
        startTime,
        duration: 60,
        endTime,
        slotType,
        ...(scheduleType === 'daily'
            ? { date }
            : {
                startdate: startDate,
                enddate: endDate,
                daysOfWeek,
            }),
        ...(slotType === 'personal' && { comment }),
    };

    try {
        let endpoint;

        if (scheduleType === 'daily') {
            endpoint = `${Domain_URL}/slot/createSlot`;
        } else {
            endpoint = `${Domain_URL}/slot/create-weekly-slots`;
        }

        const response = await axios.post(endpoint, payload, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Response from API:', response.data);

        // Check if the response indicates an error based on the message
        if (response.data.message) {
            // If there's a message indicating slots exist, show it as an error
            setErrorMessage(response.data.message); // Set error message from response
            setSuccessMessage(''); // Clear any previous success messages
            return; // Early return to prevent further processing
        }

        // If we reach here, it means the operation was successful
        if (scheduleType === 'daily') {
            setSlots(response.data); // Use the entire response if it is a single slot
        }
        setSuccessMessage('Slots generated successfully!'); // Show success message
        setErrorMessage(''); // Clear any previous error messages

    } catch (error: any) {
        console.error('Error creating slots:', error);
        console.log('Full error:', error); 

        // Handle unexpected errors
        if (error.response && error.response.data) {
            setErrorMessage(error.response.data.message || 'An unexpected error occurred.'); // Set error message
        } else {
            setErrorMessage('An unexpected error occurred.'); // Fallback error message
        }
        setSuccessMessage(''); // Clear success message on error
    }
};


  return (
    <Box sx={{
      p: 3,
      borderRadius: 3,
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f5f5f5',
      maxWidth: 600,
      m: '60px auto 0 ',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <IconButton sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }} onClick={() => { /* Your back logic here */ }}>
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Create Your Schedule
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <RadioGroup
          row
          aria-label="scheduleType"
          name="scheduleType"
          value={scheduleType}
          onChange={handleScheduleTypeChange}
        >
          <FormControlLabel value="daily" control={<Radio />} label="Daily" />
          <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
        </RadioGroup>
      </FormControl>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="slotTypeLabel">Slot Type</InputLabel>
            <Select
              labelId="slotTypeLabel" id="slotType"
              value={slotType} onChange={e => setSlotType(e.target.value)}
              label="Slot Type"
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {scheduleType === 'daily' ? (
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date" type="date" value={date}
              onChange={e => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Date" type="date" value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date" type="date" value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="daysOfWeekLabel">Days of Week</InputLabel>
                <Select
                  labelId="daysOfWeekLabel" id="daysOfWeek" multiple
                  value={daysOfWeek} onChange={e => setDaysOfWeek(e.target.value as string[])}
                  renderValue={selected => selected.join(', ')}
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <MenuItem key={day} value={day}>
                      <Checkbox checked={daysOfWeek.includes(day)} />
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Time" type="time" value={startTime}
            onChange={e => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="End Time" type="time" value={endTime}
            onChange={e => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
          />
        </Grid>

        {slotType === 'personal' && (
          <Grid item xs={12}>
            <TextField
              label="Comments"
              value={comment}
              onChange={e => setComment(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 25, // Limit to 25 characters
              }}
              InputProps={{
                style: {
                  height: '56px', // This is the default height for standard TextFields
                  display: 'flex',
                  alignItems: 'center', // Centers text vertically
                },
              }}
            />
          </Grid>
        )}
      </Grid>

      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Schedule
      </Button>

      {scheduleType === 'daily' && slots.length > 0 && (
        <List sx={{ mt: 2, width: '100%' }}>
          {slots.map((slot: Slot) => (
            <ListItem key={slot.slotId}>
              <ListItemText
                primary={`${slot.startTime} - ${slot.endTime} (${slot.slotType})`}
                secondary={`Date: ${moment(slot.date).format('YYYY-MM-DD')}`} // Format date to readable form
              />
            </ListItem>
          ))}
        </List>
      )}

      {successMessage && (
        <Typography variant="body2" sx={{ color: 'green', mt: 2 }}>
          {successMessage}
        </Typography>
      )}

      {errorMessage && (
        <Typography variant="body2" sx={{ color: 'red', mt: 2 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};  

export default Schedule;