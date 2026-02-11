
'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, BellSlash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import { Domain_URL } from '../../config';
import UserShell from '../../Layout/UserShell';

interface Person {
  id: string;
  name: string;
  age: number;
  sport: string;
  phoneNumber: string;
  coachId: string;
}

export default function Screen() {
  const [people, setPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, people]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
      setPeople(response.data);
      setFilteredPeople(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = () => {
    const filtered = people.filter((person) => {
      const nameMatch = person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      const professionMatch = person.sport?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      return nameMatch || professionMatch;
    });
    setFilteredPeople(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()} ${date.getUTCFullYear()}`;
  };

  const generateDates = () => {
    const startDate = new Date(selectedDate);
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate() + i));
      return date.toISOString().split('T')[0];
    });
  };
  const dates = generateDates();

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newDate = event.target.value;
    if (new Date(newDate).toString() !== 'Invalid Date') {
      setSelectedDate(newDate);
      setIsCalendarOpen(false);
    } else {
      console.error('Invalid date selected');
    }
  };

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

  const handleViewSlot = (coachId: string) => {
    setLoading(prev => ({ ...prev, [coachId]: true }));
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [coachId]: false }));
      navigate(`/selectslot/${coachId}?date=${selectedDate}`);
    }, 500);
  };

  return (
    <UserShell title="Find a Coach">
      <div className="space-y-8">
        {/* Search and Date Selection Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={16} />
            </div>
            <input
              className="w-full py-2.5 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              placeholder="Search by name or sport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
             <button
                 onClick={() => handleDateNavigation('back')}
                 className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
               >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-2 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
                 <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="w-10 h-10 opacity-0 absolute inset-0 z-10 cursor-pointer"
                    />
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-indigo-600 transition-colors">
                       <span className="text-lg">🗓️</span>
                    </div>
                  </div>

                  {dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap
                        ${selectedDate === date
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
              </div>

               <button
                 onClick={() => handleDateNavigation('forward')}
                 className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
               >
                <ChevronRight size={16} />
              </button>
          </div>
        </div>

        {/* Coach Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPeople.map((person) => (
            <div
              key={person.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                  {person.sport}
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 leading-tight truncate mb-1">
                  {person.name}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {person.phoneNumber}
                </p>
              </div>

              <button
                className="w-full py-2.5 bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium text-sm transition-all mt-auto flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white"
                onClick={() => handleViewSlot(person.coachId)}
                disabled={loading[person.coachId]}
              >
                {loading[person.coachId] ? (
                   'Loading...'
                ) : (
                  'View Slots'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Calendar modal */}
        {isCalendarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setIsCalendarOpen(false)}>
            <div
              className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Date</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </UserShell>
  );
}
