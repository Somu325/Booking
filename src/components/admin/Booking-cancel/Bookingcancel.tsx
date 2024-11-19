
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

export default function Component() {
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

      const dateA = a.slot?.date ? new Date(a.slot.date).getTime() : 0;
      const dateB = b.slot?.date ? new Date(b.slot.date).getTime() : 0;

      if (dateA !== dateB) {
        return dateA - dateB;
      }

      const timeA = a.slot?.startTime ? new Date(`1970-01-01T${a.slot.startTime}`).getTime() : 0;
      const timeB = b.slot?.startTime ? new Date(`1970-01-01T${b.slot.startTime}`).getTime() : 0;

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
      const selectedDateStr = date.toISOString().split('T')[0];
      filtered = filtered.filter(b => {
        if (!b.slot?.date) return false;
        const bookingDateStr = new Date(b.slot.date).toISOString().split('T')[0];
        return bookingDateStr === selectedDateStr;
      });
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

      <div className="booking-data">
        <table className="booking-table">
          <thead>
            <tr>
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
                <td>{booking.user?.name || 'N/A'}</td>
                <td>{booking.child?.name || 'N/A'}</td>
                <td>{booking.coach?.name || 'N/A'}</td>
                <td>{booking.status}</td>
                <td>{booking.slot?.startTime || 'N/A'}</td>
                <td>{booking.slot?.endTime || 'N/A'}</td>
                <td>
                  {booking.slot?.date
                    ? new Date(booking.slot.date).toISOString().slice(5, 10).replace('-', '/') + '/' + new Date(booking.slot.date).getFullYear()
                    : 'N/A'}
                </td>
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

        <div className="booking-cards">
          {paginatedBookings.map((booking) => (
            <div key={booking.bookingId} className="booking-card">
              <div><strong>User:</strong> {booking.user?.name || 'N/A'}</div>
              <div><strong>Child:</strong> {booking.child?.name || 'N/A'}</div>
              <div><strong>Coach:</strong> {booking.coach?.name || 'N/A'}</div>
              <div><strong>Status:</strong> {booking.status}</div>
              <div><strong>Start Time:</strong> {booking.slot?.startTime || 'N/A'}</div>
              <div><strong>End Time:</strong> {booking.slot?.endTime || 'N/A'}</div>
              <div><strong>Date:</strong> {booking.slot?.date
                ? new Date(booking.slot.date).toISOString().slice(5, 10).replace('-', '/') + '/' + new Date(booking.slot.date).getFullYear()
                : 'N/A'}
              </div>
              <div>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReactPaginate
        // previousLabel={'Previous'}
        // nextLabel={'Next'}

        previousLabel={<span style={{ backgroundColor: 'lightblue', padding: '5px' }}>Previous</span>}
        nextLabel={<span style={{ backgroundColor: 'lightgreen', padding: '5px' }}>Next</span>}
        breakLabel={''}
        pageCount={Math.ceil(filteredBookings.length / bookingsPerPage)}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
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