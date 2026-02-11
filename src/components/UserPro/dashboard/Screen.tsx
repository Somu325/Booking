'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, Bell, CalendarEvent, GeoAlt, Trophy } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import UserShell from '../Layout/UserShell';
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

// Main Screen component
export default function Screen() {
  // State variables
  const [people, setPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
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
    return {
      day: date.getUTCDate(),
      month: months[date.getUTCMonth()],
      year: date.getUTCFullYear(),
      full: `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
    };
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
    <UserShell>
      <div className="space-y-10 py-6 md:py-10">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900 mb-1">
              Welcome back, <span className="font-medium">{username || 'Guest'}</span>
            </h1>
            <p className="text-slate-500 text-sm">Find and book your perfect coach.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative w-full md:w-80 group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-slate-400 group-focus-within:text-slate-600 transition-colors" size={16} />
              </div>
              <input
                className="w-full py-2.5 pl-10 pr-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                placeholder="Search coaches or sports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors relative border border-slate-200 rounded-lg bg-white hover:border-slate-300">
               <Bell size={18} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white translate-x-1/2 -translate-y-1/2"></span>
            </button>
          </div>
        </header>

        {/* Date Selection Section */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-900">Select Date</h2>
              <div className="flex gap-2">
                 <button
                   onClick={() => handleDateNavigation('back')}
                   className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                 >
                  <ChevronLeft size={20} />
                </button>
                <button
                   onClick={() => handleDateNavigation('forward')}
                   className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                 >
                  <ChevronRight size={20} />
                </button>
              </div>
           </div>

           <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <div className="relative group">
                 <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex flex-col items-center justify-center w-16 h-20 bg-white border border-slate-200 rounded-xl group-hover:border-slate-400 transition-colors cursor-pointer">
                      <CalendarEvent size={20} className="text-slate-400 mb-1" />
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Pick</span>
                  </div>
              </div>

              {dates.map((dateString) => {
                 const date = formatDate(dateString);
                 const isSelected = selectedDate === dateString;
                 return (
                    <button
                      key={dateString}
                      onClick={() => setSelectedDate(dateString)}
                      className={`
                        flex flex-col items-center justify-center w-16 h-20 rounded-xl border transition-all duration-200 shrink-0
                        ${isSelected
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                        }
                      `}
                    >
                      <span className={`text-xs font-medium uppercase tracking-wide ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                        {date.month}
                      </span>
                      <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {date.day}
                      </span>
                    </button>
                 );
              })}
           </div>
        </section>

        {/* Coaches Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-medium text-slate-900">Available Coaches</h2>
             <span className="text-sm text-slate-500">{filteredPeople.length} found</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className="group bg-white rounded-2xl border border-slate-100 p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-sm flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                   <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 font-bold text-lg border border-slate-100">
                      {person.name.charAt(0).toUpperCase()}
                   </div>
                   <div className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-medium text-slate-600 tracking-wide uppercase">
                      {person.sport}
                   </div>
                </div>

                <div className="mb-6">
                   <h3 className="text-lg font-semibold text-slate-900 leading-tight mb-1 truncate">
                      {person.name}
                   </h3>
                   <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Trophy size={12} />
                      <span className="truncate">{person.sport} Coach</span>
                   </div>
                </div>

                <div className="mt-auto space-y-3">
                   <div className="flex items-center gap-2 text-xs text-slate-400 pb-3 border-b border-slate-50">
                      <GeoAlt size={12} />
                      <span className="truncate">Available for booking</span>
                   </div>

                   <button
                    onClick={() => handleViewSlot(person.coachId)}
                    disabled={loading[person.coachId]}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     {loading[person.coachId] ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     ) : (
                       <>
                         <span>View Schedule</span>
                         <ChevronRight size={14} />
                       </>
                     )}
                   </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPeople.length === 0 && (
             <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <p className="text-slate-500">No coaches found matching your criteria.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Clear search
                </button>
             </div>
          )}
        </section>

      </div>
    </UserShell>
  );
}
