
import React, { useState } from 'react';
import axios from 'axios';
import { Domain_URL } from '../config';
import { ArrowLeft, CalendarPlus, Clock, CheckCircle, ExclamationCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import CoachShell from '../Layout/CoachShell';

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
    <CoachShell title="Scheduler">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
               <CalendarPlus size={24} />
            </div>
            <div>
               <h2 className="text-xl font-bold text-gray-900">Create Schedule</h2>
               <p className="text-sm text-gray-500">Set your availability for clients.</p>
            </div>
          </div>

          <div className="flex bg-gray-50 p-1 rounded-lg mb-8 w-fit">
            <label className={`
              flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all text-sm font-medium
              ${scheduleType === 'daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}
            `}>
              <input
                type="radio"
                name="scheduleType"
                value="daily"
                checked={scheduleType === 'daily'}
                onChange={handleScheduleTypeChange}
                className="hidden"
              />
              Daily
            </label>
            <label className={`
              flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all text-sm font-medium
              ${scheduleType === 'weekly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}
            `}>
              <input
                type="radio"
                name="scheduleType"
                value="weekly"
                checked={scheduleType === 'weekly'}
                onChange={handleScheduleTypeChange}
                className="hidden"
              />
              Weekly
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                 <label className="text-sm font-medium text-gray-700 block">Slot Type</label>
                 <select
                    id="slotType"
                    value={slotType}
                    onChange={e => setSlotType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  >
                    <option value="general">General</option>
                    <option value="personal">Personal</option>
                  </select>
              </div>

              {scheduleType === 'daily' ? (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block">Date</label>
                  <input
                    type="date"
                    value={moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD')}
                    onChange={e => setDate(moment(e.target.value).format('MM/DD/YYYY'))}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">Start Date</label>
                    <input
                      type="date"
                      value={moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
                      onChange={e => setStartDate(moment(e.target.value).format('MM/DD/YYYY'))}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">End Date</label>
                    <input
                      type="date"
                      value={moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD')}
                      onChange={e => setEndDate(moment(e.target.value).format('MM/DD/YYYY'))}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                    />
                  </div>
                </>
              )}
            </div>

             {scheduleType === 'weekly' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">Repeat On</label>
                  <div className="flex flex-wrap gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <label
                          key={day}
                          className={`
                            cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-all
                            ${daysOfWeek.includes(day)
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                            }
                          `}
                        >
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
                            className="hidden"
                          />
                          {day.slice(0, 3)}
                        </label>
                      ))}
                  </div>
                </div>
              )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block flex items-center gap-2">
                     <Clock size={14} /> Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block flex items-center gap-2">
                     <Clock size={14} /> End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>
             </div>

             {slotType === 'personal' && (
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">Comment</label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                      placeholder="Add a note for this slot..."
                    />
                </div>
              )}

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                 <ExclamationCircle className="mt-0.5 shrink-0" size={16} />
                 {errorMessage}
              </div>
            )}

            {successMessage && (
               <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3 text-green-700 text-sm">
                 <CheckCircle className="mt-0.5 shrink-0" size={16} />
                 {successMessage}
              </div>
            )}

            <div className="pt-4">
               <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-xl font-semibold text-white transition-all shadow-md ${
                      isSubmitting
                      ? 'bg-indigo-400 cursor-not-allowed shadow-none'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? 'Generating...' : 'Generate Slots'}
                </button>
            </div>

          </form>
        </div>
      </div>
    </CoachShell>
  );
};

export default Schedule;
