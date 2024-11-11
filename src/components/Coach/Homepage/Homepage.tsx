

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Coachdashboard.css';
// import { format, addDays, differenceInDays } from 'date-fns';
// import { useNavigate } from 'react-router-dom';
// import { Domain_URL } from '../../config';
// import DatePicker from 'react-datepicker'; // Import the DatePicker component
// import 'react-datepicker/dist/react-datepicker.css';

// const Coachdashboard: React.FC = () => {
//   const [startDate, setStartDate] = useState<Date>(new Date());
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [filter, setFilter] = useState<string>('All');
//   const [menuOpen, setMenuOpen] = useState<boolean>(false);
//   const [slots, setSlots] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false); // State to toggle date picker
//   const navigate = useNavigate();

//   const coachId = localStorage.getItem('coachId');
//   const dates = Array.from({ length: 5 }, (_, i) => addDays(startDate, i));

//   const handleNext = () => setStartDate((prev) => addDays(prev, 5));

//   // Allow going back to any date
//   const handlePrevious = () => setStartDate((prev) => addDays(prev, -5));

//   const toggleMenu = () => setMenuOpen((prev) => !prev);
//   const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => setFilter(event.target.value);

//   const handleDateChange = (date: Date) => {
//     setSelectedDate(date);
//     setIsCalendarOpen(false); // Close the calendar after selecting a date

//     // Ensure the selected date is shown in the date row
//     const daysDifference = differenceInDays(date, startDate);
//     if (daysDifference < 0 || daysDifference >= 5) {
//       setStartDate(date);
//     }
//   };

//   const fetchSlots = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${Domain_URL}/slots-g-p/${coachId}`);
//       setSlots(response.data);
//       setError(null);
//     } catch (err: any) {
//       console.error('Error fetching slots:', err.message);
//       setError('No slots are availble for the selected date');
//       setSlots([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (coachId) fetchSlots();
//   }, [coachId]);




//   const convertToLocalDate = (dateString: string) => {
//     const localDate = new Date(dateString);
//     return new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
//   };

//   const filteredSlots = slots.filter((slot) => {
//     const slotDate = convertToLocalDate(slot.date);
//     const isStatusMatch = filter === 'All' || slot.status === filter;
//     const isSlotTypeMatch = filter === 'personal' ? slot.slotType === 'personal' : true;

//     return isStatusMatch && isSlotTypeMatch && slotDate.toDateString() === selectedDate.toDateString();
//   });

//   const getStatusClass = (status: string) => {
//     switch (status) {
//       case 'available':
//         return 'status-available';
//       case 'completed':
//         return 'status-completed';
//       case 'upcoming':
//         return 'status-upcoming';
//       case 'cancelled':
//         return 'status-cancelled';
//       case 'booked':
//         return 'status-booked';
//       default:
//         return '';
//     }
//   };

//   return (
//     <div className="container">
//       <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
//         <button className="close-btn" onClick={toggleMenu}>
//           &times;
//         </button>
//         <nav>
//           <ul>
//             <li onClick={() => navigate('/Coach-Profile')}>Profile</li>
//             <li onClick={() => navigate('/Coach-Analytics')}>Analytics</li>
//             <li onClick={() => navigate('/Schedule')}>Scheduler</li>
//             <li  className="logout" onClick={() => {
//               localStorage.removeItem('coachId');
//               localStorage.removeItem('email');
//               navigate('/Coach-login');
//             }}>
//               Logout
//             </li>
//           </ul>
//         </nav>
//       </div>
//       <div className="content">
//         <header className="header">
//           <div className="menu-icon" onClick={toggleMenu}>
//             &#9776;
//           </div>
//           <h2>Welcome, Coach</h2>
//           <div className="notification-icon-container">
//             <div className="notification-icon">&#128276;</div>
//             <div className="notification-cancel-line"></div>
//           </div>
//         </header>
//         <main className="main-content">
//           <div className="calendar-filter-container">
//             <div className="calendar">
//               <span className="calendar-icon" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
//                 &#128197;
//               </span>
//               <div className="dates-row">
//                 <span className="arrow" onClick={handlePrevious}>&#10094;</span>
//                 {dates.map((date, index) => (
//                   <span
//                     key={index}
//                     className={`date ${date.getTime() === selectedDate.getTime() ? 'selected' : ''}`}
//                     onClick={() => setSelectedDate(date)}
//                   >
//                     {format(date, 'MMM d yyyy')}
//                   </span>
//                 ))}
//                 <span className="arrow" onClick={handleNext}>&#10095;</span>
//               </div>
//             </div>
//             <div className="filter-container">
//               <label htmlFor="filter" className="filter-label">
//                 Filter:
//               </label>
//               <select
//                 id="filter"
//                 value={filter}
//                 onChange={handleFilterChange}
//                 className="filter-dropdown"
//               >
//                 <option value="All">All</option>
//                 <option value="completed">Completed</option>
//                 <option value="available">Available</option>
//                 <option value="booked">Booked</option>
//               </select>
//             </div>
//           </div>

//           {isCalendarOpen && (
//             <div className="calendar-datePicker">
//               <DatePicker
//                 selected={selectedDate}
//                 onChange={handleDateChange}
//                 inline
//                 className="custom-datepicker"
//               />
//             </div>
//           )}

//           <div className="slots-table-container">
//             {loading ? (
//               <div className="loading">Loading slots...</div>
//             ) : error ? (
//               <div className="error">{error}</div>
//             ) : filteredSlots.length === 0 ? (
//               <div className="no-slots">No slots available</div>
//             ) : (
//               <table className="slots-table">
//                 <thead>
//                   <tr>
//                     <th>Date</th> {/* New Date column */}
//                     <th>Time</th>
//                     <th>Status</th>
//                     <th>Duration</th>
//                     <th>Slot Type</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredSlots.map((slot, index) => (
//                     <tr key={index}>
//                       <td>{format(selectedDate, 'MMM d, yyyy')}</td>
//                       <td>{`${slot.startTime} - ${slot.endTime}`}</td>
//                       <td className={getStatusClass(slot.status)}>{slot.status}</td>
//                       <td>{slot.duration} mins</td>
//                       <td>{slot.slotType}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Coachdashboard;







import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Coachdashboard.css';
import { format, addDays, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from '../../config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
        return 'status-available';
      case 'completed':
        return 'status-completed';
      case 'upcoming':
        return 'status-upcoming';
      case 'cancelled':
        return 'status-cancelled';
      case 'booked':
        return 'status-booked';
      default:
        return '';
    }
  };

  return (
    <div className="container">
      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleMenu}>
          &times;
        </button>
        <nav>
          <ul>
            <li onClick={() => navigate('/Coach-Profile')}>Profile</li>
            <li onClick={() => navigate('/Coach-Analytics')}>Analytics</li>
            <li onClick={() => navigate('/Schedule')}>Scheduler</li>
            <li className="logout" onClick={() => {
              localStorage.removeItem('coachId');
              localStorage.removeItem('email');
              navigate('/Coach-login');
            }}>
              Logout
            </li>
          </ul>
        </nav>
      </div>
      <div className="content">
        <header className="header">
          <div className="menu-icon" onClick={toggleMenu}>
            &#9776;
          </div>
          <h2>Welcome, Coach</h2>
          <div className="notification-icon-container">
            <div className="notification-icon">&#128276;</div>
            <div className="notification-cancel-line"></div>
          </div>
        </header>
        <main className="main-content">
          <div className="calendar-filter-container">
            <div className="calendar">
              <span className="calendar-icon" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                &#128197;
              </span>
              <div className="dates-row">
                <span className="arrow" onClick={handlePrevious}>&#10094;</span>
                {dates.map((date, index) => (
                  <span
                    key={index}
                    className={`date ${date.getTime() === selectedDate.getTime() ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {format(date, 'MMM d yyyy')}
                  </span>
                ))}
                <span className="arrow" onClick={handleNext}>&#10095;</span>
              </div>
            </div>
            <div className="filter-container">
              <label htmlFor="filter" className="filter-label">
                Filter:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="filter-dropdown"
              >
                <option value="All">All</option>
                <option value="completed">Completed</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="canceled">canceled</option>
              </select>
            </div>
          </div>

          {isCalendarOpen && (
            <div className="calendar-datePicker">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
                className="custom-datepicker"
              />
            </div>
          )}

          <div className="slots-table-container">
            {loading ? (
              <div className="loading">Loading slots...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : filteredSlots.length === 0 ? (
              <div className="no-slots">No slots available</div>
            ) : (
              <table className="slots-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Slot Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSlots.map((slot, index) => (
                    <tr key={index} onClick={() => handleRowClick(slot)}>
                      <td>{format(selectedDate, 'MMM d, yyyy')}</td>
                      <td>{`${slot.startTime} - ${slot.endTime}`}</td>
                      <td className={getStatusClass(slot.status)}>{slot.status}</td>
                      <td>{slot.duration} mins</td>
                      <td>{slot.slotType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

   
      {selectedBooking && (
  <div className="custom-modal">
    <div className="modal-content">
  
      <button className="close-modal" onClick={() => setSelectedBooking(null)}>
        &times;
      </button>
      
      <h3>Booking Details</h3>
      <br></br>
      <div>
        <p><strong>User Name:</strong> {selectedBooking.userName}</p>
        <p><strong>Child Name:</strong> {selectedBooking.childName}</p>
        <p><strong>Date:</strong> {selectedBooking.date?.split('T')[0]}</p>
        <p><strong>Start Time:</strong> {selectedBooking.startTime}</p>
        <p><strong>End Time:</strong> {selectedBooking.endTime}</p>
        <p><strong>Slot Type:</strong> {selectedBooking.slotType}</p>
     
        <p><strong>Status:</strong> <span>{selectedBooking.status}</span></p>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Coachdashboard;
