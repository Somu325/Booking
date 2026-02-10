
'use client';

import { useEffect, useState, ChangeEvent, useRef } from 'react';
import axios from 'axios';
import { Search, List, Person, Gear, BoxArrowRight, ChevronLeft, ChevronRight, BellSlash } from 'react-bootstrap-icons';
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
      className={`fixed top-0 left-0 w-[280px] h-full bg-white/90 backdrop-blur-xl border-r border-white/40 shadow-2xl z-[1000] transform transition-transform duration-300 ease-out flex flex-col p-6 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-800">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="space-y-2">
        <button
          className="w-full flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 hover:shadow-sm transition-all duration-200 disabled:opacity-50 font-medium"
          onClick={() => handleButtonClick('profile')}
          disabled={loading.profile}
        >
          <Person size={20} />
          {loading.profile ? 'Loading...' : 'Profile'}
        </button>

        <button
          className="w-full flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 hover:shadow-sm transition-all duration-200 disabled:opacity-50 font-medium"
          onClick={() => handleButtonClick('bookingHistory')}
          disabled={loading.bookingHistory}
        >
          <Gear size={20} />
          {loading.bookingHistory ? 'Loading...' : 'Booking History'}
        </button>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-200">
        <button
          className="w-full flex items-center gap-4 p-3.5 rounded-xl text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-200 disabled:opacity-50 font-medium"
          onClick={() => handleButtonClick('logout')}
          disabled={loading.logout}
        >
          <BoxArrowRight size={20} />
          {loading.logout ? 'Loading...' : 'Logout'}
        </button>
      </div>
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
      className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 transition-all duration-300 ${isMenuOpen ? 'lg:pl-[280px]' : ''}`}
    >
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">

        {/* Header section with menu, search, and notifications */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <button
              onClick={() => setIsMenuOpen(true)}
              className="p-3 bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-600"
            >
              <List size={24} />
            </button>
            <div>
               <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                {username ? `Welcome, ${username}` : 'Welcome, Guest'}
              </h1>
              <p className="text-slate-500 text-sm font-medium">Find your perfect coach</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto flex-1 justify-end">
             <div className="relative w-full max-w-md group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              </div>
              <input
                className="w-full py-3.5 pl-11 pr-4 bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                placeholder="Search by name or sport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="p-3 bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-600 relative"
              onClick={() => navigate('')}
            >
              <BellSlash size={20} />
            </button>

             <div className="hidden lg:flex flex-col items-end">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Coaches</span>
                <span className="text-lg font-bold text-indigo-600">{people.length}</span>
             </div>
          </div>
        </header>

        {/* Date selection section */}
        <div className="w-full overflow-x-auto pb-4 pt-2 scrollbar-hide">
            <div className="flex items-center justify-between md:justify-start gap-4 min-w-max mx-auto md:mx-0">
               <button
                 onClick={() => handleDateNavigation('back')}
                 className="p-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-sm hover:bg-white hover:shadow-md transition-all text-slate-500 hover:text-indigo-600"
               >
                <ChevronLeft size={20} />
              </button>

               <div className="flex items-center gap-3 bg-white/30 backdrop-blur-md p-2 rounded-2xl border border-white/30">
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="w-12 h-12 opacity-0 absolute inset-0 z-10 cursor-pointer"
                    />
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-indigo-100 text-indigo-500 font-bold text-lg">
                       <span className="transform -translate-y-0.5">🗓️</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {dates.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                          ${selectedDate === date
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                            : 'bg-white/60 text-slate-600 border-transparent hover:bg-white hover:border-white hover:shadow-sm'
                          }
                        `}
                      >
                        {formatDate(date)}
                      </button>
                    ))}
                  </div>
               </div>

              <button
                 onClick={() => handleDateNavigation('forward')}
                 className="p-3 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-sm hover:bg-white hover:shadow-md transition-all text-slate-500 hover:text-indigo-600"
               >
                <ChevronRight size={20} />
              </button>
            </div>
        </div>


        {/* Coach cards section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {filteredPeople.map((person) => (
            <div
              key={person.id}
              className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden"
            >
              {/* Decorative gradient blob */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl shrink-0">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-800 leading-tight truncate">
                      {person.name}
                    </h2>
                     <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mt-1 truncate max-w-full">
                      {person.sport}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-6 text-sm">
                   <div className="flex items-center gap-2 text-slate-500">
                      <span className="font-medium text-slate-400">Phone:</span>
                      <span className="truncate">{person.phoneNumber}</span>
                   </div>
                </div>

                <button
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 disabled:opacity-50 disabled:shadow-none transition-all mt-auto flex items-center justify-center gap-2"
                  onClick={() => handleViewSlot(person.coachId)}
                  disabled={loading[person.coachId]}
                >
                  {loading[person.coachId] ? (
                     <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Loading...</span>
                     </>
                  ) : (
                    <>
                      <span>View Slots</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar modal */}
        {isCalendarOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCalendarOpen(false)}>
            <div
              className="bg-white p-6 rounded-2xl shadow-2xl border border-white/50 transform transition-all scale-100 animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-800 mb-4">Select Date</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        )}

      </div>

        {/* Side menu component */}
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}
