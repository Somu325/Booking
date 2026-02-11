
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from '../../config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, ChevronLeft, ChevronRight, Filter, X } from 'react-bootstrap-icons';
import CoachShell from '../../Layout/CoachShell';

const Coachdashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<string>('All');
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  interface Booking {
    bookingId: string;
    userId: string;
    childId?: string;
    childName: string | null;
    coachId: string;
    slotId: string;
    bookingType: 'single' | 'group';
    status: 'progress' | 'completed' | 'canceled' | 'upcoming';
    createdAt: string;
    updatedAt: string;
    userName: string | null;
    coachName: string | null;
    startTime: string | null;
    endTime: string | null;
    slotType: string | null;
    slotDuration: string | null;
    date: string | null;
  }

  const coachId = localStorage.getItem('coachId');

  const dates = Array.from({ length: 5 }, (_, i) => addDays(startDate, i));

  const handleNext = () => setStartDate((prev) => addDays(prev, 5));
  const handlePrevious = () => setStartDate((prev) => addDays(prev, -5));
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => setFilter(event.target.value);

  const handleRowClick = async (slot: any) => {
    if (slot.status === 'booked' || slot.status === 'completed') {
      try {
        const response = await axios.get(`${Domain_URL}/bookings/slot/${slot.slotId}`);
        const bookingData = response.data;
        
        const booking: Booking = {
          bookingId: bookingData.bookingId,
          userId: bookingData.userId,
          childId: bookingData.childId,
          childName: bookingData.child.name,
          coachId: bookingData.coachId,
          slotId: bookingData.slotId,
          bookingType: bookingData.bookingType,
          status: bookingData.status,
          createdAt: bookingData.createdAt,
          updatedAt: bookingData.updatedAt,
          userName: bookingData.user.name,
          coachName: bookingData.coachName,
          startTime: bookingData.slot.startTime,
          endTime: bookingData.slot.endTime,
          slotType: bookingData.bookingType,
          slotDuration: "60 min",
          date: bookingData.slot.date.split('T')[0],
        };
        
        setSelectedBooking(booking);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);

      const daysDifference = differenceInDays(date, startDate);
      if (daysDifference < 0 || daysDifference >= 5) {
        setStartDate(date);
      }
    }
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Domain_URL}/slots-g-p/${coachId}`);
      setSlots(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching slots:', err.message);
      setError('No slots available for the selected date.');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coachId) fetchSlots();
  }, [coachId]);

  const convertToLocalDate = (dateString: string) => {
    const localDate = new Date(dateString);
    return new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
  };

  const filteredSlots = slots
    .filter((slot) => {
      const slotDate = convertToLocalDate(slot.date);
      const isStatusMatch = filter === 'All' || slot.status === filter;
      const isSlotTypeMatch = filter === 'personal' ? slot.slotType === 'personal' : true;
      return isStatusMatch && isSlotTypeMatch && slotDate.toDateString() === selectedDate.toDateString();
    })
    .sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.startTime}`).getTime();
      const timeB = new Date(`1970-01-01T${b.startTime}`).getTime();
      return timeA - timeB;
    });

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'completed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'upcoming':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
      case 'canceled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'booked':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  return (
    <CoachShell title="Dashboard">
      <div className="space-y-6">
        {/* Controls Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors border border-gray-200"
              >
                <Calendar size={20} />
              </button>

              <button onClick={handlePrevious} className="p-2 text-gray-500 hover:text-indigo-600">
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {dates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                      ${date.getTime() === selectedDate.getTime()
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    {format(date, 'MMM d')}
                  </button>
                ))}
              </div>

              <button onClick={handleNext} className="p-2 text-gray-500 hover:text-indigo-600">
                <ChevronRight size={20} />
              </button>
           </div>

           <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="text-gray-400" size={14} />
                </div>
                <select
                  value={filter}
                  onChange={handleFilterChange}
                  className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm appearance-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
           </div>
        </div>

        {isCalendarOpen && (
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-lg">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
              />
            </div>
          </div>
        )}

        {/* Slots Content */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
           {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
           ) : error ? (
              <div className="flex justify-center items-center h-64 text-gray-500">
                {error}
              </div>
           ) : filteredSlots.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-gray-500">
                No slots available for this date.
              </div>
           ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                           <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                           <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                           <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                           <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                           <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {filteredSlots.map((slot, index) => (
                           <tr
                              key={index}
                              onClick={() => handleRowClick(slot)}
                              className="hover:bg-gray-50 transition-colors cursor-pointer"
                           >
                              <td className="py-4 px-6 text-sm text-gray-900">{format(selectedDate, 'MMM d, yyyy')}</td>
                              <td className="py-4 px-6 text-sm text-gray-900 font-medium">{`${slot.startTime} - ${slot.endTime}`}</td>
                              <td className="py-4 px-6">
                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(slot.status)}`}>
                                    {slot.status}
                                 </span>
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-600">{slot.duration} mins</td>
                              <td className="py-4 px-6 text-sm text-gray-600 capitalize">{slot.slotType}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                {/* Mobile List */}
                <div className="md:hidden p-4 space-y-4">
                   {filteredSlots.map((slot, index) => (
                      <div
                        key={index}
                        onClick={() => handleRowClick(slot)}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 active:scale-[0.98] transition-transform"
                      >
                         <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-gray-900">{slot.startTime} - {slot.endTime}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(slot.status)}`}>
                               {slot.status}
                            </span>
                         </div>
                         <div className="flex justify-between text-sm text-gray-500">
                            <span>{slot.duration} mins</span>
                            <span className="capitalize">{slot.slotType}</span>
                         </div>
                      </div>
                   ))}
                </div>
              </>
           )}
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
               <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
               <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                 <X size={20} />
               </button>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">User</span>
                  <span className="text-sm font-medium text-gray-900">{selectedBooking.userName}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Child</span>
                  <span className="text-sm font-medium text-gray-900">{selectedBooking.childName || 'N/A'}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm font-medium text-gray-900">{selectedBooking.date}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="text-sm font-medium text-gray-900">{selectedBooking.startTime} - {selectedBooking.endTime}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{selectedBooking.slotType}</span>
               </div>
               <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(selectedBooking.status)}`}>
                      {selectedBooking.status}
                  </span>
               </div>
            </div>
          </div>
        </div>
      )}
    </CoachShell>
  );
};

export default Coachdashboard;
