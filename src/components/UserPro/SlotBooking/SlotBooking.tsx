
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowBack, AccessTime, Person, Info, Close } from '@mui/icons-material'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Domain_URL } from '../../config'

interface Slot {
  slotId: string
  coachId: string
  startTime: string
  endTime: string
  duration: number
  status: 'booked' | 'Available' | 'completed' | 'unbooked' | 'inprogress'
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

        // Sort the slots by startTime in ascending order
        const sortedSlots = filteredSlots.sort((a, b) => {
          return new Date('1970/01/01 ' + a.startTime).getTime() - new Date('1970/01/01 ' + b.startTime).getTime()
        })

        setSlots(sortedSlots)
      } catch (error) {
        console.error('Error fetching slots:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlots()

    const fetchSubsets = async () => {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        return
      }
      console.log(userId);

      try {
        const response = await axios.get(`${Domain_URL}/children/user/${userId}`)
        setSubusers(response.data)
       
      } catch (error) {
        console.error('Error fetching subusers:', error)
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
      setError('This user already has a booking at this time with another coach on this date.')
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data)
        setError('This user already has a booking at this time with another coach on this date.')
        // Automatically close the pop-up after 3 seconds
        setTimeout(() => {
          setIsSubsetModalOpen(false)
          setError(null)
        }, 5000)
      } else {
        setError('Booking failed. Please try again.')
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
    }
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
        <div className="max-w-7xl mx-auto">
          <button
            className="mb-4 bg-[#0B6BCB] text-white hover:bg-[#0D8CEB] flex items-center px-4 py-2 rounded-xl font-semibold transition-colors duration-200"
            onClick={handleBack}
          >
            <ArrowBack className="mr-2" />
            Back
          </button>
          <h2 className="mb-8 text-center text-4xl font-bold text-gray-800">
          Select a Slot for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { timeZone: 'America/New_York' })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {slots.length > 0 ? (
              slots.map((slot) => (
                <div key={slot.slotId} className="p-6 h-full flex flex-col bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4 text-gray-800">
                      <AccessTime className="mr-2" />
                      <h4 className="text-xl font-semibold">
                        {slot.startTime} - {slot.endTime}
                      </h4>
                    </div>
                    <p
                      className={`mb-4 font-bold text-base ${
                        slot.status === 'booked' ? 'text-red-500' :
                        slot.status === 'completed' ? 'text-orange-500' :
                        'text-green-600'
                      }`}
                    >
                      {slot.status}
                    </p>
                    <div className="flex gap-4 mt-auto">
                      <button
                        className="flex-grow flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        onClick={() => handleView(slot)}
                      >
                        <Info className="mr-2" />
                        View
                      </button>
                      <button
                        className={`flex-grow flex items-center justify-center px-4 py-2 text-white rounded-xl font-semibold transition-colors ${
                             slot.status === 'booked' || slot.status === 'completed'  || slot.status === 'unbooked'  || slot.status === 'inprogress'
                             ? 'bg-gray-400 cursor-not-allowed'
                             : 'bg-[#0B6BCB] hover:bg-[#0D8CEB]'
                        }`}
                        onClick={() => handleBook(slot)}
                        disabled={slot.status === 'booked' || slot.status === 'completed'  || slot.status === 'unbooked'  || slot.status === 'inprogress'}
                      >
                        <Person className="mr-2" />
                        {slot.status === 'booked' ? 'Booked' : 'Book'}
                      </button>
                    </div>
                  </div>
              ))
            ) : (
              <div className="col-span-full">
                <p className="mt-4 text-center text-gray-600 text-lg">
                  No slots available for the selected date.
                </p>
              </div>
            )}
          </div>
        </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md p-6 rounded-xl shadow-2xl bg-white/90 backdrop-blur-md border border-gray-200">
            <button
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                onClick={() => setIsModalOpen(false)}
            >
                <Close />
            </button>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Coach Information
          </h2>
          {coachDetails ? (
            <div className="flex flex-col gap-2 text-gray-700">
              <p><strong>Name:</strong> {coachDetails.name}</p>
              <p><strong>Sport:</strong> {coachDetails.sport}</p>
              <p><strong>Mobile Number:</strong> {coachDetails.phoneNumber}</p>
              <p><strong>Bio:</strong> {coachDetails.bio}</p>
            </div>
          ) : (
            <p className="text-gray-600">Loading coach details...</p>
          )}
        </div>
        </div>
      )}

      {isSubsetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-md p-6 rounded-xl shadow-2xl bg-white/90 backdrop-blur-md border border-gray-200">
          <button
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                onClick={() => setIsSubsetModalOpen(false)}
            >
                <Close />
            </button>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Select Children for Booking Coach
          </h2>


{subsets.length > 0 ? (
  <>
    <p className="mb-4 text-gray-500">
      You can select Children for this booking.
    </p>
    <select
      className="w-full p-2 mb-4 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={selectedSubuser1}
      onChange={(e) => setSelectedSubuser1(e.target.value)}
    >
      <option value="" disabled>Add Child</option>
      {subsets.map((subuser) => (
        <option key={subuser.childId} value={subuser.childId}>
          {subuser.name}
        </option>
      ))}
    </select>

    <button
      onClick={handleConfirmBooking}
      className={`w-full py-2 px-4 mt-2 rounded-xl font-semibold text-white transition-colors ${
         !selectedSubuser1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0B6BCB] hover:bg-[#0D8CEB]'
      }`}
      disabled={!selectedSubuser1} // Disable if no child is selected
    >
      Confirm Booking
    </button>
  </>
) : (
  <p className="text-gray-700">No Children available. Please add children in your profile.</p>
)}
        </div>
      </div>
      )}

      {!!error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-md p-6 rounded-xl shadow-2xl bg-white/90 backdrop-blur-md border border-gray-200">
            <button
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                onClick={() => setError(null)}
            >
                <Close />
            </button>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Booking Status
          </h2>
          <p className="text-gray-500">
            {error}
          </p>
        </div>
        </div>
      )}
    </div>
  )
}
