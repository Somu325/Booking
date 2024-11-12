
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import './RealTime.css'; // Import the CSS for styling
import { Domain_URL } from "../../config";
import { useNavigate } from 'react-router-dom';

interface User {
  userId: string;
  name: string;
  gender: string;
  mobileNumber: string;
  email: string;
}

const RealTime: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeSessions, setActiveSessions] = useState<number>(0);
  const [bookedSlots, setBookedSlots] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<User[]>([]);
  const navigate = useNavigate();

  // Fetch data for analytics
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch total user count
        const usersResponse = await axios.get(`${Domain_URL}/user/count`);
        console.log('Total Users Response:', usersResponse.data);
        setTotalUsers(usersResponse.data.count);

        // Fetch active sessions count
        const sessionsResponse = await axios.get(`${Domain_URL}/bookings/progress/count`);
        console.log('Active Sessions Response:', sessionsResponse.data);
        setActiveSessions(sessionsResponse.data.count);

        // Fetch booked slots count
        const slotsResponse = await axios.get(`${Domain_URL}/slot/booked/count`);
        console.log('Booked Slots Response:', slotsResponse.data);
        setBookedSlots(slotsResponse.data.count);

        // Fetch user details and sort them by name in ascending order
        const userDetailsResponse = await axios.get(`${Domain_URL}/user/users`);
        console.log('User Details Response:', userDetailsResponse.data); // Log response here
        const sortedUserDetails = userDetailsResponse.data.sort((a: User, b: User) => 
          a.name.localeCompare(b.name)
        );
        setUserDetails(sortedUserDetails);
      } catch (error: any) {
        console.error('Error fetching user data: ', error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <button onClick={goBackToDashboard} className="go-back-button">
        <FaArrowLeft /> Go Back to Dashboard
      </button>

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
                <th>Email</th>
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
                    <td>{user?.email}</td>
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
