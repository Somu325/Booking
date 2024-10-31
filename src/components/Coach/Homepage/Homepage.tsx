// import { styled, useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import CssBaseline from '@mui/material/CssBaseline';
// import MuiAppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// //import NotificationsIcon from '@mui/icons-material/Notifications';
// import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// //import ViewListIcon from '@mui/icons-material/ViewList';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// //import Card from '@mui/material/Card';
// //import CardContent from '@mui/material/CardContent';
// //import Typography from '@mui/material/Typography';

// import React, { useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import axios from 'axios';
// //import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import AnalyticsIcon from '@mui/icons-material/Analytics';
// import { Card } from '@mui/joy';
// import { Domain_URL } from '../../config';



// const drawerWidth = 240;


// interface MainProps {
//   open: boolean;
// }

// const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<MainProps>(
//   ({ theme, open }) => ({
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     marginLeft: `-${drawerWidth}px`,
//     ...(open && {
//       transition: theme.transitions.create('margin', {
//         easing: theme.transitions.easing.easeOut,
//         duration: theme.transitions.duration.enteringScreen,
//       }),
//       marginLeft: 0,
//     }),
//   }),
// );




// interface AppBarProps {
//   open: boolean;
// }

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })<AppBarProps>(({ theme, open }) => ({
//   transition: theme.transitions.create(['margin', 'width'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: `${drawerWidth}px`,
//     transition: theme.transitions.create(['margin', 'width'], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

// const DrawerHeader = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
//   justifyContent: 'flex-end',
// }));


// interface Slot {
//   id: number;
//   date: string;
//   startTime: string;
//   endTime: string;
//   status:string;
//   slot:string;
// }

// const CombinedApp: React.FC = () => {
//   const theme = useTheme();
//   const [open, setOpen] = useState(false);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [currentDate, setCurrentDate] = useState(new Date());
//  // const [slots, setSlots] = useState([]); // State to store fetched slots
//   //const [bookedSlots, setBookedSlots] = useState([]); // State for booked slots
//  // const [completedSlots, setCompletedSlots] = useState([]); // Completed slots
// //const [upcomingSlots, setUpcomingSlots] = useState([]);
//   const [message, setMessage] = useState<string>('');
//   const navigate = useNavigate();
//   //const [view, setView] = useState<'all' | 'booked'>('all'); // State to track the current view
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Store the selected date
//   const [view, setView] = useState<ViewType>('all');

//   const [slots, setSlots] = useState<Slot[]>([]);
// const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
// const [completedSlots] = useState<Slot[]>([]);

// const [upcomingSlots ] = useState<Slot[]>([]);


  


//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   //const handleSeeAllClick = () => {
//     //setShowCalendar(true);
//   //};

//    // Handle date changes for button clicks
//    const handleDateChange = (days: number) => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(currentDate.getDate() + days);
//     setCurrentDate(newDate);
//     setSelectedDate(null); // Reset selected date
//   };

//   //type Value = Date | null;

//  /* const handleCalendarChange = (value?: Value, event?: React.MouseEvent<HTMLButtonElement>) => {
//     if (value instanceof Date) { // Ensure value is a valid Date
//       setCurrentDate(value);     // Update currentDate to the selected date
//       setSelectedDate(value);    // Store the selected date
//       setShowCalendar(false);    // Close the calendar
//     }
//   };*/
  


//   type ViewType = 'all' | 'booked' | 'completed' | 'inprogress' ;
//   // Handle view change and fetch corresponding slots


//   const handleViewChange = (viewType: ViewType) => {
//     setView(viewType);
//     const dateToUse = selectedDate || currentDate; // Use selected date if available
//     if (viewType === 'all') {
//       fetchSlots(dateToUse); // Fetch all slots for the selected/current date
//     } else if (viewType === 'booked') {
//       fetchBookedSlots(dateToUse); // Fetch booked slots for the selected/current date
//     } else if (viewType === 'completed') {
//       fetchCompletedSlots(dateToUse); // Fetch completed slots for the selected/current date
//     }
//   };
  



 

//     // Fetch all slots for the specified date
//   const fetchSlots = async (date: Date) => {
//     const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
//     try {
//       const response = await axios.get(`${Domain_URL}/slot/coach/${coachid}?date=${formattedDate}`);
//       setSlots(response.data);
//       setMessage(''); // Clear message if fetch is successful
//     } catch (error) {
//       console.error('Error fetching slots:', error);
//       setMessage('No slots available');
//     }
//   };
  

//   // Fetch booked slots for the specified date
//   const fetchBookedSlots = async (date: Date) => {
//     const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
//     try {
//       const response = await axios.get(`${Domain_URL}/slot/coaches/${coachid}/booked-slots?date=${formattedDate}`);
//       setBookedSlots(response.data);
//       setMessage(''); // Clear message if fetch is successful
//     } catch (error) {
//       console.error('Error fetching booked slots:', error);
//       setMessage('No booked slots available');
//     }
//   };

 
//   const fetchCompletedSlots = async (date: Date) => {
//     const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
//     const currentTime = new Date(); // Current time to compare
  
//     try {
//       const response = await axios.get(`${Domain_URL}/slot/coaches/${coachid}/completed-slots?date=${formattedDate}`);
//       const slots = response.data;
  
//       // Filter slots to only include those that ended before the current time
//       const completedSlots = slots.filter((slot: { endTime: any; }) => {
//         const slotEndTime = new Date(`${formattedDate}T${slot.endTime}`); // Combine date and endTime
//         return slotEndTime < currentTime;
//       });
  
//       setSlots(completedSlots);
//       setMessage(completedSlots.length ? '' : 'No completed slots available');
//     } catch (error) {
//       console.error('Error fetching completed slots:', error);
//       setMessage('No completed slots available');
//     }
//   };



 



//   const handleProfileClick = () => {
//     navigate('/Coach-Profile');
//   }
    
//   const handleAnalyticsClick = () => {
//     navigate('/Coach-Analytics'); // Navigate to the CoachAnalytics page
//   };


//   const handleScheduler = () => {
//     navigate('/Schedule'); // Navigate to the CoachAnalytics page
//   };


//   const handleLogoutClick = () => {
//     navigate('/Coach-login');
//   }
  

//   const coachid = localStorage.getItem('coachId');
 


//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <AppBar position="fixed" open={open}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handleDrawerOpen}
//             edge="start"
//             sx={[{ mr: 2 }, open && { display: 'none' }]} 
//           >
//             <MenuIcon />
//           </IconButton>
//           <Box sx={{ flexGrow: 1 }} />
//           <IconButton color="inherit">
//              <NotificationsOffIcon/>
//           </IconButton>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           '& .MuiDrawer-paper': {
//             width: drawerWidth,
//             boxSizing: 'border-box',
//           },
//         }}
//         variant="persistent"
//         anchor="left"
//         open={open}
//       >
//         <DrawerHeader>
//           <IconButton onClick={handleDrawerClose}>
//             {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
//           </IconButton>
//         </DrawerHeader>
//         <Divider />
        
//         <List>
//   {[
//     { text: 'Profile', 
//       icon: <AccountCircleIcon />,
//       onClick: handleProfileClick,
//     },

//     {
//       text: 'Analytics',
//       icon: <AnalyticsIcon sx={{ color: 'blue' }} />,
//       onClick: handleAnalyticsClick, // Set the onClick handler here
//     },

//     {
//       text: 'Scheduler',
//       icon: <AnalyticsIcon sx={{ color: 'blue' }} />,
//       onClick: handleScheduler, // Set the onClick handler here
//     },

    

//     {
//       text: 'Logout',
//       icon: <ExitToAppIcon sx={{ color: 'red' }} />,
//       onClick: handleLogoutClick,
//       textStyle: { color: 'red' },
      
//     },
//   ].map((item) => (
//     <ListItem key={item.text} disablePadding>
//       <ListItemButton onClick={item.onClick}> 
//         <ListItemIcon sx={item.text === 'Logout' ? { color: 'red' } : {}}>
//           {item.icon}
//         </ListItemIcon>
//         <ListItemText primary={item.text} sx={item.textStyle || {}} />
//       </ListItemButton>
//     </ListItem>
//   ))}
// </List>

//         <Divider />
//       </Drawer>
//       <Main open={open}>
//         <DrawerHeader />
//         <br />
//         <br />
        
//         <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      

//       <main style={{ marginTop: '20px' }}>
//         <div className="full-length-container">
//         <div 
//   style={{
//     display: 'flex', 
//     flexDirection: 'column',
//     alignItems: 'center', 
//     width: '100%', 
//     position: 'absolute', 
//     top: 100, // Positions the container at the top
//     padding: '10px 0',
//     backgroundColor: '#f5f5f5', // Optional: background for visibility
//     boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' // Optional: shadow for separation
//   }}
// >
//   <div className="date-buttons" style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', width: '100%' }}>
//     {Array.from({ length: 4 }).map((_, index) => {
//       const buttonDate = new Date(currentDate);
//       buttonDate.setDate(currentDate.getDate() + index);
//       return (
//         <button 
//           className="date-btn" 
//           key={index} 
//           onClick={() => handleDateChange(index)} 
//           style={{
//             flex: 1,
//             padding: '10px 0',
//             fontSize: '16px',
//             fontWeight: 'bold',
//             borderRadius: '4px',
//             backgroundColor: '#007bff',
//             color: '#fff',
//             cursor: 'pointer',
//             border: 'none',
//           }}
//         >
//           {buttonDate.toLocaleString('default', { month: 'short' })}<br />

//           {buttonDate.getDate()}
//         </button>
//       );
//     })}
//   </div>
// </div>

// <br></br>


//           <div className="see-all">
//             <button className="see-all-btn" onClick={() => setShowCalendar(true)} 
//                 style={{
//                   width: '100%',
//                   padding: '10px',
//                   backgroundColor: '#007bff',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '5px',
//                   cursor: 'pointer',
//                 }}
//               >
//               <span role="img" aria-label="calendar">📅</span>
//               See All ({currentDate.toLocaleDateString()})
//             </button>
//           </div>
//           <br></br>

// <div className="action-buttons">
//   <button className="action-btn" onClick={() => handleViewChange('all')}  
//           style={{
//             flex: 1, // Ensures equal width for each button
//             padding: '10px 0',
//             fontSize: '16px',
//             fontWeight: 'bold',
//             borderRadius: '4px',
            
//             color: '#fff',
//             cursor: 'pointer',
//             border: 'none',
//           }}
//     >All</button>
//   <button className="action-btn" onClick={() => handleViewChange('booked')} 
//           style={{
//             flex: 1, // Ensures equal width for each button
//             padding: '10px 0',
//             fontSize: '16px',
//             fontWeight: 'bold',
//             borderRadius: '4px',
//            backgroundColor:'black',
//             color: '#fff',
//             cursor: 'pointer',
//             border: 'none',
//           }}
//     >Booked</button>
//   <button className="action-btn" onClick={() => handleViewChange('completed')} 
//     style={{
//       flex: 1, // Ensures equal width for each button
//       padding: '10px 0',
//       fontSize: '16px',
//       fontWeight: 'bold',
//       borderRadius: '4px',
//       backgroundColor: 'green',
//       color: 'white',
//       cursor: 'pointer',
//       border: 'none',
//     }}
//     >Completed</button> 
//   <button className="action-btn" onClick={() => handleViewChange('inprogress')}
//         style={{
//           flex: 1, // Ensures equal width for each button
//           padding: '10px 0',
//           fontSize: '16px',
//           fontWeight: 'bold',
//           borderRadius: '4px',
//           backgroundColor: 'red',
//           color: 'white',
//           cursor: 'pointer',
//           border: 'none',
//         }}
//     >In Progress</button> 
// </div>


// <br></br>
// <br></br>


// <div className="slots-container" style={{ 
//   display: 'grid', 
//   gridTemplateColumns: 'repeat(4, 1fr)', // 4 equal-width columns
//   gap: '10px', // Spacing between cards
//   justifyContent: 'center' 
// }}>
//   {(view === 'all' ? slots
//     : view === 'booked' ? bookedSlots
//     : view === 'completed' ? completedSlots
//     : upcomingSlots // Use upcomingSlots for 'upcoming' view
//   ).filter(slot => {
//     const slotDate = new Date(slot.date);
//     return slotDate.toDateString() === (selectedDate || currentDate).toDateString();
//   }).map((slot) => (
//     <Card key={slot.id} sx={{
//       padding: '8px',
//       border: '0.5px solid #007bff',
//       fontSize: '14px',
//     }}>
//       <div>Date: {new Date(slot.date).toLocaleDateString()}</div>
//       <div style={{ color: 'black' }}>Time: {slot.startTime} - {slot.endTime}</div>
//     </Card>
//   ))}
//   {message && <p style={{ color: 'red' }}>{message}</p>}
// </div>


//  {showCalendar && (
//       <div className="calendar-container" style={{ marginTop: '20px' }}>
//             <Calendar 
//             //onChange={(value, event) => handleCalendarChange(value, event)} value={selectedDate || currentDate}
//              />;
//            <button onClick={() => setShowCalendar(false)}>Close Calendar</button>
//        </div>
//   )}
//         </div>
//       </main>
//     </div>
//       </Main>
//     </Box>
//   );
// };

// export default CombinedApp; 


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Coachdashboard.css';
import { format, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from '../../config';

const Coachdashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState<string>('All');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const coachId = localStorage.getItem('coachId');
  const dates = Array.from({ length: 5 }, (_, i) => addDays(startDate, i));

  const handleNext = () => setStartDate((prev) => addDays(prev, 5));
  const handlePrevious = () => {
    const newStartDate = addDays(startDate, -5);
    if (newStartDate >= new Date()) setStartDate(newStartDate);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => setFilter(event.target.value);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Domain_URL}/slots-g-p/${coachId}`);
      setSlots(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching slots:', err.message);
      setError('No slots are availble for the selected date');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coachId) fetchSlots();
  }, [coachId]);

  const convertToLocalDate = (dateString: string) => {
    const localDate = new Date(dateString);
    return new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
  };

  const filteredSlots = slots.filter((slot) => {
    const slotDate = convertToLocalDate(slot.date);
    const isStatusMatch = filter === 'All' || slot.status === filter;
    const isSlotTypeMatch = filter === 'personal' ? slot.slotType === 'personal' : true;

    return isStatusMatch && isSlotTypeMatch && slotDate.toDateString() === selectedDate.toDateString();
  });

  // Function to get the class name based on slot status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'status-available';
      case 'completed':
        return 'status-completed';
      case 'upcoming':
        return 'status-upcoming';
      case 'cancelled':
        return 'status-cancelled';
      case 'booked':
        return 'status-booked';
      default:
        return '';
    }
  };

  return (
    <div className="container">
      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleMenu}>
          &times;
        </button>
        <nav>
          <ul>
            <li onClick={() => navigate('/Coach-Profile')}>Profile</li>
            <li onClick={() => navigate('/Coach-Analytics')}>Analytics</li>
            <li onClick={() => navigate('/Schedule')}>Scheduler</li>
           <li className="logout" onClick={() => {
             localStorage.removeItem('coachId');
             localStorage.removeItem('email');
             navigate('/Coach-login');
            }}>
             Logout
          </li>
          </ul>
        </nav>
      </div>
      <div className="content">
        <header className="header">
          <div className="menu-icon" onClick={toggleMenu}>
            &#9776;
          </div>
          <h2>Welcome, Coach</h2>
          <div className="notification-icon-container">
            <div className="notification-icon">&#128276;</div>
            <div className="notification-cancel-line"></div>
          </div>
        </header>
        <main className="main-content">
          <div className="calendar-filter-container">
            <div className="calendar">
              <div className="calendar-icon">&#128197;</div>
              <div className="dates-row">
                <span className="arrow" onClick={handlePrevious}>
                  &#10094;
                </span>
                {dates.map((date, index) => (
                  <span
                    key={index}
                    className={`date ${date.getTime() === selectedDate.getTime() ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {format(date, 'MMM d yyyy')}
                  </span>
                ))}
                <span className="arrow" onClick={handleNext}>
                  &#10095;
                </span>
              </div>
            </div>
            <div className="filter-container">
              <label htmlFor="filter" className="filter-label">
                Filter:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="filter-dropdown"
              >
                <option value="All">All</option>
                <option value="completed">Completed</option>
                <option value="available">Available</option>
              
                <option value="booked">Booked</option>
        
              </select>
            </div>
          </div>

          <div className="slots-table-container">
            {loading ? (
              <div className="loading">Loading slots...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : filteredSlots.length === 0 ? (
              <div className="no-slots">No slots available</div>
            ) : (
              <table className="slots-table">
                <thead>
                  <tr>
        
                    <th>Time</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Slot Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSlots.map((slot, index) => (
                    <tr key={index}>
                    
                      <td>{`${slot.startTime} - ${slot.endTime}`}</td>
                      <td className={getStatusClass(slot.status)}>{slot.status}</td>
                      <td>{slot.duration} mins</td>
                      <td>{slot.slotType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Coachdashboard;
