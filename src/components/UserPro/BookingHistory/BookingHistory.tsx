'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CalendarEvent, Clock, Person, ChatLeftText, X, Funnel, ChevronDown } from 'react-bootstrap-icons';
import UserShell from '../Layout/UserShell';
import { Domain_URL } from '../../config';

interface Booking {
  id: number;
  userId: number;
  coachId: number;
  userName: string;
  coachName: string;
  childName: string;
  startTime: string;
  endTime: string;
  slotId: number;
  date: string;
  bookingType: 'single' | 'group';
  groupId: number | null;
  status: string;
  createdAt: string;
  comment: string;
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userId) fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    filterBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, dateFilter, statusFilter]);

  const fetchBookings = async () => {
    if (!userId) {
      setError('User ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get<Booking[]>(
        `${Domain_URL}/bookings/user/${userId}`
      );
      setBookings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('No booking history found.');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (dateFilter) {
      filtered = filtered.filter((booking) => {
        const localDate = new Date(booking.date).toLocaleString('en-US', { timeZone: 'UTC' });
        const bookingDate = new Date(localDate).toLocaleDateString('en-US');
        return bookingDate === dateFilter;
      });
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (booking) => booking.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      return a.startTime.localeCompare(b.startTime);
    });

    const completedBookings = filtered.filter(
      booking => booking.status.toLowerCase() === 'completed' || booking.status.toLowerCase() === 'canceled'
    );
  
    const otherBookings = filtered.filter(
      booking => booking.status.toLowerCase() !== 'completed' && booking.status.toLowerCase() !== 'canceled'
    );
  
    setFilteredBookings([...otherBookings, ...completedBookings]);
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'completed') return 'bg-green-50 text-green-700 border-green-200';
    if (s === 'canceled') return 'bg-red-50 text-red-700 border-red-200';
    if (s === 'booked') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (s === 'progress') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const uniqueDates = Array.from(
    new Set(
      bookings.map((booking) => {
        const localDate = new Date(booking.date).toLocaleString('en-US', { timeZone: 'UTC' });
        return new Date(localDate).toLocaleDateString('en-US');
      })
    )
  ).sort();

  const uniqueStatuses = [...new Set(bookings.map((booking) => booking.status))];

  const convertToLocalDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { timeZone: 'UTC' });
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    return new Date(0, 0, 0, parseInt(hours), parseInt(minutes)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <UserShell>
      <div className="space-y-8 py-6 md:py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">Booking History</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and view your past and upcoming sessions.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Funnel size={14} />
               </div>
               <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 appearance-none cursor-pointer hover:border-slate-300 transition-colors shadow-sm"
               >
                  <option value="">All Dates</option>
                  {uniqueDates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                  ))}
               </select>
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown size={12} />
               </div>
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Funnel size={14} />
               </div>
               <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 appearance-none cursor-pointer hover:border-slate-300 transition-colors shadow-sm"
               >
                  <option value="">All Statuses</option>
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
               </select>
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown size={12} />
               </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
           <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-6 text-center text-sm">
             {error}
           </div>
        ) : filteredBookings.length === 0 ? (
           <div className="bg-slate-50 border border-slate-100 border-dashed rounded-2xl p-12 text-center">
              <p className="text-slate-500">No bookings found matching your filters.</p>
              <button
                onClick={() => { setDateFilter(''); setStatusFilter(''); }}
                className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Clear filters
              </button>
           </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
             {/* Desktop Table */}
             <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                         <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Coach</th>
                         <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Child</th>
                         <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Date & Time</th>
                         <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                         <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Comment</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {filteredBookings.map((booking) => (
                         <tr
                           key={booking.id}
                           onClick={() => setSelectedBooking(booking)}
                           className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                         >
                            <td className="py-4 px-6">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                                     {booking.coachName.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-sm font-medium text-slate-900">{booking.coachName}</span>
                               </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-600">
                               {booking.childName}
                            </td>
                            <td className="py-4 px-6">
                               <div className="flex flex-col text-sm">
                                  <span className="text-slate-900 font-medium">
                                    {convertToLocalDate(booking.date).split(',')[0]}
                                  </span>
                                  <span className="text-slate-500 text-xs mt-0.5">
                                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                  </span>
                               </div>
                            </td>
                            <td className="py-4 px-6">
                               <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                               </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-500 max-w-xs truncate">
                               {booking.comment || '-'}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             {/* Mobile Cards */}
             <div className="md:hidden divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                   <div
                     key={booking.id}
                     onClick={() => setSelectedBooking(booking)}
                     className="p-5 active:bg-slate-50 transition-colors cursor-pointer"
                   >
                      <div className="flex items-start justify-between mb-3">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                               {booking.coachName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                               <h3 className="text-sm font-semibold text-slate-900">{booking.coachName}</h3>
                               <p className="text-xs text-slate-500">{booking.childName}</p>
                            </div>
                         </div>
                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                         </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                         <div className="flex items-center gap-1.5">
                            <CalendarEvent size={12} />
                            <span>{convertToLocalDate(booking.date).split(',')[0]}</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                         </div>
                      </div>

                      {booking.comment && (
                         <div className="flex items-start gap-1.5 text-xs text-slate-400 bg-slate-50 p-2 rounded-lg">
                            <ChatLeftText size={12} className="mt-0.5 shrink-0" />
                            <span className="italic">{booking.comment}</span>
                         </div>
                      )}
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity duration-300" onClick={() => setSelectedBooking(null)}>
             <div
               className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
               onClick={(e) => e.stopPropagation()}
             >
                <div className="flex items-center justify-between p-6 border-b border-slate-50">
                   <h3 className="text-lg font-bold text-slate-900">Booking Details</h3>
                   <button
                     onClick={() => setSelectedBooking(null)}
                     className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                   >
                      <X size={24} />
                   </button>
                </div>

                <div className="p-6 space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Status</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedBooking.status)}`}>
                         {selectedBooking.status}
                      </span>
                   </div>

                   <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                         <span className="text-sm font-medium text-slate-500">Coach</span>
                         <span className="text-sm font-semibold text-slate-900">{selectedBooking.coachName}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                         <span className="text-sm font-medium text-slate-500">Child</span>
                         <span className="text-sm font-semibold text-slate-900">{selectedBooking.childName}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                         <span className="text-sm font-medium text-slate-500">Date</span>
                         <span className="text-sm font-semibold text-slate-900">{convertToLocalDate(selectedBooking.date).split(',')[0]}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                         <span className="text-sm font-medium text-slate-500">Time</span>
                         <span className="text-sm font-semibold text-slate-900">{formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                         <span className="text-sm font-medium text-slate-500">Type</span>
                         <span className="text-sm font-semibold text-slate-900 capitalize">{selectedBooking.bookingType}</span>
                      </div>
                   </div>

                   {selectedBooking.comment && (
                      <div className="pt-2">
                         <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Comment</span>
                         <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {selectedBooking.comment}
                         </p>
                      </div>
                   )}
                </div>

                <div className="p-6 pt-0">
                   <button
                     onClick={() => setSelectedBooking(null)}
                     className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors shadow-sm"
                   >
                      Close
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </UserShell>
  );
}
