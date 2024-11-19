import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingList.css';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import { Domain_URL } from "../../config";
import { useNavigate } from 'react-router-dom'; 
import { useMediaQuery } from '@mui/material';

interface Booking {
  id: string;
  userName: string;
  coachName: string;
  status: string;
  slotId: string;
}

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const fetchBookings = async () => {
    try {
      const response = await axios.get<Booking[]>(`${Domain_URL}/bookingsName`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching booking data:', error);
      setError('Failed to load bookings. Please try again later.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const closeDetails = () => {
    setSelectedBooking(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

  const paginatedBookings = bookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <button onClick={goBackToDashboard} className="go-back-button">
        <FaArrowLeft /> Go Back to Dashboard
      </button>

      <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
        <h2>Booking Details</h2>
        {error && <Typography color="error">{error}</Typography>}

        {isMobile ? (
          <div>
            {paginatedBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <p><strong>User Name:</strong> {booking.userName}</p>
                <p><strong>Coach Name:</strong> {booking.coachName}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <p><strong>Slot ID:</strong> {booking.slotId}</p>
                <div className="booking-actions">
                  <button onClick={() => handleView(booking)}>View</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <TableContainer style={{ overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#007bff', '& .MuiTableCell-root': { color: 'white' }, '& .MuiTableRow-root:hover': { backgroundColor: 'transparent' } }}>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Coach Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.coachName}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      <button onClick={() => handleView(booking)}>View</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          component="div"
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'flex-start',
            paddingTop: 2,
          }}
        />

        <Dialog open={!!selectedBooking} onClose={closeDetails}>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <>
                <p><strong>User Name:</strong> {selectedBooking.userName}</p>
                <p><strong>Coach Name:</strong> {selectedBooking.coachName}</p>
                <p><strong>Status:</strong> {selectedBooking.status}</p>
                <p><strong>Slot ID:</strong> {selectedBooking.slotId}</p>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDetails} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default BookingList;
