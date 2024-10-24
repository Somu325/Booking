'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
import { Add, Edit, Delete, AccountCircle, VerifiedUser } from '@mui/icons-material'
import { Domain_URL } from '../config'
import { useNavigate } from 'react-router-dom'


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
  const [childDetails, setChildDetails] = useState<  { childId: string; name: string; age: number; gender: string }[] >([])
  const [showAddChildForm, setShowAddChildForm] = useState(false)
  const [editableChildId, setEditableChildId] = useState<string | null>(null)
  const [updatedChild, setUpdatedChild] = useState({ name: '', age: '', gender: '' })
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [emailVerificationData, setEmailVerificationData] = useState<EmailVerificationData>({ orderId: '' })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const Navigate = useNavigate()

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
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  useEffect(() => {
    fetchUserData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail, email])

  const updateUserData = async () => {
    try {
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
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }

  const handleUpdateChild = async (childId: string) => {
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
    if (!newChildName || !newChildAge || !newChildGender) {
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
      const response = await axios.post(`${Domain_URL}/api/send-otp1`, { email: userData?.email })
      setEmailVerificationData(response.data)
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
            variant="outlined"
            onClick={() => Navigate('/screen')}
            sx={{ mb: 2 }}
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
                      onChange={(e) => setTempName(e.target.value)}
                    />
                    <Input
                      placeholder="Phone Number"
                      value={tempPhoneNumber}
                      onChange={(e) => setTempPhoneNumber(e.target.value)}
                    />
                    <Input
                      placeholder="Email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                    />
                    <Button onClick={updateUserData}>Update Profile</Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography>
                      <strong>Name:</strong> {userData?.name}
                    </Typography>
                    <Typography>
                      <strong>Phone Number:</strong> {userData?.mobileNumber}
                    </Typography>
                    <Button onClick={() => setIsEditMode(true)}>Edit Profile</Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Box sx={{ marginTop: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography level="h3">Add SubMember</Typography>
                <Button
                  startDecorator={<Add />}
                  onClick={() => setShowAddChildForm(!showAddChildForm)}
                  variant="outlined"
                >
                  Add Child
                </Button>
              </Box>

              {showAddChildForm && (
                <Card variant="outlined" sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Input
                        placeholder="Child's Name"
                        value={newChildName}
                        onChange={(e) => setNewChildName(e.target.value)}
                      />
                      <Input
                        placeholder="Child's Age"
                        value={newChildAge}
                        onChange={(e) => setNewChildAge(e.target.value)}
                        type="number"
                      />
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
                      <Button onClick={addChild}>Add Sub Member</Button>
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
                            onChange={(e) =>
                              setUpdatedChild({ ...updatedChild, name: e.target.value })
                            }
                            placeholder="Name"
                          />
                          <Input
                            value={updatedChild.age}
                            onChange={(e) =>
                              setUpdatedChild({ ...updatedChild, age: e.target.value })
                            }
                            type="number"
                            placeholder="Age"
                          />
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
                          <Button onClick={() => handleUpdateChild(child.childId)}>
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
                <Typography>{userData?.email}</Typography>
                <Button onClick={verifyEmail}>Send OTP</Button>
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button
                  onClick={() =>
                    confirmOtp(userData?.email, otp, emailVerificationData.orderId)
                  }
                >
                  Verify OTP
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


