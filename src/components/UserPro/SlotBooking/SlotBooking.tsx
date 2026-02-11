
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft, Clock, Person, InfoCircle, X } from 'react-bootstrap-icons'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Domain_URL } from '../../config'
import UserShell from '../../Layout/UserShell'

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
      <UserShell title="Select Slot">
        <div className="flex justify-center items-center h-64">
           <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </UserShell>
    )
  }

  return (
    <UserShell title="Select Slot">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 rounded-lg transition-all shadow-sm font-medium text-sm"
              onClick={handleBack}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a Slot'}
            </h2>
             <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {slots.length > 0 ? (
            slots.map((slot) => (
              <div key={slot.slotId} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group">
                  <div className="flex items-center gap-3 mb-4 text-gray-900">
                    <Clock size={18} className="text-gray-400" />
                    <h4 className="text-lg font-semibold tracking-tight">
                      {slot.startTime} - {slot.endTime}
                    </h4>
                  </div>

                  <div className="mb-6">
                     <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        slot.status === 'booked' ? 'bg-red-50 text-red-700 border-red-100' :
                        slot.status === 'completed' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        'bg-green-50 text-green-700 border-green-100'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      onClick={() => handleView(slot)}
                    >
                      <InfoCircle size={14} />
                      View
                    </button>
                    <button
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium text-sm transition-colors shadow-sm ${
                           slot.status === 'booked' || slot.status === 'completed'  || slot.status === 'unbooked'  || slot.status === 'inprogress'
                           ? 'bg-gray-300 cursor-not-allowed'
                           : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                      }`}
                      onClick={() => handleBook(slot)}
                      disabled={slot.status === 'booked' || slot.status === 'completed'  || slot.status === 'unbooked'  || slot.status === 'inprogress'}
                    >
                      <Person size={14} />
                      {slot.status === 'booked' ? 'Booked' : 'Book'}
                    </button>
                  </div>
                </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white border border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500">
                No slots available for the selected date.
              </p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100" onClick={e => e.stopPropagation()}>
            <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                onClick={() => setIsModalOpen(false)}
            >
                <X size={20} />
            </button>
          <h2 className="text-xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">
            Coach Information
          </h2>
          {coachDetails ? (
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500 font-medium">Name</span>
                <span className="text-gray-900 font-semibold">{coachDetails.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500 font-medium">Sport</span>
                <span className="text-gray-900 font-semibold">{coachDetails.sport}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500 font-medium">Mobile</span>
                <span className="text-gray-900 font-semibold">{coachDetails.phoneNumber}</span>
              </div>
              <div className="pt-2">
                <span className="text-gray-500 font-medium block mb-1">Bio</span>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">{coachDetails.bio}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
               <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        </div>
      )}

      {isSubsetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsSubsetModalOpen(false)}>
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100" onClick={e => e.stopPropagation()}>
          <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                onClick={() => setIsSubsetModalOpen(false)}
            >
                <X size={20} />
            </button>
          <h2 className="text-xl font-bold mb-2 text-gray-900">
            Confirm Booking
          </h2>
          <p className="text-gray-500 mb-6 text-sm">Select a child to associate with this booking.</p>


          {subsets.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Child</label>
                  <div className="relative">
                    <select
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none text-gray-700 font-medium"
                      value={selectedSubuser1}
                      onChange={(e) => setSelectedSubuser1(e.target.value)}
                    >
                      <option value="" disabled>Select a child...</option>
                      {subsets.map((subuser) => (
                        <option key={subuser.childId} value={subuser.childId}>
                          {subuser.name}
                        </option>
                      ))}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                  </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all shadow-md ${
                  !selectedSubuser1 ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5'
                }`}
                disabled={!selectedSubuser1}
              >
                Confirm Booking
              </button>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-700 font-medium mb-2">No Children Found</p>
                <p className="text-gray-500 text-sm">Please add children in your profile settings before booking.</p>
            </div>
          )}
        </div>
      </div>
      )}

      {!!error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setError(null)}>
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100" onClick={e => e.stopPropagation()}>
            <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                onClick={() => setError(null)}
            >
                <X size={20} />
            </button>
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            Booking Status
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {error}
          </p>
          <div className="mt-6">
             <button
                onClick={() => setError(null)}
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
