import { useEffect, useState } from 'react';
import {
 Typography,
  Box,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Button,
  Modal,
} from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';

import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import "./AdminOverview.css";
import { Domain_URL } from "../../config";

import { useNavigate } from 'react-router-dom'; 
// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register the necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminOverview = () => {
  // States for navigation and data
  const navigate = useNavigate();

  const [totalBookings, setTotalBookings] = useState(0);
  const [monthlyBookings, setMonthlyBookings] = useState<any[]>([]);
  const [bookingTrends, setBookingTrends] = useState<any[]>([]);
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal handlers
  const handleModalOpen = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  
  const fetchData = async () => {
    setLoading(true);
    try {
      const bookingsResponse = await axios.get(`${Domain_URL}/monthly-bookings`);
      const trendsResponse = await axios.get(`${Domain_URL}/booking-trends`);
      const listResponse = await axios.get(`${Domain_URL}/bookings`);

      const formattedTrends = trendsResponse.data.map((t: any) => ({
        month: new Date(t.month).toLocaleString('default', { month: 'long' }),
        completed: parseInt(t.completed, 10),
        canceled: parseInt(t.canceled, 10),
      }));

      const formattedBookings = bookingsResponse.data.map((booking: any) => ({
        month: new Date(booking.month).toLocaleString('default', { month: 'long' }),
        totalBookings: booking.totalBookings,
      }));

      setMonthlyBookings(formattedBookings);
      setBookingTrends(formattedTrends);
      setBookingList(listResponse.data);
      setTotalBookings(listResponse.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Data for charts
  const barData = {
    labels: monthlyBookings.map((data) => data.month),
    datasets: [
      {
        label: 'Total Bookings',
        data: monthlyBookings.map((data) => data.totalBookings),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: bookingTrends.map((trend) => trend.month),
    datasets: [
      {
        label: 'Completed Bookings',
        data: bookingTrends.map((trend) => trend.completed),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const pieData = {
    labels: ['Total Bookings', 'Remaining Capacity'],
    datasets: [
      {
        label: 'Booking Distribution',
        data: [totalBookings, 100 - totalBookings],
        backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
      },
    ],
  };

  const filteredBookings = bookingList.filter((booking) =>
    booking.bookingId.toString().includes(filter) || booking.userId.toString().includes(filter)
  );


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
<div>
<button onClick={goBackToDashboard} className="go-back-button">
        <FaArrowLeft /> Go Back to Dashboard
      </button>
         <h2> Manage user accounts</h2>

      {/* Main Content */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Admin Overview
      </Typography>

      {/* Charts (Bar and Line Side by Side) */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Total Bookings Bar Chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '400px' }}>
            <Typography variant="h6">Total Bookings</Typography>
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </Box>
        </Grid>

        {/* Booking Trends Line Chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '400px' }}>
            <Typography variant="h6">Booking Trends</Typography>
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </Box>
        </Grid>
      </Grid>

      {/* Pie Chart for Booking Distribution */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Booking Distribution</Typography>
        <Pie data={pieData} />
      </Box>

      {/* Filter and Booking List */}
      <TextField
        label="Filter by Booking ID or User ID"
        variant="outlined"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Booking List
      </Typography>
      <Grid container spacing={2}>
        {filteredBookings.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking.id}>
            <Card onClick={() => handleModalOpen(booking)} sx={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h6">Booking ID: {booking.bookingId}</Typography>
                <Typography>User ID: {booking.userId}</Typography>
                <Typography>Date: {new Date(booking.date).toLocaleDateString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for Booking Details */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2, maxWidth: 600, margin: 'auto', marginTop: '10%' }}>
          {selectedBooking && (
            <>
              <Typography variant="h6">Booking Details</Typography>
              <Typography>Booking ID: {selectedBooking.bookingId}</Typography>
              <Typography>User ID: {selectedBooking.userId}</Typography>
              <Typography>Date: {new Date(selectedBooking.date).toLocaleDateString()}</Typography>
              <Typography>Status: {selectedBooking.status}</Typography>
            </>
          )}
          <Button onClick={handleModalClose} sx={{ mt: 2 }} variant="contained">
            Close
          </Button>
        </Box>
      </Modal>

    </div>
  );
};

export default AdminOverview;
