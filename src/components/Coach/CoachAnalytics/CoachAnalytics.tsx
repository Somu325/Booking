
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
  Card,
  CardContent,
  CardActions,
} from '@mui/joy';
import { ArrowBack, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from '../../config';

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
  const [childNameSearch, setChildNameSearch] = useState<string>('');
  const [startTimeSearch, setStartTimeSearch] = useState<string>('');
  const [endTimeSearch, setEndTimeSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const navigate = useNavigate();
  const CoachId = localStorage.getItem('coachId');
  const coachName = localStorage.getItem('coachName');

  useEffect(() => {
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, statusFilter, childNameSearch, startTimeSearch, endTimeSearch, startDate, endDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Booking[]>(`${Domain_URL}/coaches/${CoachId}/bookings`);
      
      const bookingsWithFormattedDates = response.data.map(booking => ({
        ...booking,
        date: booking.date ? new Date(booking.date).toISOString().split('T')[0] : null,
      }));

      const sortedBookings = bookingsWithFormattedDates.sort((a, b) => {
        const dateA = new Date(a.date || '').getTime();
        const dateB = new Date(b.date || '').getTime();
        const startTimeA = a.startTime ? new Date(`1970-01-01T${a.startTime}`) : new Date(0);
        const startTimeB = b.startTime ? new Date(`1970-01-01T${b.startTime}`) : new Date(0);

        if (dateA === dateB) {
          return startTimeA.getTime() - startTimeB.getTime();
        }
        return dateA - dateB;
      });

      setBookings(sortedBookings);
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
  
    if (statusFilter) {
      filtered = filtered.filter(
        (booking) => booking.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
  
    if (childNameSearch) {
      filtered = filtered.filter((booking) =>
        booking.childName?.toLowerCase().includes(childNameSearch.toLowerCase())
      );
    }
  
    if (startTimeSearch) {
      filtered = filtered.filter((booking) =>
        booking.startTime?.includes(startTimeSearch)
      );
    }
  
    if (endTimeSearch) {
      filtered = filtered.filter((booking) =>
        booking.endTime?.includes(endTimeSearch)
      );
    }
  
    const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
    const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';
  
    if (formattedStartDate) {
      filtered = filtered.filter((booking) => booking.date && booking.date >= formattedStartDate);
    }
  
    if (formattedEndDate) {
      filtered = filtered.filter((booking) => booking.date && booking.date <= formattedEndDate);
    }
  
    if (formattedStartDate && formattedEndDate && formattedStartDate === formattedEndDate) {
      filtered = filtered.filter((booking) => booking.date === formattedStartDate);
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

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentItems = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          p: { xs: 2, md: 4 },
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
                backgroundColor: '#1b90ed',
              },
            }}
          >
            Back to Dashboard
          </Button>

          {coachName && (
            <Typography level="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
              Coach: {coachName}
            </Typography>
          )}

          <Typography level="h2" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
            Analytics
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, justifyContent: 'flex-end' }}>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
              <FormLabel>Filter by Status</FormLabel>
              <Select 
                value={statusFilter} 
                onChange={(_, value) => setStatusFilter(value || '')} 
              >
                <Option value="">All</Option>
                <Option value="booked">booked</Option>
                <Option value="upcoming">Upcoming</Option>
                <Option value="progress">Progress</Option>
                <Option value="canceled">canceled</Option>
                <Option value="completed">completed</Option>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
              <FormLabel>Search by Child Name</FormLabel>
              <Input
                value={childNameSearch}
                onChange={(e) => setChildNameSearch(e.target.value)}
                placeholder="Enter child name"
              />
            </FormControl>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
              <FormLabel>Search by Start Time</FormLabel>
              <Input
                value={startTimeSearch}
                onChange={(e) => setStartTimeSearch(e.target.value)}
                placeholder="Enter start time"
              />
            </FormControl>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
              <FormLabel>Search by End Time</FormLabel>
              <Input
                value={endTimeSearch}
                onChange={(e) => setEndTimeSearch(e.target.value)}
                placeholder="Enter end time"
              />
            </FormControl>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
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
            <>
              {/* {/ Mobile view: Cards /} */}
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {currentItems.length > 0 ? (
                  currentItems.map((booking) => (
                    <Card key={booking.bookingId} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography level='body-md'>{booking.userName}</Typography>
                        <Typography>Child: {booking.childName}</Typography>
                        <Typography>Date: {booking.date}</Typography>
                        <Typography>Time: {booking.startTime} - {booking.endTime}</Typography>
                        <Typography>Duration: {booking.slotDuration}</Typography>
                        <Typography>Type: {booking.slotType}</Typography>
                        <Chip 
                          color={getStatusColor(booking.status)}
                          sx={{ mt: 1 }}
                        >
                          {booking.status}
                        </Chip>
                      </CardContent>
                      <CardActions>
                        <Button onClick={() => setSelectedBooking(booking)}>View Details</Button>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <Typography sx={{ textAlign: 'center' }}>No bookings found</Typography>
                )}
              </Box>

              {/* {/ Desktop view: Table /} */}
              <Sheet 
                variant="outlined" 
                sx={{ 
                  display: { xs: 'none', md: 'block' },
                  borderRadius: 'sm', 
                  overflow: 'auto' 
                }}
              >
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
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center' }}>No bookings found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Sheet>
            </>
          )}

          {/* {/ Pagination Controls /} */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              <ArrowBackIos />
            </Button>
            <Typography>{`Page ${currentPage} of ${totalPages}`}</Typography>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outlined"
              sx={{ ml: 2 }}
            >
              <ArrowForwardIos />
            </Button>
          </Box>
        </Box>
      </Box>

      {/* {/ Modal for booking details /} */}
      <Modal open={Boolean(selectedBooking)} onClose={() => setSelectedBooking(null)}>
        <ModalDialog>
          <ModalClose />
          <Typography>Booking Details</Typography>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography><strong>User Name:</strong> {selectedBooking.userName}</Typography>
              <Typography><strong>Child Name:</strong> {selectedBooking.childName}</Typography>
              <Typography><strong>Coach Name:</strong> {selectedBooking.coachName}</Typography>
              <Typography><strong>Date:</strong> {selectedBooking.date?.split('T')[0]}</Typography>
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