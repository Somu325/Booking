import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,

  ListItemText,
  Collapse,
  Box,
  Typography,
} from '@mui/material';
import {  ListItemButton } from '@mui/joy';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './RealTime.css'; // Import the CSS for styling
import { Domain_URL } from "../../config";

interface User {
  userId: string;
  name: string;
  gender: string;
  mobileNumber: string;
}

const RealTime: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeSessions, setActiveSessions] = useState<number>(0);
  const [bookedSlots, setBookedSlots] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<User[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [dashboardOpen, setDashboardOpen] = useState<boolean>(false);
  const [userOpen, setUserOpen] = useState<boolean>(false);
  const [coachOpen, setCoachOpen] = useState<boolean>(false);
  const [, setBookingOpen] = useState<boolean>(false);

  // Fetch data for analytics
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch total user count
        const usersResponse = await axios.get(`${Domain_URL}/user/count`);
        setTotalUsers(usersResponse.data.count);

        // Fetch active sessions count
        const sessionsResponse = await axios.get(`${Domain_URL}/bookings/progress/count`);
        setActiveSessions(sessionsResponse.data.count);

        // Fetch booked slots count
        const slotsResponse = await axios.get(`${Domain_URL}/slot/booked/count`);
        setBookedSlots(slotsResponse.data.count);

        // Fetch user details
        const userDetailsResponse = await axios.get(`${Domain_URL}/user/users`);
        setUserDetails(userDetailsResponse.data);
      } catch (error:any) {
        console.error('Error fetching user data: ', error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Toggle Sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleDashboardMenu = () => {
    setDashboardOpen((prev) => !prev);
  };

  const toggleUserMenu = () => {
    setUserOpen((prev) => !prev);
  };

  const toggleCoachMenu = () => {
    setCoachOpen((prev) => !prev);
  };

  const toggleBookingMenu = () => {
    setBookingOpen((prev) => !prev);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Real-Time Analytics
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
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
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/AdminOverview">
                  <ListItemText primary="Overview" />
                </ListItemButton >
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/Analyst">
                  <ListItemText primary="Analytics" />
                </ListItemButton >
              </List>
            </Collapse>

            <ListItemButton onClick={toggleUserMenu}>
              <GroupIcon />
              <ListItemText primary="Manage Coach" />
              {userOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton >
            <Collapse in={userOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/ManageCoach">
                  <ListItemText primary="Coach Profile" />
                </ListItemButton >
              </List>
            </Collapse>

            <ListItemButton onClick={toggleCoachMenu}>
              <PersonIcon />
              <ListItemText primary="Manage User" />
              {coachOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton >
            <Collapse in={coachOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/ManageUser">
                  <ListItemText primary="User Profile" />
                </ListItemButton >
              </List>
            </Collapse>

            <ListItemButton onClick={toggleBookingMenu} component={Link} to="/Booking">
              <InsertInvitationIcon />
              <ListItemText primary="Booking" />
            </ListItemButton >
          </List>
        </Box>
      </Drawer>

      {/* Real-time Analytics Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
        <div className="analytics-container">
          <h1>Analytics</h1>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Users</h3>
              <p>{totalUsers}</p>
            </div>
            <div className="summary-card">
              <h3>Active Sessions</h3>
              <p>{activeSessions}</p>
            </div>
            <div className="summary-card">
              <h3>Booked Slots</h3>
              <p>{bookedSlots}</p>
            </div>
          </div>

          <h2>User Details</h2>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Mobile Number</th>
              </tr>
            </thead>
            <tbody>
              {userDetails.length > 0 ? (
                userDetails.map((user) => (
                  <tr key={user.userId}>
                    <td>
                      {user?.name
                        ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()
                        : 'N/A'}
                    </td>
                    <td>
                      {user?.gender
                        ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase()
                        : 'N/A'}
                    </td>
                    <td>{user?.mobileNumber || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No user details available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Box>
    </div>
  );
};

export default RealTime;
