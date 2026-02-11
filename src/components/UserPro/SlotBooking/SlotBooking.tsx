'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, Clock, Person, InfoCircle, X, CheckCircle, ExclamationCircle, GeoAlt, Trophy } from 'react-bootstrap-icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import UserShell from '../Layout/UserShell';
import { Domain_URL } from '../../config';

interface Slot {
  slotId: string;
  coachId: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'booked' | 'Available' | 'completed' | 'unbooked' | 'inprogress'
  date: string;
}

interface Coach {
  id: string;
  name: string;
  expertise: string;
  sport: string;
  age: number;
  phoneNumber: string;
  experience: string;
  bio: string;
}

interface Subset {
  id: string;
  name: string;
  childId: string;
}

export default function SlotBooking() {
  const { coachId } = useParams<{ coachId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedDate = queryParams.get('date');

  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubsetModalOpen, setIsSubsetModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [coachDetails, setCoachDetails] = useState<Coach | null>(null);
  const [subsets, setSubusers] = useState<Subset[]>([]);
  const [selectedSubuser1, setSelectedSubuser1] = useState<string>('');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<Slot[]>(`${Domain_URL}/slot/coach/${coachId}`, {
          params: { date: selectedDate },
        });

        const filteredSlots = response.data.filter((slot: Slot) =>
          new Date(slot.date).toISOString().split('T')[0] === selectedDate
        );

        const sortedSlots = filteredSlots.sort((a, b) => {
          return new Date('1970/01/01 ' + a.startTime).getTime() - new Date('1970/01/01 ' + b.startTime).getTime();
        });

        setSlots(sortedSlots);
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();

    const fetchSubsets = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const response = await axios.get(`${Domain_URL}/children/user/${userId}`);
        setSubusers(response.data);
      } catch (error) {
        console.error('Error fetching subusers:', error);
      }
    };

    fetchSubsets();
  }, [coachId, selectedDate, selectedSlot?.slotId, selectedSlotId]);

  const handleBook = async (slot: Slot) => {
    setSelectedSlot(slot);
    setSelectedSlotId(slot.slotId);
    setIsSubsetModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;

    const userId = localStorage.getItem('userId');

    if (!userId) {
      setError('User not logged in.');
      return;
    }

    try {
      const selectedSubusers = selectedSubuser1;
      const childId = selectedSubusers;

      const data = {
        userId,
        childId,
        coachId,
        slotId: selectedSlot.slotId,
        bookingType: "single",
        status: "available"
      };

      const response = await axios.post(`${Domain_URL}/bookings`, data);
      
      if (response.data && response.data.message === "Invalid slot ID") {
        console.error('Error response:', response.data);
        return;
      }

      setIsSubsetModalOpen(false);
      const slotsResponse = await axios.get(`${Domain_URL}/slot/coach/${coachId}`, {
        params: { date: selectedDate },
      });
      const filteredSlots = slotsResponse.data.filter((slot: Slot) =>
        new Date(slot.date).toISOString().split('T')[0] === selectedDate
      );
      setSlots(filteredSlots);
      setError('Booking successful!');
    } catch (error) {
      console.error('Error booking slot:', error);
      setError('This user already has a booking at this time with another coach on this date.');
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        setError('This user already has a booking at this time with another coach on this date.');
        setTimeout(() => {
          setIsSubsetModalOpen(false);
          setError(null);
        }, 5000);
      } else {
        setError('Booking failed. Please try again.');
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = async (slot: Slot) => {
    setSelectedSlot(slot);
    try {
      const response = await axios.get(`${Domain_URL}/coach/coaches/${coachId}`);
      setCoachDetails(response.data);
    } catch (error) {
      console.error('Error fetching coach details:', error);
    }
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <UserShell>
        <div className="flex justify-center items-center h-full min-h-[500px]">
           <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      </UserShell>
    );
  }

  return (
    <UserShell>
      <div className="space-y-8 py-6 md:py-10">

        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-light tracking-tight text-slate-900">
               Select a Slot
            </h1>
            <p className="text-sm text-slate-500">
               For {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {slots.length > 0 ? (
            slots.map((slot) => {
               const isUnavailable = slot.status === 'booked' || slot.status === 'completed' || slot.status === 'unbooked' || slot.status === 'inprogress';
               return (
                  <div
                    key={slot.slotId}
                    className={`
                      group bg-white rounded-2xl border transition-all duration-300 p-6 flex flex-col h-full
                      ${isUnavailable ? 'border-slate-100 opacity-60' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}
                    `}
                  >
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-slate-900">
                           <Clock size={16} className="text-slate-400" />
                           <span className="font-semibold text-lg">{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <span className={`
                          inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                          ${slot.status === 'booked' ? 'bg-red-50 text-red-600' :
                            slot.status === 'completed' ? 'bg-orange-50 text-orange-600' :
                            'bg-green-50 text-green-600'}
                        `}>
                           {slot.status}
                        </span>
                     </div>

                     <div className="mt-auto grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleView(slot)}
                          className="py-2.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <InfoCircle size={14} />
                          Details
                        </button>
                        <button
                          onClick={() => handleBook(slot)}
                          disabled={isUnavailable}
                          className={`
                             py-2.5 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2
                             ${isUnavailable
                               ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                               : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'}
                          `}
                        >
                          <Person size={14} />
                          {slot.status === 'booked' ? 'Booked' : 'Book'}
                        </button>
                     </div>
                  </div>
               );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
              <p className="text-slate-500">No slots available for this date.</p>
              <button onClick={handleBack} className="mt-2 text-indigo-600 font-medium hover:underline">Select another date</button>
            </div>
          )}
        </div>

        {/* Coach Details Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
               <button
                 onClick={() => setIsModalOpen(false)}
                 className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
               >
                  <X size={20} />
               </button>

               <h3 className="text-xl font-bold text-slate-900 mb-6">Coach Information</h3>

               {coachDetails ? (
                  <div className="space-y-4">
                     <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Name</span>
                        <p className="text-slate-900 font-medium text-lg">{coachDetails.name}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Sport</span>
                           <div className="flex items-center gap-2 text-slate-700">
                              <Trophy size={14} />
                              {coachDetails.sport}
                           </div>
                        </div>
                        <div>
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</span>
                           <div className="flex items-center gap-2 text-slate-700">
                              <GeoAlt size={14} />
                              {coachDetails.phoneNumber}
                           </div>
                        </div>
                     </div>
                     <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Bio</span>
                        <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                           {coachDetails.bio || "No bio available."}
                        </p>
                     </div>
                  </div>
               ) : (
                  <div className="flex justify-center py-8">
                     <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
                  </div>
               )}
            </div>
          </div>
        )}

        {/* Booking Confirmation Modal */}
        {isSubsetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
               <button
                 onClick={() => setIsSubsetModalOpen(false)}
                 className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
               >
                  <X size={20} />
               </button>

               <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Booking</h3>
               <p className="text-slate-500 text-sm mb-6">Select a child for this session.</p>

               {subsets.length > 0 ? (
                  <div className="space-y-4">
                     <div className="relative">
                        <select
                           value={selectedSubuser1}
                           onChange={(e) => setSelectedSubuser1(e.target.value)}
                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-slate-900"
                        >
                           <option value="" disabled>Select Child</option>
                           {subsets.map((subuser) => (
                              <option key={subuser.childId} value={subuser.childId}>
                                 {subuser.name}
                              </option>
                           ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <ChevronLeft size={16} className="-rotate-90" />
                        </div>
                     </div>

                     <button
                        onClick={handleConfirmBooking}
                        disabled={!selectedSubuser1}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        Confirm Booking
                     </button>
                  </div>
               ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                     <p className="text-slate-500 text-sm mb-2">No children found.</p>
                     <button onClick={() => navigate('/userprofile')} className="text-indigo-600 font-medium text-sm hover:underline">Add a child in Profile</button>
                  </div>
               )}
            </div>
          </div>
        )}

        {/* Status/Error Modal */}
        {!!error && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200 text-center space-y-4">
               <button
                 onClick={() => setError(null)}
                 className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
               >
                  <X size={20} />
               </button>

               <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${error.includes('successful') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {error.includes('successful') ? <CheckCircle size={24} /> : <ExclamationCircle size={24} />}
               </div>

               <div>
                  <h3 className="text-lg font-bold text-slate-900">{error.includes('successful') ? 'Success' : 'Notice'}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{error}</p>
               </div>
            </div>
          </div>
        )}

      </div>
    </UserShell>
  );
}
