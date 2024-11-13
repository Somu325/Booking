
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
  childName: string
  startTime: string
  endTime: string
  slotId: number
  date: string
  bookingType: 'single' | 'group'
  groupId: number | null
  status: string
  createdAt: string
  comment:string
}

const theme = extendTheme({
  // Theme configuration
})

export default function Component() {
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
      const uniqueDates = new Set()

      response.data.forEach((booking) => {
        const localDate = new Date(booking.date).toLocaleString('en-US', { timeZone: 'UTC' })
        const dateOnly = new Date(localDate).toLocaleDateString('en-US')
        if (!uniqueDates.has(dateOnly)) {
          uniqueDates.add(dateOnly)
          console.log(dateOnly)
        }
      })

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
  );
  
  const otherBookings = filtered.filter(
      booking => booking.status.toLowerCase() !== 'completed' && booking.status.toLowerCase() !== 'canceled'
  );
  
    setFilteredBookings([...otherBookings, ...completedBookings])
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, 'primary' | 'success' | 'danger' | 'neutral'> = {
      progress: 'primary',
      completed: 'success',
      canceled: 'danger',
      booked: 'danger',
    }
    return statusColors[status.toLowerCase()] || 'neutral'
  }

  const uniqueDates = Array.from(
    new Set(
      bookings.map((booking) => {
        const localDate = new Date(booking.date).toLocaleString('en-US', { timeZone: 'UTC' })
        return new Date(localDate).toLocaleDateString('en-US')
      })
    )
  ).sort()
  console.log("hrl", uniqueDates)
  const uniqueStatuses = [...new Set(bookings.map((booking) => booking.status))]

  const convertToLocalDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { timeZone: 'UTC' })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    return new Date(0, 0, 0, parseInt(hours), parseInt(minutes)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
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
                backgroundColor: '#0D8CEB',
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
                    {date}
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
                    <th>Child Name</th>
                    <th>Slot Date</th>
                    <th>Slot</th>
                    <th>Status</th>
                    <th>Comment</th>
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
                          <Person fontSize="small" />
                          {booking.childName}
                        </Box>
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday fontSize="small" />
                          {convertToLocalDate(booking.date).split(',')[0]}
                        </Box>
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime fontSize="small" />
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
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
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          
                          {booking.comment || 'No Comment'}
                        </Box>
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
                  <strong>Child Name:</strong> {selectedBooking.childName}
                </Typography>
                <Typography>
                  <strong>Date:</strong>{' '}
                  {convertToLocalDate(selectedBooking.date).split(',')[0]}
                </Typography>
                <Typography>
                  <strong>Time:</strong> {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
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