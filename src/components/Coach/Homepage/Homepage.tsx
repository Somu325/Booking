
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from '../../config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';

const Coachdashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<string>('All');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
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
  const coachName = localStorage.getItem('coachName');

  const dates = Array.from({ length: 5 }, (_, i) => addDays(startDate, i));

  const handleNext = () => setStartDate((prev) => addDays(prev, 5));
  const handlePrevious = () => setStartDate((prev) => addDays(prev, -5));
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => setFilter(event.target.value);

  const handleRowClick = async (slot: any) => {
    if (slot.status === 'booked' || slot.status === 'completed') {
      try {
        const response = await axios.get(`${Domain_URL}/bookings/slot/${slot.slotId}`);
        const bookingData = response.data;
        
        // Populate the booking details from the response
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
          slotDuration: "60 min", // Assume 60 min for simplicity
          date: bookingData.slot.date.split('T')[0], // Assuming it's in UTC format
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

  // Filter and sort slots
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 font-bold';
      case 'completed':
        return 'text-red-600 font-bold';
      case 'upcoming':
        return 'text-blue-600 font-bold';
      case 'cancelled':
        return 'text-black font-bold';
      case 'booked':
        return 'text-[rgb(8,178,235)] font-bold';
      default:
        return '';
    }
  };

  const [isMobile, setIsMobile] = useState(false);
  
  // Detect screen width on component mount and resize
  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Set mobile breakpoint at 768px
    };

    updateScreenSize(); // Initial check
    window.addEventListener('resize', updateScreenSize); // Listen for resize events

    return () => {
      window.removeEventListener('resize', updateScreenSize); // Clean up event listener
    };
  }, []);


  return (
    <div className="flex h-screen bg-[#f0f4f8] font-sans w-full overflow-x-hidden">
      <div className={`fixed top-0 h-full bg-[#535a62] text-white flex flex-col items-center p-8 transition-[left] duration-300 z-[1000] ${menuOpen ? 'left-0' : '-left-full'} w-full md:w-[250px]`}>
        <button className="absolute top-4 right-4 bg-none border-none text-[2rem] text-white cursor-pointer hover:scale-110" onClick={toggleMenu}>
          &times;
        </button>
        <nav className="mt-8 w-full">
          <ul className="list-none p-0">
            <li className="my-4 cursor-pointer text-[1.2rem] text-center hover:text-gray-300" onClick={() => navigate('/Coach-Profile')}>Profile</li>
            <li className="my-4 cursor-pointer text-[1.2rem] text-center hover:text-gray-300" onClick={() => navigate('/Coach-Analytics')}>Analytics</li>
            <li className="my-4 cursor-pointer text-[1.2rem] text-center hover:text-gray-300" onClick={() => navigate('/Schedule')}>Scheduler</li>
            <li className="my-4 cursor-pointer text-[1.2rem] text-center text-red-500 hover:underline" onClick={() => {
              localStorage.clear()
              localStorage.removeItem('coachId');
              localStorage.removeItem('email');
              Cookies.remove('Coachtoken');
              navigate('/Coach-login');
            }}>
              Logout
            </li>
          </ul>
        </nav>
      </div>

      <div className={`flex-1 transition-[margin-left] duration-300 ${menuOpen ? 'md:ml-[250px]' : 'ml-0'}`}>
        <header className="flex justify-between items-center w-full py-3 px-6 shadow-md rounded-lg mx-auto bg-white mb-6">
          <div className="text-[2rem] cursor-pointer" onClick={toggleMenu}>
            &#9776;
          </div>
          <h2 className="text-xl font-bold">Welcome, {coachName}</h2>
          <div className="relative inline-block">
            <div className="text-2xl">&#128276;</div>
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red-500 transform -rotate-45"></div>
          </div>
        </header>

        <main className="flex flex-col items-center w-full px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-evenly w-full gap-8 mb-8">
            <div className="flex items-center gap-4 md:gap-32">
              <span className="text-[2rem] cursor-pointer" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                &#128197;
              </span>
              <div className="flex items-center justify-evenly flex-grow gap-4">
                <span className="text-[1.5rem] cursor-pointer text-[#007aff] hover:text-[#005bb5]" onClick={handlePrevious}>&#10094;</span>
                {dates.map((date, index) => (
                  <span
                    key={index}
                    className={`text-base cursor-pointer px-4 py-2 rounded transition-colors ${date.getTime() === selectedDate.getTime() ? 'bg-[#007bffb3] text-white font-bold' : 'text-[#007aff] hover:bg-gray-100'}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {format(date, 'MMM d yyyy')}
                  </span>
                ))}
                <span className="text-[1.5rem] cursor-pointer text-[#007aff] hover:text-[#005bb5]" onClick={handleNext}>&#10095;</span>
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="filter" className="mr-2 font-bold md:ml-24 ml-1">
                Filter:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 rounded text-base cursor-pointer bg-white"
              >
                <option value="All">All</option>
                <option value="completed">Completed</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="canceled">canceled</option>
                <option value="unbooked">Unbooked</option>
              </select>
            </div>
          </div>

          {isCalendarOpen && (
            <div className="mb-6">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
                className="custom-datepicker"
              />
            </div>
          )}

          <div className="w-[95%] max-w-[1000px] mx-auto">
            {loading ? (
              <div className="mt-5 text-lg text-[#666] text-center">Loading slots...</div>
            ) : error ? (
              <div className="mt-5 text-lg text-[#666] text-center">{error}</div>
            ) : filteredSlots.length === 0 ? (
              <div className="mt-5 text-lg text-[#666] text-center">No slots available</div>
            ) : (
              isMobile ? (
                <div className="flex flex-col gap-4 mt-5">
                  {filteredSlots.map((slot, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform flex flex-col gap-2 border border-gray-200" onClick={() => handleRowClick(slot)}>
                      <div className="font-bold">Time: {`${slot.startTime} - ${slot.endTime}`}</div>
                      <div className="font-bold">Status:
                        <span className={`ml-2 ${getStatusClass(slot.status)}`}>{slot.status}</span>
                      </div>
                      <div className="text-sm text-[#555]">Duration: {slot.duration} mins</div>
                      <div className="text-sm text-[#555]">Slot Type: {slot.slotType}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse mt-2">
                    <thead>
                      <tr>
                        <th className="p-3 border border-[#ddd] text-left bg-[#f4f4f4] font-bold">Date</th>
                        <th className="p-3 border border-[#ddd] text-left bg-[#f4f4f4] font-bold">Time</th>
                        <th className="p-3 border border-[#ddd] text-left bg-[#f4f4f4] font-bold">Status</th>
                        <th className="p-3 border border-[#ddd] text-left bg-[#f4f4f4] font-bold">Duration</th>
                        <th className="p-3 border border-[#ddd] text-left bg-[#f4f4f4] font-bold">Slot Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSlots.map((slot, index) => (
                        <tr key={index} className="hover:bg-[#f1f1f1] cursor-pointer" onClick={() => handleRowClick(slot)}>
                          <td className="p-3 border border-[#ddd]">{format(selectedDate, 'MMM d, yyyy')}</td>
                          <td className="p-3 border border-[#ddd]">{`${slot.startTime} - ${slot.endTime}`}</td>
                          <td className={`p-3 border border-[#ddd] ${getStatusClass(slot.status)}`}>{slot.status}</td>
                          <td className="p-3 border border-[#ddd]">{slot.duration} mins</td>
                          <td className="p-3 border border-[#ddd]">{slot.slotType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </main>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]">
          <div className="bg-white p-4 rounded-lg w-[350px] max-w-[90%] relative shadow-lg">
            <button className="absolute top-2 right-2 text-2xl bg-none border-none text-black hover:text-red-500 cursor-pointer" onClick={() => setSelectedBooking(null)}>
              &times;
            </button>

            <h3 className="text-lg font-bold text-center mt-0 mb-4">Booking Details</h3>
            <div className="text-sm">
              <p className="mb-2"><strong>User Name:</strong> {selectedBooking.userName}</p>
              <p className="mb-2"><strong>Child Name:</strong> {selectedBooking.childName}</p>
              <p className="mb-2"><strong>Date:</strong> {selectedBooking.date?.split('T')[0]}</p>
              <p className="mb-2"><strong>Start Time:</strong> {selectedBooking.startTime}</p>
              <p className="mb-2"><strong>End Time:</strong> {selectedBooking.endTime}</p>
              <p className="mb-2"><strong>Slot Type:</strong> {selectedBooking.slotType}</p>
              <p className="mb-2"><strong>Status:</strong> <span>{selectedBooking.status}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coachdashboard;
