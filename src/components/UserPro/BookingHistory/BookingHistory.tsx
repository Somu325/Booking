
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Domain_URL } from '../../config'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarCheck,
  Person,
  Clock,
  ChatLeftText,
  X
} from 'react-bootstrap-icons'
import UserShell from '../../Layout/UserShell'

interface Booking {
  id: number
  userId: number
  coachId: number
  userName: string
  coachName: string
  childName: string
  startTime: string
  endTime: string
  slotId: number
  date: string
  bookingType: 'single' | 'group'
  groupId: number | null
  status: string
  createdAt: string
  comment: string
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [dateFilter, setDateFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const navigate = useNavigate()

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    setUserId(storedUserId)
  }, [])

  useEffect(() => {
    if (userId) fetchBookings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => {
    filterBookings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, dateFilter, statusFilter])

  const fetchBookings = async () => {
    if (!userId) {
      setError('User ID not found. Please log in again.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await axios.get<Booking[]>(
        `${Domain_URL}/bookings/user/${userId}`
      )
      setBookings(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('No booking history. Please book slots.')
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    if (dateFilter) {
      filtered = filtered.filter((booking) => {
        const localDate = new Date(booking.date).toLocaleString('en-US', { timeZone: 'UTC' })
        const bookingDate = new Date(localDate).toLocaleDateString('en-US')
        return bookingDate === dateFilter
      })
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (booking) => booking.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime()
      }
      return a.startTime.localeCompare(b.startTime)
    })

    const completedBookings = filtered.filter(
      booking => booking.status.toLowerCase() === 'completed' || booking.status.toLowerCase() === 'canceled'
    )
  
    const otherBookings = filtered.filter(
      booking => booking.status.toLowerCase() !== 'completed' && booking.status.toLowerCase() !== 'canceled'
    )
  
    setFilteredBookings([...otherBookings, ...completedBookings])
  }

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'canceled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'booked':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  }

  const uniqueDates = Array.from(
    new Set(
      bookings.map((booking) => {
        const localDate = new Date(booking.date).toLocaleString('en-US', { timeZone: 'UTC' })
        return new Date(localDate).toLocaleDateString('en-US')
      })
    )
  ).sort()

  const uniqueStatuses = [...new Set(bookings.map((booking) => booking.status))]

  const convertToLocalDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { timeZone: 'UTC' })
  }

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return 'N/A'
    const [hours, minutes] = timeString.split(':')
    return new Date(0, 0, 0, parseInt(hours), parseInt(minutes)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <UserShell title="Booking History">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium shadow-sm transition-all cursor-pointer hover:border-gray-300"
              >
                <option value="">All Dates</option>
                {uniqueDates.map((date) => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium shadow-sm transition-all cursor-pointer hover:border-gray-300"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-white rounded-xl border border-red-100 text-red-600">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-200 text-gray-500">
            No bookings found matching your filters.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Info</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Coach Info</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                              <Person size={14} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{booking.userName}</p>
                              <p className="text-xs text-gray-500">Child: {booking.childName || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span>{booking.coachName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2 text-sm text-gray-700">
                                <CalendarCheck size={14} className="text-gray-400" />
                                <span>{convertToLocalDate(booking.date).split(',')[0]}</span>
                             </div>
                             <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock size={12} />
                                <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                             </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                           <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                             View
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm active:scale-[0.99] transition-transform"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="font-semibold text-gray-900">{booking.coachName}</h3>
                        <p className="text-sm text-gray-500">Coach</p>
                     </div>
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                     </span>
                  </div>

                  <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                     <div className="flex justify-between">
                       <span className="text-gray-500">Date</span>
                       <span className="font-medium text-gray-900">{convertToLocalDate(booking.date).split(',')[0]}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-500">Time</span>
                       <span className="font-medium text-gray-900">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                     </div>
                      <div className="flex justify-between">
                       <span className="text-gray-500">User</span>
                       <span className="font-medium text-gray-900">{booking.userName}</span>
                     </div>
                      <div className="flex justify-between">
                       <span className="text-gray-500">Child</span>
                       <span className="font-medium text-gray-900">{booking.childName || 'N/A'}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
               <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
               <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                 <X size={20} />
               </button>
            </div>

            <div className="p-6 space-y-4">
               <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Coach</span>
                  <p className="text-base font-medium text-gray-900">{selectedBooking.coachName}</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</span>
                      <p className="text-sm text-gray-700">{convertToLocalDate(selectedBooking.date).split(',')[0]}</p>
                  </div>
                   <div className="space-y-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</span>
                      <p className="text-sm text-gray-700">{formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}</p>
                  </div>
               </div>

               <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Participants</span>
                  <p className="text-sm text-gray-700">User: {selectedBooking.userName}</p>
                  <p className="text-sm text-gray-700">Child: {selectedBooking.childName || 'N/A'}</p>
               </div>

               <div className="space-y-1">
                   <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                   <div>
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(selectedBooking.status)}`}>
                        {selectedBooking.status}
                      </span>
                   </div>
               </div>

               {selectedBooking.comment && (
                 <div className="space-y-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <ChatLeftText size={12} /> Comment
                    </span>
                    <p className="text-sm text-gray-600">{selectedBooking.comment}</p>
                 </div>
               )}
            </div>

            <div className="p-6 pt-0">
               <button
                onClick={() => setSelectedBooking(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors"
               >
                 Close
               </button>
            </div>
          </div>
        </div>
      )}
    </UserShell>
  )
}
