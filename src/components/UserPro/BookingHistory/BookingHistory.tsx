
// 'use client'

// import { useState, useEffect, ReactNode } from 'react'
// import {
//   CssVarsProvider,
//   extendTheme,
//   CssBaseline,
//   Box,
//   Typography,
//   Table,
//   Sheet,
//   Chip,
//   CircularProgress,
//   Modal,
//   ModalClose,
//   ModalDialog,
//   Button,
//   Select,
//   Option,
//   FormControl,
//   FormLabel,
// } from '@mui/joy'
// import {
//   ArrowBack,
//   CalendarToday,
//   Person,
//   AccessTime,
// } from '@mui/icons-material'
// import axios from 'axios'
// import { Domain_URL } from '../../config'
// import { useNavigate } from 'react-router-dom'

// interface Booking {
//   comment: ReactNode
//   id: number
//   userId: number
//   coachId: number
//   userName: string
//   coachName: string
//   childName: string
//   startTime: string
//   endTime: string
//   slotId: number
//   date: string
//   bookingType: 'single' | 'group'
//   groupId: number | null
//   status: string
//   createdAt: string
// }

// const theme = extendTheme({
//   // Theme configuration
// })

// export default function BookingHistory() {
//   const [bookings, setBookings] = useState<Booking[]>([])
//   const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
//   const [userId, setUserId] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
//   const [dateFilter, setDateFilter] = useState<string>('')
//   const [statusFilter, setStatusFilter] = useState<string>('')

//   const navigate = useNavigate()

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId')
//     setUserId(storedUserId)
//   }, [])

//   useEffect(() => {
//     if (userId) fetchBookings()
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userId])

//   useEffect(() => {
//     filterBookings()
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [bookings, dateFilter, statusFilter])

//   const fetchBookings = async () => {
//     if (!userId) {
//       setError('User ID not found. Please log in again.')
//       setLoading(false)
//       return
//     }

//     try {
//       setLoading(true)
//       const response = await axios.get<Booking[]>(
//         `${Domain_URL}/bookings/user/${userId}`
//       )
//       setBookings(response.data)
//       setError(null)
//     } catch (err) {
//       console.error('Error fetching bookings:', err)
//       setError('No booking history. Please book slots.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filterBookings = () => {
//     let filtered = bookings

//     if (dateFilter) {
//       filtered = filtered.filter((booking) => booking.date === dateFilter)
//     }

//     if (statusFilter) {
//       filtered = filtered.filter(
//         (booking) =>
//           booking.status.toLowerCase() === statusFilter.toLowerCase()
//       )
//     }

//     filtered.sort((a, b) => {
//       const dateA = new Date(a.date)
//       const dateB = new Date(b.date)
//       return dateA.getTime() - dateB.getTime()
//     })
    
//     setFilteredBookings(filtered)
//   }

//   const getStatusColor = (status: string) => {
//     const statusColors: Record<string, 'primary' | 'success' | 'danger' | 'neutral'> = {
//       progress: 'primary',
//       completed: 'success',
//       canceled: 'danger',
//     }
//     return statusColors[status.toLowerCase()] || 'neutral'
//   }

//   const uniqueDates = Array.from(new Set(bookings.map((booking) => booking.date))).sort()
//   const uniqueStatuses = [...new Set(bookings.map((booking) => booking.status))]

//   const convertToLocalDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
//   }

//   return (
//     <CssVarsProvider theme={theme}>
//       <CssBaseline />
//       <Box
//         sx={{
//           p: { xs: 2, md: 4 },
//           minHeight: '100vh',
//           background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//         }}
//       >
//         <Box sx={{ maxWidth: '100%', mb: 2 }}>
//           <Button
//             startDecorator={<ArrowBack />}
//             onClick={() => navigate('/screen')}
//             variant="outlined"
//             color="neutral"
//             sx={{
//               mb: 2,
//               backgroundColor: '#0B6BCB',
//               color: 'white',
//               width: { xs: '100%', sm: 'auto' },
//               '&:hover': {
//                 backgroundColor: '#0D8CEB',
//               },
//             }}
//           >
//             Back to Dashboard
//           </Button>
//           <Typography
//             level="h2"
//             sx={{
//               mb: 4,
//               textAlign: 'center',
//               fontWeight: 'bold',
//               fontSize: { xs: '1.5rem', md: '2.5rem' },
//             }}
//           >
//             Booking History
//           </Typography>

//           <Box
//             sx={{
//               display: 'flex',
//               gap: 2,
//               mb: 2,
//               flexWrap: 'wrap',
//               justifyContent: { xs: 'center', md: 'flex-end' },
//             }}
//           >
//             <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
//               <FormLabel>Filter by Date</FormLabel>
//               <Select
//                 value={dateFilter}
//                 onChange={(_, value) => setDateFilter(value || '')}
//               >
//                 <Option value="">All Dates</Option>
//                 {uniqueDates.map((date) => (
//                   <Option key={date} value={date}>
//                     {convertToLocalDate(date).toLocaleDateString('en-US')}
//                   </Option>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
//               <FormLabel>Filter by Status</FormLabel>
//               <Select
//                 value={statusFilter}
//                 onChange={(_, value) => setStatusFilter(value || '')}
//               >
//                 <Option value="">All Status</Option>
//                 {uniqueStatuses.map((status) => (
//                   <Option key={status} value={status}>
//                     {status}
//                   </Option>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>

//           {loading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', height: 200 }}>
//               <CircularProgress size="lg" />
//             </Box>
//           ) : error ? (
//             <Typography color="danger" sx={{ mb: 2, textAlign: 'center' }}>
//               {error}
//             </Typography>
//           ) : filteredBookings.length === 0 ? (
//             <Typography sx={{ mb: 2, textAlign: 'center' }}>
//               No bookings found.
//             </Typography>
//           ) : (
//             <Sheet variant="outlined" sx={{ boxShadow: 'lg', overflowX: 'auto' }}>
//               <Table stickyHeader hoverRow>
//                 <thead>
//                   <tr>
//                     <th>User Name</th>
//                     <th>Coach Name</th>
//                     <th>Child Name</th>
//                     <th>Slot Date</th>
//                     <th>Slot</th>
//                     <th>Status</th>
//                     <th>Comment</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredBookings.map((booking) => (
//                     <tr
//                       key={booking.id}
//                       onClick={() => setSelectedBooking(booking)}
//                       style={{ cursor: 'pointer' }}
//                     >
//                       <td>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Person fontSize="small" />
//                           {booking.userName}
//                         </Box>
//                       </td>
//                       <td>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Person fontSize="small" />
//                           {booking.coachName}
//                         </Box>
//                       </td>
//                       <td>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Person fontSize="small" />
//                           {booking.childName}
//                         </Box>
//                       </td>
//                       <td>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <CalendarToday fontSize="small" />
//                           {convertToLocalDate(booking.date).toLocaleDateString('en-US')}
//                         </Box>
//                       </td>
//                       <td>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <AccessTime fontSize="small" />
//                           {booking.startTime} - {booking.endTime}
//                         </Box>
//                       </td>
//                       <td>
//                         <Chip
//                           variant="soft"
//                           color={getStatusColor(booking.status)}
//                           size="sm"
//                         >
//                           {booking.status}
//                         </Chip>
//                       </td>
//                       <td>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        
//                           {booking.comment|| 'Null'}
//                         </Box>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Sheet>
//           )}
//         </Box>

//         <Modal open={Boolean(selectedBooking)} onClose={() => setSelectedBooking(null)}>
//           <ModalDialog sx={{ minWidth: 'sm' }}>
//             <ModalClose />
//             <Typography level="h4" sx={{ mb: 2 }}>
//               Booking Details
//             </Typography>
//             {selectedBooking && (
//               <Box>
//                 <Typography>
//                   <strong>User:</strong> {selectedBooking.userName}
//                 </Typography>
//                 <Typography>
//                   <strong>Coach:</strong> {selectedBooking.coachName}
//                 </Typography>
//                 <Typography>
//                   <strong>Child Name:</strong> {selectedBooking.childName}
//                 </Typography>
//                 <Typography>
//                   <strong>Date:</strong>{' '}
//                   {convertToLocalDate(selectedBooking.date).toLocaleDateString('en-US')}
//                 </Typography>
//                 <Typography>
//                   <strong>Time:</strong> {selectedBooking.startTime} - {selectedBooking.endTime}
//                 </Typography>
//                 <Typography>
//                   <strong>Booking Type:</strong> {selectedBooking.bookingType}
//                 </Typography>
//                 <Typography>
//                   <strong>Status:</strong>{' '}
//                   <Chip
//                     variant="soft"
//                     color={getStatusColor(selectedBooking.status)}
//                   >
//                     {selectedBooking.status}
//                   </Chip>
//                 </Typography>

//                 <Typography>
//                   <strong>Comment:</strong> {selectedBooking.comment || 'Null'}
//                 </Typography>
//               </Box>
//             )}
//           </ModalDialog>
//         </Modal>
//       </Box>
//     </CssVarsProvider>
//   )
// }

import { useState, useEffect } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Domain_URL } from '../../config'
import { useNavigate } from 'react-router-dom'
import './BookingHistory.css'
import { FaArrowLeft } from 'react-icons/fa'

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
  comment?: 'personal reason' | 'not available' | 'had other work'
  createdAt: string
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<Date | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const rowsPerPage = 10

  const navigate = useNavigate()

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    setUserId(storedUserId)
  }, [])

  useEffect(() => {
    if (userId) fetchBookings()
  }, [userId])

  useEffect(() => {
    filterBookings()
  }, [bookings, dateFilter, statusFilter, currentPage])

  const fetchBookings = async () => {
    if (!userId) {
      setError('User ID not found. Please log in again.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await axios.get<Booking[]>(`${Domain_URL}/bookings/user/${userId}`)
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
    let filtered = bookings;
  
    if (dateFilter) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.date);
        const filterDate = new Date(dateFilter);
  
        // Normalize both dates to midnight UTC
        bookingDate.setUTCHours(0, 0, 0, 0);
        filterDate.setUTCHours(0, 0, 0, 0);
  
        return bookingDate.getTime() === filterDate.getTime();
      });
    }
  
    if (statusFilter) {
      filtered = filtered.filter(
        (booking) => booking.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
  
    // Sort the bookings by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
  
      // Sort by date first
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
  
      // If dates are equal, sort by startTime
      return a.startTime.localeCompare(b.startTime);
    });
  
    setFilteredBookings(filtered);
  }
  
  const convertToLocalDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
  }

  const uniqueStatuses = [...new Set(bookings.map((booking) => booking.status))]

  // Calculate the paginated bookings to show on the current page
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="booking-history">
      <button onClick={() => navigate('/screen')} className="back-button">
        <FaArrowLeft /> Back to Dashboard
      </button>
      <h2 className="title">Booking History</h2>

      {/* Filter Section */}
      <div className="filters">
        <label>
          Filter by Date:
          <DatePicker
            selected={dateFilter ? convertToLocalDate(dateFilter.toString()) : null}
             onChange={(date: Date | null) => setDateFilter(date)} // Set the date without toggling the picker
           onSelect={() => setIsDatePickerOpen(false)} // Close the picker on date selection
             onClickOutside={() => setIsDatePickerOpen(false)} // Close when clicking outside
            open={isDatePickerOpen} // Control when it opens/closes
            onInputClick={() => setIsDatePickerOpen(true)} // Open when clicking on the input
            isClearable
           placeholderText="Select a date"
         dateFormat="MM/dd/yyyy"
       className="date-input"
          />

        </label>

        <label>
          Filter by Status:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Booking Table */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : paginatedBookings.length === 0 ? (
        <div className="no-bookings">No bookings found.</div>
      ) : (
        <>
          <table className="booking-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Coach Name</th>
                <th>Child Name</th>
                <th>Slot Date</th>
                <th>Slot</th>
                <th>Status</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.userName}</td>
                  <td>{booking.coachName}</td>
                  <td>{booking.childName}</td>
                  <td>
                    {convertToLocalDate(booking.date).toLocaleDateString('en-US', { 
                      month: '2-digit', 
                      day: '2-digit', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td>{`${booking.startTime} - ${booking.endTime}`}</td>
                  <td className={`status ${booking.status.toLowerCase()}`}>{booking.status}</td>
                  <td>{booking.comment || 'No Comment'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}