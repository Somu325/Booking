
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
  status: string;
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

export default function BookingTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [cancelComment, setCancelComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const bookingsPerPage = 10;
  const navigate = useNavigate();

  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get<Booking[]>(`${Domain_URL}/allbookings`);
        const sortedBookings = sortBookings(response.data);
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };
    fetchBookings();
  }, []);

  const sortBookings = (bookingsToSort: Booking[]) => {
    return bookingsToSort.sort((a, b) => {
      if ((a.status === 'completed' || a.status === 'canceled') && (b.status !== 'completed' && b.status !== 'canceled')) {
        return 1;
      }
      if ((b.status === 'completed' || b.status === 'canceled') && (a.status !== 'completed' && a.status !== 'canceled')) {
        return -1;
      }

      const dateA = new Date(a.slot.date).getTime();
      const dateB = new Date(b.slot.date).getTime();

      if (dateA !== dateB) {
        return dateA - dateB;
      }

      const timeA = new Date(`1970-01-01T${a.slot.startTime}`).getTime();
      const timeB = new Date(`1970-01-01T${b.slot.startTime}`).getTime();

      return timeA - timeB;
    });
  };

  const openCancelModal = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel || !cancelComment) return;

    setIsLoading(true);
    try {
      await axios.patch(`${Domain_URL}/bookings/${bookingToCancel}/cancel`, { comment: cancelComment });
      const updatedBookings = bookings.map(b =>
        b.bookingId === bookingToCancel ? { ...b, status: 'canceled' } : b
      );
      const sortedBookings = sortBookings(updatedBookings);
      setBookings(sortedBookings);
      filterBookings(sortedBookings, selectedDate, selectedStatus);
      setShowModal(false);
      setBookingToCancel(null);
      setCancelComment('');
    } catch (error) {
      console.error('Error canceling booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const filterBookings = (bookingsToFilter: Booking[], date: Date | null, status: string) => {
    let filtered = bookingsToFilter;

    if (date) {
      const selectedDateStr = formatDate(date.toISOString());
      filtered = filtered.filter(b => formatDate(b.slot.date) === selectedDateStr);
    }

    if (status !== 'all') {
      filtered = filtered.filter(b => b.status === status);
    }

    setFilteredBookings(sortBookings(filtered));
    setCurrentPage(0);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    filterBookings(bookings, date, selectedStatus);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value;
    setSelectedStatus(status);
    filterBookings(bookings, selectedDate, status);
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
      <div className="filters">
        <div className="date-picker">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="Select a date"
            isClearable
            dateFormat="MM/dd/yyyy"
            className="date-input"
          />
        </div>
        <div className="status-filter">
          <select value={selectedStatus} onChange={handleStatusChange} className="status-select">
            <option value="all">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="completed">Completed</option>
            <option value="canceled">Cancelled</option>
            <option value="upcoming">Upcoming</option>
            <option value="inprogress">In Progress</option>
          </select>
        </div>
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
                    disabled={booking.status === 'completed' || booking.status === 'inprogress'}
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Cancellation</h3>
            <p>Select a reason for cancellation:</p>
            <select
              value={cancelComment}
              onChange={(e) => setCancelComment(e.target.value)}
              className="comment-select"
            >
              <option value="">Select a reason</option>
              <option value="personal reason">Personal Reason</option>
              <option value="not available">Not Available</option>
              <option value="had other work">Had Other Work</option>
            </select>
            <button
              onClick={handleCancelConfirm}
              className="confirm-button"
              disabled={!cancelComment || isLoading}
            >
              {isLoading ? 'Canceling...' : 'Yes, Cancel'}
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="cancel-button1"
              disabled={isLoading}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
