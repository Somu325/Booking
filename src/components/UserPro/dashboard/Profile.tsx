
'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { CssVarsProvider, extendTheme } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Typography from '@mui/joy/Typography'
import Input from '@mui/joy/Input'
import IconButton from '@mui/joy/IconButton'
import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import ModalClose from '@mui/joy/ModalClose'
import { Add, Edit, Delete, AccountCircle, VerifiedUser, ArrowBack } from '@mui/icons-material'

import { Domain_URL } from '../../config'

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
    JoyInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
          },
        },
      },
    },
  },
})

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
        <Typography color="danger">
          Something went wrong. Please try again later.
        </Typography>
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

  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(localStorage.getItem('email'))
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
      } else {
        // Navigate to /userlogin if no data is returned
        //navigate('/userlogin')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Navigate to /userlogin on error
     // navigate('/userlogin')
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
    if (!/^\d{11}$/.test(phone)) {
      setPhoneError('Plase enter a valid Phone number ')
      return false
    }
    setPhoneError('')
    return true
  }


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
    if (isNaN(ageNum) || ageNum < 3 || ageNum > 18) {
      setChildAgeError('Age must be between 3 and 18')
      return false
    }
    setChildAgeError('')
    return true
  }

  const updateUserData = async () => {
    if (!validateName(tempName) || !validatePhoneNumber(tempPhoneNumber)) {
      return
    }

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
    }
  }

  const handleUpdateChild = async (childId: string) => {
    if (!validateChildName(updatedChild.name) || !validateChildAge(updatedChild.age)) {
      return
    }

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
    }
  }

  const addChild = async () => {
    if (!validateChildName(newChildName) || !validateChildAge(newChildAge) || !newChildGender) {
      return
    }

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
    }
  }

  const handleDeleteChild = async (childId: string) => {
    try {
      await axios.delete(`${Domain_URL}/children/id/${childId}`)
      setChildDetails(prev => prev.filter(child => child.childId !== childId))
    } catch (error) {
      console.error('Error deleting child:', error)
    }
  }

  const verifyEmail = async () => {
    try {
      const response = await axios.post(`${Domain_URL}/api/send-otp1`, { email: tempEmail })
      setEmailVerificationData(response.data)
      setShowEmailModal(true)
      setTimer(120) // Set 2-minute timer
    } catch (error) {
      console.error('Error verifying email:', error)
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
        
        // Update user data after successful verification
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
    
          setTimeout(() => navigate('/user-login'), 5000); // 5-second delay
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
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: 4,
          }}
        >
           <Button
            startDecorator={<ArrowBack />}
            onClick={() => navigate('/screen')}
            variant="outlined"
            color="neutral"
            sx={{
              mb: 2,
               backgroundColor:'#0B6BCB',
              color: 'white',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: '#0D8CEB', // lighter blue for hover
              },
            }}
          >
            Back to Dashboard
          </Button>
          <Box sx={{ maxWidth: 800, margin: 'auto' }}>
            <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
              <AccountCircle sx={{ fontSize: 80, color: 'primary.main' }} />
              <Typography level="h2" component="h1" sx={{ mt: 2 }}>
                {userData?.name || 'User'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <Typography level="body-md">{userData?.email || userEmail || email}</Typography>
                {isEmailVerified ? (
                  <VerifiedUser sx={{ marginLeft: 1, color: 'success.main' }} />
                ) : (
                  <Button
                    variant="plain"
                    color="primary"
                    onClick={() => setShowEmailModal(true)}
                    sx={{ marginLeft: 1 }}
                  >
                    Verify Email
                  </Button>
                )}
              </Box>
            </Box>

            <Card variant="outlined" sx={{ mb: 4 }}>
              <CardContent>
                {isEditMode ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Input
                      placeholder="Name"
                      value={tempName}
                      onChange={(e) => {
                        setTempName(e.target.value)
                        
                        validateName(e.target.value)
                      }}
                      error={!!nameError}
                    />
                    {nameError && <Typography color="danger">{nameError}</Typography>}
                    <Input
  placeholder="Phone Number"
  value={tempPhoneNumber}
  onChange={(e) => {
    const input = e.target.value;
    // Allow only up to 11 digits
    if (input.length <= 11 && /^\d*$/.test(input)) {
      setTempPhoneNumber(input);
      validatePhoneNumber(input);
    }
  }}
  error={!!phoneError}
/>
                    <Input
                       placeholder="Email"
                       value={tempEmail}
                       onChange={(e) => setTempEmail(e.target.value)}
                     />
                    {phoneError && <Typography color="danger">{phoneError}</Typography>}
                    <Button sx={{width:'130px' ,  mx: 'auto' }} onClick={updateUserData} disabled={!!nameError || !!phoneError}>Update Profile</Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography>
                      <strong>Name:</strong> {userData?.name}
                    </Typography>
                    <Typography>
                      <strong>Phone Number:</strong> {userData?.mobileNumber}
                    </Typography>
                    <Button sx={{width:'100px' ,  mx: 'auto' }} onClick={() => setIsEditMode(true)}>Edit Profile</Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Box sx={{ marginTop: 4 }}>
              <Box sx={{ display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 2
              }}>
                <Typography level="h3">Add Child</Typography>
                <Button
                  startDecorator={<Add />}
                  onClick={() => setShowAddChildForm(!showAddChildForm)}
                  variant="outlined"
                >
                  Add Child
                </Button>
              </Box>

              <Typography level="body-lg" sx={{ mb: 2, fontWeight: 'bold' }}>
                Total Children: {childDetails.length}
              </Typography>

              {showAddChildForm && (
                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Input
                        placeholder="Child's Name"
                        value={newChildName}
                        onChange={(e) => {
                          setNewChildName(e.target.value)
                          validateChildName(e.target.value)
                        }}
                        error={!!childNameError}
                      />
                      {childNameError && <Typography color="danger">{childNameError}</Typography>}
                      <Input
                        placeholder="Child's Age"
                        value={newChildAge}
                        onChange={(e) => {
                          setNewChildAge(e.target.value)
                          validateChildAge(e.target.value)
                        }}
                        type="number"
                        error={!!childAgeError}
                      />
                      {childAgeError && <Typography color="danger">{childAgeError}</Typography>}
                      <select
                        value={newChildGender}
                        onChange={(e) => setNewChildGender(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '12px',
                          border: '1px solid #ccc',
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        <option value="" disabled>
                          Select Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <Button onClick={addChild} disabled={!!childNameError || !!childAgeError || !newChildGender}>Add Child</Button>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {childDetails.length > 0 ? (
                childDetails.map((child) => (
                  <Card key={child.childId} variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                      {editableChildId === child.childId ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Input
                            value={updatedChild.name}
                            onChange={(e) => {
                              setUpdatedChild({ ...updatedChild, name: e.target.value })
                              validateChildName(e.target.value)
                            }}
                            placeholder="Name"
                            error={!!childNameError}
                          />
                          {childNameError && <Typography color="danger">{childNameError}</Typography>}
                          <Input
                            value={updatedChild.age}
                            onChange={(e) => {
                              setUpdatedChild({ ...updatedChild, age: e.target.value })
                              validateChildAge(e.target.value)
                            }}
                            type="number"
                            placeholder="Age"
                            error={!!childAgeError}
                          />
                          {childAgeError && <Typography color="danger">{childAgeError}</Typography>}
                          <select
                            value={updatedChild.gender}
                            onChange={(e) =>
                              setUpdatedChild({ ...updatedChild, gender: e.target.value })
                            }
                            required
                            style={{
                              width: '100%',
                              padding: '12px',
                              borderRadius: '12px',
                              border: '1px solid #ccc',
                              backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            }}
                          >
                            <option value="" disabled>
                              Select Gender
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                          <Button   sx={{width:'100px' ,  mx: 'auto' }} onClick={() => handleUpdateChild(child.childId)} disabled={!!childNameError || !!childAgeError}>
                            Save
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography>
                              <strong>Name:</strong> {child.name}
                            </Typography>
                            <Typography>
                              <strong>Age:</strong> {child.age}
                            </Typography>
                            <Typography>
                              <strong>Gender:</strong> {child.gender}
                            </Typography>
                          </Box>
                          <Box>
                            <IconButton
                              onClick={() => {
                                setEditableChildId(child.childId)
                                setUpdatedChild({
                                  name: child.name,
                                  age: child.age.toString(),
                                  gender: child.gender,
                                })
                              }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteChild(child.childId)}>
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  No children added yet. Click the button above to add.
                </Typography>
              )}
            </Box>

            <Modal open={showEmailModal} onClose={() => setShowEmailModal(false)}>
              <ModalDialog
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
              >
                <ModalClose />
                <Typography level="h4">Verify Your Email</Typography>
                <Typography>{tempEmail}</Typography>
                <Button onClick={verifyEmail} disabled={timer > 0}>
                  {timer > 0 ? `Resend OTP (${timer}s)` : 'Send OTP'}
                </Button>
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button
                  onClick={() =>
                    confirmOtp(tempEmail, otp, emailVerificationData.orderId)
                  }
                >
                  Verify OTP
                </Button>
              </ModalDialog>
            </Modal>

            <Modal open={showVerificationPrompt} onClose={() => setShowVerificationPrompt(false)}>
              <ModalDialog
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
              >
                <ModalClose />
                <Typography level="h4">Email Verification Required</Typography>
                <Typography>You've changed your email. Please verify your new email address.</Typography>
                <Button onClick={() => {
                  setShowVerificationPrompt(false)
                  verifyEmail()
                }}>
                  Verify Email
                </Button>
              </ModalDialog>
            </Modal>

            <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
              <ModalDialog
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
              >
                <ModalClose />
                <Typography level="h4" color="success">
                 OTP Verified Successfully! 
                 </Typography>
              <Typography level="body-md" color="success" sx={{ mt: 1 }}>
               New email verified. Please login with your new email and the same password.
              </Typography>
              </ModalDialog>
            </Modal>

            <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)}>
              <ModalDialog
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
              >
                <ModalClose />
                <Typography level="h4" color="danger">
                  Incorrect OTP. Try Again!
                </Typography>
              </ModalDialog>
            </Modal>
          </Box>
        </Box>
      </CssVarsProvider>
    </ErrorBoundary>
  )
}