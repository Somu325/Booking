
'use client'

import { useState, useEffect } from 'react'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Table from '@mui/joy/Table'
import Sheet from '@mui/joy/Sheet'
import Chip from '@mui/joy/Chip'
import CircularProgress from '@mui/joy/CircularProgress'
import Modal from '@mui/joy/Modal'
import ModalClose from '@mui/joy/ModalClose'
import ModalDialog from '@mui/joy/ModalDialog'
import { CalendarToday, Person, AccessTime, Category } from '@mui/icons-material'
import axios from 'axios'
import { Domain_URL } from '../../config'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/joy/Button'
import { ArrowBack } from '@mui/icons-material'

interface Booking {
  id: number
  userId: number
  coachId: number
  slotId: number
  bookingType: 'single' | 'group'
  groupId: number | null
  status: string
  createdAt: string
}

const theme = extendTheme({
  // ... (theme configuration remains the same)
})

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await axios.get<Booking[]>(`${Domain_URL}/bookings`)
      setBookings(response.data)
      console.log(response.data);
      setError(null)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to fetch bookings. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'progress':
        return 'primary'
      case 'completed':
        return 'success'
      case 'canceled':
        return 'danger'
      default:
        return 'neutral'
    }
  }

  const handleUserClick = (booking: Booking) => {
    setSelectedBooking(booking)
  }

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
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
          <Typography level="h2" component="h1" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
            Booking History
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
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

                    <th style={{ width: '15%' }}>User</th>
                    <th style={{ width: '15%' }}>Coach</th>
                    <th style={{ width: '15%' }}>Slot</th>
                    <th style={{ width: '10%' }}>Type</th>
                    <th style={{ width: '15%' }}>Status</th>
                    <th style={{ width: '25%' }}>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>

                      <td>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                          onClick={() => handleUserClick(booking)}
                        >
                          <Person fontSize="small" />
                          {booking.userId}
                        </Box>
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person fontSize="small" />
                          {booking.coachId}
                        </Box>
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime fontSize="small" />
                          {booking.slotId}
                        </Box>
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Category fontSize="small" />
                          {booking.bookingType}
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
                          <CalendarToday fontSize="small" />
                          {new Date(booking.createdAt).toLocaleString()}
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          )}
        </Box>
      </Box>

      <Modal open={!!selectedBooking} onClose={() => setSelectedBooking(null)}>
        <ModalDialog
          aria-labelledby="booking-modal-title"
          aria-describedby="booking-modal-description"
          sx={{
            maxWidth: 500,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
          }}
        >
          <ModalClose
            variant="outlined"
            sx={{
              top: 'calc(-1/4 * var(--IconButton-size))',
              right: 'calc(-1/4 * var(--IconButton-size))',
              boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
              borderRadius: '50%',
              bgcolor: 'background.body',
            }}
          />
          <Typography
            id="booking-modal-title"
            component="h2"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Booking Details
          </Typography>
          <Typography id="booking-modal-description" textColor="text.tertiary">
            {selectedBooking && (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {/* <Typography>ID:</Typography>
                <Typography>{selectedBooking.id}</Typography> */}
                <Typography>User ID:</Typography>
                <Typography>{selectedBooking.userId}</Typography>
                <Typography>Coach ID:</Typography>
                <Typography>{selectedBooking.coachId}</Typography>
                <Typography>Slot ID:</Typography>
                <Typography>{selectedBooking.slotId}</Typography>
                <Typography>Booking Type:</Typography>
                <Typography>{selectedBooking.bookingType}</Typography>
                <Typography>Group ID:</Typography>
                <Typography>{selectedBooking.groupId || 'N/A'}</Typography>
                <Typography>Status:</Typography>
                <Typography>{selectedBooking.status}</Typography>
                <Typography>Created At:</Typography>
                <Typography>{new Date(selectedBooking.createdAt).toLocaleString()}</Typography>
              </Box>
            )}
          </Typography>
        </ModalDialog>
      </Modal>
    </CssVarsProvider>
  )
}