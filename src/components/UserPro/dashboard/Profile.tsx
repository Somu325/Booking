
'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Person,
  PersonPlus,
  Pencil,
  Trash,
  CheckCircleFill,
  ExclamationCircle,
  ShieldCheck,
  Save,
  X,
  PersonCircle
} from 'react-bootstrap-icons'

import { Domain_URL } from '../../config'
import UserShell from '../../Layout/UserShell'

interface User {
  userId: string
  name: string
  age: number
  mobileNumber: string
  email: string
  gender: string
  password: string
  verified: boolean
  children?: { childId: string; name: string; age: number; gender: string }[]
}

interface EmailVerificationData {
  orderId: string
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          Something went wrong. Please try again later.
        </div>
      )
    }

    return this.props.children
  }
}

export default function UserProfile({ userEmail = '' }: { userEmail?: string }) {
  const [email, setEmail] = useState<string | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [tempName, setTempName] = useState('')
  const [tempAge, setTempAge] = useState('')
  const [tempPhoneNumber, setTempPhoneNumber] = useState('')
  const [tempGender, setTempGender] = useState('')
  const [tempEmail, setTempEmail] = useState('')
  const [newChildName, setNewChildName] = useState('')
  const [newChildAge, setNewChildAge] = useState('')
  const [newChildGender, setNewChildGender] = useState('')
  const [userId, setUserId] = useState('')
  const [childDetails, setChildDetails] = useState<{ childId: string; name: string; age: number; gender: string }[]>([])
  const [showAddChildForm, setShowAddChildForm] = useState(false)
  const [editableChildId, setEditableChildId] = useState<string | null>(null)
  const [updatedChild, setUpdatedChild] = useState({ name: '', age: '', gender: '' })
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [emailVerificationData, setEmailVerificationData] = useState<EmailVerificationData>({ orderId: '' })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [childNameError, setChildNameError] = useState('')
  const [childAgeError, setChildAgeError] = useState('')
  const [timer, setTimer] = useState(0)
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('');

  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(localStorage.getItem('useremail'))
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${Domain_URL}/user/email/${userEmail || email}`)
      const data: User = response.data
      if (data) {
        setUserData(data)
        setTempName(data.name)
        setTempAge(data.age?.toString() ?? '')
        setTempPhoneNumber(data.mobileNumber ?? '')
        setTempGender(data.gender ?? '')
        setTempEmail(data.email)
        setIsEmailVerified(data.verified ?? false)
        setUserId(data.userId)
        setChildDetails(data.children?.map(child => ({ ...child })) || [])
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  useEffect(() => {
    fetchUserData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail, email])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const validateName = (name: string) => {
    if (name.length < 2) {
      setNameError('Name should contain only Alphabets')
      return false
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setNameError('Name should contain only Alphabets')
      return false
    }
    setNameError('')
    return true
  }

  const validatePhoneNumber = (phone: string) => {
    if (!/^\d{10}$/.test(phone)) {
      setPhoneError('Plase enter a valid Phone number ')
      return false
    }
    setPhoneError('')
    return true
  }

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
    if (name.length < 2) {
      setChildNameError('Name should contain only Alphabets')
      return false
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setChildNameError('Name should contain only Alphabets')
      return false
    }
    setChildNameError('')
    return true
  }
 
  const validateChildAge = (age: string) => {
    const ageNum = parseInt(age, 10)
    if (isNaN(ageNum) || ageNum < 6 || ageNum > 15) {
      setChildAgeError('Age must be between 6 and 15')
      return false
    }
    setChildAgeError('')
    return true
  }

  const updateUserData = async () => {
    if (!validateName(tempName) || !validatePhoneNumber(tempPhoneNumber)) {
      return
    }

    setIsLoading(true)
    try {
      const updatedUserData = {
        name: tempName,
        age: parseInt(tempAge, 10),
        mobileNumber: tempPhoneNumber,
        email: tempEmail,
        gender: tempGender,
        children: childDetails,
      }
      
      if (tempEmail !== userData?.email) {
        setShowVerificationPrompt(true)
      } else {
        await axios.put(`${Domain_URL}/user/email/${userData?.email}`, updatedUserData)
        setIsEditMode(false)
        fetchUserData()
      }
    } catch (error) {
      console.error('Error updating user data:', error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
    }
  }

  const handleUpdateChild = async (childId: string) => {
    if (!validateChildName(updatedChild.name) || !validateChildAge(updatedChild.age)) {
      return
    }

    setIsLoading(true)
    try {
      const updatedChildData = {
        name: updatedChild.name,
        age: parseInt(updatedChild.age, 10),
        gender: updatedChild.gender,
      }
      await axios.put(`${Domain_URL}/children/id/${childId}`, updatedChildData)
      setEditableChildId(null)
      fetchUserData()
    } catch (error) {
      console.error('Error updating child:', error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
    }
  }

  const addChild = async () => {
    if (!validateChildName(newChildName) || !validateChildAge(newChildAge) || !newChildGender) {
      return
    }

    setIsLoading(true)
    try {
      const childData = {
        name: newChildName,
        age: parseInt(newChildAge, 10),
        gender: newChildGender,
        userId,
      }
      const response = await axios.post(`${Domain_URL}/children`, childData)
      setChildDetails(prev => [...prev, { ...response.data, childId: response.data.id }])
      setNewChildName('')
      setNewChildAge('')
      setNewChildGender('')
      setShowAddChildForm(false)
    } catch (error) {
      console.error('Error adding child:', error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
    }
  }

  const handleDeleteChild = async (childId: string) => {
    setIsLoading(true)
    try {
      await axios.delete(`${Domain_URL}/children/id/${childId}`)
      setChildDetails(prev => prev.filter(child => child.childId !== childId))
    } catch (error) {
      console.error('Error deleting child:', error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
    }
  }

  const verifyEmail = async () => {
    try {
      const response = await axios.post(`${Domain_URL}/api/send-otp2`, { email: tempEmail })
      setEmailVerificationData(response.data)
      setShowEmailModal(true)
      setTimer(120)
    } catch (error) {
      console.error('Error verifying email:', error)
      alert('This email is already registered');
    }
  }

  const confirmOtp = async (email: string | undefined, otp: string, orderId: string) => {
    try {
      const response = await axios.post(`${Domain_URL}/api/verify-otp`, {
        email,
        otp,
        orderId,
      })

      if (response.status === 200) {
        await updateVerifiedStatus(email)
        setShowSuccessModal(true)
        setIsEmailVerified(true)
        setShowEmailModal(false)
        
        const updatedUserData = {
          name: tempName,
          age: parseInt(tempAge, 10),
          mobileNumber: tempPhoneNumber,
          email: tempEmail,
          gender: tempGender,
          children: childDetails,
        }
        await axios.put(`${Domain_URL}/user/email/${userData?.email}`, updatedUserData)
        setIsEditMode(false)
        fetchUserData()
       
        if (response.status === 200) {
          setTimeout(() => navigate('/user-login'), 5000);
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setShowErrorModal(true)
    }
  }

  const updateVerifiedStatus = async (email: string | undefined) => {
    try {
      await axios.put(`${Domain_URL}/user/email/${email}`, {
        email,
        verified: true,
      })
    } catch (error) {
      console.error('Error updating verified status:', error)
    }
  }

  return (
    <ErrorBoundary>
      <UserShell title="My Profile">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Profile Header */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
             <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                <PersonCircle size={64} />
             </div>
             <h1 className="text-2xl font-bold text-gray-900">{userData?.name || 'User'}</h1>
             <div className="flex items-center gap-2 mt-2 text-gray-600">
                <span>{userData?.email || userEmail || email}</span>
                {isEmailVerified ? (
                  <CheckCircleFill className="text-green-500" size={16} />
                ) : (
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded"
                  >
                    Verify Email
                  </button>
                )}
             </div>
          </div>
  
          {/* Profile Edit Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                )}
             </div>

             <div className="space-y-4">
                {isEditMode ? (
                  <>
                    <div className="space-y-1">
                       <label className="text-sm font-medium text-gray-700">Name</label>
                       <input
                         className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                         placeholder="Name"
                         value={tempName}
                         onChange={(e) => {
                           setTempName(e.target.value)
                           validateName(e.target.value)
                         }}
                       />
                       {nameError && <p className="text-xs text-red-500">{nameError}</p>}
                    </div>

                    <div className="space-y-1">
                       <label className="text-sm font-medium text-gray-700">Phone Number</label>
                       <input
                         className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                         placeholder="Phone Number"
                         value={tempPhoneNumber}
                         onChange={(e) => {
                            let input = e.target.value;
                            if (input.startsWith("0")) input = input.slice(1);
                            if (input.length <= 10 && /^\d*$/.test(input)) {
                              setTempPhoneNumber(input);
                              validatePhoneNumber(input);
                            }
                         }}
                       />
                       {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
                    </div>

                    <div className="space-y-1">
                       <label className="text-sm font-medium text-gray-700">Email</label>
                       <input
                         className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                         placeholder="Email"
                         value={tempEmail}
                         onChange={handleEmailChange}
                       />
                       {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                       <button
                         onClick={updateUserData}
                         disabled={!!nameError || !!phoneError || !!emailError || isLoading}
                         className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                       >
                         {isLoading ? 'Saving...' : 'Save Changes'}
                       </button>
                       <button
                         onClick={() => setIsEditMode(false)}
                         className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                       >
                         Cancel
                       </button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <span className="block text-sm font-medium text-gray-500">Name</span>
                        <p className="mt-1 text-gray-900">{userData?.name}</p>
                     </div>
                     <div>
                        <span className="block text-sm font-medium text-gray-500">Phone Number</span>
                        <p className="mt-1 text-gray-900">{userData?.mobileNumber}</p>
                     </div>
                     <div className="md:col-span-2">
                        <span className="block text-sm font-medium text-gray-500">Email</span>
                        <p className="mt-1 text-gray-900">{userData?.email}</p>
                     </div>
                  </div>
                )}
             </div>
          </div>

          {/* Children Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Children</h2>
                  <p className="text-sm text-gray-500">Total: {childDetails.length}</p>
                </div>
                <button
                  onClick={() => setShowAddChildForm(!showAddChildForm)}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <PersonPlus size={16} />
                  Add Child
                </button>
             </div>

              {/* Add child form */}
              {showAddChildForm && (
                <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
                   <h3 className="text-sm font-bold text-gray-900 mb-4">Add New Child</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-1">
                        <input
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                          placeholder="Child's Name"
                          value={newChildName}
                          onChange={(e) => {
                            setNewChildName(e.target.value)
                            validateChildName(e.target.value)
                          }}
                        />
                        {childNameError && <p className="text-xs text-red-500">{childNameError}</p>}
                      </div>
                      <div className="space-y-1">
                        <input
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                          placeholder="Age"
                          type="number"
                          value={newChildAge}
                          onChange={(e) => {
                            setNewChildAge(e.target.value)
                            validateChildAge(e.target.value)
                          }}
                        />
                        {childAgeError && <p className="text-xs text-red-500">{childAgeError}</p>}
                      </div>
                      <div>
                        <select
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                          value={newChildGender}
                          onChange={(e) => setNewChildGender(e.target.value)}
                        >
                          <option value="" disabled>Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button
                        onClick={addChild}
                        disabled={!!childNameError || !!childAgeError || !newChildGender || isLoading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        {isLoading ? 'Adding...' : 'Add Child'}
                      </button>
                      <button
                        onClick={() => setShowAddChildForm(false)}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                   </div>
                </div>
              )}
 
             {/* List of children */}
             <div className="space-y-4">
              {childDetails.length > 0 ? (
                childDetails.map((child) => (
                  <div key={child.childId} className="bg-white border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors">
                      {editableChildId === child.childId ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                           <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-500">Name</label>
                              <input
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm"
                                value={updatedChild.name}
                                onChange={(e) => {
                                  setUpdatedChild({ ...updatedChild, name: e.target.value })
                                  validateChildName(e.target.value)
                                }}
                              />
                           </div>
                           <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-500">Age</label>
                              <input
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm"
                                value={updatedChild.age}
                                onChange={(e) => {
                                  setUpdatedChild({ ...updatedChild, age: e.target.value })
                                  validateChildAge(e.target.value)
                                }}
                                type="number"
                              />
                           </div>
                           <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-500">Gender</label>
                              <select
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm"
                                value={updatedChild.gender}
                                onChange={(e) =>
                                  setUpdatedChild({ ...updatedChild, gender: e.target.value })
                                }
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                           </div>
                           <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateChild(child.childId)}
                                disabled={!!childNameError || !!childAgeError || isLoading}
                                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                title="Save"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={() => setEditableChildId(null)}
                                className="bg-white border border-gray-300 text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                           </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <Person size={20} />
                             </div>
                             <div>
                                <p className="font-semibold text-gray-900">{child.name}</p>
                                <p className="text-xs text-gray-500">{child.age} years • {child.gender}</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditableChildId(child.childId)
                                setUpdatedChild({
                                  name: child.name,
                                  age: child.age.toString(),
                                  gender: child.gender,
                                })
                              }}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteChild(child.childId)}
                              disabled={isLoading}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">No children added yet.</p>
                </div>
              )}
             </div>
          </div>
  
          {/* Email verification modal */}
          {showEmailModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
               <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                     <h3 className="text-lg font-bold text-gray-900">Verify Email</h3>
                     <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-600">
                       <X size={20} />
                     </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">We'll send a code to <span className="font-semibold text-gray-900">{tempEmail}</span></p>

                  <div className="space-y-4">
                     <button
                       onClick={verifyEmail}
                       disabled={timer > 0}
                       className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                     >
                       {timer > 0 ? `Resend OTP (${timer}s)` : 'Send OTP'}
                     </button>

                     <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Enter OTP</label>
                        <input
                          placeholder="000000"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                     </div>

                     <button
                        onClick={() => confirmOtp(tempEmail, otp, emailVerificationData.orderId)}
                        className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors"
                      >
                        Verify & Update
                      </button>
                  </div>
               </div>
            </div>
          )}
 
          {/* Email verification prompt modal */}
          {showVerificationPrompt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
               <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                     <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Verification Required</h3>
                  <p className="text-sm text-gray-600 mb-6">You've changed your email address. Please verify it to continue.</p>
                  <div className="flex gap-3">
                     <button
                       onClick={() => {
                         setShowVerificationPrompt(false)
                         verifyEmail()
                       }}
                       className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                     >
                       Verify Now
                     </button>
                     <button
                       onClick={() => setShowVerificationPrompt(false)}
                       className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                     >
                       Cancel
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* Success modal */}
          {showSuccessModal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
               <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                     <CheckCircleFill size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Success!</h3>
                  <p className="text-sm text-gray-600 mb-6">Email verified successfully. Please login with your new credentials.</p>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full py-2.5 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
               </div>
            </div>
          )}
  
          {/* Error modal */}
          {showErrorModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
               <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
                     <ExclamationCircle size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Verification Failed</h3>
                  <p className="text-sm text-gray-600 mb-6">The OTP you entered is incorrect. Please try again.</p>
                  <button
                    onClick={() => setShowErrorModal(false)}
                    className="w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
               </div>
            </div>
          )}
        </div>
      </UserShell>
    </ErrorBoundary>
  )
}
