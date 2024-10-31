// import { useState } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Checkbox,
//   TextField,
//   Grid,
//   Button,
//   IconButton,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import moment from 'moment';
// import { Domain_URL } from '../config';
// import { ArrowBack } from '@mui/icons-material';
// // interface Slot {
// //   slotId: string;
// //   date: string; // Keep as string to match API response
// //   startTime: string;
// //   endTime: string;
// //   duration: number;
// //   slotType: string;
// //   coachId: string; // Added for completeness based on your data
// // }

// const Schedule = () => {
//   const [startTime, setStartTime] = useState('09:00');
//   const [endTime, setEndTime] = useState('10:00');
//   const [date, setDate] = useState(moment().format('MM/DD/YYYY'));
//   const [startDate, setStartDate] = useState(moment().format('MM/DD/YYYY'));
//   const [endDate, setEndDate] = useState(moment().add(7, 'days').format('MM/DD/YYYY'));
//   const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
//   const [slotType, setSlotType] = useState('general');
//   const [scheduleType, setScheduleType] = useState<'daily' | 'weekly'>('daily');
//   const [comment, setComment] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//  const navigate = useNavigate();
  
//   const handleScheduleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newScheduleType = e.target.value as 'daily' | 'weekly';
//     setScheduleType(newScheduleType);
//     setSuccessMessage('');   // Clear success message
//     setErrorMessage('');     // Clear error message
//     setDaysOfWeek([]);      // Clear selected days of the week if switching to daily
//     if (newScheduleType === 'daily') {
//       setDate(moment().format('MM/DD/YYYY')); // Reset date to today
//     } else {
//       setStartDate(moment().format('MM/DD/YYYY')); // Reset start date
//       setEndDate(moment().add(7, 'days').format('MM/DD/YYYY')); // Reset end date
//     }
//   };

//   const coachid = localStorage.getItem('coachId');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validation: Check end time is after start time
//     if (moment(endTime, "HH:mm").isBefore(moment(startTime, "HH:mm"))) {
//       setErrorMessage("End time must be after start time.");
//       return;
//     }

//     // Prepare the payload
//     const payload = {
//       coachId: coachid,
//       startTime,
//       duration: 60,
//       endTime,
//       slotType,
//       ...(scheduleType === 'daily'
//           ? { date: moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD') } // Format date for API
//           : {
//               startdate: moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD'), // Format start date for API
//               enddate: moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD'), // Format end date for API
//               daysOfWeek,
//           }),
//     };

//     try {
//       let endpoint;

//       if (scheduleType === 'daily') {
//         endpoint = `${Domain_URL}/slot/createSlot`;
//       } else {
//         endpoint = `${Domain_URL}/slot/create-weekly-slots`;
//       }

//       const response = await axios.post(endpoint, payload, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       console.log('Response from API:', response.data);

//       if (response.data.message) {
//         setErrorMessage(response.data.message); // Set error message from response
//         setSuccessMessage(''); // Clear any previous success messages
//         return; // Early return to prevent further processing
//       }

//       setSuccessMessage('Slots generated successfully!'); // Show success message
//       setErrorMessage(''); // Clear any previous error messages

//     } catch (error: any) {
//       console.error('Error creating slots:', error);
//       console.log('Full error:', error);

//       if (error.response && error.response.data) {
//         setErrorMessage(error.response.data.message || 'An unexpected error occurred.'); // Set error message
//       } else {
//         setErrorMessage('An unexpected error occurred.'); // Fallback error message
//       }
//       setSuccessMessage(''); // Clear success message on error
//     }
//   };

//   return (
//     <Box sx={{
//       p: 3,
//       borderRadius: 3,
//       boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
//       backgroundColor: '#f5f5f5',
//       maxWidth: 600,
//       m: '60px auto 0 ',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center'
//     }}>
//      <IconButton
//       sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}
//         onClick={() => navigate('/Coach-Dashboard')}
//       >
//    <ArrowBack />
//       </IconButton>

//       <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//         Create Your Schedule
//       </Typography>

//       <FormControl component="fieldset" sx={{ mb: 2 }}>
//         <RadioGroup
//           row
//           aria-label="scheduleType"
//           name="scheduleType"
//           value={scheduleType}
//           onChange={handleScheduleTypeChange}
//         >
//           <FormControlLabel value="daily" control={<Radio />} label="Daily" />
//           <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
//         </RadioGroup>
//       </FormControl>

//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel id="slotTypeLabel">Slot Type</InputLabel>
//             <Select
//               labelId="slotTypeLabel" id="slotType"
//               value={slotType} onChange={e => setSlotType(e.target.value)}
//               label="Slot Type"
//             >
//               <MenuItem value="general">General</MenuItem>
//               <MenuItem value="personal">Personal</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>

//         {scheduleType === 'daily' ? (
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Date" type="date" value={moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD')}
//               onChange={e => setDate(moment(e.target.value).format('MM/DD/YYYY'))}
//               InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
//             />
//           </Grid>
//         ) : (
//           <>
//             <Grid item xs={12} container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Start Date" type="date" value={moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
//                   onChange={e => setStartDate(moment(e.target.value).format('MM/DD/YYYY'))}
//                   InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="End Date" type="date" value={moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
//                   onChange={e => setEndDate(moment(e.target.value).format('MM/DD/YYYY'))}
//                   InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
//                 />
//               </Grid>
//             </Grid>
//             <Grid item xs={12}>
//               <FormControl fullWidth sx={{ mb: 2 }}>
//                 <InputLabel id="daysOfWeekLabel">Days of Week</InputLabel>
//                 <Select
//                   labelId="daysOfWeekLabel" id="daysOfWeek" multiple
//                   value={daysOfWeek} onChange={e => setDaysOfWeek(e.target.value as string[])}
//                   renderValue={selected => selected.join(', ')}
//                 >
//                   {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
//                     <MenuItem key={day} value={day}>
//                       <Checkbox checked={daysOfWeek.includes(day)} />
//                       {day}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//           </>
//         )}

//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="Start Time" type="time" value={startTime}
//             onChange={e => setStartTime(e.target.value)}
//             InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="End Time" type="time" value={endTime}
//             onChange={e => setEndTime(e.target.value)}
//             InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
//           />
//         </Grid>

//         <Grid item xs={12}>
//           {slotType === 'personal' && (
//             <TextField
//               label="Comment" multiline rows={4} value={comment}
//               onChange={e => setComment(e.target.value)}
//               fullWidth sx={{ mb: 2 }}
//             />
//           )}
//           <Typography variant="body2" sx={{ color: 'gray', mt: 1 }} hidden={slotType !== 'personal'}>
//             Note: You can generate slots per day for daily scheduling.
//           </Typography>
//         </Grid>
//       </Grid>

//       {errorMessage && (
//         <Typography variant="body2" sx={{ color: 'red', mt: 2 }}>
//           {errorMessage}
//         </Typography>
//       )}
//       {successMessage && (
//         <Typography variant="body2" sx={{ color: 'green', mt: 2 }}>
//           {successMessage}
//         </Typography>
//       )}

//       <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3 }}>
//         Submit
//       </Button>
//     </Box>
//   );
// };

// export default Schedule;



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
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import moment from 'moment';
import { Domain_URL } from '../config';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// interface Slot {
//   slotId: string;
//   date: string; // Keep as string to match API response
//   startTime: string;
//   endTime: string;
//   duration: number;
//   slotType: string;
//   coachId: string; // Added for completeness based on your data
// }

const Schedule = () => {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [date, setDate] = useState(moment().format('MM/DD/YYYY'));
  const [startDate, setStartDate] = useState(moment().format('MM/DD/YYYY'));
  const [endDate, setEndDate] = useState(moment().add(7, 'days').format('MM/DD/YYYY'));
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [slotType, setSlotType] = useState('general');
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly'>('daily');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
 const navigate = useNavigate();
  
  const handleScheduleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScheduleType = e.target.value as 'daily' | 'weekly';
    setScheduleType(newScheduleType);
    setSuccessMessage('');   // Clear success message
    setErrorMessage('');     // Clear error message
    setDaysOfWeek([]);      // Clear selected days of the week if switching to daily
    if (newScheduleType === 'daily') {
      setDate(moment().format('MM/DD/YYYY')); // Reset date to today
    } else {
      setStartDate(moment().format('MM/DD/YYYY')); // Reset start date
      setEndDate(moment().add(7, 'days').format('MM/DD/YYYY')); // Reset end date
    }
  };

  const coachid = localStorage.getItem('coachId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check end time is after start time
    if (moment(endTime, "HH:mm").isBefore(moment(startTime, "HH:mm"))) {
      setErrorMessage("End time must be after start time.");
      return;
    }

    // Prepare the payload
    const payload = {
      coachId: coachid,
      startTime,
      duration: 60,
      endTime,
      slotType,
      ...(scheduleType === 'daily'
          ? { date: moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD') } // Format date for API
          : {
              startdate: moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD'), // Format start date for API
              enddate: moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD'), // Format end date for API
              daysOfWeek,
          }),
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

      if (response.data.message) {
        setErrorMessage(response.data.message); // Set error message from response
        setSuccessMessage(''); // Clear any previous success messages
        return; // Early return to prevent further processing
      }

      setSuccessMessage('Slots generated successfully!'); // Show success message
      setErrorMessage(''); // Clear any previous error messages

    } catch (error: any) {
      console.error('Error creating slots:', error);
      console.log('Full error:', error);

      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Slots already exist for the specified date and time range.'); // Set error message
      } else {
        setErrorMessage('Slots already exist for the specified date and time range.'); // Fallback error message
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
     <IconButton
      sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}
        onClick={() => navigate('/Coach-Dashboard')}
      >
   <ArrowBack />
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
              label="Date" type="date" value={moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD')}
              onChange={e => setDate(moment(e.target.value).format('MM/DD/YYYY'))}
              InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Date" type="date" value={moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
                  onChange={e => setStartDate(moment(e.target.value).format('MM/DD/YYYY'))}
                  InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date" type="date" value={moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
                  onChange={e => setEndDate(moment(e.target.value).format('MM/DD/YYYY'))}
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

        <Grid item xs={12}>
          {slotType === 'personal' && (
            <TextField
              label="Comment" multiline rows={4} value={comment}
              onChange={e => setComment(e.target.value)}
              fullWidth sx={{ mb: 2 }}
            />
          )}
          <Typography variant="body2" sx={{ color: 'gray', mt: 1 }} hidden={slotType !== 'personal'}>
            Note: You can generate slots per day for daily scheduling.
          </Typography>
        </Grid>
      </Grid>

      {errorMessage && (
        <Typography variant="body2" sx={{ color: 'red', mt: 2 }}>
          {errorMessage}
        </Typography>
      )}
      {successMessage && (
        <Typography variant="body2" sx={{ color: 'green', mt: 2 }}>
          {successMessage}
        </Typography>
      )}

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3 }}>
        Submit
      </Button>
    </Box>
  );
};

export default Schedule;

