
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Importing Bar chart from react-chartjs-2
import {
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  InsertInvitation as InsertInvitationIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Domain_URL } from "../../config";
import Cookies from 'js-cookie';
import moment from 'moment';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Dashboard() {
  const [dailyData, setDailyData] = useState<{ labels: string[]; datasets: { data: number[] }[] }>({
    labels: [], // Initialize as empty array
    datasets: [{ data: [] }], // Initialize with an empty dataset
  });
  const [weeklyData, setWeeklyData] = useState<{ labels: string[]; datasets: { data: number[] }[] }>({
    labels: [], // Initialize as empty array
    datasets: [{ data: [] }], // Initialize with an empty dataset
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dailyResponse = await axios.get(`${Domain_URL}/daily`);
        const weeklyResponse = await axios.get(`${Domain_URL}/weekly`);
  
        // Process daily bookings data
        const dailyCounts = Array(7).fill(0); // Initialize counts for 7 days
        dailyResponse.data.forEach((booking: any) => {
          const bookingDate = new Date(`${booking.day}T00:00:00-06:00`);
          const dayIndex = bookingDate.getDay();
          dailyCounts[dayIndex] += booking.totalBookings;
        });
  
        // Set daily chart data
        const dailyChartData = {
          labels: weekdays,
          datasets: [
            {
              label: 'Daily Bookings',
              data: dailyCounts,
              backgroundColor: 'rgba(255, 165, 0, 0.6)', // Orange color
            },
          ],
        };
  
        setDailyData(dailyChartData);
  
        // Process weekly bookings data with date range calculation
        const weeklyCounts = weeklyResponse.data.map((booking: any) => booking.totalBookings);
        const weeklyLabels = weeklyResponse.data.map((booking: any) => {
          if (booking.week) {
            let date: Date;
            try {
              date = new Date(booking.week);
              if (isNaN(date.getTime())) {
                date = new Date(`${booking.week}T00:00:00-06:00`);
              }
  
              if (isNaN(date.getTime())) {
                throw new Error(`Invalid date format for week: ${booking.week}`);
              }
  
              const startOfWeek = moment(date).startOf('week');
              const endOfWeek = moment(date).endOf('week');
              return `${startOfWeek.format('MM/DD/YYYY')} - ${endOfWeek.format('MM/DD/YYYY')}`;
            } catch (error) {
              console.error('Invalid date:', error);
              return ''; 
            }
          }
          return ''; 
        });
  
        // Set weekly chart data
        const weeklyChartData = {
          labels: weeklyLabels.filter(Boolean),
          datasets: [
            {
              label: 'Weekly Bookings',
              data: weeklyCounts,
              backgroundColor: 'rgba(0, 77, 64, 0.6)', // Dark green color
            },
          ],
        };
  
        setWeeklyData(weeklyChartData);
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

  const gotoBookingcancel = () => {
    navigate('/Booking-cancel');
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

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove('admintoken'); // Remove JWT cookie
    navigate('/Adminlogin');
  };

  return (
    <div className="h-screen flex flex-col font-sans">
      <nav className="bg-[#1976d2] text-white p-4 shadow-md flex items-center">
        <button onClick={toggleSidebar} className="mr-4 p-2 rounded hover:bg-white/10">
          <MenuIcon />
        </button>
        <h6 className="text-xl font-medium flex-grow">
          Admin Dashboard
        </h6>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1200] lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-[250px] h-full bg-white shadow-xl z-[1300] transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:h-auto`}
        // Note: Logic for sidebar behavior changed slightly. The original was a drawer.
        // Here I made it responsive: fixed and hidden by default on mobile (controlled by sidebarOpen),
        // but wait, the original logic was just a drawer toggled by button.
        // Let's stick to the original behavior: A drawer that slides in.
        // It seems the original drawer covered content or pushed it.
        // "marginLeft: sidebarOpen ? '250px' : '0'" implies pushing.
      >
         {/* Resetting Sidebar logic to match original intent more closely but with Tailwind */}
      </div>

      {/* Re-implementing structure to support pushing content */}
      <div className="flex flex-1 overflow-hidden relative">
        <aside
          className={`absolute top-0 left-0 h-full w-[250px] bg-white shadow-lg z-20 transition-transform duration-300 overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="w-[200px] p-2">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={toggleDashboardMenu}
                  className="w-full flex items-center p-2 text-left hover:bg-gray-100 rounded"
                >
                  <DashboardIcon className="mr-4 text-gray-600" />
                  <span className="flex-grow">Dashboard</span>
                  {dashboardOpen ? <ExpandLess /> : <ExpandMore />}
                </button>
                {dashboardOpen && (
                  <ul className="pl-4 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/AdminOverview"
                        onClick={toggleSidebar}
                        className="block p-2 pl-8 hover:bg-gray-100 rounded text-sm"
                      >
                        Overview
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Analyst"
                        onClick={toggleSidebar}
                        className="block p-2 pl-8 hover:bg-gray-100 rounded text-sm"
                      >
                        Analytics
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <button
                  onClick={toggleUserMenu}
                  className="w-full flex items-center p-2 text-left hover:bg-gray-100 rounded"
                >
                  <GroupIcon className="mr-4 text-gray-600" />
                  <span className="flex-grow">Manage Coach</span>
                  {userOpen ? <ExpandLess /> : <ExpandMore />}
                </button>
                {userOpen && (
                  <ul className="pl-4 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/ManageCoach"
                        className="block p-2 pl-8 hover:bg-gray-100 rounded text-sm"
                      >
                        Coach Profile
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <button
                  onClick={toggleCoachMenu}
                  className="w-full flex items-center p-2 text-left hover:bg-gray-100 rounded"
                >
                  <PersonIcon className="mr-4 text-gray-600" />
                  <span className="flex-grow">Manage User</span>
                  {coachOpen ? <ExpandLess /> : <ExpandMore />}
                </button>
                {coachOpen && (
                  <ul className="pl-4 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/ManageUser"
                        className="block p-2 pl-8 hover:bg-gray-100 rounded text-sm"
                      >
                        User Profile
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link
                  to="/Booking"
                  onClick={toggleBookingMenu}
                  className="w-full flex items-center p-2 text-left hover:bg-gray-100 rounded"
                >
                  <InsertInvitationIcon className="mr-4 text-gray-600" />
                  <span>Booking</span>
                </Link>
              </li>

              <li>
                <button
                  onClick={() => { gotoBookingcancel(); toggleSidebar(); }}
                  className="w-full flex items-center p-2 text-left hover:bg-gray-100 rounded"
                >
                  <InsertInvitationIcon className="mr-4 text-gray-600" />
                  <span>Booking Cancel</span>
                </button>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center p-2 text-left hover:bg-gray-100 rounded text-red-600 hover:text-red-700"
                >
                  <ExitToAppIcon className="mr-4" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto p-4 transition-[margin-left] duration-300 ${sidebarOpen ? 'ml-[250px]' : 'ml-0'}`}
        >
          {error && <p className="text-red-500 text-center">{error}</p>}
          {loading ? (
            <p className="text-center">Loading data...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center">
              <div className="w-full">
                <div className="text-center mt-6">
                  <h5 className="text-xl font-medium mb-4">Daily Bookings</h5>
                  <div className="w-full max-w-[600px] mx-auto mt-4 h-[200px]">
                    <Bar
                      data={dailyData as any}
                      options={{ maintainAspectRatio: false, responsive: true }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="text-center mt-6">
                  <h5 className="text-xl font-medium mb-4">Weekly Bookings</h5>
                  <div className="w-full max-w-[600px] mx-auto mt-4 h-[200px]">
                    <Bar
                      data={weeklyData as any}
                      options={{ maintainAspectRatio: false, responsive: true }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
