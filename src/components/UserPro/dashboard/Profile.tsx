'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Person, Envelope, Telephone, ShieldCheck, ExclamationCircle, Pencil, Trash, Plus, Check, X, GenderMale, GenderFemale } from 'react-bootstrap-icons';
import UserShell from '../Layout/UserShell';
import { Domain_URL } from '../../config';

// Define interfaces for User and EmailVerificationData
interface User {
  userId: string;
  name: string;
  age: number;
  mobileNumber: string;
  email: string;
  gender: string;
  password: string;
  verified: boolean;
  children?: { childId: string; name: string; age: number; gender: string }[];
}

interface EmailVerificationData {
  orderId: string;
}

// Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">
          Something went wrong. Please try again later.
        </div>
      );
    }

    return this.props.children;
  }
}

export default function UserProfile({ userEmail = '' }: { userEmail?: string }) {
  // State variables
  const [email, setEmail] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempAge, setTempAge] = useState('');
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');
  const [tempGender, setTempGender] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [newChildGender, setNewChildGender] = useState('');
  const [userId, setUserId] = useState('');
  const [childDetails, setChildDetails] = useState<{ childId: string; name: string; age: number; gender: string }[]>([]);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [editableChildId, setEditableChildId] = useState<string | null>(null);
  const [updatedChild, setUpdatedChild] = useState({ name: '', age: '', gender: '' });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailVerificationData, setEmailVerificationData] = useState<EmailVerificationData>({ orderId: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [childNameError, setChildNameError] = useState('');
  const [childAgeError, setChildAgeError] = useState('');
  const [timer, setTimer] = useState(0);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(localStorage.getItem('useremail'));
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${Domain_URL}/user/email/${userEmail || email}`);
      const data: User = response.data;
      if (data) {
        setUserData(data);
        setTempName(data.name);
        setTempAge(data.age?.toString() ?? '');
        setTempPhoneNumber(data.mobileNumber ?? '');
        setTempGender(data.gender ?? '');
        setTempEmail(data.email);
        setIsEmailVerified(data.verified ?? false);
        setUserId(data.userId);
        setChildDetails(data.children?.map(child => ({ ...child })) || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail, email]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const validateName = (name: string) => {
    if (name.length < 2 || !/^[a-zA-Z\s]+$/.test(name)) {
      setNameError('Name should contain only Alphabets');
      return false;
    }
    setNameError('');
    return true;
  };

  const validatePhoneNumber = (phone: string) => {
    if (!/^\d{10}$/.test(phone)) {
      setPhoneError('Please enter a valid Phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.trim()) {
      setEmailError('Email is required.');
      return false;
    }
    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedEmail = e.target.value;
    setTempEmail(updatedEmail);
    validateEmail(updatedEmail);
  };

  const validateChildName = (name: string) => {
    if (name.length < 2 || !/^[a-zA-Z\s]+$/.test(name)) {
      setChildNameError('Name should contain only Alphabets');
      return false;
    }
    setChildNameError('');
    return true;
  };

  const validateChildAge = (age: string) => {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 6 || ageNum > 15) {
      setChildAgeError('Age must be between 6 and 15');
      return false;
    }
    setChildAgeError('');
    return true;
  };

  const updateUserData = async () => {
    if (!validateName(tempName) || !validatePhoneNumber(tempPhoneNumber)) {
      return;
    }
    setIsLoading(true);
    try {
      const updatedUserData = {
        name: tempName,
        age: parseInt(tempAge, 10),
        mobileNumber: tempPhoneNumber,
        email: tempEmail,
        gender: tempGender,
        children: childDetails,
      };
      
      if (tempEmail !== userData?.email) {
        setShowVerificationPrompt(true);
      } else {
        await axios.put(`${Domain_URL}/user/email/${userData?.email}`, updatedUserData);
        setIsEditMode(false);
        fetchUserData();
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleUpdateChild = async (childId: string) => {
    if (!validateChildName(updatedChild.name) || !validateChildAge(updatedChild.age)) {
      return;
    }
    setIsLoading(true);
    try {
      const updatedChildData = {
        name: updatedChild.name,
        age: parseInt(updatedChild.age, 10),
        gender: updatedChild.gender,
      };
      await axios.put(`${Domain_URL}/children/id/${childId}`, updatedChildData);
      setEditableChildId(null);
      fetchUserData();
    } catch (error) {
      console.error('Error updating child:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const addChild = async () => {
    if (!validateChildName(newChildName) || !validateChildAge(newChildAge) || !newChildGender) {
      return;
    }
    setIsLoading(true);
    try {
      const childData = {
        name: newChildName,
        age: parseInt(newChildAge, 10),
        gender: newChildGender,
        userId,
      };
      const response = await axios.post(`${Domain_URL}/children`, childData);
      setChildDetails(prev => [...prev, { ...response.data, childId: response.data.id }]);
      setNewChildName('');
      setNewChildAge('');
      setNewChildGender('');
      setShowAddChildForm(false);
    } catch (error) {
      console.error('Error adding child:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (!window.confirm("Are you sure you want to delete this child?")) return;
    setIsLoading(true);
    try {
      await axios.delete(`${Domain_URL}/children/id/${childId}`);
      setChildDetails(prev => prev.filter(child => child.childId !== childId));
    } catch (error) {
      console.error('Error deleting child:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const verifyEmail = async () => {
    try {
      const response = await axios.post(`${Domain_URL}/api/send-otp2`, { email: tempEmail });
      setEmailVerificationData(response.data);
      setShowEmailModal(true);
      setTimer(120);
    } catch (error) {
      console.error('Error verifying email:', error);
      alert('This email is already registered');
    }
  };

  const confirmOtp = async (email: string | undefined, otp: string, orderId: string) => {
    try {
      const response = await axios.post(`${Domain_URL}/api/verify-otp`, {
        email,
        otp,
        orderId,
      });

      if (response.status === 200) {
        await updateVerifiedStatus(email);
        setShowSuccessModal(true);
        setIsEmailVerified(true);
        setShowEmailModal(false);
        
        const updatedUserData = {
          name: tempName,
          age: parseInt(tempAge, 10),
          mobileNumber: tempPhoneNumber,
          email: tempEmail,
          gender: tempGender,
          children: childDetails,
        };
        await axios.put(`${Domain_URL}/user/email/${userData?.email}`, updatedUserData);
        setIsEditMode(false);
        fetchUserData();
       
        if (response.status === 200) {
          setTimeout(() => navigate('/user-login'), 3000);
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setShowErrorModal(true);
    }
  };

  const updateVerifiedStatus = async (email: string | undefined) => {
    try {
      await axios.put(`${Domain_URL}/user/email/${email}`, {
        email,
        verified: true,
      });
    } catch (error) {
      console.error('Error updating verified status:', error);
    }
  };

  return (
    <UserShell>
      <ErrorBoundary>
        <div className="max-w-4xl mx-auto py-6 md:py-10 space-y-10">

          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
               <Person size={48} />
            </div>
            <div>
               <h1 className="text-3xl font-light text-slate-900 tracking-tight">{userData?.name || 'User'}</h1>
               <div className="flex items-center justify-center gap-2 mt-1 text-slate-500">
                  <Envelope size={14} />
                  <span className="text-sm">{userData?.email || userEmail || email}</span>
                  {isEmailVerified ? (
                    <ShieldCheck size={16} className="text-green-500" title="Verified" />
                  ) : (
                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline"
                    >
                      Verify Now
                    </button>
                  )}
               </div>
            </div>
          </div>

          {/* Personal Information */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-slate-900">Personal Information</h2>
                {!isEditMode && (
                   <button
                     onClick={() => setIsEditMode(true)}
                     className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                   >
                     <Pencil size={14} />
                     Edit
                   </button>
                )}
             </div>

             {isEditMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Name</label>
                      <input
                        value={tempName}
                        onChange={(e) => { setTempName(e.target.value); validateName(e.target.value); }}
                        className={`w-full p-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all ${nameError ? 'border-red-300' : 'border-slate-200'}`}
                        placeholder="Full Name"
                      />
                      {nameError && <p className="text-xs text-red-500">{nameError}</p>}
                   </div>

                   <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Phone</label>
                      <input
                        value={tempPhoneNumber}
                        onChange={(e) => {
                           let input = e.target.value;
                           if (input.startsWith("0")) input = input.slice(1);
                           if (input.length <= 10 && /^\d*$/.test(input)) {
                              setTempPhoneNumber(input);
                              validatePhoneNumber(input);
                           }
                        }}
                        className={`w-full p-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all ${phoneError ? 'border-red-300' : 'border-slate-200'}`}
                        placeholder="Mobile Number"
                      />
                      {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
                   </div>

                   <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Email</label>
                      <input
                        value={tempEmail}
                        onChange={handleEmailChange}
                        className={`w-full p-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all ${emailError ? 'border-red-300' : 'border-slate-200'}`}
                        placeholder="Email Address"
                      />
                      {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                   </div>

                   <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => { setIsEditMode(false); setTempName(userData?.name || ''); setTempPhoneNumber(userData?.mobileNumber || ''); setTempEmail(userData?.email || ''); }}
                        className="px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateUserData}
                        disabled={!!nameError || !!phoneError || !!emailError || isLoading}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                   </div>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                   <div>
                      <span className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">Name</span>
                      <p className="text-slate-900 font-medium text-lg">{userData?.name}</p>
                   </div>
                   <div>
                      <span className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">Phone</span>
                      <p className="text-slate-900 font-medium text-lg flex items-center gap-2">
                        <Telephone size={14} className="text-slate-400" />
                        {userData?.mobileNumber}
                      </p>
                   </div>
                   <div>
                      <span className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1">Email</span>
                      <p className="text-slate-900 font-medium text-lg flex items-center gap-2">
                        <Envelope size={14} className="text-slate-400" />
                        {userData?.email}
                      </p>
                   </div>
                </div>
             )}
          </section>

          {/* Children Section */}
          <section className="space-y-6">
             <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-slate-900">Children</h2>
                  <p className="text-sm text-slate-500">Manage family members ({childDetails.length})</p>
                </div>
                <button
                  onClick={() => setShowAddChildForm(!showAddChildForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 rounded-xl transition-all shadow-sm font-medium text-sm"
                >
                  <Plus size={18} />
                  Add Child
                </button>
             </div>

             {showAddChildForm && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">New Child Details</h3>
                      <button onClick={() => setShowAddChildForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <input
                           placeholder="Name"
                           value={newChildName}
                           onChange={(e) => { setNewChildName(e.target.value); validateChildName(e.target.value); }}
                           className={`w-full p-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all ${childNameError ? 'border-red-300' : 'border-slate-200'}`}
                        />
                        {childNameError && <p className="text-xs text-red-500">{childNameError}</p>}
                      </div>
                      <div className="space-y-1">
                        <input
                           placeholder="Age"
                           type="number"
                           value={newChildAge}
                           onChange={(e) => { setNewChildAge(e.target.value); validateChildAge(e.target.value); }}
                           className={`w-full p-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all ${childAgeError ? 'border-red-300' : 'border-slate-200'}`}
                        />
                        {childAgeError && <p className="text-xs text-red-500">{childAgeError}</p>}
                      </div>
                      <div className="space-y-1">
                        <select
                           value={newChildGender}
                           onChange={(e) => setNewChildGender(e.target.value)}
                           className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
                        >
                           <option value="" disabled>Select Gender</option>
                           <option value="Male">Male</option>
                           <option value="Female">Female</option>
                        </select>
                      </div>
                   </div>
                   <div className="mt-4 flex justify-end">
                      <button
                        onClick={addChild}
                        disabled={!!childNameError || !!childAgeError || !newChildGender || isLoading}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md transition-all disabled:opacity-50"
                      >
                        {isLoading ? 'Adding...' : 'Add Child'}
                      </button>
                   </div>
                </div>
             )}

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {childDetails.map((child) => (
                   <div key={child.childId} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group relative">
                      {editableChildId === child.childId ? (
                         <div className="space-y-3">
                            <input
                              value={updatedChild.name}
                              onChange={(e) => { setUpdatedChild({ ...updatedChild, name: e.target.value }); validateChildName(e.target.value); }}
                              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                              placeholder="Name"
                            />
                            <div className="flex gap-2">
                               <input
                                 value={updatedChild.age}
                                 onChange={(e) => { setUpdatedChild({ ...updatedChild, age: e.target.value }); validateChildAge(e.target.value); }}
                                 type="number"
                                 className="w-1/3 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                 placeholder="Age"
                               />
                               <select
                                 value={updatedChild.gender}
                                 onChange={(e) => setUpdatedChild({ ...updatedChild, gender: e.target.value })}
                                 className="w-2/3 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                               >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                               </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                               <button onClick={() => setEditableChildId(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><X size={16}/></button>
                               <button onClick={() => handleUpdateChild(child.childId)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Check size={16}/></button>
                            </div>
                         </div>
                      ) : (
                         <>
                            <div className="flex items-start justify-between">
                               <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${child.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                     {child.gender === 'Male' ? <GenderMale size={18} /> : <GenderFemale size={18} />}
                                  </div>
                                  <div>
                                     <h3 className="font-semibold text-slate-900">{child.name}</h3>
                                     <p className="text-xs text-slate-500">{child.age} years old</p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                       setEditableChildId(child.childId);
                                       setUpdatedChild({ name: child.name, age: child.age.toString(), gender: child.gender });
                                    }}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  >
                                     <Pencil size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteChild(child.childId)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                     <Trash size={14} />
                                  </button>
                               </div>
                            </div>
                         </>
                      )}
                   </div>
                ))}
                {childDetails.length === 0 && !showAddChildForm && (
                   <div className="col-span-full py-12 text-center border border-slate-200 border-dashed rounded-xl bg-slate-50">
                      <p className="text-slate-500 text-sm">No children added yet.</p>
                      <button onClick={() => setShowAddChildForm(true)} className="text-indigo-600 font-medium text-sm mt-1 hover:underline">Add one now</button>
                   </div>
                )}
             </div>
          </section>

          {/* Modals */}
          {/* Email Verification */}
          {showEmailModal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
                   <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-900">Verify Email</h3>
                      <p className="text-sm text-slate-500 mt-1">{tempEmail}</p>
                   </div>
                   <div className="space-y-3">
                      <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center tracking-widest text-lg font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                      <div className="flex flex-col gap-2">
                         <button
                           onClick={() => confirmOtp(tempEmail, otp, emailVerificationData.orderId)}
                           className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                         >
                           Verify OTP
                         </button>
                         <button
                           onClick={verifyEmail}
                           disabled={timer > 0}
                           className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
                         >
                           {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                         </button>
                      </div>
                   </div>
                   <button onClick={() => setShowEmailModal(false)} className="w-full py-2 text-slate-400 hover:text-slate-600 text-sm">Cancel</button>
                </div>
             </div>
          )}

          {/* Verification Prompt */}
          {showVerificationPrompt && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
                   <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto">
                      <ExclamationCircle size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-slate-900">Verify New Email</h3>
                      <p className="text-sm text-slate-500 mt-2">You changed your email. Please verify it to continue.</p>
                   </div>
                   <div className="flex gap-3">
                      <button onClick={() => setShowVerificationPrompt(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200">Cancel</button>
                      <button onClick={() => { setShowVerificationPrompt(false); verifyEmail(); }} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800">Verify</button>
                   </div>
                </div>
             </div>
          )}

          {/* Success/Error Modals */}
          {(showSuccessModal || showErrorModal) && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${showSuccessModal ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {showSuccessModal ? <Check size={24} /> : <X size={24} />}
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-slate-900">{showSuccessModal ? 'Success!' : 'Error'}</h3>
                      <p className="text-sm text-slate-500 mt-2">
                        {showSuccessModal
                           ? 'Email verified successfully. Please login again.'
                           : 'Incorrect OTP. Please try again.'}
                      </p>
                   </div>
                   <button
                     onClick={() => { setShowSuccessModal(false); setShowErrorModal(false); }}
                     className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800"
                   >
                     Okay
                   </button>
                </div>
             </div>
          )}

        </div>
      </ErrorBoundary>
    </UserShell>
  );
}
