
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
} from '@mui/joy'
import { ArrowBack, CalendarToday, Person, AccessTime, Category } from '@mui/icons-material'
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
  slotType: string
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
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const navigate = useNavigate() 

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    console.log('Stored userId:', storedUserId) // Log the userId for debugging
    setUserId(storedUserId)
  }, [])

  useEffect(() => {
    if (userId) {
      fetchBookings()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const fetchBookings = async () => {
    if (!userId) {
      console.error('UserId is null, cannot fetch bookings')
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
      setError('Failed to fetch booking history. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, 'primary' | 'success' | 'danger' | 'neutral'> = {
      progress: 'primary',
      completed: 'success',
      canceled: 'danger',
    }
    return statusColors[status.toLowerCase()] || 'neutral'
  }

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          p: 4,
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Box sx={{ maxWidth: 1000, margin: 'auto' }}>
          <Button
            startDecorator={<ArrowBack />}
            onClick={() => navigate('/screen')}
            variant="outlined"
            color="neutral"
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography level="h2" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
            Booking History
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', height: 200 }}>
              <CircularProgress size="lg" />
            </Box>
          ) : error ? (
            <Typography color="danger" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          ) : bookings.length === 0 ? (
            <Typography sx={{ mb: 2, textAlign: 'center' }}>No bookings found.</Typography>
          ) : (
            <Sheet variant="outlined" sx={{ boxShadow: 'lg' }}>
              <Table stickyHeader hoverRow>
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Coach Name</th>
                    <th>Slot</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} onClick={() => setSelectedBooking(booking)} style={{ cursor: 'pointer' }}>
                      <td><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Person fontSize="small" />{booking.userName}</Box></td>
                      <td><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Person fontSize="small" />{booking.coachName}</Box></td>
                      <td><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><AccessTime fontSize="small" />{booking.startTime} - {booking.endTime}</Box></td>
                      <td><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Category fontSize="small" />{booking.slotType}</Box></td>
                      <td><Chip variant="soft" color={getStatusColor(booking.status)} size="sm">{booking.status}</Chip></td>
                      <td><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CalendarToday fontSize="small" />{new Date(booking.createdAt).toLocaleString()}</Box></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          )}
        </Box>
      </Box>

      {selectedBooking && (
        <Modal open onClose={() => setSelectedBooking(null)}>
          <ModalDialog aria-labelledby="booking-modal-title" aria-describedby="booking-modal-description" sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}>
            <ModalClose sx={{ top: 'calc(-1/4 * var(--IconButton-size))', right: 'calc(-1/4 * var(--IconButton-size))', boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)', borderRadius: '50%', bgcolor: 'background.body' }} />
            <Typography id="booking-modal-title" level="h4" fontWeight="lg" mb={1}>Booking Details</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Typography>User Name:</Typography><Typography>{selectedBooking.userName}</Typography>
              <Typography>Coach Name:</Typography><Typography>{selectedBooking.coachName}</Typography>
              <Typography>Slot Time:</Typography><Typography>{selectedBooking.startTime} - {selectedBooking.endTime}</Typography>
              <Typography>Type:</Typography><Typography>{selectedBooking.slotType}</Typography>
              <Typography>Group ID:</Typography><Typography>{selectedBooking.groupId || 'N/A'}</Typography>
              <Typography>Status:</Typography><Typography>{selectedBooking.status}</Typography>
              <Typography>Created At:</Typography><Typography>{new Date(selectedBooking.createdAt).toLocaleString()}</Typography>
            </Box>
          </ModalDialog>
        </Modal>
      )}
    </CssVarsProvider>
  )
}
