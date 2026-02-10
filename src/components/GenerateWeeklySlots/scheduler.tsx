
import { useState } from 'react';
import axios from 'axios';
import { Domain_URL } from '../config';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';

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

  const isDateInFuture = (selectedDate: string) => {
    const currentDateInLocal = getCurrentDateInLocal();
    console.log("current date is", currentDateInLocal.format('YYYY-MM-DD HH:mm:ss'));
    return moment(selectedDate, 'MM/DD/YYYY').isSameOrAfter(currentDateInLocal, 'day');
  };

  const isTimeValid = (selectedTime: string, selectedDate: string) => {
    const currentDateInLocal = getCurrentDateInLocal();
    const selectedDateTime = moment(`${selectedDate} ${selectedTime}`, 'MM/DD/YYYY HH:mm');
    return selectedDateTime.isSameOrAfter(currentDateInLocal.add(12, 'hours'));
  };

  const isValidWeeklyDays = (startDate: string, endDate: string, selectedDays: string[]) => {
    const start = moment(startDate, 'MM/DD/YYYY');
    const end = moment(endDate, 'MM/DD/YYYY');
    const validDays = selectedDays.map((day: string) => moment().day(day).format('dddd'));
    
    // Loop through each date in the range and check if it matches any of the selected days
    let isValid = false;
    for (let m = moment(start); m.isBefore(end) || m.isSame(end, 'day'); m.add(1, 'days')) {
      if (validDays.includes(m.format('dddd'))) {
        isValid = true;
        break;
      }
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    try {
      if (moment(endTime, "HH:mm").isBefore(moment(startTime, "HH:mm"))) {
        throw new Error("End time must be after start time.");
      }
      const startMinutes = moment(startTime, "HH:mm").minutes();
    const endMinutes = moment(endTime, "HH:mm").minutes();
    
    if (![0, 30].includes(startMinutes) || ![0, 30].includes(endMinutes)) {
        throw new Error("Please select times with minutes only as 00 or 30.");
    }
    const durationInMinutes = moment(endTime, "HH:mm").diff(moment(startTime, "HH:mm"), "minutes");
    if (durationInMinutes < 60) {
      throw new Error("The time difference between start time and end time must be at least 60 minutes.");
    }
    if (durationInMinutes % 60 !== 0) {
      throw new Error("The time range must be in full-hour increments (e.g., 9:00 to 10:00, 9:00 to 11:00).");
    }
  
      if (scheduleType === 'daily') {
        if (!isDateInFuture(date)) {
          throw new Error("Please select a future date for daily scheduling.");
        }
        if (!isTimeValid(startTime, date)) {
          throw new Error("Please select a time at least 12 hours in advance.");
        }
        if (startTime === endTime) {
          throw new Error("Start time and end time must not be the same.");
      }
      } else {
        if (moment(startDate).isAfter(moment(endDate))) {
          throw new Error("End date must be after start date.");
        }
        if (moment(startDate).isSame(moment(endDate), 'day')) {
          throw new Error("Start date and end date must not be the same for weekly scheduling.");
      }
        if (!isDateInFuture(startDate) || !isDateInFuture(endDate)) {
          throw new Error("Please select future dates for weekly scheduling.");
        }
        if (startTime === endTime) {
          throw new Error("Start time and end time must not be the same.");
      }
        if (daysOfWeek.length === 0) {
          throw new Error("Please select at least one day of the week.");
        }
        if (!isValidWeeklyDays(startDate, endDate, daysOfWeek)) {
          throw new Error("The selected days of the week do not match the date range.");
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

      console.log("payload is",payload)
  
      const endpoint = scheduleType === 'daily' 
        ? `${Domain_URL}/slot/createSlot`
        : `${Domain_URL}/slot/create-weekly-slots`;
  
      const response = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
  
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
  
    } catch (error: unknown) {
      console.error('Error creating slots:', error);
  
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setErrorMessage('Slots already generated in the specified date range.');
        } else if (error.code === 'ERR_NETWORK') {
          alert('Server Offline. Please wait...');
        } else {
          setErrorMessage(error.response?.data?.message || 'An unexpected error occurred.');
        }
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
  
      setSuccessMessage('');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
  
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-md bg-[#f5f5f5] max-w-2xl mx-auto mt-16 flex flex-col items-center relative">
      <button
        className="absolute top-4 left-4 z-10 p-2 rounded-full hover:bg-gray-200 transition-colors"
        onClick={() => navigate('/Coach-Dashboard')}
      >
        <ArrowBack />
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Your Schedule
      </h2>

      <div className="flex items-center space-x-6 mb-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="scheduleType"
            value="daily"
            checked={scheduleType === 'daily'}
            onChange={handleScheduleTypeChange}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Daily</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="scheduleType"
            value="weekly"
            checked={scheduleType === 'weekly'}
            onChange={handleScheduleTypeChange}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Weekly</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slot Type</label>
            <select
              id="slotType"
              value={slotType}
              onChange={e => setSlotType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="general">General</option>
              <option value="personal">Personal</option>
            </select>
        </div>

        {scheduleType === 'daily' ? (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD')}
              onChange={e => setDate(moment(e.target.value).format('MM/DD/YYYY'))}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <>
            <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
                  onChange={e => setStartDate(moment(e.target.value).format('MM/DD/YYYY'))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
                  onChange={e => setEndDate(moment(e.target.value).format('MM/DD/YYYY'))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
              <div className="flex flex-wrap gap-3 bg-white p-3 border border-gray-300 rounded-md">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={daysOfWeek.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDaysOfWeek([...daysOfWeek, day]);
                          } else {
                            setDaysOfWeek(daysOfWeek.filter(d => d !== day));
                          }
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
              </div>
            </div>
          </>
        )}

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          {slotType === 'personal' && (
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <p className="mt-4 text-red-600 text-sm font-medium">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="mt-4 text-green-600 text-sm font-medium">
          {successMessage}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`mt-6 px-6 py-2 rounded-md font-semibold text-white transition-all ${
            isSubmitting
            ? 'bg-blue-400 cursor-not-allowed opacity-70'
            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
        }`}
      >
        {isSubmitting ? 'Creating...' : 'Create Slots'}
      </button>
    </div>
  );
};

export default Schedule;
