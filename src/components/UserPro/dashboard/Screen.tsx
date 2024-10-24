

import { useEffect, useState } from 'react'
import axios from 'axios'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Input from '@mui/joy/Input'
import IconButton from '@mui/joy/IconButton'
import Card from '@mui/joy/Card'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import { Search, Notifications, Menu, CalendarToday, Person, Settings, Logout } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';


import { Domain_URL } from '../config';

interface Person {
  id: string
  name: string
  age: number
  profession: string
  phoneNumber: string
  coachId: string
}

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
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
    JoyCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
})

function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '250px',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      }}
    >
      <Typography level="h2" sx={{ mb: 4 }}>Menu</Typography>
      <Button
        startDecorator={<Person />}
        variant="plain"
        color="neutral"
        sx={{ justifyContent: 'flex-start', mb: 2, width: '150px' }}
        onClick={() =>  navigate('/userprofile')}
      >
        Profile
      </Button>
      <Button
        startDecorator={<Settings />}
        variant="plain"
        color="neutral"
        sx={{ justifyContent: 'flex-start', mb: 2, width: '150px' }}
        onClick={onClose}
      >
        Settings
      </Button>
      <Button
        startDecorator={<Logout />}
        variant="plain"
        color="danger"
        sx={{ justifyContent: 'flex-start', mt: 'auto', width: '150px' }}
        onClick={() =>navigate('/user-login')}
      >
        Logout
      </Button>
    </Box>
  )
}

export default function Screen() {
  const [people, setPeople] = useState<Person[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    handleSearch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, people])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`)
      setPeople(response.data)
      setFilteredPeople(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  
  const handleSearch = () => {
    const filtered = people.filter((person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPeople(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${days[date.getDay()]} ${date.getDate()}`
  }

  const generateDates = () => {
    const startDate = new Date(selectedDate)
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)


      
      return date.toISOString().split('T')[0]
    })
  }

  const dates = generateDates()

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1200px',
          mb: 4,
        }}>
          <IconButton
            size="lg"
            variant="outlined"
            color="neutral"
            sx={{ mr: 2 }}
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu />
          </IconButton>

          <Input
            size="lg"
            placeholder="Search ...."
            startDecorator={<Search />}
            sx={{ 
              flexGrow: 1, 
              maxWidth: 500,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <IconButton
            size="lg"
            variant="outlined"
            color="neutral"
            sx={{ ml: 2 }}
            onClick={() => navigate('/booking-history')}
          >
            <Notifications />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, width: '100%', maxWidth: '1200px', overflowX: 'auto' }}>
          <IconButton
            size="lg"
            variant="outlined"
            color="primary"
            onClick={() => setIsCalendarOpen(true)}
            sx={{ mr: 2, flexShrink: 0 }}
          >
            <CalendarToday />
          </IconButton>
          {dates.map((date) => (
            <Button
              key={date}
              variant={selectedDate === date ? 'soft' : 'outlined'}
              color="primary"
              onClick={() => setSelectedDate(date)}
              sx={{
                minWidth: 120,
                height: 48,
                borderRadius: 12,
                mr: 2,
                flexShrink: 0,
                ...(selectedDate === date && {
                  bgcolor: 'primary.100',
                  color: 'primary.700',
                }),
              }}
            >
              {formatDate(date)}
            </Button>
          ))}
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 3,
          width: '100%',
          maxWidth: '1200px',
        }}>
          {filteredPeople.map((person) => (
            <Card key={person.id} variant="outlined">
              <Typography level="h2" fontSize="xl" fontWeight="lg" mb={1}>
                {person.name}
              </Typography>
              <Typography>Age: {person.age}</Typography>
              <Typography>Profession: {person.profession}</Typography>
              <Typography mb={2}>Phone: {person.phoneNumber}</Typography>
              <Button
                fullWidth
                variant="solid"
                color="primary"
                onClick={() => navigate(`/selectslot/${person.coachId}?date=${selectedDate}`)}
              >
                View Slot
              </Button>
            </Card>
          ))}
        </Box>

        <Modal open={isCalendarOpen} onClose={() => setIsCalendarOpen(false)}>
          <ModalDialog sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                const newDate = e.target.value
                setSelectedDate(newDate)
                setIsCalendarOpen(false)
              }}
              style={{
                fontSize: '16px',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #ccc',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }}
            />
          </ModalDialog>
        </Modal>

        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </Box>
    </CssVarsProvider>
  )
}
