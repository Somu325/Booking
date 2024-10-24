import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Importing Bar chart from react-chartjs-2
import { Typography, Box, AppBar, Toolbar, IconButton, Drawer, List,  ListItemText, Collapse, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import { Link } from 'react-router-dom'; 
import "./Dashboard.css"
import { Domain_URL } from "../../config";
import {  ListItemButton } from '@mui/joy';

// Weekday labels
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Dashboard () {
  const [dailyData, setDailyData] = useState<{ labels: string[], datasets: { data: number[] }[] }>({ labels: [], datasets: [{ data: [] }] });
  const [weeklyData, setWeeklyData] = useState<{ labels: string[], datasets: { data: number[] }[] }>({ labels: [], datasets: [{ data: [] }] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dailyResponse = await axios.get( `${Domain_URL}/daily`);
        const weeklyResponse = await axios.get(`${Domain_URL}/weekly`);

        // Process daily bookings data
        const dailyCounts = Array(7).fill(0); // Initialize counts for 7 days
        dailyResponse.data.forEach((booking: any) => {
          const dayIndex = new Date(booking.day).getDay();
          dailyCounts[dayIndex] += booking.totalBookings;
        });

        // Set daily chart data
        setDailyData({
          labels: weekdays,
          datasets: [{ data: dailyCounts }]
        });

        // Process weekly bookings data
        const weeklyCounts = weeklyResponse.data.map((booking: any) => booking.totalBookings);
        const weeklyLabels = weeklyResponse.data.map((booking: any) => booking.week);

        // Set weekly chart data
        setWeeklyData({
          labels: weeklyLabels,
          datasets: [{ data: weeklyCounts }]
        });

        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDashboardMenu = () => {
    setDashboardOpen(!dashboardOpen);
  };

  const toggleUserMenu = () => {
    setUserOpen(!userOpen);
  };

  const toggleCoachMenu = () => {
    setCoachOpen(!coachOpen);
  };

  const toggleBookingMenu = () => {
    setBookingOpen(!bookingOpen);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography className='Admin' variant="h6" sx={{ flexGrow: 1 }}>
             Admin Dashboard
          </Typography>


        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItemButton onClick={toggleDashboardMenu}>
              <DashboardIcon />
              <ListItemText primary="Dashboard" />
              {dashboardOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={dashboardOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} onClick={toggleSidebar} component={Link} to="/AdminOverview">
                  <ListItemText primary="Overview" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} onClick={toggleSidebar} component={Link} to="/Analyst">
                  <ListItemText primary="Analytics" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={toggleUserMenu}>
              <GroupIcon />
              <ListItemText primary="Manage Coach" />
              {userOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={userOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/ManageCoach">
                  <ListItemText primary="Coach Profile" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={toggleCoachMenu}>
              <PersonIcon />
              <ListItemText primary="Manage User" />
              {coachOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={coachOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/ManageUser">
                  <ListItemText primary="User Profile" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={toggleBookingMenu} component={Link} to="/Booking">
              <InsertInvitationIcon />
              <ListItemText primary="Booking" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading data...</p>
        ) : (
          <>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="h5">Daily Bookings</Typography>
                  <Box sx={{ width: '100%', maxWidth: '600px', mx: 'auto', mt: 2 }}>
                    <Bar
                      data={{
                        labels: dailyData.labels,
                        datasets: [{
                          label: 'Daily Bookings',
                          data: dailyData.datasets[0].data,
                          backgroundColor: 'rgba(255, 165, 0, 0.6)', // Orange color
                        }]
                      }}
                      options={{ maintainAspectRatio: false }}
                      height={200}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="h5">Weekly Bookings</Typography>
                  <Box sx={{ width: '100%', maxWidth: '600px', mx: 'auto', mt: 2 }}>
                    <Bar
                      data={{
                        labels: weeklyData.labels,
                        datasets: [{
                          label: 'Weekly Bookings',
                          data: weeklyData.datasets[0].data,
                          backgroundColor: 'rgba(0, 77, 64, 0.6)', // Dark green color
                        }]
                      }}
                      options={{ maintainAspectRatio: false }}
                      height={200}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </div>
  );
};

export default Dashboard;
