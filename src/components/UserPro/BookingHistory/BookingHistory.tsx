
import  { useState, useEffect } from 'react'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Table from '@mui/joy/Table'
import Sheet from '@mui/joy/Sheet'
import Chip from '@mui/joy/Chip'
import CircularProgress from '@mui/joy/CircularProgress'
import { CalendarToday, Person, AccessTime, Category } from '@mui/icons-material'
import axios from 'axios'
import { Domain_URL } from '../config'
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
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: 'rgba(255, 255, 255, 0.8)',
        },
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
      },
    },
  },
  components: {
    JoySheet: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          overflow: 'hidden',
        },
      },
    },
    JoyTable: {
      styleOverrides: {
        root: {
          '& th': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
          },
          '& tr:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    JoyChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
})

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await axios.get<Booking[]>(`${Domain_URL}/bookings/`)
      setBookings(response.data)
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
            onClick={() => navigate('/dashboard')}
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
                    <th style={{ width: '5%' }}>ID</th>
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
                      <td>{booking.id}</td>
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
    </CssVarsProvider>
  )
}
