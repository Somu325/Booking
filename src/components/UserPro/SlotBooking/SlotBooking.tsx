

// 'use client'

// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { CssVarsProvider, extendTheme } from '@mui/joy/styles'
// import CssBaseline from '@mui/joy/CssBaseline'
// import Box from '@mui/joy/Box'
// import Typography from '@mui/joy/Typography'
// import Button from '@mui/joy/Button'
// import Card from '@mui/joy/Card'
// import Grid from '@mui/joy/Grid'
// import Modal from '@mui/joy/Modal'
// import ModalClose from '@mui/joy/ModalClose'
// import Sheet from '@mui/joy/Sheet'
// import Select from '@mui/joy/Select'
// import Option from '@mui/joy/Option'
// import CircularProgress from '@mui/joy/CircularProgress'
// import { ArrowBack, AccessTime, Person, Info } from '@mui/icons-material'
// import { useParams, useNavigate, useLocation } from 'react-router-dom'
// import { Domain_URL } from '../../config'

// interface Slot {
//   slotId: string
//   coachId: string
//   startTime: string
//   endTime: string
//   duration: number
//   status: 'booked' | 'Available'
//   date: string
// }

// interface Coach {
//   id: string
//   name: string
//   expertise: string
//   sport: string
//   age: number
//   phoneNumber: string
//   experience: string
//   bio: string
// }

// interface Subset {
//   id: string
//   name: string
//   childId: string
// }

// const theme = extendTheme({
//   colorSchemes: {
//     light: {
//       palette: {
//         primary: {
//           50: '#e3f2fd',
//           100: '#bbdefb',
//           200: '#90caf9',
//           300: '#64b5f6',
//           400: '#42a5f5',
//           500: '#2196f3',
//           600: '#1e88e5',
//           700: '#1976d2',
//           800: '#1565c0',
//           900: '#0d47a1',
//         },
//         background: {
//           body: 'rgba(255, 255, 255, 0.8)',
//         },
//       },
//     },
//   },
//   components: {
//     JoyCard: {
//       styleOverrides: {
//         root: {
//           backgroundColor: 'rgba(255, 255, 255, 0.7)',
//           backdropFilter: 'blur(10px)',
//           transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//           '&:hover': {
//             transform: 'translateY(-5px)',
//             boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
//           },
//         },
//       },
//     },
//     JoyButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: '12px',
//           textTransform: 'none',
//           fontWeight: 600,
//         },
//       },
//     },
//     JoySelect: {
//       styleOverrides: {
//         root: {
//           backgroundColor: 'rgba(255, 255, 255, 0.7)',
//           '&:hover': {
//             backgroundColor: 'rgba(255, 255, 255, 0.8)',
//           },
//         },
//       },
//     },
//   },
// })

// export default function SlotBooking() {
//   const { coachId } = useParams<{ coachId: string }>()
//   const location = useLocation()
//   const queryParams = new URLSearchParams(location.search)
//   const selectedDate = queryParams.get('date')

//   const [slots, setSlots] = useState<Slot[]>([])
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [isSubsetModalOpen, setIsSubsetModalOpen] = useState(false)
//   const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
//   const [coachDetails, setCoachDetails] = useState<Coach | null>(null)
//   const [subsets, setSubusers] = useState<Subset[]>([])
//   const [selectedSubuser1, setSelectedSubuser1] = useState<string>('')
//   const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)

//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchSlots = async () => {
//       if (!selectedDate) return

//       setIsLoading(true)
//       setError(null)

//       try {
//         const response = await axios.get<Slot[]>(`${Domain_URL}/slot/coach/${coachId}`, {
//           params: { date: selectedDate },
//         })

//         const filteredSlots = response.data.filter((slot: Slot) =>
//           new Date(slot.date).toISOString().split('T')[0] === selectedDate
//         )

//         setSlots(filteredSlots)
//       } catch (error) {
//         console.error('Error fetching slots:', error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchSlots()

//     const fetchSubsets = async () => {
//       const userId = localStorage.getItem('userId')
//       if (!userId) {
//         return
//       }
//       console.log(userId);

//       try {
//         const response = await axios.get(`${Domain_URL}/children/user/${userId}`)
//         setSubusers(response.data)
       
//       } catch (error) {
//         console.error('Error fetching subusers:', error)
//       }
//     }

//     fetchSubsets()
//   }, [coachId, selectedDate, selectedSlot?.slotId, selectedSlotId])

//   const handleBook = async (slot: Slot) => {
//     setSelectedSlot(slot)
//     setSelectedSlotId(slot.slotId)
//     setIsSubsetModalOpen(true)
//   }

//   const handleConfirmBooking = async () => {
//     if (!selectedSlot) return

//     const userId = localStorage.getItem('userId')

//     if (!userId) {
//       setError('User not logged in.')
//       return
//     }

//     try {
//       const selectedSubusers = selectedSubuser1
//       const childId = selectedSubusers

//       const data = {
//         userId,
//         childId,
//         coachId,
//         slotId: selectedSlot.slotId,
//         bookingType: "single",
//         status: "available"
//       }

//       const response = await axios.post(`${Domain_URL}/bookings`, data)
      
//       if (response.data && response.data.message === "Invalid slot ID") {
//         console.error('Error response:', response.data)
//         return
//       }

//       setIsSubsetModalOpen(false)
//       const slotsResponse = await axios.get(`${Domain_URL}/slot/coach/${coachId}`, {
//         params: { date: selectedDate },
//       })
//       const filteredSlots = slotsResponse.data.filter((slot: Slot) =>
//         new Date(slot.date).toISOString().split('T')[0] === selectedDate
//       )
//       setSlots(filteredSlots)
//       setError('Booking successful!')
//     } catch (error) {
//       console.error('Error booking slot:', error)
//       setError('This slot has already been booked. Please select a different time slot')
//       if (axios.isAxiosError(error) && error.response) {
//         console.error('Error response:', error.response.data)
//         setError('This slot has already been booked. Please select a different time slot')
//         // Automatically close the pop-up after 3 seconds
//         setTimeout(() => {
//           setIsSubsetModalOpen(false)
//           setError(null)
//         }, 3000)
//       } else {
//         setError('Booking failed. Please try again.')
//       }
//     }
//   }

//   const handleBack = () => {
//     navigate(-1)
//   }

//   const handleView = async (slot: Slot) => {
//     setSelectedSlot(slot)
//     try {
//       const response = await axios.get(`${Domain_URL}/coach/coaches/${coachId}`)
//       setCoachDetails(response.data)
//     } catch (error) {
//       console.error('Error fetching coach details:', error)
//     }
//     setIsModalOpen(true)
//   }

//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <CssVarsProvider theme={theme}>
//       <CssBaseline />
//       <Box sx={{
//         p: 4,
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//       }}>
//         <Box sx={{ maxWidth: 1200, margin: 'auto' }}>
//           <Button
//             startDecorator={<ArrowBack />}
//             variant="outlined"
//             sx={{ mb: 4 ,backgroundColor:'#0B6BCB',color: 'white','&:hover': {
//               backgroundColor: '#0D8CEB', // lighter blue for hover
//             },
//           }}
//             onClick={handleBack}
//           >
//             Back
//           </Button>
//           <Typography level="h2" sx={{ mb: 4, textAlign: 'center' }}>
//             Select a Slot for {new Date(selectedDate!).toLocaleDateString()}
//           </Typography>
//           <Grid container spacing={3}>
//             {slots.length > 0 ? (
//               slots.map((slot) => (
//                 <Grid xs={12} sm={6} md={4} lg={3} key={slot.slotId}>
//                   <Card variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                       <AccessTime sx={{ mr: 1 }} />
//                       <Typography level="h4">
//                         {slot.startTime} - {slot.endTime}
//                       </Typography>
//                     </Box>
//                     <Typography
//                       level="body-md"
//                       sx={{
//                         mb: 2,
//                         color: slot.status === 'booked' ? 'danger.500' : 'success.500',
//                         fontWeight: 'bold',
//                       }}
//                     >
//                       {slot.status}
//                     </Typography>
//                     <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
//                       <Button
//                         variant="soft"
//                         color="neutral"
//                         startDecorator={<Info />}
//                         sx={{ flexGrow: 1 }}
//                         onClick={() => handleView(slot)}
//                       >
//                         View
//                       </Button>
//                       <Button
//                         variant="solid"
//                         color="primary"
//                         startDecorator={<Person />}
//                         sx={{ flexGrow: 1 }}
//                         onClick={() => handleBook(slot)}
//                         disabled={slot.status === 'booked'}
//                       >
//                         {slot.status === 'booked' ? 'Booked' : 'Book'}
//                       </Button>
//                     </Box>
//                   </Card>
//                 </Grid>
//               ))
//             ) : (
//               <Grid xs={12}>
//                 <Typography level="body-md" sx={{ mt: 2, textAlign: 'center' }}>
//                   No slots available for the selected date.
//                 </Typography>
//               </Grid>
//             )}
//           </Grid>
//         </Box>
//       </Box>

//       <Modal
//         aria-labelledby="modal-title"
//         aria-describedby="modal-desc"
//         open={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
//       >
//         <Sheet
//           variant="outlined"
//           sx={{
//             width: 400,
//             maxWidth: '90%',
//             borderRadius: 'md',
//             p: 3,
//             boxShadow: 'lg',
//             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//             backdropFilter: 'blur(10px)',
//           }}
//         >
//           <ModalClose
//             variant="outlined"
//             sx={{
//               top: 'calc(-1/4 * var(--IconButton-size))',
//               right: 'calc(-1/25 * var(--IconButton-size))',
//               boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
//               borderRadius: '50%',
//               bgcolor: 'background.body',
//             }}
//           />
//           <Typography component="h2" id="modal-title" level="h4" textColor="inherit" fontWeight="lg" mb={2}>
//             Coach Information
//           </Typography>
//           {coachDetails ? (
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Typography><strong>Name:</strong> {coachDetails.name}</Typography>
//               <Typography><strong>Sport:</strong> {coachDetails.sport}</Typography>
//               <Typography><strong>Mobile Number:</strong> {coachDetails.phoneNumber}</Typography>
//               <Typography><strong>Bio:</strong> {coachDetails.bio}</Typography>
//             </Box>
//           ) : (
//             <Typography>Loading coach details...</Typography>
//           )}
//         </Sheet>
//       </Modal>

//       <Modal
//         aria-labelledby="subuser-modal-title"
//         aria-describedby="subuser-modal-desc"
//         open={isSubsetModalOpen}
//         onClose={() => setIsSubsetModalOpen(false)}
//         sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
//       >
//         <Sheet
//           variant="outlined"
//           sx={{
//             width: 400,
//             maxWidth: '90%',
//             borderRadius: 'md',
//             p: 3,
//             boxShadow: 'lg',
//             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//             backdropFilter: 'blur(10px)',
//           }}
//         >
//           <ModalClose
//             variant="outlined"
//             sx={{
//               top: 'calc(-1/4 * var(--IconButton-size))',
//               right: 'calc(-1/25 * var(--IconButton-size))',
//               boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
//               borderRadius: '50%',
//               bgcolor: 'background.body',
//             }}
//           />
//           <Typography component="h2" id="subuser-modal-title" level="h4" textColor="inherit" fontWeight="lg" mb={2}>
//             Select Children for  Booking Coach
//           </Typography>

//           {subsets.length > 0 ? (
//             <>
//               <Typography id="subuser-modal-desc" textColor="text.tertiary" mb={2}>
//                 You can select Children for this booking.
//               </Typography>
//               <Select
//                 placeholder="Select subuser 1"
//                 value={selectedSubuser1}
//                 onChange={(_, newValue) => setSelectedSubuser1(newValue as string)}
//                 sx={{ mb: 2 }}
//               >
//                 <Option value="" disabled>Add Child</Option>
                
//                 {subsets.map((subuser) => (
//                   <Option key={subuser.childId} value={subuser.childId}>
//                     {subuser.name}
//                   </Option>
//                 ))}
//               </Select>
             
//               <Button
//                 onClick={handleConfirmBooking}
//                 sx={{ mt: 2 }}
//                 fullWidth
//                 variant="solid"
//                 color="primary"
//               >
//                 Confirm Booking
//               </Button>
//             </>
//           ) : (
//             <Typography>No Childrens available. Please Add Childrens In Your Profile</Typography>
//           )}
//         </Sheet>
//       </Modal>

//       <Modal
//         aria-labelledby="error-modal-title"
//         aria-describedby="error-modal-desc"
//         open={!!error}
//         onClose={() => setError(null)}
//         sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
//       >
//         <Sheet
//           variant="outlined"
//           sx={{
//             width: 400,
//             maxWidth: '90%',
//             borderRadius: 'md',
//             p: 3,
//             boxShadow: 'lg',
//             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//             backdropFilter: 'blur(10px)',
//           }}
//         >
//           <ModalClose
//             variant="outlined"
//             sx={{
//               top: 'calc(-1/4 * var(--IconButton-size))',
//               right: 'calc(-1/25 * var(--IconButton-size))',
//               boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
//               borderRadius: '50%',
//               bgcolor: 'background.body',
//             }}
//           />
//           <Typography component="h2" id="error-modal-title" level="h4" textColor="inherit" fontWeight="lg" mb={2}>
//             Booking Status
//           </Typography>
//           <Typography id="error-modal-desc" textColor="text.tertiary">
//             {error}
//           </Typography>
//         </Sheet>
//       </Modal>
//     </CssVarsProvider>
//   )
// }



'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import Grid from '@mui/joy/Grid'
import Modal from '@mui/joy/Modal'
import ModalClose from '@mui/joy/ModalClose'
import Sheet from '@mui/joy/Sheet'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import CircularProgress from '@mui/joy/CircularProgress'
import { ArrowBack, AccessTime, Person, Info } from '@mui/icons-material'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Domain_URL } from '../../config'

interface Slot {
  slotId: string
  coachId: string
  startTime: string
  endTime: string
  duration: number
  status: 'booked' | 'Available'
  date: string
}

interface Coach {
  id: string
  name: string
  expertise: string
  sport: string
  age: number
  phoneNumber: string
  experience: string
  bio: string
}

interface Subset {
  id: string
  name: string
  childId: string
}

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
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
        background: {
          body: 'rgba(255, 255, 255, 0.8)',
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
    JoySelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        },
      },
    },
  },
})

export default function SlotBooking() {
  const { coachId } = useParams<{ coachId: string }>()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const selectedDate = queryParams.get('date')

  const [slots, setSlots] = useState<Slot[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubsetModalOpen, setIsSubsetModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [coachDetails, setCoachDetails] = useState<Coach | null>(null)
  const [subsets, setSubusers] = useState<Subset[]>([])
  const [selectedSubuser1, setSelectedSubuser1] = useState<string>('')
  //const [selectedSubuser2, setSelectedSubuser2] = useState<string>('')
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await axios.get<Slot[]>(`${Domain_URL}/slot/coach/${coachId}`, {
          params: { date: selectedDate },
        })

        const filteredSlots = response.data.filter((slot: Slot) =>
          new Date(slot.date).toISOString().split('T')[0] === selectedDate
        )

        setSlots(filteredSlots)
      } catch (error) {
        console.error('Error fetching slots:', error)
       // setError('Failed to fetch slots. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlots()

    const fetchSubsets = async () => {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        //setError('User not logged in.')
        return
      }
      console.log(userId);

      try {
        const response = await axios.get(`${Domain_URL}/children/user/${userId}`)
        setSubusers(response.data)
       
      } catch (error) {
        console.error('Error fetching subusers:', error)
        //setError('Failed to fetch subsets. Please try again.')
      }
    }

    fetchSubsets()
  }, [coachId, selectedDate, selectedSlot?.slotId, selectedSlotId])

  const handleBook = async (slot: Slot) => {
    setSelectedSlot(slot)
    setSelectedSlotId(slot.slotId)
    setIsSubsetModalOpen(true)
  }

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return

    const userId = localStorage.getItem('userId')

    if (!userId) {
      setError('User not logged in.')
      return
    }

    try {
      const selectedSubusers = selectedSubuser1
      const childId = selectedSubusers

      const data = {
        userId,
        childId,
        coachId,
        slotId: selectedSlot.slotId,
        bookingType: "single",
        status: "available"
      }

      const response = await axios.post(`${Domain_URL}/bookings`, data)
      
      if (response.data && response.data.message === "Invalid slot ID") {
        console.error('Error response:', response.data)
        //setError('Invalid slot ID. Please try again.')
        return
      }

      setIsSubsetModalOpen(false)
      const slotsResponse = await axios.get(`${Domain_URL}/slot/coach/${coachId}`, {
        params: { date: selectedDate },
      })
      const filteredSlots = slotsResponse.data.filter((slot: Slot) =>
        new Date(slot.date).toISOString().split('T')[0] === selectedDate
      )
      setSlots(filteredSlots)
      setError('Booking successful!')
    } catch (error) {
      console.error('Error booking slot:', error)
      setError('This slot has already been booked. Please refresh page and select a different time slot')
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data)
       // setError('Booking failed. Please try again.')
      } else {
       // setError('Booking failed. Please try again.')
      }
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleView = async (slot: Slot) => {
    setSelectedSlot(slot)
    try {
      const response = await axios.get(`${Domain_URL}/coach/coaches/${coachId}`)
      setCoachDetails(response.data)
    } catch (error) {
      console.error('Error fetching coach details:', error)
     // setError('Failed to fetch coach details. Please try again.')
    }
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <Box sx={{ maxWidth: 1200, margin: 'auto' }}>
          <Button
            startDecorator={<ArrowBack />}
            variant="outlined"
            sx={{ mb: 4 ,backgroundColor:'#0B6BCB',color: 'white','&:hover': {
              backgroundColor: '#0D8CEB', // lighter blue for hover
            },
          }}
            onClick={handleBack}
          >
            Back
          </Button>
          <Typography level="h2" sx={{ mb: 4, textAlign: 'center' }}>
  Select a Slot for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { timeZone: 'America/New_York' })}
</Typography>
          {error && (
            <Typography
              level="body-md"
              color={error.includes('successful') ? 'success' : 'danger'}
              sx={{ mb: 4, textAlign: 'center' }}
            >
              {error}
            </Typography>
          )}
          <Grid container spacing={3}>
            {slots.length > 0 ? (
              slots.map((slot) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={slot.slotId}>
                  <Card variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography level="h4">
                        {slot.startTime} - {slot.endTime}
                      </Typography>
                    </Box>
                    <Typography
                      level="body-md"
                      sx={{
                        mb: 2,
                        color: slot.status === 'booked' ? 'danger.500' : 'success.500',
                        fontWeight: 'bold',
                      }}
                    >
                      {slot.status}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                      <Button
                        variant="soft"
                        color="neutral"
                        startDecorator={<Info />}
                        sx={{ flexGrow: 1 }}
                        onClick={() => handleView(slot)}
                      >
                        View
                      </Button>
                      <Button
                        variant="solid"
                        color="primary"
                        startDecorator={<Person />}
                        sx={{ flexGrow: 1 }}
                        onClick={() => handleBook(slot)}
                        disabled={slot.status === 'booked'}
                      >
                        {slot.status === 'booked' ? 'Booked' : 'Book'}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid xs={12}>
                <Typography level="body-md" sx={{ mt: 2, textAlign: 'center' }}>
                  No slots available for the selected date.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width: 400,
            maxWidth: '90%',
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <ModalClose
            variant="outlined"
            sx={{
              top: 'calc(-1/4 * var(--IconButton-size))',
              right: 'calc(-1/25 * var(--IconButton-size))',
              boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
              borderRadius: '50%',
              bgcolor: 'background.body',
            }}
          />
          <Typography component="h2" id="modal-title" level="h4" textColor="inherit" fontWeight="lg" mb={2}>
            Coach Information
          </Typography>
          {coachDetails ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography><strong>Name:</strong> {coachDetails.name}</Typography>
              {/* <Typography><strong>Expertise:</strong> {coachDetails.expertise}</Typography> */}
              <Typography><strong>Sport:</strong> {coachDetails.sport}</Typography>
              <Typography><strong>Mobile Number:</strong> {coachDetails.phoneNumber}</Typography>
             {/* <Typography><strong>Experience:</strong> {coachDetails.experience}</Typography> */}
              <Typography><strong>Bio:</strong> {coachDetails.bio}</Typography>
            </Box>
          ) : (
            <Typography>Loading coach details...</Typography>
          )}
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="subuser-modal-title"
        aria-describedby="subuser-modal-desc"
        open={isSubsetModalOpen}
        onClose={() => setIsSubsetModalOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width: 400,
            maxWidth: '90%',
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
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
          <Typography component="h2" id="subuser-modal-title" level="h4" textColor="inherit" fontWeight="lg" mb={2}>
            Select Children for  Booking Coach
          </Typography>

          {subsets.length > 0 ? (
            <>
              <Typography id="subuser-modal-desc" textColor="text.tertiary" mb={2}>
                You can select Children for this booking.
              </Typography>
              <Select
                placeholder="Select subuser 1"
                value={selectedSubuser1}
                onChange={(_, newValue) => setSelectedSubuser1(newValue as string)}
                sx={{ mb: 2 }}
              >
                <Option value="" disabled>Add Child</Option>
                {subsets.map((subuser) => (
                  <Option key={subuser.childId} value={subuser.childId}>
                    {subuser.name}
                  </Option>
                ))}
              </Select>
             
              <Button
                onClick={handleConfirmBooking}
                sx={{ mt: 2 }}
                fullWidth
                variant="solid"
                color="primary"
              >
                Confirm Booking
              </Button>
            </>
          ) : (
            <Typography>No Childrens available. Please Add Childrens In Your Profile</Typography>
          )}
        </Sheet>
      </Modal>
    </CssVarsProvider>
  )
}
