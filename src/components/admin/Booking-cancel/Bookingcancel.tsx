import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingTable.css';
import { Domain_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface Booking {
  bookingId: string;
  user: { userId: string; name: string };
  child?: { childId: string; name: string };
  coach: { coachId: string; name: string };
  slot: { slotId: string; startTime: string; endTime: string; date: string };
  status: 'completed' | 'canceled' | 'booked';
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const utc6Date = new Date(date.getTime() - 6 * 60 * 60 * 1000);

  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'America/Chicago',
  };

  return utc6Date.toLocaleDateString('en-US', options);
};

const BookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const bookingsPerPage = 10;
  const navigate = useNavigate();

  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get<Booking[]>(`${Domain_URL}/allbookings`);
        setBookings(response.data);
        setFilteredBookings(response.data);
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };
    fetchBookings();
  }, []);

  const openCancelModal = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    try {
      await axios.post(`${Domain_URL}/bookings/${bookingToCancel}/cancel`);
      setFilteredBookings(filteredBookings.map(b =>
        b.bookingId === bookingToCancel ? { ...b, status: 'canceled' } : b
      ));
      setShowModal(false);
      setBookingToCancel(null);
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const selectedDateStr = formatDate(date.toISOString());
      const filtered = bookings.filter(b => formatDate(b.slot.date) === selectedDateStr);
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
    setCurrentPage(0);
  };

  const paginatedBookings = filteredBookings.slice(
    currentPage * bookingsPerPage,
    (currentPage + 1) * bookingsPerPage
  );

  return (
    <div className="booking-table-container">
      <h2>Bookings</h2>
      <button onClick={goBackToDashboard} className="go-back-button">
        <FaArrowLeft /> Go Back to Dashboard
      </button>
      <div className="date-picker">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Select a date"
          dateFormat="MM/dd/yyyy"
          className="date-input"
        />
      </div>

      <table className="booking-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User Name</th>
            <th>Child Name</th>
            <th>Coach Name</th>
            <th>Status</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBookings.map((booking) => (
            <tr key={booking.bookingId}>
              <td>{booking.bookingId}</td>
              <td>{booking.user.name}</td>
              <td>{booking.child?.name || 'N/A'}</td>
              <td>{booking.coach.name}</td>
              <td>{booking.status}</td>
              <td>{booking.slot.startTime}</td>
              <td>{booking.slot.endTime}</td>
              <td>{new Date(booking.slot.date).toISOString().slice(5, 10).replace('-', '/') + '/' + new Date(booking.slot.date).getFullYear()}</td>
              <td>
                {booking.status !== 'canceled' ? (
                  <button
                    className="cancel-button"
                    onClick={() => openCancelModal(booking.bookingId)}
                  >
                    Cancel
                  </button>
                ) : (
                  'Canceled'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={''}
        pageCount={Math.ceil(filteredBookings.length / bookingsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Cancellation</h3>
            <p>Are you sure you want to cancel this booking?</p>
            <button onClick={handleCancelConfirm} className="confirm-button">Yes, Cancel</button>
            <button onClick={() => setShowModal(false)} className="cancel-button1">No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;
