
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Domain_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import {
  PersonCircle,
  Telephone,
  Award,
  CheckCircleFill,
  Pencil,
  Envelope,
  ArrowLeft,
  X,
  ExclamationCircle
} from 'react-bootstrap-icons';
import CoachShell from '../../Layout/CoachShell';

interface CoachData {
  name: string;
  age: string;
  phoneNumber: string;
  sport: string;
  bio: string;
  email: string;
  gender: string;
  emailVerified: boolean;
}

interface SendOtpResponse {
  orderId: string;
}

interface VerifyOtpResponse {
  message: string;
}

export default function CoachProfile() {
  const [coachId, setCoachId] = useState<string | null>(null);
  const [coachDetails, setCoachDetails] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedDetails, setUpdatedDetails] = useState<Partial<CoachData>>({});
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [orderId, setOrderId] = useState('');
  const [timer, setTimer] = useState(120);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    const storedCoachId = localStorage.getItem('coachId');
    if (storedCoachId) {
      setCoachId(storedCoachId);
    }
  }, []);

  const fetchCoachData = async (coachId: string) => {
    try {
      const response = await axios.get(`${Domain_URL}/coach/coaches/${coachId}`);
      return response.data as CoachData;
    } catch (error) {
      console.error('Error fetching coach data:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadCoachData = async () => {
      if (coachId) {
        setLoading(true);
        const data = await fetchCoachData(coachId);
        if (data) {
          setCoachDetails(data);
          setIsEmailVerified(data.emailVerified);
        } else {
          setSnackbar({ open: true, message: 'Coach not found.', severity: 'error' });
        }
        setLoading(false);
      }
    };
    loadCoachData();
  }, [coachId]);

  const handleUpdateProfile = async () => {
    if (!coachId) {
      setSnackbar({ open: true, message: 'Coach ID is not defined.', severity: 'error' });
      return;
    }
  
    try {
      const { emailVerified, ...dataToUpdate } = { ...coachDetails, ...updatedDetails };
  
      if (!dataToUpdate.name || !/^[a-zA-Z0-9\s]+$/.test(dataToUpdate.name)) {
        setSnackbar({ open: true, message: 'Please enter a valid name (alphanumeric characters only).', severity: 'error' });
        return;
      }
  
      if (!dataToUpdate.phoneNumber || !/^[1-9]\d{9}$/.test(dataToUpdate.phoneNumber)) {
        setSnackbar({ open: true, message: 'Please enter a valid 10-digit phone number.', severity: 'error' });
        return;
      }
  
      if (!dataToUpdate.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(dataToUpdate.email)) {
        setSnackbar({ open: true, message: 'Please enter a valid email address.', severity: 'error' });
        return;
      }
  
      if (dataToUpdate.email !== coachDetails?.email) {
        setShowOtpModal(true);
        await handleSendOTP(dataToUpdate.email as string);
        return;
      }
  
      await axios.put(`${Domain_URL}/coach/update/${coachId}`, dataToUpdate);
      setSnackbar({ open: true, message: 'Profile updated successfully.', severity: 'success' });
      setEditMode(false);
  
      const data = await fetchCoachData(coachId);
      if (data) {
        setCoachDetails(data);
        setIsEmailVerified(data.emailVerified);
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setSnackbar({ open: true, message: 'Email already registered. Please use a different email.', severity: 'error' });
      } else {
        setSnackbar({ open: true, message: 'Failed to update profile. Please try again.', severity: 'error' });
      }
      console.error('Update profile error:', error.response || error.message);
    }
  };
  
  const handleInputChange = (field: keyof CoachData) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = event.target.value;

    if (field === 'name') {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        setNameError('Name should contain only alphabets');
      } else if (value.length < 2) {
        setNameError('Name must be at least 2 characters');
      } else {
        setNameError(null);
      }
    }

    const validateEmail = (email: string) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };

    if (field === 'email') {
      if (!validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError(null);
      }
    }

    if (field === 'phoneNumber') {
      if (!/^[1-9]\d{9}$/.test(value)) {
        setPhoneError('Please enter a valid 10-digit phone number that does not start with 0');
      } else {
        setPhoneError(null);
      }
    }

    setUpdatedDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSendOTP = async (email: string) => {
    try {
      const response = await axios.post<SendOtpResponse>(`${Domain_URL}/api/send-otp2`, { email });
      if (response.data.orderId) {
        setOrderId(response.data.orderId);
        setIsOtpSent(true);
        setTimer(120);
        setSnackbar({ open: true, message: 'OTP sent successfully.', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to send OTP.', severity: 'error' });
        alert('This email is already registered')
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('This email is already registered');
    }
  };

  const confirmOtp = async () => {
    try {
      const response = await axios.post<VerifyOtpResponse>(`${Domain_URL}/verify-otp`, { email: updatedDetails.email, otp, orderId });
      if (response.data.message === 'OTP Verified Successfully!') {
        await axios.put(`${Domain_URL}/coach/update/${coachId}`, { ...updatedDetails, emailVerified: true });
        setSnackbar({ open: true, message: 'Email verified and profile updated successfully.', severity: 'success' });
        setIsEmailVerified(true);
        setShowOtpModal(false);
        setEditMode(false);
        alert("New email verified. Please login with your new email and the same password.");
        navigate('/Coach-login');
      } else {
        setSnackbar({ open: true, message: 'Invalid OTP. Please try again.', severity: 'error' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setSnackbar({ open: true, message: 'Error verifying OTP.', severity: 'error' });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  if (loading) {
    return (
      <CoachShell title="My Profile">
        <div className="flex justify-center items-center h-screen">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading Profile...</span>
        </div>
      </CoachShell>
    );
  }

  return (
    <CoachShell title="My Profile">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
           <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
              <PersonCircle size={64} />
           </div>
           <h1 className="text-2xl font-bold text-gray-900">{coachDetails?.name}</h1>
           <div className="flex items-center gap-2 mt-2 text-gray-600 justify-center">
              <span>{coachDetails?.email}</span>
              {isEmailVerified && <CheckCircleFill className="text-green-500" size={16} />}
           </div>
        </div>

        {/* Details Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Pencil size={14} /> {editMode ? 'Cancel Edit' : 'Edit Profile'}
              </button>
           </div>

           {editMode ? (
             <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-sm font-medium text-gray-700">Name</label>
                     <input
                       className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                       value={updatedDetails.name ?? coachDetails?.name ?? ''}
                       onChange={handleInputChange('name')}
                     />
                     {nameError && <p className="text-xs text-red-500">{nameError}</p>}
                  </div>
                  <div className="space-y-1">
                     <label className="text-sm font-medium text-gray-700">Phone Number</label>
                     <input
                       className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                       value={updatedDetails.phoneNumber ?? coachDetails?.phoneNumber ?? ''}
                       onChange={handleInputChange('phoneNumber')}
                     />
                     {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
                  </div>
                  <div className="space-y-1">
                     <label className="text-sm font-medium text-gray-700">Sport</label>
                     <select
                       className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                       value={coachDetails?.sport} // Non-editable based on original code
                       disabled
                     >
                       <option value="Cricket">Cricket</option>
                       {/* Add other options as needed */}
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="text-sm font-medium text-gray-700">Email</label>
                     <input
                       className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                       value={updatedDetails.email ?? coachDetails?.email ?? ''}
                       onChange={handleInputChange('email')}
                     />
                     {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                   <Telephone className="text-gray-400 mt-1" size={18} />
                   <div>
                      <span className="block text-sm font-medium text-gray-500">Phone</span>
                      <p className="text-gray-900">{coachDetails?.phoneNumber}</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <Award className="text-gray-400 mt-1" size={18} />
                   <div>
                      <span className="block text-sm font-medium text-gray-500">Sport</span>
                      <p className="text-gray-900">{coachDetails?.sport}</p>
                   </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                   <Award className="text-gray-400 mt-1" size={18} />
                   <div>
                      <span className="block text-sm font-medium text-gray-500">Bio</span>
                      <p className="text-gray-900 whitespace-pre-wrap">{coachDetails?.bio || 'N/A'}</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <Envelope className="text-gray-400 mt-1" size={18} />
                   <div>
                      <span className="block text-sm font-medium text-gray-500">Gender</span>
                      <p className="text-gray-900">{coachDetails?.gender || 'N/A'}</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Snackbar replacement */}
      {snackbar.open && (
         <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 z-50 ${snackbar.severity === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {snackbar.severity === 'success' ? <CheckCircleFill /> : <ExclamationCircle />}
            {snackbar.message}
            <button onClick={() => setSnackbar({ ...snackbar, open: false })} className="ml-2 hover:bg-white/20 rounded-full p-1">
              <X />
            </button>
         </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-gray-100">
              <div className="mb-4">
                 <h3 className="text-lg font-bold text-gray-900">Email Verification</h3>
                 <p className="text-sm text-gray-500">Enter the OTP sent to your new email.</p>
              </div>

              <div className="space-y-4">
                 <input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                 />
                 <p className="text-xs text-gray-500 text-center">
                    Resend OTP in {timer} seconds
                 </p>
                 <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowOtpModal(false)}
                      className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmOtp}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Verify OTP
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </CoachShell>
  );
}
