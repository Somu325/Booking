import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
//import ViewListIcon from '@mui/icons-material/ViewList';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
//import Card from '@mui/material/Card';
//import CardContent from '@mui/material/CardContent';
//import Typography from '@mui/material/Typography';
// import './Homepage.css';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
//import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { Domain_URL } from "../../config";
 

//npm type Value = Date | [Date, Date] | null; // Define Value type


type MainProps = {
  open?: boolean; // Add the open property with an optional boolean type
};


const drawerWidth = 240;


interface Slot {
  id: string; // Assuming ID is a string, change if necessary
  date: string; // or Date, depending on how you're handling dates
  startTime: string; // Assuming this is a string, e.g., '10:00 AM'
  endTime: string; // Assuming this is a string, e.g., '11:00 AM'
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<MainProps>(
  ({ theme, open }) => {
    const marginLeft = open ? 0 : `-${drawerWidth}px`; // Determine marginLeft based on open prop

    return {
      flexGrow: 1,
      padding: theme.spacing(3),
      marginLeft: marginLeft, // Set marginLeft based on the condition
      transition: theme.transitions.create('margin', {
        easing: open ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
        duration: open 
          ? theme.transitions.duration.enteringScreen 
          : theme.transitions.duration.leavingScreen,
      }),
    };
  }
);


import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean; // Make 'open' optional or required based on your needs
}


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open = false }) => ({
  // Combine the transition properties into one definition
  transition: theme.transitions.create(['margin', 'width'], {
    easing: open ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
    duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
  }),
  // Set width and margin based on the `open` state
  width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
  marginLeft: open ? `${drawerWidth}px` : '0',
}));




const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const CombinedApp: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slots, setSlots] = useState([]); // State to store fetched slots
  const [bookedSlots, setBookedSlots] = useState([]); // State for booked slots
  const [completedSlots, setCompletedSlots] = useState([]); // Completed slots
const [upcomingSlots, setUpcomingSlots] = useState([]);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  //const [view, setView] = useState<'all' | 'booked'>('all'); // State to track the current view
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Store the selected date
  const [view, setView] = useState<'all' | 'booked' | 'completed' | 'upcoming'>('all');


  


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //const handleSeeAllClick = () => {
    //setShowCalendar(true);
  //};

   // Handle date changes for button clicks
   const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
    setSelectedDate(null); // Reset selected date
  };

// const handleCalendarChange = (value: Value) => {
//   if (value instanceof Date) {
//     // Handle single date
//     setSelectedDate(value);
//   } else if (Array.isArray(value) && value.length === 2) {
//     // Handle range, taking the start date
//     setSelectedDate(value[0]); // You can also manage end date if necessary
//   } else {
//     // Handle null case or unexpected values
//     setSelectedDate(null);
//   }
// };
  
  


   // Handle calendar date selection
  // const handleCalendarChange = (date: Date) => {
   // setCurrentDate(date); // Update currentDate to the selected date
   // setSelectedDate(date); // Store the selected date
   // setShowCalendar(false); // Close the calendar
  //};

  


  // Handle view change and fetch corresponding slots
const handleViewChange = (viewType: 'all' | 'booked' | 'completed' | 'upcoming') => {
  setView(viewType);
  const dateToUse = selectedDate || currentDate; // Use selected date if available
  if (viewType === 'all') {
    fetchSlots(dateToUse); // Fetch all slots for the selected/current date
  } else if (viewType === 'booked') {
    fetchBookedSlots(dateToUse); // Fetch booked slots for the selected/current date
  } else if (viewType === 'completed') {
    fetchCompletedSlots(dateToUse); // Fetch completed slots for the selected/current date
  } else if (viewType === 'upcoming') {
    fetchUpcomingSlots(dateToUse); // Fetch upcoming slots for the selected/current date
  }
};
 

 

    // Fetch all slots for the specified date
  const fetchSlots = async (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
    try {
      const response = await axios.get(`${Domain_URL}/slot/coach/${coachid}?date=${formattedDate}`);
      setSlots(response.data);
      setMessage(''); // Clear message if fetch is successful
    } catch (error) {
      console.error('Error fetching slots:', error);
      setMessage('No slots available');
    }
  };
  

  // Fetch booked slots for the specified date
  const fetchBookedSlots = async (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
    try {
      const response = await axios.get(`Domain_URL/slot/coaches/${coachid}/booked-slots?date=${formattedDate}`);
      setBookedSlots(response.data);
      setMessage(''); // Clear message if fetch is successful
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setMessage('No booked slots available');
    }
  };

  // Fetch completed slots for the specified date
const fetchCompletedSlots = async (date: Date) => {
  const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
  try {
    const response = await axios.get(`Domain_URL/slot/coaches/${coachid}/completed-slots?date=${formattedDate}`);
    setCompletedSlots(response.data);
    setMessage(''); // Clear message if fetch is successful
  } catch (error) {
    console.error('Error fetching completed slots:', error);
    setMessage('No completed slots available');
  }
};



// Fetch upcoming slots for the specified date
const fetchUpcomingSlots = async (date: Date) => {
  const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
  try {
    const response = await axios.get(`Domain_URL/slot/coaches/${coachid}/upcoming-slots?date=${formattedDate}`);
    setUpcomingSlots(response.data);
    setMessage(''); // Clear message if fetch is successful
  } catch (error) {
    console.error('Error fetching upcoming slots:', error);
    setMessage('No upcoming slots available');
  }
};
 

  const handleCreateSlotsClick = () => {
    navigate('/Create-slot'); // Navigate to the create-slots page
  };

  const handleProfileClick = () => {
    navigate('/Coach-Profile');
  }
    
  const handleAnalyticsClick = () => {
    navigate('/CoachAnalytics'); // Navigate to the CoachAnalytics page
  };


  const handleLogoutClick = () => {
    navigate('/Coach-login');
  }
  

  const coachid = localStorage.getItem('coachId');
 


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{ mr: 2 }, open && { display: 'none' }]} 
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        
        <List>
  {[
    { text: 'Profile', 
      icon: <AccountCircleIcon />,
      onClick: handleProfileClick,
    },
    {
      text: 'Create Slots', // This is the Create Slots button
      icon: <CalendarTodayIcon />,
      onClick: handleCreateSlotsClick, // Navigates to create slots page
    },

    {
      text: 'Analytics',
      icon: <AnalyticsIcon sx={{ color: 'blue' }} />,
      onClick: handleAnalyticsClick, // Set the onClick handler here
    },

    

    {
      text: 'Logout',
      icon: <ExitToAppIcon sx={{ color: 'red' }} />,
      onClick: handleLogoutClick,
      textStyle: { color: 'red' },
      
    },
  ].map((item) => (
    <ListItem key={item.text} disablePadding>
      <ListItemButton onClick={item.onClick}> 
        <ListItemIcon sx={item.text === 'Logout' ? { color: 'red' } : {}}>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.text} sx={item.textStyle || {}} />
      </ListItemButton>
    </ListItem>
  ))}
</List>

        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <br />
        <br />
        <br />
        <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      

      <main style={{ marginTop: '20px' }}>
        <div className="full-length-container">
          <div className="date-buttons">
            {Array.from({ length: 4 }).map((_, index) => {
              const buttonDate = new Date(currentDate);
              buttonDate.setDate(currentDate.getDate() + index);
              return (
                <button className="date-btn" key={index} onClick={() => handleDateChange(index)}>
                  {buttonDate.toLocaleString('default', { month: 'short' })}<br />
                  {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : buttonDate.toLocaleString('default', { weekday: 'short' })}<br />
                  {buttonDate.getDate()}
                </button>
              );
            })}
          </div>

          <div className="see-all">
            <button className="see-all-btn" onClick={() => setShowCalendar(true)}>
              <span role="img" aria-label="calendar">📅</span>
              See All ({currentDate.toLocaleDateString()})
            </button>
          </div>

          <div className="action-buttons">
  <button className="action-btn" onClick={() => handleViewChange('all')}>ALL</button>
  <button className="action-btn" onClick={() => handleViewChange('booked')}>BOOKED</button>
  <button className="action-btn" onClick={() => handleViewChange('completed')}>COMPLETED</button> 
  <button className="action-btn" onClick={() => handleViewChange('upcoming')}>UPCOMING</button> 
</div>


<div className="slots-container">
  <ul>
    {(view === 'all' ? slots
      : view === 'booked' ? bookedSlots
      : view === 'completed' ? completedSlots
      : upcomingSlots
    )
      .filter((slot: Slot) => {
        const slotDate = new Date(slot.date);
        return slotDate.toDateString() === (selectedDate || currentDate).toDateString();
      })
      .map((slot: Slot) => (
        <li
          key={slot.id}
          style={{ padding: '10px', border: '1px solid #007bff', marginBottom: '10px', backgroundColor: '#007bff' }}
        >
          <div>Date: {slot.date}</div>
          <div style={{ color: 'black' }}>Time: {slot.startTime} - {slot.endTime}</div>
        </li>
      ))}
  </ul>
  {message && <p style={{ color: 'red' }}>{message}</p>}
</div>;
  

          {showCalendar && (
            <div className="calendar-container" style={{ marginTop: '20px' }}>
              <Calendar
           // onChange={handleCalendarChange}
            //value={selectedDate || currentDate}
        />
            <button onClick={() => setShowCalendar(false)}>Close Calendar</button>
          </div>
          )}
        </div>
          
      </main>
    </div>
      </Main>
    </Box>
  );
};

export default CombinedApp; 
