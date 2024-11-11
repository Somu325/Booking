import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios for API calls
import './BookingList.css'; // Import the CSS file for styling
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

interface Booking {
  id: string; // Assuming each booking has a unique ID
  userName: string;
  coachName: string;
  status: string;
  slotId: string;
}

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]); // State to store booking data
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); // State to store the selected booking
  const [error, setError] = useState<string | null>(null); // State to store error messages

  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Number of rows per page

  // Function to fetch booking data from the API
  const fetchBookings = async () => {
    try {
      const response = await axios.get<Booking[]>(`${Domain_URL}/bookingsName`); // Replace with your API endpoint
      setBookings(response.data); // Assuming the response data is an array of bookings
    } catch (error) {
      console.error('Error fetching booking data:', error);
      setError('Failed to load bookings. Please try again later.');
    }
  };

  // Fetch bookings when the component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking); // Set the selected booking for viewing
  };

  const closeDetails = () => {
    setSelectedBooking(null); // Clear the selected booking
  };



  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  
  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Calculate paginated bookings
  const paginatedBookings = bookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div >
       <button onClick={goBackToDashboard} className="go-back-button">
        <FaArrowLeft /> Go Back to Dashboard
      </button>
         <h2> Manage user accounts</h2>

      {/* Booking List Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
        <h2>Booking Details</h2>
        {error && <Typography color="error">{error}</Typography>} {/* Display error message if any */}
        <TableContainer style={{ overflowX: 'auto' }}>
          <Table className="booking-table">
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Coach Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBookings.map((booking) => (
                <TableRow key={booking.id}> {/* Use unique ID as key */}
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

        {/* Table Pagination */}
        <TablePagination
          component="div"
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
        />

        {/* Booking Details Modal */}
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
