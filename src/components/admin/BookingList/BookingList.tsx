
'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Domain_URL } from "../../config";
import { useNavigate } from 'react-router-dom';
import AdminShell from '../../Layout/AdminShell';
import { ChevronLeft, ChevronRight, Eye, X } from 'react-bootstrap-icons';

interface Booking {
  id: string;
  userName: string;
  coachName: string;
  status: string;
  slotId: string;
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get<Booking[]>(`${Domain_URL}/bookingsName`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching booking data:', error);
      setError('Failed to load bookings. Please try again later.');
    }
  };

  const paginatedBookings = bookings.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.ceil(bookings.length / rowsPerPage);

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
    <AdminShell title="Bookings">
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Name</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Coach Name</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {paginatedBookings.map((booking) => (
                       <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">{booking.userName}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{booking.coachName}</td>
                          <td className="py-4 px-6">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(booking.status)}`}>
                                {booking.status}
                             </span>
                          </td>
                          <td className="py-4 px-6">
                             <button
                               onClick={() => setSelectedBooking(booking)}
                               className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                               title="View Details"
                             >
                                <Eye size={16} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Pagination */}
           {bookings.length > 0 && (
             <div className="border-t border-gray-100 p-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                   Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, bookings.length)} of {bookings.length} entries
                </span>
                <div className="flex gap-2">
                   <button
                     onClick={() => setPage(Math.max(0, page - 1))}
                     disabled={page === 0}
                     className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:bg-white transition-colors"
                   >
                     <ChevronLeft size={16} />
                   </button>
                   <button
                     onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                     disabled={page === totalPages - 1}
                     className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:bg-white transition-colors"
                   >
                     <ChevronRight size={16} />
                   </button>
                </div>
             </div>
           )}

           {bookings.length === 0 && !error && (
              <div className="p-8 text-center text-gray-500">No bookings found.</div>
           )}
        </div>
      </div>

      {/* Modal */}
      {selectedBooking && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedBooking(null)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-gray-100" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
                  <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between">
                     <span className="text-sm text-gray-500">User</span>
                     <span className="text-sm font-medium text-gray-900">{selectedBooking.userName}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-sm text-gray-500">Coach</span>
                     <span className="text-sm font-medium text-gray-900">{selectedBooking.coachName}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-sm text-gray-500">Slot ID</span>
                     <span className="text-sm font-medium text-gray-900">{selectedBooking.slotId}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                     <span className="text-sm text-gray-500">Status</span>
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(selectedBooking.status)}`}>
                        {selectedBooking.status}
                     </span>
                  </div>
               </div>
               <div className="mt-6">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
               </div>
            </div>
         </div>
      )}
    </AdminShell>
  );
}
