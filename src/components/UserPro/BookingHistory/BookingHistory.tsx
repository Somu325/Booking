

// 'use client'

// import { useState, useEffect } from 'react'
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
//   id: number
//   userId: number
//   coachId: number
//   userName: string
//   coachName: string
//   startTime: string
//   endTime: string
//   slotId: number
//  // slotType: string
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
//   //const [typeFilter, setTypeFilter] = useState<string>('')
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
//   }, [bookings, dateFilter,  statusFilter])

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
//     // if (typeFilter) {
//     //   filtered = filtered.filter((booking) => booking.slotType === typeFilter)
//     // }
//     if (statusFilter) {
//       filtered = filtered.filter(
//         (booking) =>
//           booking.status.toLowerCase() === statusFilter.toLowerCase()
//       )
//     }
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

//   const uniqueDates = [...new Set(bookings.map((booking) => booking.date))]
//  // const uniqueTypes = [...new Set(bookings.map((booking) => booking.slotType))]
//   const uniqueStatuses = [...new Set(bookings.map((booking) => booking.status))]

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
//                backgroundColor:'#0B6BCB',
//               color: 'white',
//               width: { xs: '100%', sm: 'auto' },
//               '&:hover': {
//                 backgroundColor: '#0D8CEB', // lighter blue for hover
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
//              <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
//               <FormLabel>Filter by Date</FormLabel>
//               <Select
//                 value={dateFilter}
//                 onChange={(_, value) => setDateFilter(value || '')}
//               >
//                 <Option value="">All Dates</Option>
//                 {uniqueDates.map((date) => (
//                   <Option key={date} value={date}>
//                     {new Date(date).toLocaleDateString('en-US')}
//                   </Option>
//                 ))}
//               </Select>
//             </FormControl>
            
//             {/* <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
//               <FormLabel>Filter by Type</FormLabel>
//               <Select
//                 value={typeFilter}
//                 onChange={(_, value) => setTypeFilter(value || '')}
//               >
//                 <Option value="">All Types</Option>
//                 {uniqueTypes.map((type) => (
//                   <Option key={type} value={type}>
//                     {type}
//                   </Option>
//                 ))}
//               </Select>
//             </FormControl> */}

//             <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
//               <FormLabel>Filter by Status</FormLabel>
//               <Select
//                 value={statusFilter}
//                 onChange={(_, value) => setStatusFilter(value || '')}
//               >
//                 <Option value="">All Statuses</Option>
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
//                     <th>Slot Date</th>
//                     <th>Slot</th>
//                     {/* <th>Type</th> */}
//                     <th>Status</th>
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
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                        <CalendarToday fontSize="small" />
//                             {new Date(booking.date).toLocaleDateString('en-US')}
//                        </Box>
//                       </td>
//                       <td>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <AccessTime fontSize="small" />
//                           {booking.startTime} - {booking.endTime}
//                         </Box>
//                       </td>
//                       {/* <td>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Category fontSize="small" />
//                           {booking.slotType}
//                         </Box>
//                       </td> */}
//                       <td>
//                         <Chip
//                           variant="soft"
//                           color={getStatusColor(booking.status)}
//                           size="sm"
//                         >
//                           {booking.status}
//                         </Chip>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Sheet>
//           )}
//         </Box>
//       </Box>
//       {selectedBooking && (
//         <Modal open onClose={() => setSelectedBooking(null)}>
//           <ModalDialog aria-labelledby="booking-modal-title" aria-describedby="booking-modal-description" sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}>
//             <ModalClose sx={{ top: 'calc(-1/4  var(--IconButton-size))',  boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)', borderRadius: '50%', bgcolor: 'background.body' }} />
//             <Typography id="booking-modal-title" level="h4" fontWeight="lg" mb={1}>Booking Details</Typography>
//             <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
//               <Typography>User Name:</Typography><Typography>{selectedBooking.userName}</Typography>
//               <Typography>Coach Name:</Typography><Typography>{selectedBooking.coachName}</Typography>
//               <Typography>Slot Date:</Typography><Typography>{new Date(selectedBooking.date).toLocaleDateString('en-US')}</Typography>
//               <Typography>Slot Time:</Typography><Typography>{selectedBooking.startTime} - {selectedBooking.endTime}</Typography>
//               {/* <Typography>Type:</Typography><Typography>{selectedBooking.slotType}</Typography> */}
//               <Typography>Group ID:</Typography><Typography>{selectedBooking.groupId || 'N/A'}</Typography>
//               <Typography>Status:</Typography><Typography>{selectedBooking.status}</Typography>
//             </Box>
//           </ModalDialog>
//         </Modal>
//       )}
//     </CssVarsProvider>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import {
  CssVarsProvider,
  extendTheme,
  CssBaseline,
  Box,
  Typography,
  Table,
  Sheet,
  Chip,
  CircularProgress,
  Modal,
  ModalClose,
  ModalDialog,
  Button,
  Select,
  Option,
  FormControl,
  FormLabel,
} from '@mui/joy'
import {
  ArrowBack,
  CalendarToday,
  Person,
  AccessTime,
} from '@mui/icons-material'
import axios from 'axios'
import { Domain_URL } from '../../config'
import { useNavigate } from 'react-router-dom'

interface Booking {
  id: number
  userId: number
  coachId: number
  userName: string
  coachName: string
  startTime: string
  endTime: string
  slotId: number
  date: string
  bookingType: 'single' | 'group'
  groupId: number | null
  status: string
  createdAt: string
}

const theme = extendTheme({
  // Theme configuration
})

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
  }, [userId])

  useEffect(() => {
    filterBookings()
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
      filtered = filtered.filter((booking) => booking.date === dateFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (booking) =>
          booking.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }
    setFilteredBookings(filtered)
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, 'primary' | 'success' | 'danger' | 'neutral'> = {
      progress: 'primary',
      completed: 'success',
      canceled: 'danger',
    }
    return statusColors[status.toLowerCase()] || 'neutral'
  }

  const uniqueDates = [...new Set(bookings.map((booking) => booking.date))]
  const uniqueStatuses = [...new Set(bookings.map((booking) => booking.status))]

  // Convert UTC date string to local date
  const convertToLocalDate = (dateString: string) => {
    const date = new Date(dateString)
    // Adjust to local timezone
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
  }

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Box sx={{ maxWidth: '100%', mb: 2 }}>
          <Button
            startDecorator={<ArrowBack />}
            onClick={() => navigate('/screen')}
            variant="outlined"
            color="neutral"
            sx={{
              mb: 2,
              backgroundColor: '#0B6BCB',
              color: 'white',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: '#0D8CEB', // lighter blue for hover
              },
            }}
          >
            Back to Dashboard
          </Button>
          <Typography
            level="h2"
            sx={{
              mb: 4,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', md: '2.5rem' },
            }}
          >
            Booking History
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-end' },
            }}
          >
            <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
              <FormLabel>Filter by Date</FormLabel>
              <Select
                value={dateFilter}
                onChange={(_, value) => setDateFilter(value || '')}
              >
                <Option value="">All Dates</Option>
                {uniqueDates.map((date) => (
                  <Option key={date} value={date}>
                    {convertToLocalDate(date).toLocaleDateString('en-US')}
                  </Option>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
              <FormLabel>Filter by Status</FormLabel>
              <Select
                value={statusFilter}
                onChange={(_, value) => setStatusFilter(value || '')}
              >
                <Option value="">All Statuses</Option>
                {uniqueStatuses.map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', height: 200 }}>
              <CircularProgress size="lg" />
            </Box>
          ) : error ? (
            <Typography color="danger" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          ) : filteredBookings.length === 0 ? (
            <Typography sx={{ mb: 2, textAlign: 'center' }}>
              No bookings found.
            </Typography>
          ) : (
            <Sheet variant="outlined" sx={{ boxShadow: 'lg', overflowX: 'auto' }}>
              <Table stickyHeader hoverRow>
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Coach Name</th>
                    <th>Slot Date</th>
                    <th>Slot</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person fontSize="small" />
                          {booking.userName}
                        </Box>
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person fontSize="small" />
                          {booking.coachName}
                        </Box>
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday fontSize="small" />
                          {convertToLocalDate(booking.date).toLocaleDateString('en-US')}
                        </Box>
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime fontSize="small" />
                          {booking.startTime} - {booking.endTime}
                        </Box>
                      </td>
                      <td>
                        <Chip
                          variant="soft"
                          color={getStatusColor(booking.status)}
                          size="sm"
                        >
                          {booking.status}
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          )}
        </Box>

        <Modal open={Boolean(selectedBooking)} onClose={() => setSelectedBooking(null)}>
          <ModalDialog sx={{ minWidth: 'sm' }}>
            <ModalClose />
            <Typography level="h4" sx={{ mb: 2 }}>
              Booking Details
            </Typography>
            {selectedBooking && (
              <Box>
                <Typography>
                  <strong>User:</strong> {selectedBooking.userName}
                </Typography>
                <Typography>
                  <strong>Coach:</strong> {selectedBooking.coachName}
                </Typography>
                <Typography>
                  <strong>Date:</strong>{' '}
                  {convertToLocalDate(selectedBooking.date).toLocaleDateString('en-US')}
                </Typography>
                <Typography>
                  <strong>Time:</strong> {selectedBooking.startTime} - {selectedBooking.endTime}
                </Typography>
                <Typography>
                  <strong>Booking Type:</strong> {selectedBooking.bookingType}
                </Typography>
                <Typography>
                  <strong>Status:</strong>{' '}
                  <Chip
                    variant="soft"
                    color={getStatusColor(selectedBooking.status)}
                  >
                    {selectedBooking.status}
                  </Chip>
                </Typography>
              </Box>
            )}
          </ModalDialog>
        </Modal>
      </Box>
    </CssVarsProvider>
  )
}

