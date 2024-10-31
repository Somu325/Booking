'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CssVarsProvider,
  extendTheme,
  CssBaseline,
  Box,
  Typography,
  Table,
  Sheet,
  Chip,
  CircularProgress,
  Modal,
  ModalClose,
  ModalDialog,
  Button,
  Select,
  Option,
  FormControl,
  FormLabel,
  Input,
} from '@mui/joy';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Domain_URL } from '../../config';


// Define the Booking interface with the new date property
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
  date: string | null; // Add date property
}

const theme = extendTheme({
  // Theme customization (colors, typography, etc.)
});

export default function CoachAnalytics() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [childNameSearch, setChildNameSearch] = useState<string>(''); // State for child name search
  const [startTimeSearch, setStartTimeSearch] = useState<string>(''); // State for start time search
  const [endTimeSearch, setEndTimeSearch] = useState<string>(''); // New state for end time search
  const [startDate, setStartDate] = useState<string>(''); // New state for start date
  const [endDate, setEndDate] = useState<string>(''); // New state for end date

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Change this value for items per page

  const navigate = useNavigate();
  const CoachId = localStorage.getItem('coachId'); // Get the logged-in coach ID from local storage
  const coachName = localStorage.getItem('coachName'); // Get the logged-in coach name from local storage

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter, childNameSearch, startTimeSearch, endTimeSearch, startDate, endDate]); // Add date range to dependency array

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Booking[]>(`${Domain_URL}/coaches/${CoachId}/bookings`);
      setBookings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('No booking history. Please book a slot.');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(
        (booking) => booking.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by child name
    if (childNameSearch) {
      filtered = filtered.filter((booking) =>
        booking.childName?.toLowerCase().includes(childNameSearch.toLowerCase())
      );
    }

    // Filter by start time
    if (startTimeSearch) {
      filtered = filtered.filter((booking) =>
        booking.startTime?.includes(startTimeSearch)
      );
    }

    // Filter by end time
    if (endTimeSearch) {
      filtered = filtered.filter((booking) =>
        booking.endTime?.includes(endTimeSearch)
      );
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.date || '').getTime();
        return bookingDate >= new Date(startDate).getTime();
      });
    }

    if (endDate) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.date || '').getTime();
        return bookingDate <= new Date(endDate).getTime();
      });
    }

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, 'primary' | 'success' | 'danger' | 'neutral'> = {
      progress: 'primary',
      completed: 'success',
      canceled: 'danger',
      upcoming: 'neutral',
    };
    return statusColors[status.toLowerCase()] || 'neutral';
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const currentItems = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          p: 4,
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Box sx={{ maxWidth: 2000 }}>
          <Button
            startDecorator={<ArrowBack />}
            onClick={() => navigate('/Coach-Dashboard')}
            variant="outlined"
            color="neutral"
            sx={{
              mb: 2,
              backgroundColor: '#0B6BCB',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1b90ed', // Change to blue on hover
              },
            }}
          >
            Back to Dashboard
          </Button>

          {/* Display logged-in coach information */}
          {coachName && (
            <Typography level="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
              Coach: {coachName}
            </Typography>
          )}

          <Typography level="h2" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
            Analytics
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'flex-end' }}>
            <FormControl>
              <FormLabel>Filter by Status</FormLabel>
              <Select 
                value={statusFilter} 
                onChange={(_, value) => setStatusFilter(value || '')} 
              >
                <Option value="">Booked</Option>
                <Option value="progress">Progress</Option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Search by Child Name</FormLabel>
              <Input
                value={childNameSearch}
                onChange={(e) => setChildNameSearch(e.target.value)}
                placeholder="Enter child name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Search by Start Time</FormLabel>
              <Input
                value={startTimeSearch}
                onChange={(e) => setStartTimeSearch(e.target.value)}
                placeholder="Enter start time"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Search by End Time</FormLabel>
              <Input
                value={endTimeSearch}
                onChange={(e) => setEndTimeSearch(e.target.value)}
                placeholder="Enter end time"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormControl>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography sx={{ textAlign: 'center' }}>{error}</Typography>
          ) : (
            <Sheet variant="outlined" sx={{ borderRadius: 'sm', overflow: 'auto' }}>
              <Table stickyHeader>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Child</th>
                    <th>Coach</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Duration</th>
                    <th>Slot Type</th>
                    <th>Status</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((booking) => (
                      <tr key={booking.bookingId} onClick={() => setSelectedBooking(booking)} style={{ cursor: 'pointer' }}>
                        <td>{booking.userName}</td>
                        <td>{booking.childName}</td>
                        <td>{booking.coachName}</td>
                        <td>{booking.date?.split('T')[0]}</td>
                        <td>{booking.startTime}</td>
                        <td>{booking.endTime}</td>
                        <td>{booking.slotDuration}</td>
                        <td>{booking.slotType}</td>
                        <td>
                          <Chip color={getStatusColor(booking.status)}>{booking.status}</Chip>
                        </td>
                        {/* <td>
                          <Button onClick={() => {}}><RemoveRedEyeIcon/></Button>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center' }}>No bookings found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Sheet>
          )}

          {/* Pagination Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              <ArrowBackIosIcon/>
            </Button>
            <Typography >{`Page ${currentPage} of ${totalPages}`}</Typography>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outlined"
              sx={{ ml: 2 }}
            >
              <ArrowForwardIosIcon/>
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Modal for booking details */}
      <Modal open={Boolean(selectedBooking)} onClose={() => setSelectedBooking(null)}>
        <ModalDialog>
          <ModalClose />
          <Typography>Booking Details</Typography>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography><strong>User Name:</strong> {selectedBooking.userName}</Typography>
              <Typography><strong>Child Name:</strong> {selectedBooking.childName}</Typography>
              <Typography><strong>Coach Name:</strong> {selectedBooking.coachName}</Typography>
              <Typography><strong>Date:</strong> {selectedBooking.date}</Typography>
              <Typography><strong>Start Time:</strong> {selectedBooking.startTime}</Typography>
              <Typography><strong>End Time:</strong> {selectedBooking.endTime}</Typography>
              <Typography><strong>Slot Type:</strong> {selectedBooking.slotType}</Typography>
              <Typography><strong>Duration:</strong> {selectedBooking.slotDuration}</Typography>
              <Typography><strong>Status:</strong> <Chip color={getStatusColor(selectedBooking.status)}>{selectedBooking.status}</Chip></Typography>
            </Box>
          )}
          <Button variant="outlined" onClick={() => setSelectedBooking(null)} sx={{ mt: 2 }}>
            Close
          </Button>
        </ModalDialog>
      </Modal>
    </CssVarsProvider>
  );
}






