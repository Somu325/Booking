
'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Domain_URL } from '../../config';
import AdminShell from '../../Layout/AdminShell';
import { ChevronLeft, ChevronRight, X, Calendar, SlashCircle } from 'react-bootstrap-icons';

interface Booking {
  bookingId: string;
  user: { userId: string; name: string };
  child?: { childId: string; name: string };
  coach: { coachId: string; name: string };
  slot: { slotId: string; startTime: string; endTime: string; date: string };
  status: string;
}

export default function BookingCancel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [cancelComment, setCancelComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const bookingsPerPage = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get<Booking[]>(`${Domain_URL}/allbookings`);
        const sortedBookings = sortBookings(response.data);
        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };
    fetchBookings();
  }, []);

  const sortBookings = (bookingsToSort: Booking[]) => {
    return bookingsToSort.sort((a, b) => {
      if ((a.status === 'completed' || a.status === 'canceled') && (b.status !== 'completed' && b.status !== 'canceled')) {
        return 1;
      }
      if ((b.status === 'completed' || b.status === 'canceled') && (a.status !== 'completed' && a.status !== 'canceled')) {
        return -1;
      }

      const dateA = a.slot?.date ? new Date(a.slot.date).getTime() : 0;
      const dateB = b.slot?.date ? new Date(b.slot.date).getTime() : 0;

      if (dateA !== dateB) return dateA - dateB;

      const timeA = a.slot?.startTime ? new Date(`1970-01-01T${a.slot.startTime}`).getTime() : 0;
      const timeB = b.slot?.startTime ? new Date(`1970-01-01T${b.slot.startTime}`).getTime() : 0;

      return timeA - timeB;
    });
  };

  const openCancelModal = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel || !cancelComment) return;

    setIsLoading(true);
    try {
      await axios.patch(`${Domain_URL}/bookings/${bookingToCancel}/cancel`, { comment: cancelComment });
      const updatedBookings = bookings.map(b =>
        b.bookingId === bookingToCancel ? { ...b, status: 'canceled' } : b
      );
      const sortedBookings = sortBookings(updatedBookings);
      setBookings(sortedBookings);
      filterBookings(sortedBookings, selectedDate, selectedStatus);
      setShowModal(false);
      setBookingToCancel(null);
      setCancelComment('');
    } catch (error) {
      console.error('Error canceling booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = (bookingsToFilter: Booking[], date: Date | null, status: string) => {
    let filtered = bookingsToFilter;

    if (date) {
      const selectedDateStr = date.toISOString().split('T')[0];
      filtered = filtered.filter(b => {
        if (!b.slot?.date) return false;
        const bookingDateStr = new Date(b.slot.date).toISOString().split('T')[0];
        return bookingDateStr === selectedDateStr;
      });
    }

    if (status !== 'all') {
      filtered = filtered.filter(b => b.status === status);
    }

    setFilteredBookings(sortBookings(filtered));
    setCurrentPage(0);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    filterBookings(bookings, date, selectedStatus);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value;
    setSelectedStatus(status);
    filterBookings(bookings, selectedDate, status);
  };

  const paginatedBookings = filteredBookings.slice(
    currentPage * bookingsPerPage,
    (currentPage + 1) * bookingsPerPage
  );

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'canceled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'booked':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <AdminShell title="Cancel Bookings">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
           <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                placeholderText="Select date"
                isClearable
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                 <Calendar size={14} />
              </div>
           </div>

           <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-full md:w-48 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
              <option value="upcoming">Upcoming</option>
              <option value="inprogress">In Progress</option>
            </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Child</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Coach</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {paginatedBookings.map((booking) => (
                       <tr key={booking.bookingId} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">{booking.user?.name || 'N/A'}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{booking.child?.name || '-'}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{booking.coach?.name || 'N/A'}</td>
                          <td className="py-4 px-6">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(booking.status)}`}>
                                {booking.status}
                             </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                             {booking.slot?.startTime} - {booking.slot?.endTime}
                             <br />
                             <span className="text-xs text-gray-400">
                               {booking.slot?.date ? new Date(booking.slot.date).toLocaleDateString() : ''}
                             </span>
                          </td>
                          <td className="py-4 px-6">
                             {booking.status !== 'canceled' && booking.status !== 'completed' && booking.status !== 'inprogress' ? (
                                <button
                                  onClick={() => openCancelModal(booking.bookingId)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-red-200 hover:border-red-300"
                                >
                                   Cancel Booking
                                </button>
                             ) : (
                                <span className="text-xs text-gray-400 italic">
                                   {booking.status === 'canceled' ? 'Already Canceled' : 'Cannot Cancel'}
                                </span>
                             )}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Pagination */}
           {filteredBookings.length > 0 && (
             <div className="border-t border-gray-100 p-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                   Page {currentPage + 1} of {totalPages}
                </span>
                <div className="flex gap-2">
                   <button
                     onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                     disabled={currentPage === 0}
                     className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:bg-white transition-colors"
                   >
                     <ChevronLeft size={16} />
                   </button>
                   <button
                     onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                     disabled={currentPage === totalPages - 1}
                     className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:bg-white transition-colors"
                   >
                     <ChevronRight size={16} />
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Cancel Booking</h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-500 uppercase">Reason</label>
                     <select
                        value={cancelComment}
                        onChange={(e) => setCancelComment(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                     >
                        <option value="">Select a reason</option>
                        <option value="personal reason">Personal Reason</option>
                        <option value="not available">Not Available</option>
                        <option value="had other work">Had Other Work</option>
                     </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                     <button
                        onClick={handleCancelConfirm}
                        disabled={!cancelComment || isLoading}
                        className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
                     >
                        {isLoading ? 'Canceling...' : 'Confirm Cancel'}
                     </button>
                     <button
                        onClick={() => setShowModal(false)}
                        disabled={isLoading}
                        className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                     >
                        Keep Booking
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </AdminShell>
  );
}
