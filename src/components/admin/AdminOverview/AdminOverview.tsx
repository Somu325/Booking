// /* eslint-disable @typescript-eslint/no-explicit-any */

// 'use client'

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

import {  useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import "./AdminOverview.css";
import { Domain_URL } from "../../config";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaArrowLeft } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminOverview() {
  const navigate = useNavigate();

  const [totalBookings, setTotalBookings] = useState(0);
  const [monthlyBookings, setMonthlyBookings] = useState<any[]>([]);
  const [bookingTrends, setBookingTrends] = useState<any[]>([]);
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDateToCST = (dateString: string) => {
    const date = new Date(dateString);
    const isDST = date.getMonth() > 2 && date.getMonth() < 11;
    const timeZoneOffset = isDST ? 5 : 6;
    date.setHours(date.getHours() - timeZoneOffset);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('en-US');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const bookingsResponse = await axios.get(`${Domain_URL}/monthly-bookings`);
      const trendsResponse = await axios.get(`${Domain_URL}/booking-trends`);
      const listResponse = await axios.get(`${Domain_URL}/bookingsName`);
      const currentMonthUTC = new Date().getUTCMonth();

      const formattedTrends = trendsResponse.data
        .filter((t: any) => new Date(t.month).getUTCMonth() === currentMonthUTC)
        .map((t: any) => ({
          month: new Date(t.month).toLocaleString('default', { month: 'long', timeZone: 'UTC' }),
          completed: parseInt(t.completed, 10),
          canceled: parseInt(t.canceled, 10),
        }));

      const formattedBookings = bookingsResponse.data.map((booking: any) => ({
        month: new Date(booking.month).toLocaleString('default', { month: 'long', timeZone: 'UTC' }),
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

  const barDataMonthly = {
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

  const barDataTrends = {
    labels: bookingTrends.map((trend) => trend.month),
    datasets: [
      {
        label: 'Completed Bookings',
        data: bookingTrends.map((trend) => trend.completed),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const filteredBookings = bookingList.filter((booking) =>
    (booking.coachName?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    (booking.userName?.toLowerCase() || '').includes(filter.toLowerCase())
  );

  const handleModalOpen = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };
  const goBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
     
     <button onClick={goBackToDashboard} className="go-back-button">
        <FaArrowLeft /> Go Back to Dashboard
      </button>
      <Typography sx={{ mt: 4 }} variant="h5" fontWeight="bold" gutterBottom>
        Admin Overview
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '400px' }}>
            <Typography variant="h6">Total Bookings</Typography>
            <Bar data={barDataMonthly} options={{ maintainAspectRatio: false }} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '400px' }}>
            <Typography variant="h6">Booking Trends</Typography>
            <Bar data={barDataTrends} options={{ maintainAspectRatio: false }} />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2, mt: 10, width: '350px', ml: 110 }}>
        <TextField
          label="Search by Coach Name or Username"
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          fullWidth
        />
      </Box>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Booking List
      </Typography>
      <Grid container spacing={2}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.id}>
              <Card onClick={() => handleModalOpen(booking)} sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography>User Name: {booking.userName}</Typography>
                  <Typography>Child Name: {booking.childName}</Typography>
                  <Typography>Coach Name: {booking.coachName}</Typography>
                  <Typography>Date: {formatDateToCST(booking.date)}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              No bookings found
            </Typography>
          </Grid>
        )}
      </Grid>

      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2, maxWidth: 300, margin: 'auto', marginTop: '10%' }}>
          {selectedBooking && (
            <>
              <Typography variant="h6">Booking Details</Typography>
               <Typography>Booking ID: {selectedBooking.bookingId}</Typography>
               <Typography>User Name: {selectedBooking.userName}</Typography>
               <Typography>Coach Name: {selectedBooking.coachName}</Typography>
               <Typography>Date: {formatDateToCST(selectedBooking.date)}</Typography>
               <Typography>Status: {selectedBooking.status}</Typography>
              <Button variant="contained" onClick={handleModalClose} sx={{ mt: 2 }}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}



