
'use client';

import { useEffect, useState, ChangeEvent, useRef } from 'react';
import axios from 'axios';
import { Search, Menu, Person, Settings, Logout, ChevronLeft, ChevronRight, NotificationsOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
    navigate('/user-login');
  };

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 w-[250px] h-full bg-white/90 backdrop-blur-md transform transition-transform duration-300 ease-in-out z-[1000] flex flex-col p-4 shadow-[0_0_20px_rgba(0,0,0,0.1)] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <button onClick={onClose} className="mb-4 text-left p-2 hover:bg-gray-100 rounded">Close Menu</button>

      <button
        className="flex items-center justify-start mb-2 w-[150px] p-2 hover:bg-gray-100 rounded text-left disabled:opacity-50"
        onClick={() => handleButtonClick('profile')}
        disabled={loading.profile}
      >
        <Person className="mr-2" />
        {loading.profile ? 'Loading...' : 'Profile'}
      </button>

      <button
        className="flex items-center justify-start mb-2 w-[150px] p-2 hover:bg-gray-100 rounded text-left disabled:opacity-50"
        onClick={() => handleButtonClick('bookingHistory')}
        disabled={loading.bookingHistory}
      >
        <Settings className="mr-2" />
        {loading.bookingHistory ? 'Loading...' : 'BookingHistory'}
      </button>

      <button
        className="flex items-center justify-start mt-auto w-[150px] p-2 text-red-600 hover:bg-red-50 rounded text-left disabled:opacity-50"
        onClick={() => handleButtonClick('logout')}
        disabled={loading.logout}
      >
        <Logout className="mr-2" />
        {loading.logout ? 'Loading...' : 'Logout'}
      </button>
    </div>
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
  const [username, setUsername] = useState('');

  // Fetch coach data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
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
    <div
      className={`w-full min-h-screen p-6 flex flex-col items-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] transition-all duration-300 ${isMenuOpen ? 'pl-[260px]' : ''}`}
    >
        <div className="font-bold text-xl text-center mb-5">
          {username ? <h4>Welcome, {username}</h4> : <h2>Welcome, Guest</h2>}
        </div>
          
        {/* Header section with menu, search, and notifications */}
        <div className="flex items-center justify-between w-full max-w-[1200px] mb-2">
          <button
            className="mr-4 p-2 border border-gray-300 rounded hover:bg-gray-100"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu />
          </button>

          <div className="flex-grow max-w-[500px] relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" />
            </div>
            <input
              className="w-full py-3 pl-10 pr-4 bg-white/70 backdrop-blur-md hover:bg-white/80 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by Name or Sport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <span className="ml-4 font-bold hidden sm:inline">
            Total Coaches: {people.length}
          </span>

          <button
            className="ml-4 p-2 border border-gray-300 rounded hover:bg-gray-100"
            onClick={() => navigate('')}
          >
            <NotificationsOff />
          </button>
        </div>

        {/* Date selection section */}
        
        <div className="flex items-center mb-8 w-full max-w-[1200px] overflow-x-auto pb-2">
          <button onClick={() => handleDateNavigation('back')} className="mr-4 p-2 hover:bg-gray-200 rounded-full">
            <ChevronLeft />
          </button>

          <div className="relative flex items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="mb-6 mt-8 mr-6 p-3 w-[48px] h-[48px] rounded-[25px] border-2 border-[#007BFF] bg-white shadow-md focus:outline-none focus:border-[#0056b3] focus:shadow-[0_0_5px_rgba(0,123,255,0.5)]"
              style={{ maxWidth: '300px' }}
            />

            <div className="flex space-x-4">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`min-w-[100px] h-[40px] rounded-xl px-4 font-medium transition-colors ${
                    selectedDate === date
                      ? 'bg-blue-200 text-black'
                      : 'border border-blue-500 text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => handleDateNavigation('forward')} className="ml-4 p-2 hover:bg-gray-200 rounded-full">
            <ChevronRight />
          </button>
        </div>


        {/* Coach cards section */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 w-full max-w-[1200px]">
          {filteredPeople.map((person) => (
            <div key={person.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col">
              <h2 className="text-xl font-bold mb-2">
                {person.name}
              </h2>
              <p className="text-gray-700">Sport: {person.sport}</p>
              <p className="text-gray-700 mb-4">Phone: {person.phoneNumber}</p>
              <button
                className="w-full py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors mt-auto"
                onClick={() => handleViewSlot(person.coachId)}
                disabled={loading[person.coachId]}
              >
                {loading[person.coachId] ? 'Loading...' : 'View Slot'}
              </button>
            </div>
          ))}
        </div>

        {/* Calendar modal */}
        {isCalendarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsCalendarOpen(false)}>
            <div
              className="bg-white/90 backdrop-blur-md shadow-2xl p-6 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="text-base p-3 rounded-xl border border-gray-300 bg-white/70"
              />
            </div>
          </div>
        )}

        {/* Side menu component */}
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}
