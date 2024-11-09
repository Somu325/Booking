// // import { useState } from 'react';
// // import axios from 'axios';
// // import {
// //   Box,
// //   Typography,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Checkbox,
// //   TextField,
// //   Grid,
// //   Button,
// //   IconButton,
// //   RadioGroup,
// //   FormControlLabel,
// //   Radio,
// // } from '@mui/material';
// // import moment from 'moment';
// // import { Domain_URL } from '../config';
// // import { ArrowBack } from '@mui/icons-material';
// // import { useNavigate } from 'react-router-dom';

// // const Schedule = () => {
// //   const [startTime, setStartTime] = useState('09:00');
// //   const [endTime, setEndTime] = useState('10:00');
// //   const [date, setDate] = useState(moment().format('MM/DD/YYYY'));
// //   const [startDate, setStartDate] = useState(moment().format('MM/DD/YYYY'));
// //   const [endDate, setEndDate] = useState(moment().add(7, 'days').format('MM/DD/YYYY'));
// //   const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
// //   const [slotType, setSlotType] = useState('general');
// //   const [scheduleType, setScheduleType] = useState<'daily' | 'weekly'>('daily');
// //   const [comment, setComment] = useState('');
// //   const [errorMessage, setErrorMessage] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');
// //   const navigate = useNavigate();
  
// //   const handleScheduleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const newScheduleType = e.target.value as 'daily' | 'weekly';
// //     setScheduleType(newScheduleType);
// //     setSuccessMessage('');   
// //     setErrorMessage('');     
// //     setDaysOfWeek([]);      
// //     if (newScheduleType === 'daily') {
// //       setDate(moment().format('MM/DD/YYYY'));
// //     } else {
// //       setStartDate(moment().format('MM/DD/YYYY'));
// //       setEndDate(moment().add(7, 'days').format('MM/DD/YYYY'));
// //     }
// //   };

// //   const coachid = localStorage.getItem('coachId');

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (moment(endTime, "HH:mm").isBefore(moment(startTime, "HH:mm"))) {
// //       setErrorMessage("End time must be after start time.");
// //       return;
// //     }

// //     const payload = {
// //       coachId: coachid,
// //       startTime,
// //       duration: 60,
// //       endTime,
// //       slotType,
// //       ...(scheduleType === 'daily'
// //           ? { date: moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD') }
// //           : {
// //               startdate: moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
// //               enddate: moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
// //               daysOfWeek,
// //           }),
// //     };

// //     try {
// //       let endpoint;

// //       if (scheduleType === 'daily') {
// //         endpoint = `${Domain_URL}/slot/createSlot`;
// //       } else {
// //         endpoint = `${Domain_URL}/slot/create-weekly-slots`;
// //       }

// //       const response = await axios.post(endpoint, payload, {
// //         headers: { 'Content-Type': 'application/json' },
// //       });

// //       console.log('Response from API:', response.data);

// //       if (response.data.message) {
// //         setErrorMessage(response.data.message);
// //         setSuccessMessage('');
// //         return;
// //       }

// //       setSuccessMessage('Slots generated successfully!');
// //       setErrorMessage('');

// //     } catch (error: any) {
// //       console.error('Error creating slots:', error);
// //       if (error.response && error.response.data) {
// //         setErrorMessage(error.response.data.message || 'Slots already exist for the specified date and time range.');
// //       } else {
// //         setErrorMessage('Slots already exist for the specified date and time range.');
// //       }
// //       setSuccessMessage('');
// //     }
// //   };

// //   return (
// //     <Box sx={{
// //       p: 3,
// //       borderRadius: 3,
// //       boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
// //       backgroundColor: '#f5f5f5',
// //       maxWidth: 600,
// //       m: '60px auto 0 ',
// //       display: 'flex',
// //       flexDirection: 'column',
// //       alignItems: 'center'
// //     }}>
// //       <IconButton
// //         sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}
// //         onClick={() => navigate('/Coach-Dashboard')}
// //       >
// //         <ArrowBack />
// //       </IconButton>

// //       <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
// //         Create Your Schedule
// //       </Typography>

// //       <FormControl component="fieldset" sx={{ mb: 2 }}>
// //         <RadioGroup
// //           row
// //           aria-label="scheduleType"
// //           name="scheduleType"
// //           value={scheduleType}
// //           onChange={handleScheduleTypeChange}
// //         >
// //           <FormControlLabel value="daily" control={<Radio />} label="Daily" />
// //           <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
// //         </RadioGroup>
// //       </FormControl>

// //       <Grid container spacing={2}>
// //         <Grid item xs={12} sm={6}>
// //           <FormControl fullWidth sx={{ mb: 2 }}>
// //             <InputLabel id="slotTypeLabel">Slot Type</InputLabel>
// //             <Select
// //               labelId="slotTypeLabel" id="slotType"
// //               value={slotType} onChange={e => setSlotType(e.target.value)}
// //               label="Slot Type"
// //             >
// //               <MenuItem value="general">General</MenuItem>
// //               <MenuItem value="personal">Personal</MenuItem>
// //             </Select>
// //           </FormControl>
// //         </Grid>

// //         {scheduleType === 'daily' ? (
// //           <Grid item xs={12} sm={6}>
// //             <TextField
// //               label="Date" type="date" value={moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD')}
// //               onChange={e => setDate(moment(e.target.value).format('MM/DD/YYYY'))}
// //               InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
// //             />
// //           </Grid>
// //         ) : (
// //           <>
// //             <Grid item xs={12} container spacing={2}>
// //               <Grid item xs={6}>
// //                 <TextField
// //                   label="Start Date" type="date" value={moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
// //                   onChange={e => setStartDate(moment(e.target.value).format('MM/DD/YYYY'))}
// //                   InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
// //                 />
// //               </Grid>
// //               <Grid item xs={6}>
// //                 <TextField
// //                   label="End Date" type="date" value={moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
// //                   onChange={e => setEndDate(moment(e.target.value).format('MM/DD/YYYY'))}
// //                   InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
// //                 />
// //               </Grid>
// //             </Grid>
// //             <Grid item xs={12}>
// //               <FormControl fullWidth sx={{ mb: 2 }}>
// //                 <InputLabel id="daysOfWeekLabel">Days of Week</InputLabel>
// //                 <Select
// //                   labelId="daysOfWeekLabel" id="daysOfWeek" multiple
// //                   value={daysOfWeek} onChange={e => setDaysOfWeek(e.target.value as string[])}
// //                   renderValue={selected => selected.join(', ')}
// //                 >
// //                   {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
// //                     <MenuItem key={day} value={day}>
// //                       <Checkbox checked={daysOfWeek.includes(day)} />
// //                       {day}
// //                     </MenuItem>
// //                   ))}
// //                 </Select>
// //               </FormControl>
// //             </Grid>
// //           </>
// //         )}

// //         <Grid item xs={12} sm={6}>
// //           <TextField
// //             label="Start Time" type="time" value={startTime}
// //             onChange={e => setStartTime(e.target.value)}
// //             InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
// //           />
// //         </Grid>
// //         <Grid item xs={12} sm={6}>
// //           <TextField
// //             label="End Time" type="time" value={endTime}
// //             onChange={e => setEndTime(e.target.value)}
// //             InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }}
// //           />
// //         </Grid>

// //         <Grid item xs={12}>
// //           {slotType === 'personal' && (
// //             <TextField
// //               label="Comment" multiline rows={4} value={comment}
// //               onChange={e => setComment(e.target.value)}
// //               fullWidth sx={{ mb: 2 }}
// //             />
// //           )}
// //           <Typography variant="body2" sx={{ color: 'gray', mt: 1 }} hidden={slotType !== 'personal'}>
// //             Note: You can generate slots per day for daily scheduling.
// //           </Typography>
// //         </Grid>
// //       </Grid>

// //       {errorMessage && (
// //         <Typography variant="body2" sx={{ color: 'red', mt: 2 }}>
// //           {errorMessage}
// //         </Typography>
// //       )}
// //       {successMessage && (
// //         <Typography variant="body2" sx={{ color: 'green', mt: 2 }}>
// //           {successMessage}
// //         </Typography>
// //       )}

// //       <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
// //         Create Slots
// //       </Button>
// //     </Box>
// //   );
// // };

// // export default Schedule;




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
// // import moment from 'moment';
// import { Domain_URL } from '../config';
// import { ArrowBack } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import moment from 'moment-timezone';
// const Schedule = () => {
//   const [startTime, setStartTime] = useState('09:00');
//   const [serverOffline, setServerOffline] = useState(false);

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
//   const navigate = useNavigate();
  
//   const handleScheduleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newScheduleType = e.target.value as 'daily' | 'weekly';
//     setScheduleType(newScheduleType);
//     setSuccessMessage('');   
//     setErrorMessage('');     
//     setDaysOfWeek([]);      
//     if (newScheduleType === 'daily') {
//       setDate(moment().format('MM/DD/YYYY'));
//     } else {
//       setStartDate(moment().format('MM/DD/YYYY'));
//       setEndDate(moment().add(7, 'days').format('MM/DD/YYYY'));
//     }
//   };

//   const coachid = localStorage.getItem('coachId');

//   // Helper function to get the current date in UTC-6 timezone
//  // Get the current date in local time as a moment object
// const getCurrentDateInLocal = () => {
//   return moment();  // No formatting, returns a moment object
// };

// // Helper function to check if a selected date is in the future
// const isDateInFuture = (selectedDate) => {
//   const currentDateInLocal = getCurrentDateInLocal();
//   console.log("current date is", currentDateInLocal.format('YYYY-MM-DD HH:mm:ss'));
//   return moment(selectedDate, 'MM/DD/YYYY').isSameOrAfter(currentDateInLocal, 'day');
// };

// // Helper function to check if the selected time is at least 12 hours in advance
// const isTimeValid = (selectedTime, selectedDate) => {
//   const currentDateInLocal = getCurrentDateInLocal();
//   const selectedDateTime = moment(`${selectedDate} ${selectedTime}`, 'MM/DD/YYYY HH:mm');

//   // Check if the selected time is at least 12 hours ahead of the current time
//   return selectedDateTime.isSameOrAfter(currentDateInLocal.add(12, 'hours'));
// };



//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (moment(endTime, "HH:mm").isBefore(moment(startTime, "HH:mm"))) {
//       setErrorMessage("End time must be after start time.");
//       return;
//     }

//     // Validate selected dates
//     if (scheduleType === 'daily') {
//       if (!isDateInFuture(date)) {
//         setErrorMessage("Please select a future date for daily scheduling.");
//         return;
//       }
//       if (!isTimeValid(startTime, date)) {
//         setErrorMessage("Please select a time at least 12 hours in advance.");
//         return;
//       }
//     } else {
//       if (!isDateInFuture(startDate) || !isDateInFuture(endDate)) {
//         setErrorMessage("Please select future dates for weekly scheduling.");
//         return;
//       }
//     }

//     const payload = {
//       coachId: coachid,
//       startTime,
//       duration: 60,
//       endTime,
//       slotType,
//       ...(scheduleType === 'daily'
//           ? { date: moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD') }
//           : {
//               startdate: moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
//               enddate: moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
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
//         setErrorMessage(response.data.message);
//         setSuccessMessage('');
//         return;
//       }

//       setSuccessMessage('Slots generated successfully!');
//       setErrorMessage('');
      

//       setTimeout(() => {
//         setSuccessMessage('');
//       }, 5000);

//     } catch (error: any) {
//       console.error('Error creating slots:', error);
//       if (axios.isAxiosError(error)) {
//         if (error.code === 'ERR_NETWORK') {
//           console.log('Server is offline, please wait...');
//           alert('Server Offline. Please wait...');
//           setServerOffline(true); // Set state to show the "offline" message
//         } else {
//           setServerOffline(false);
//         }
//       }
//       if (error.response && error.response.data) {
//         setErrorMessage(error.response.data.message || 'Slots already exist for the specified date and time range.');
        
//       } else {
//         setErrorMessage('Slots already exist for the specified date and time range.');
//       }
//       setSuccessMessage('');
//       setTimeout(() => {
//         setErrorMessage('');
//       }, 5000);
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
//       <IconButton
//         sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}
//         onClick={() => navigate('/Coach-Dashboard')}
//       >
//         <ArrowBack />
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
//           {/* <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
//             Note: You can generate slots per day for daily scheduling.
//           </Typography> */}
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

//       <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
//         Create Slots
//       </Button>

//       {/* ...rest of the component code, unchanged... */}
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
import { Domain_URL } from '../config';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';

const Schedule = () => {
  const [startTime, setStartTime] = useState('09:00');
  const [serverOffline, setServerOffline] = useState(false);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleScheduleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScheduleType = e.target.value as 'daily' | 'weekly';
    setScheduleType(newScheduleType);
    setSuccessMessage('');   
    setErrorMessage('');     
    setDaysOfWeek([]);      
    if (newScheduleType === 'daily') {
      setDate(moment().format('MM/DD/YYYY'));
    } else {
      setStartDate(moment().format('MM/DD/YYYY'));
      setEndDate(moment().add(7, 'days').format('MM/DD/YYYY'));
    }
  };

  const coachid = localStorage.getItem('coachId');

  const getCurrentDateInLocal = () => {
    return moment();
  };

  const isDateInFuture = (selectedDate) => {
    const currentDateInLocal = getCurrentDateInLocal();
    console.log("current date is", currentDateInLocal.format('YYYY-MM-DD HH:mm:ss'));
    return moment(selectedDate, 'MM/DD/YYYY').isSameOrAfter(currentDateInLocal, 'day');
  };

  const isTimeValid = (selectedTime, selectedDate) => {
    const currentDateInLocal = getCurrentDateInLocal();
    const selectedDateTime = moment(`${selectedDate} ${selectedTime}`, 'MM/DD/YYYY HH:mm');
    return selectedDateTime.isSameOrAfter(currentDateInLocal.add(12, 'hours'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      if (moment(endTime, "HH:mm").isBefore(moment(startTime, "HH:mm"))) {
        throw new Error("End time must be after start time.");
      }
  
      // Validate selected dates
      if (scheduleType === 'daily') {
        if (!isDateInFuture(date)) {
          throw new Error("Please select a future date for daily scheduling.");
        }
        if (!isTimeValid(startTime, date)) {
          throw new Error("Please select a time at least 12 hours in advance.");
        }
      } else {
        // Validate weekly schedule: check that the start date and end date are valid
        if (!isDateInFuture(startDate) || !isDateInFuture(endDate)) {
          throw new Error("Please select future dates for weekly scheduling.");
        }
  
        // Validate that the selected date range matches the days of the week
        const start = moment(startDate, 'MM/DD/YYYY');
        const end = moment(endDate, 'MM/DD/YYYY');
  
        const selectedDays = daysOfWeek.map(day => {
          return moment().day(day).format('dddd'); // Get the day name in full format
        });
  
        // Loop through the range and check if the selected days match the date range
        let validDays = false;
        for (let m = moment(start); m.isBefore(end) || m.isSame(end, 'day'); m.add(1, 'days')) {
          if (selectedDays.includes(m.format('dddd'))) {
            validDays = true;
            break;
          }
        }
  
        if (!validDays) {
          throw new Error("The selected days of the week do not match the date range.");
        }
  
        if (daysOfWeek.length === 0) {
          throw new Error("Please select at least one day of the week.");
        }
      }
  
      const payload = {
        coachId: coachid,
        startTime,
        duration: 60,
        endTime,
        slotType,
        comment: slotType === 'personal' ? comment : '',
        ...(scheduleType === 'daily'
            ? { date: moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD') }
            : {
                startdate: moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                enddate: moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                daysOfWeek,
            }),
      };
  
      const endpoint = scheduleType === 'daily' 
        ? `${Domain_URL}/slot/createSlot`
        : `${Domain_URL}/slot/create-weekly-slots`;
  
      const response = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log('Response from API:', response.data);
  
      if (response.data.message) {
        setErrorMessage(response.data.message);
        setSuccessMessage('');
        return;
      }
  
      setSuccessMessage('Slots generated successfully!');
      setErrorMessage('');
  
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
  
    } catch (error: any) {
      console.error('Error creating slots:', error);
  
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          console.log('Server is offline, please wait...');
          alert('Server Offline. Please wait...');
          setServerOffline(true);
        } else {
          setServerOffline(false);
        }
      }
  
      const errorMsg = 'Slots already exist for the specified date and time range.';
      setErrorMessage(errorMsg);
      setSuccessMessage('');
  
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    } finally {
      // Reset submission state after a delay to prevent rapid re-submissions
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
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
              labelId="slotTypeLabel"
              id="slotType"
              value={slotType}
              onChange={e => setSlotType(e.target.value)}
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
              label="Date"
              type="date"
              value={moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD')}
              onChange={e => setDate(moment(e.target.value).format('MM/DD/YYYY'))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
                  onChange={e => setStartDate(moment(e.target.value).format('MM/DD/YYYY'))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
                  onChange={e => setEndDate(moment(e.target.value).format('MM/DD/YYYY'))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="daysOfWeekLabel">Days of Week</InputLabel>
                <Select
                  labelId="daysOfWeekLabel"
                  id="daysOfWeek"
                  multiple
                  value={daysOfWeek}
                  onChange={e => setDaysOfWeek(e.target.value as string[])}
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
            label="Start Time"
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="End Time"
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mb: 2 }}
          />
        </Grid>

        <Grid item xs={12}>
          {slotType === 'personal' && (
            <TextField
              label="Comment"
              multiline
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
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

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        sx={{ 
          mt: 2,
          opacity: isSubmitting ? 0.7 : 1,
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Creating...' : 'Create Slots'}
      </Button>
    </Box>
  );
};

export default Schedule;