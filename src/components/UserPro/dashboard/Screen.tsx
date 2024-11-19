
// 'use client';

// import { useEffect, useState, ChangeEvent, useRef } from 'react';
// import axios from 'axios';
// import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
// import CssBaseline from '@mui/joy/CssBaseline';
// import Box from '@mui/joy/Box';
// import Typography from '@mui/joy/Typography';
// import Input from '@mui/joy/Input';
// import IconButton from '@mui/joy/IconButton';
// import Card from '@mui/joy/Card';
// import Button from '@mui/joy/Button';
// import Modal from '@mui/joy/Modal';
// import ModalDialog from '@mui/joy/ModalDialog';
// import { Search, Menu, Person, Settings, Logout, ChevronLeft, ChevronRight } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import NotificationsOff from '@mui/icons-material/NotificationsOff';

// import { Domain_URL } from '../../config';

// // Define interfaces for type checking
// interface Person {
//   id: string;
//   name: string;
//   age: number;
//   sport: string;
//   phoneNumber: string;
//   coachId: string;
// }

// interface SideMenuProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// // Custom theme configuration
// const theme = extendTheme({
//   // your existing theme configuration
// });

// // SideMenu component for navigation
// function SideMenu({ isOpen, onClose }: SideMenuProps) {
//   const navigate = useNavigate();
//   const menuRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState({
//     profile: false,
//     bookingHistory: false,
//     logout: false,
//   });

//   // Effect to handle clicking outside the menu to close it
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   // Function to handle button clicks with loading state
//   const handleButtonClick = (action: 'profile' | 'bookingHistory' | 'logout') => {
//     setLoading(prev => ({ ...prev, [action]: true }));
//     setTimeout(() => {
//       setLoading(prev => ({ ...prev, [action]: false }));
//       switch (action) {
//         case 'profile':
//           navigate('/userprofile');
//           break;
//         case 'bookingHistory':
//           navigate('/booking-history');
//           break;
//         case 'logout':
//           handleLogout();
//           break;
//       }
//     }, 400);
//   };

//   // Function to handle logout
//   const handleLogout = () => {
//     localStorage.clear();
    
//     document.cookie.split(";").forEach((c) => {
//       document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
//     });
//     navigate('/');
//   };

//   return (
//     <Box
//       ref={menuRef}
//       sx={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '250px',
//         height: '100%',
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         backdropFilter: 'blur(10px)',
//         transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
//         transition: 'transform 0.3s ease-in-out',
//         zIndex: 1000,
//         display: 'flex',
//         flexDirection: 'column',
//         p: 2,
//         boxShadow: '0 0 20px rgba(0,0,0,0.1)',
//       }}
//     >
//       <Button onClick={onClose}>Close Menu</Button>
//       <Button
//         startDecorator={<Person />}
//         variant="plain"
//         color="neutral"
//         sx={{ justifyContent: 'flex-start', mb: 2, width: '150px' }}
//         onClick={() => handleButtonClick('profile')}
//         loading={loading.profile}
//       >
//         Profile
//       </Button>
//       <Button
//         startDecorator={<Settings />}
//         variant="plain"
//         color="neutral"
//         sx={{ justifyContent: 'flex-start', mb: 2, width: '150px' }}
//         onClick={() => handleButtonClick('bookingHistory')}
//         loading={loading.bookingHistory}
//       >
//         BookingHistory
//       </Button>
//       <Button
//         startDecorator={<Logout />}
//         variant="plain"
//         color="danger"
//         sx={{ justifyContent: 'flex-start', mt: 'auto', width: '150px' }}
//         onClick={() => handleButtonClick('logout')}
//         loading={loading.logout}
//       >
//         Logout
//       </Button>
//     </Box>
//   );
// }

// // Main Screen component
// export default function Screen() {
//   // State variables
//   const [people, setPeople] = useState<Person[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
//   const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
//   const navigate = useNavigate();

//   // Fetch coach data on component mount
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Filter people when search term or people list changes
//   useEffect(() => {
//     handleSearch();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchTerm, people]);

//   // Function to fetch coach data from API
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
//       setPeople(response.data);
//       setFilteredPeople(response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   // Function to handle search functionality
//   const handleSearch = () => {
//     const filtered = people.filter((person) => {
//       const nameMatch = person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
//       const professionMatch = person.sport?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
//       return nameMatch || professionMatch;
//     });
//     setFilteredPeople(filtered);
//   };

//   // Function to format date for display
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     return `${months[date.getUTCMonth()]} ${date.getUTCDate()} ${date.getUTCFullYear()}`;
//   };

//   // Function to generate an array of dates for display
//   const generateDates = () => {
//     const startDate = new Date(selectedDate);
//     return Array.from({ length: 5 }, (_, i) => {
//       const date = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate() + i));
//       return date.toISOString().split('T')[0];
//     });
//   };
//   const dates = generateDates();

//   // Function to handle date change
//   const handleDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
//     const newDate = event.target.value;
//     if (new Date(newDate).toString() !== 'Invalid Date') {
//       setSelectedDate(newDate);
//       setIsCalendarOpen(false); // Close the calendar modal
//     } else {
//       console.error('Invalid date selected');
//     }
//   };

//   // Function to handle date navigation
//   const handleDateNavigation = (direction: 'back' | 'forward') => {
//     const currentDate = new Date(selectedDate);
//     const newDate = new Date(currentDate);
//     if (direction === 'back') {
//       newDate.setDate(currentDate.getDate() - 5);
//     } else {
//       newDate.setDate(currentDate.getDate() + 5);
//     }
//     setSelectedDate(newDate.toISOString().split('T')[0]);
//   };

//   // Function to handle view slot button click with loading state
//   const handleViewSlot = (coachId: string) => {
//     setLoading(prev => ({ ...prev, [coachId]: true }));
//     setTimeout(() => {
//       setLoading(prev => ({ ...prev, [coachId]: false }));
//       navigate(`/selectslot/${coachId}?date=${selectedDate}`);
//     }, 500);
//   };

//   return (
//     <CssVarsProvider theme={theme}>
//       <CssBaseline />
//       <Box
//         sx={{
//           width: '100%',
//           minHeight: '100vh',
//           p: 3,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//           ...(isMenuOpen && { pl: '260px' }),
//         }}
//       >
//         {/* Header section with menu, search, and notifications */}
//         <Box sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           width: '100%',
//           maxWidth: '1200px',
//           mb: 4,
//         }}>
//           <IconButton
//             size="lg"
//             variant="outlined"
//             color="neutral"
//             sx={{ mr: 2 }}
//             onClick={() => setIsMenuOpen(true)}
//           >
//             <Menu />
//           </IconButton>

//           <Input
//             size="lg"
//             placeholder="Search by Name or Sport..."
//             startDecorator={<Search />}
//             sx={{
//               flexGrow: 1,
//               maxWidth: 500,
//               backgroundColor: 'rgba(255, 255, 255, 0.7)',
//               backdropFilter: 'blur(10px)',
//               '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
//               borderRadius: '20px',
//               '& .MuiInput-input': { padding: '12px 16px' },
//             }}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           <Typography sx={{ ml: 2, fontWeight: 'bold' }}>
//             Total Coaches: {people.length}
//           </Typography>

//           <IconButton
//             size="lg"
//             variant="outlined"
//             color="neutral"
//             sx={{ ml: 2 }}
//             onClick={() => navigate('')}
//           >
//             <NotificationsOff />
//           </IconButton>
//         </Box>

//         {/* Date selection section */}
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, width: '100%', maxWidth: '1200px', overflowX: 'auto' }}>
//           <IconButton
//             onClick={() => handleDateNavigation('back')}
//             sx={{ mr: 2 }}
//           >
//             <ChevronLeft />
//           </IconButton>
          
//           <Input
//             type="date"
//             value={selectedDate}
//             onChange={handleDateChange}
//             sx={{
//               mb: 4,
//               borderRadius: '25px',
//               width: '48px',
//               height:'48px',
//               marginTop:'40px',
//               marginRight:'25px',
//               maxWidth: 300,
//               padding: '12px',
//               border: '2px solid #007BFF',
//               backgroundColor: 'white',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//               '&:focus': {
//                 outline: 'none',
//                 borderColor: '#0056b3',
//                 boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
//               },
//             }}
//           />
           
//           {dates.map((date) => (
//             <Button
//               key={date}
//               variant={selectedDate === date ? 'soft' : 'outlined'}
//               color="primary"
//               onClick={() => setSelectedDate(date)}
//               sx={{
//                 minWidth: 120,
//                 height: 48,
//                 borderRadius: 12,
//                 mr: 2,
//                 ...(selectedDate === date && {
//                   bgcolor: 'lightblue',
//                   color: 'black',
//                 }),
//               }}
//             >
//               {formatDate(date)}
//             </Button>
//           ))}

//           <IconButton
//             onClick={() => handleDateNavigation('forward')}
//             sx={{ ml: 2 }}
//           >
//             <ChevronRight />
//           </IconButton>
//         </Box>

//         {/* Coach cards section */}
//         <Box sx={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
//           gap: 3,
//           width: '100%',
//           maxWidth: '1200px',
//         }}>
//           {filteredPeople.map((person) => (
//             <Card key={person.id} variant="outlined">
//               <Typography level="h2" fontSize="xl" fontWeight="lg" mb={1}>
//                 {person.name}
//               </Typography>
//               <Typography>Sport: {person.sport}</Typography>
//               <Typography mb={2}>Phone: {person.phoneNumber}</Typography>
//               <Button
//                 fullWidth
//                 variant="solid"
//                 color="primary"
//                 onClick={() => handleViewSlot(person.coachId)}
//                 loading={loading[person.coachId]}
//               >
//                 View Slot
//               </Button>
//             </Card>
//           ))}
//         </Box>

//         {/* Calendar modal */}
//         <Modal open={isCalendarOpen} onClose={() => setIsCalendarOpen(false)}>
//           <ModalDialog sx={{
//             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//             backdropFilter: 'blur(10px)',
//             boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
//           }}>
//             <Input
//               type="date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               sx={{
//                 fontSize: '16px',
//                 padding: '12px',
//                 borderRadius: '12px',
//                 border: '1px solid #ccc',
//                 backgroundColor: 'rgba(255, 255, 255, 0.7)',
//               }}
//             />
//           </ModalDialog>
//         </Modal>

//         {/* Side menu component */}
//         <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
//       </Box>
//     </CssVarsProvider>
//   );
// }







'use client';

import { useEffect, useState, ChangeEvent, useRef } from 'react';
import axios from 'axios';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Card from '@mui/joy/Card';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { Search, Menu, Person, Settings, Logout, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NotificationsOff from '@mui/icons-material/NotificationsOff';

import { Domain_URL } from '../../config';

// Define interfaces for type checking
interface Person {
  id: string;
  name: string;
  age: number;
  sport: string;
  phoneNumber: string;
  coachId: string;
}

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Custom theme configuration
const theme = extendTheme({
  // your existing theme configuration
});

// SideMenu component for navigation
function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState({
    profile: false,
    bookingHistory: false,
    logout: false,
  });

  // Effect to handle clicking outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Function to handle button clicks with loading state
  const handleButtonClick = (action: 'profile' | 'bookingHistory' | 'logout') => {
    setLoading(prev => ({ ...prev, [action]: true }));
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [action]: false }));
      switch (action) {
        case 'profile':
          navigate('/userprofile');
          break;
        case 'bookingHistory':
          navigate('/booking-history');
          break;
        case 'logout':
          handleLogout();
          break;
      }
    }, 400);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    navigate('/');
  };

  return (
    <Box
      ref={menuRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '250px',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      }}
    >
      <Button onClick={onClose}>Close Menu</Button>
      <Button
        startDecorator={<Person />}
        variant="plain"
        color="neutral"
        sx={{ justifyContent: 'flex-start', mb: 2, width: '150px' }}
        onClick={() => handleButtonClick('profile')}
        loading={loading.profile}
      >
        Profile
      </Button>
      <Button
        startDecorator={<Settings />}
        variant="plain"
        color="neutral"
        sx={{ justifyContent: 'flex-start', mb: 2, width: '150px' }}
        onClick={() => handleButtonClick('bookingHistory')}
        loading={loading.bookingHistory}
      >
        BookingHistory
      </Button>
      <Button
        startDecorator={<Logout />}
        variant="plain"
        color="danger"
        sx={{ justifyContent: 'flex-start', mt: 'auto', width: '150px' }}
        onClick={() => handleButtonClick('logout')}
        loading={loading.logout}
      >
        Logout
      </Button>
    </Box>
  );
}

// Main Screen component
export default function Screen() {
  // State variables
  const [people, setPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  // Fetch coach data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter people when search term or people list changes
  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, people]);

  // Function to fetch coach data from API
  const fetchData = async () => {
    try {
      const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
      setPeople(response.data);
      setFilteredPeople(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to handle search functionality
  const handleSearch = () => {
    const filtered = people.filter((person) => {
      const nameMatch = person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      const professionMatch = person.sport?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      return nameMatch || professionMatch;
    });
    setFilteredPeople(filtered);
  };

  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()} ${date.getUTCFullYear()}`;
  };

  // Function to generate an array of dates for display
  const generateDates = () => {
    const startDate = new Date(selectedDate);
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate() + i));
      return date.toISOString().split('T')[0];
    });
  };
  const dates = generateDates();

  // Function to handle date change
  const handleDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newDate = event.target.value;
    if (new Date(newDate).toString() !== 'Invalid Date') {
      setSelectedDate(newDate);
      setIsCalendarOpen(false); // Close the calendar modal
    } else {
      console.error('Invalid date selected');
    }
  };

  // Function to handle date navigation
  const handleDateNavigation = (direction: 'back' | 'forward') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    if (direction === 'back') {
      newDate.setDate(currentDate.getDate() - 5);
    } else {
      newDate.setDate(currentDate.getDate() + 5);
    }
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  // Function to handle view slot button click with loading state
  const handleViewSlot = (coachId: string) => {
    setLoading(prev => ({ ...prev, [coachId]: true }));
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [coachId]: false }));
      navigate(`/selectslot/${coachId}?date=${selectedDate}`);
    }, 500);
  };

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          ...(isMenuOpen && { pl: '260px' }),
        }}
      >
        {/* Header section with menu, search, and notifications */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1200px',
          mb: 4,
        }}>
          <IconButton
            size="lg"
            variant="outlined"
            color="neutral"
            sx={{ mr: 2 }}
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu />
          </IconButton>

          <Input
            size="lg"
            placeholder="Search by Name or Sport..."
            startDecorator={<Search />}
            sx={{
              flexGrow: 1,
              maxWidth: 500,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
              borderRadius: '20px',
              '& .MuiInput-input': { padding: '12px 16px' },
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Typography sx={{ ml: 2, fontWeight: 'bold' }}>
            Total Coaches: {people.length}
          </Typography>

          <IconButton
            size="lg"
            variant="outlined"
            color="neutral"
            sx={{ ml: 2 }}
            onClick={() => navigate('')}
          >
            <NotificationsOff />
          </IconButton>
        </Box>

        {/* Date selection section */}
        
        <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    mb: 4,
    width: '100%',
    maxWidth: '1200px',
    overflowX: 'auto',
  }}
>
  <IconButton onClick={() => handleDateNavigation('back')} sx={{ mr: 2 }}>
    <ChevronLeft />
  </IconButton>

  <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
    <Input
      type="date"
      value={selectedDate}
      onChange={handleDateChange}
      sx={{
        mb: 3,
        borderRadius: '25px',
        width: '48px',
        height: '48px',
        mt: 4,
        mr: 3,
        maxWidth: 300,
        p: 1.5,
        border: '2px solid #007BFF',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        '&:focus': {
          outline: 'none',
          borderColor: '#0056b3',
          boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
        },
      }}
    />

    {dates.map((date) => (
      <Button
        key={date}
        variant={selectedDate === date ? 'soft' : 'outlined'}
        color="primary"
        onClick={() => setSelectedDate(date)}
        sx={{
          minWidth: 100,
          height: 40,
          borderRadius: 12,
          mr: 2,
          ...(selectedDate === date && {
            bgcolor: 'lightblue',
            color: 'black',
          }),
        }}
      >
        {formatDate(date)}
      </Button>
    ))}
  </Box>

  <IconButton onClick={() => handleDateNavigation('forward')} sx={{ ml: 2 }}>
    <ChevronRight />
  </IconButton>
</Box>


        {/* Coach cards section */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 3,
          width: '100%',
          maxWidth: '1200px',
        }}>
          {filteredPeople.map((person) => (
            <Card key={person.id} variant="outlined">
              <Typography level="h2" fontSize="xl" fontWeight="lg" mb={1}>
                {person.name}
              </Typography>
              <Typography>Sport: {person.sport}</Typography>
              <Typography mb={2}>Phone: {person.phoneNumber}</Typography>
              <Button
                fullWidth
                variant="solid"
                color="primary"
                onClick={() => handleViewSlot(person.coachId)}
                loading={loading[person.coachId]}
              >
                View Slot
              </Button>
            </Card>
          ))}
        </Box>

        {/* Calendar modal */}
        <Modal open={isCalendarOpen} onClose={() => setIsCalendarOpen(false)}>
          <ModalDialog sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          }}>
            <Input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              sx={{
                fontSize: '16px',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #ccc',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }}
            />
          </ModalDialog>
        </Modal>

        {/* Side menu component */}
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </Box>
    </CssVarsProvider>
  );
}

