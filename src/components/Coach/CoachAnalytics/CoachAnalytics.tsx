
'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from '../../config';
import { ChevronLeft, ChevronRight, Filter, Search, X, Calendar, Clock } from 'react-bootstrap-icons';
import CoachShell from '../../Layout/CoachShell';

interface Booking {
  bookingId: string;
  userId: string;
  childId?: string;
  childName: string | null;
  coachId: string;
  slotId: string;
  bookingType: 'single' | 'group';
  status: 'progress' | 'completed' | 'canceled' | 'upcoming';
  createdAt: string;
  updatedAt: string;
  userName: string | null;
  coachName: string | null;
  startTime: string | null;
  endTime: string | null;
  slotType: string | null;
  slotDuration: string | null;
  date: string | null;
}

export default function CoachAnalytics() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [childNameSearch, setChildNameSearch] = useState<string>('');
  const [startTimeSearch, setStartTimeSearch] = useState<string>('');
  const [endTimeSearch, setEndTimeSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Increased for better table view

  const navigate = useNavigate();
  const CoachId = localStorage.getItem('coachId');
  const coachName = localStorage.getItem('coachName');

  useEffect(() => {
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, statusFilter, childNameSearch, startTimeSearch, endTimeSearch, startDate, endDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Booking[]>(`${Domain_URL}/coaches/${CoachId}/bookings`);
      
      const bookingsWithFormattedDates = response.data.map(booking => ({
        ...booking,
        date: booking.date ? new Date(booking.date).toISOString().split('T')[0] : null,
      }));

      const sortedBookings = bookingsWithFormattedDates.sort((a, b) => {
        const dateA = new Date(a.date || '').getTime();
        const dateB = new Date(b.date || '').getTime();
        const startTimeA = a.startTime ? new Date(`1970-01-01T${a.startTime}`) : new Date(0);
        const startTimeB = b.startTime ? new Date(`1970-01-01T${b.startTime}`) : new Date(0);

        if (dateA === dateB) {
          return startTimeA.getTime() - startTimeB.getTime();
        }
        return dateA - dateB;
      });

      setBookings(sortedBookings);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('No booking history. Please book a slot.');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;
  
    if (statusFilter) {
      filtered = filtered.filter(
        (booking) => booking.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
  
    if (childNameSearch) {
      filtered = filtered.filter((booking) =>
        booking.childName?.toLowerCase().includes(childNameSearch.toLowerCase())
      );
    }
  
    if (startTimeSearch) {
      filtered = filtered.filter((booking) =>
        booking.startTime?.includes(startTimeSearch)
      );
    }
  
    if (endTimeSearch) {
      filtered = filtered.filter((booking) =>
        booking.endTime?.includes(endTimeSearch)
      );
    }
  
    const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
    const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';
  
    if (formattedStartDate) {
      filtered = filtered.filter((booking) => booking.date && booking.date >= formattedStartDate);
    }
  
    if (formattedEndDate) {
      filtered = filtered.filter((booking) => booking.date && booking.date <= formattedEndDate);
    }
  
    if (formattedStartDate && formattedEndDate && formattedStartDate === formattedEndDate) {
      filtered = filtered.filter((booking) => booking.date === formattedStartDate);
    }
  
    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'canceled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'upcoming':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentItems = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <CoachShell title="Analytics">
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
           <div>
              <h2 className="text-lg font-bold text-gray-900">Booking Analytics</h2>
              <p className="text-sm text-gray-500">View and manage your booking history.</p>
           </div>
           <div className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Bookings</span>
              <p className="text-2xl font-bold text-indigo-600">{filteredBookings.length}</p>
           </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
           <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Filter size={14} /> Filters
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-500">Status</label>
                 <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">All</option>
                    <option value="booked">Booked</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="progress">Progress</option>
                    <option value="canceled">Canceled</option>
                    <option value="completed">Completed</option>
                  </select>
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-500">Child Name</label>
                 <input
                    value={childNameSearch}
                    onChange={(e) => setChildNameSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-500">Start Time</label>
                 <input
                    value={startTimeSearch}
                    onChange={(e) => setStartTimeSearch(e.target.value)}
                    placeholder="HH:MM"
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-500">End Time</label>
                 <input
                    value={endTimeSearch}
                    onChange={(e) => setEndTimeSearch(e.target.value)}
                    placeholder="HH:MM"
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-500">Start Date</label>
                 <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-500">End Date</label>
                 <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
              </div>
           </div>
        </div>

        {/* Results */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
           {loading ? (
              <div className="flex justify-center items-center h-64">
                 <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
           ) : error ? (
              <div className="flex justify-center items-center h-64 text-gray-500">
                 {error}
              </div>
           ) : (
              <>
                 {/* Desktop Table */}
                 <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                             <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                             <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Child</th>
                             <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                             <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                             <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                             <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                             <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          {currentItems.length > 0 ? (
                             currentItems.map((booking) => (
                                <tr
                                   key={booking.bookingId}
                                   onClick={() => setSelectedBooking(booking)}
                                   className="hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                   <td className="py-4 px-6 text-sm text-gray-900 font-medium">{booking.userName}</td>
                                   <td className="py-4 px-6 text-sm text-gray-600">{booking.childName || '-'}</td>
                                   <td className="py-4 px-6 text-sm text-gray-600">{booking.date}</td>
                                   <td className="py-4 px-6 text-sm text-gray-600">{booking.startTime} - {booking.endTime}</td>
                                   <td className="py-4 px-6">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(booking.status)}`}>
                                         {booking.status}
                                      </span>
                                   </td>
                                   <td className="py-4 px-6 text-sm text-gray-600">{booking.slotDuration}</td>
                                   <td className="py-4 px-6 text-sm text-gray-600 capitalize">{booking.slotType}</td>
                                </tr>
                             ))
                          ) : (
                             <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-500">No bookings found</td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>

                 {/* Mobile List */}
                 <div className="md:hidden p-4 space-y-4">
                    {currentItems.length > 0 ? (
                       currentItems.map((booking) => (
                          <div
                             key={booking.bookingId}
                             onClick={() => setSelectedBooking(booking)}
                             className="bg-gray-50 border border-gray-200 rounded-lg p-4 active:scale-[0.98] transition-transform"
                          >
                             <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-gray-900">{booking.userName}</span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(booking.status)}`}>
                                   {booking.status}
                                </span>
                             </div>
                             <div className="text-sm text-gray-600 space-y-1">
                                <p>Child: {booking.childName || '-'}</p>
                                <p>Date: {booking.date}</p>
                                <p>Time: {booking.startTime} - {booking.endTime}</p>
                             </div>
                          </div>
                       ))
                    ) : (
                       <div className="text-center text-gray-500 py-8">No bookings found</div>
                    )}
                 </div>
              </>
           )}
        </div>

         {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4">
               <button
                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                 disabled={currentPage === 1}
                 className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
               >
                 <ChevronLeft />
               </button>
               <span className="text-sm font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
               <button
                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                 disabled={currentPage === totalPages}
                 className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
               >
                 <ChevronRight />
               </button>
            </div>
          )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
               <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
               <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                 <X size={20} />
               </button>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">User Name</span>
                  <span className="text-sm font-medium text-gray-900">{selectedBooking.userName}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Child Name</span>
                  <span className="text-sm font-medium text-gray-900">{selectedBooking.childName || 'N/A'}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Coach Name</span>
                  <span className="text-sm font-medium text-gray-900">{selectedBooking.coachName}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm font-medium text-gray-900">{selectedBooking.date}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="text-sm font-medium text-gray-900">{selectedBooking.startTime} - {selectedBooking.endTime}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Duration</span>
                  <span className="text-sm font-medium text-gray-900">{selectedBooking.slotDuration}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{selectedBooking.slotType}</span>
               </div>
               <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(selectedBooking.status)}`}>
                      {selectedBooking.status}
                  </span>
               </div>
            </div>
          </div>
        </div>
      )}
    </CoachShell>
  );
}
