// "use client"

// import React, { useState } from 'react'
// import {
//   Box,
//   Typography,
//   Input,
//   Button,
//   FormControl,
//   FormLabel,
//   Alert,
//   IconButton,
//   CssVarsProvider,
//   extendTheme,
// } from '@mui/joy'
// import { Visibility, VisibilityOff, Person, Email, Phone, Lock } from '@mui/icons-material'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom';

// // Assume Domain_URL is imported from a config file
// import { Domain_URL } from '../../config';

// // Custom theme
// const theme = extendTheme({
//   colorSchemes: {
//     light: {
//       palette: {
//         primary: {
//           50: '#e0f2f1',
//           100: '#b2dfdb',
//           200: '#80cbc4',
//           300: '#4db6ac',
//           400: '#26a69a',
//           500: '#009688',
//           600: '#00897b',
//           700: '#00796b',
//           800: '#00695c',
//           900: '#004d40',
//         },
//       },
//     },
//   },
//   components: {
//     JoyInput: {
//       styleOverrides: {
//         root: {
//           borderRadius: '16px',
//         },
//       },
//     },
//     JoyButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: '16px',
//           textTransform: 'none',
//           fontWeight: 600,
//         },
//       },
//     },
//   },
// });

// export default function Component() {
//   const [email, setEmail] = useState('');
//   const [emailError, setEmailError] = useState<string | null>(null);
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [name, setName] = useState('');
//   const [nameError, setNameError] = useState<string | null>(null);
//   const [password, setPassword] = useState('');
//   const [passwordError, setPasswordError] = useState<string | null>(null);
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [mobileNumberError, setMobileNumberError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const validateEmail = (email: string) => {
//     const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     const isValid = re.test(email);
//     setEmailError(isValid ? null : 'Please enter a valid email address.');
//     return isValid;
//   };

//   const validateMobileNumber = (number: string) => {
//     const maxDigits = 11;
//     const phoneRegex = new RegExp(`^\\d{1,${maxDigits}}$`);
//     if (!phoneRegex.test(number)) {
//       setMobileNumberError('Please enter a valid 11 digit phone number.');
//       return false;
//     }
//     setMobileNumberError(null);
//     return true;
//   };

//   const validateName = (name: string) => {
//     const isValid = /^[A-Za-z\s]+$/.test(name) && name.length >= 2 && name.length <= 50;
//     setNameError(isValid ? null : 'Name sholud contain only alphabets');
//     return isValid;
//   };

//   const validatePassword = (password: string) => {
//     const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
//     setPasswordError(
//       isValid ? null : 'Password should contains minimum 8-16  characters.'
//     );
//     return isValid;
//   };

//   const validateConfirmPassword = (confirmPassword: string) => {
//     const isMatch = confirmPassword === password;
//     setConfirmPasswordError(isMatch ? null : 'Enter same password.');
//     return isMatch;
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     if (!email || !mobileNumber || !password || !confirmPassword) {
//       setError('All fields except name are required.');
//       return;
//     }

//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address.');
//       return;
//     }

//     if (!validateMobileNumber(mobileNumber)) {
//       setError('Please enter a valid 10-digit mobile number.');
//       return;
//     }

//     if (name && !validateName(name)) {
//       setError('Name should be between 2 and 50 alphabetic characters.');
//       return;
//     }

//     if (!validatePassword(password)) {
//       setError('Please enter a valid password.');
//       return;
//     }

//     if (!validateConfirmPassword(confirmPassword)) {
//       setError('Please make sure your passwords match.');
//       return;
//     }

//     const userData = { email, name, mobileNumber, password };

//     try {
//       const response = await axios.post(`${Domain_URL}/user/signup`, userData);
//       if (response.status === 201) {
//         setSuccess('User registered successfully!');
//         setTimeout(() => navigate('/user-login'), 2000);
//       }
//     } catch (error) {
//       setError('Email already registered.');
//       console.error(error);
//     }
//   };

//   return (
//     <CssVarsProvider theme={theme}>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           minHeight: '100vh',
//           p: 2,
//           background: 'url("/placeholder.svg?height=1080&width=1920") no-repeat center center fixed',
//           backgroundSize: 'cover',
//         }}
//       >
//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           sx={{
//             width: '100%',
//             maxWidth: 400,
//             p: 4,
//             borderRadius: 'xl',
//             bgcolor: 'rgba(255, 255, 255, 0.8)',
//             backdropFilter: 'blur(10px)',
//             boxShadow: 'lg',
//           }}
//         >
//           <Typography level="h4" component="h1" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
//             Create an Account
//           </Typography>

//           <FormControl sx={{ mb: 2 }}>
//             <FormLabel>Email <Typography component="span" color="danger">*</Typography></FormLabel>
//             <Input
//               placeholder="Email"
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 validateEmail(e.target.value);
//               }}
//               type="email"
//               required
//               startDecorator={<Email />}
//             />
//             {emailError && (
//               <Typography color="danger" fontSize="sm">
//                 {emailError}
//               </Typography>
//             )}
//           </FormControl>

//           <FormControl sx={{ mb: 2 }}>
//             <FormLabel>Name</FormLabel>
//             <Input
//               placeholder="Name"
//               value={name}
//               onChange={(e) => {
//                 setName(e.target.value);
//                 validateName(e.target.value);
//               }}
//               startDecorator={<Person />}
//             />
//             {nameError && (
//               <Typography color="danger" fontSize="sm">
//                 {nameError}
//               </Typography>
//             )}
//           </FormControl>

//           <FormControl sx={{ mb: 2 }}>
//             <FormLabel>Mobile Number <Typography component="span" color="danger">*</Typography></FormLabel>
//             <Input
//               placeholder="Mobile Number"
//               value={mobileNumber}
//               onChange={(e) => {
//                 setMobileNumber(e.target.value);
//                 validateMobileNumber(e.target.value);
//               }}
//               type="tel"
//               required
//               startDecorator={<Phone />}
//             />
//             {mobileNumberError && (
//               <Typography color="danger" fontSize="sm">
//                 {mobileNumberError}
//               </Typography>
//             )}
//           </FormControl>

//           <FormControl sx={{ mb: 2 }}>
//             <FormLabel>Password <Typography component="span" color="danger">*</Typography></FormLabel>
//             <Input
//               placeholder="Password"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 validatePassword(e.target.value);
//               }}
//               type={showPassword ? 'text' : 'password'}
//               required
//               startDecorator={<Lock />}
//               endDecorator={
//                 <IconButton onClick={() => setShowPassword(!showPassword)}>
//                   {showPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               }
//             />
//             {passwordError && (
//               <Typography color="danger" fontSize="sm">
//                 {passwordError}
//               </Typography>
//             )}
//           </FormControl>

//           <FormControl sx={{ mb: 3 }}>
//             <FormLabel>Confirm Password <Typography component="span" color="danger">*</Typography></FormLabel>
//             <Input
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChange={(e) => {
//                 setConfirmPassword(e.target.value);
//                 validateConfirmPassword(e.target.value);
//               }}
//               type={showConfirmPassword ? 'text' : 'password'}
//               required
//               startDecorator={<Lock />}
//               endDecorator={
//                 <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                   {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               }
//             />
//             {confirmPasswordError && (
//               <Typography color="danger" fontSize="sm">
//                 {confirmPasswordError}
//               </Typography>
//             )}
//           </FormControl>

//           <Button type="submit" fullWidth sx={{ mt: 2, py: 1.5 }}>
//             Sign Up
//           </Button>

//           {error && (
//             <Alert color="danger" sx={{ mt: 2 }}>
//               {error}
//             </Alert>
//           )}
//           {success && (
//             <Alert color="success" sx={{ mt: 2 }}>
//               {success}
//             </Alert>
//           )}

//           <Typography level="body-md" sx={{ mt: 3, textAlign: 'center' }}>
//             Already have an account?{' '}
//             <Typography
//               component="a"
//               href="/user-login"
//               color="primary"
//               sx={{ cursor: 'pointer', fontWeight: 'bold' }}
//             >
//               Log In
//             </Typography>
//           </Typography>
//         </Box>
//       </Box>
//     </CssVarsProvider>
//   );
// }



"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  CssVarsProvider,
  extendTheme,
} from '@mui/joy';
import { Visibility, VisibilityOff, Person, Email, Phone, Lock } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from '../../config';
import { Textarea } from '@mui/joy';


// Custom theme
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#e0f2f1',
          100: '#b2dfdb',
          200: '#80cbc4',
          300: '#4db6ac',
          400: '#26a69a',
          500: '#009688',
          600: '#00897b',
          700: '#00796b',
          800: '#00695c',
          900: '#004d40',
        },
      },
    },
  },
  components: {
    JoyInput: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phoneNumber: '',
    email: '',
    sport: '',
    password: '',
    confirmPassword: '',
    bio: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [nameError, setNameError] = useState<string | null>(null); // New state for name validation
  const [emailError, setEmailError] = useState<string | null>(null); // Email error state
  const [phoneError, setPhoneError] = useState<string | null>(null); // Phone error state
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const inputStyle = {
    'input[type="password"]::-webkit-textfield-decoration-container': {
      display: 'none',
    },
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^\d{11}$/; // 11-digit phone number validation
    return phoneRegex.test(number);
  };

  const passwordRegex = /^[A-Za-z\d@$!%*#?&]{8,16}$/;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  
    // Name validation
    if (name === 'name') {
      const alphanumericNameRegex = /^[a-zA-Z\s]*$/;
      setNameError(
        !alphanumericNameRegex.test(value) ? 'Name should contain only alphabets.' : null
      );
    }
  
    // Email validation
    if (name === 'email') {
      setEmailError(!validateEmail(value) ? 'Please enter a valid email address.' : null);
    }
  
    // Phone number validation
    if (name === 'phoneNumber') {
      setPhoneError(!validatePhoneNumber(value) ? 'Please enter a valid phone number.' : null);
    }
  
    // Password validation
    if (name === 'password') {
      setPasswordError(
        !passwordRegex.test(value)
          ? 'Password must be 8-16 characters long'
          : null
      );
  
      // Check confirmPassword after changing password
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setConfirmPasswordError('Passwords do not match.');
      } else {
        setConfirmPasswordError(null); // Clear error if they match
      }
    }
  
    // Confirm password validation
    if (name === 'confirmPassword') {
      setConfirmPasswordError(
        value !== formData.password ? 'Passwords do not match.' : null
      );
    }
  };
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (passwordError || confirmPasswordError || nameError || emailError || phoneError) {
      setError('Please fix the errors before submitting.');
      return;
    }


    const requiredFields = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      gender: formData.gender,
      sport: formData.sport,
      bio: formData.bio,
    };

    try {
      const response = await axios.post(`${Domain_URL}/coach/createCoache`, requiredFields);
      
      if (response.status === 201) {
        setSuccess('Coach registered successfully!');
        setTimeout(() => navigate('/Coach-login'), 2000);
      }
    } catch (error: any) {
      if (error.response) {
        // Handle specific status codes
        const { status } = error.response;
    
        if (status === 400) {
          setError('This email is already registered.');
        } else if (status === 404) {
          setError('The gateway is incorrect. Please check the URL.');
        } else if (status === 500) {
          setError('The server is currently offline. Please try again later.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else if (error.request) {
        // Network error or no response received
        setError('No response from the server. Please check your connection.');
      } else {
        // Any other errors (like code issues)
        setError(`An error occurred: ${error.message}`);
      }
      
      console.error('Error during sign-up:', error);
    }
  };

  return (
    <CssVarsProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 2,
          background: 'url("/placeholder.svg?height=1080&width=1920") no-repeat center center fixed',
          backgroundSize: 'cover',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
            borderRadius: 'xl',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'lg',
          }}
        >
          <Typography level="h4" component="h1" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
           Create an Account
          </Typography>

          {error && (
            <Alert color="danger" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert color="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

           <FormControl sx={{ mb: 2 }}>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              startDecorator={<Person />}
            />
            {nameError && (
              <Typography color="danger" fontSize="sm">
                {nameError}
              </Typography>
            )}
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Gender</FormLabel>
            <select
              name="gender"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '16px',
                backgroundColor: 'white',
              }}
              value={formData.gender}
              onChange={(e) => handleChange(e as any)}
            >
              <option value="" disabled hidden>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>
              Phone Number <Typography component="span" color="danger">*</Typography>
            </FormLabel>
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => {
                if (e.target.value.length <= 11) {
                  handleChange(e);
                }
              }}
              required
              startDecorator={<Phone />}
            />
            {phoneError && (
              <Typography color="danger" fontSize="sm">
                {phoneError}
              </Typography>
            )}
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>
              Email <Typography component="span" color="danger">*</Typography>
            </FormLabel>
            <Input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              startDecorator={<Email />}
            />
            {emailError && (
              <Typography color="danger" fontSize="sm">
                {emailError}
              </Typography>
            )}
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Sport</FormLabel>
            <select
              name="sport"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '16px',
                backgroundColor: 'white',
              }}
              value={formData.sport}
              onChange={(e) => handleChange(e as any)}
            >
              <option value="" disabled hidden>
                Select Sport
              </option>
              <option value="Cricket">Cricket</option>
            </select>
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Bio</FormLabel>
            <Textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  handleChange(e);
                }
              }}
              minRows={2}
            />
            <Typography
              level="body-sm"
              sx={{
                backgroundColor: 'white',
                mt: 1,
                textAlign: 'right',
                px: 1, // Adds padding for better readability
                borderRadius: '4px', // Optional: rounds the edges slightly
              }}
            >
              {formData.bio.length}/500
            </Typography>
          </FormControl>

          <div style={inputStyle}> {/* Apply CSS styling */}
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>
          Password <Typography component="span" color="danger">*</Typography>
        </FormLabel>
        <Input
          name="password"
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          required
          startDecorator={<Lock />}
          endDecorator={
            <Button
              onClick={() => setShowPassword(!showPassword)}
              sx={{
                minWidth: 'auto',
                p: 0,
                backgroundColor: 'transparent',
                color: 'primary.500',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </Button>
          }
        />
        {passwordError && <Typography color="danger">{passwordError}</Typography>}
      </FormControl>

      <FormControl sx={{ mb: 2 }}>
        <FormLabel>
          Confirm Password <Typography component="span" color="danger">*</Typography>
        </FormLabel>
        <Input
          name="confirmPassword"
          placeholder="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          startDecorator={<Lock />}
          endDecorator={
            <Button
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              sx={{
                minWidth: 'auto',
                p: 0,
                backgroundColor: 'transparent',
                color: 'primary.500',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </Button>
          }
        />
        {confirmPasswordError && <Typography color="danger">{confirmPasswordError}</Typography>}
      </FormControl>
      </div>
          <Button type="submit" fullWidth sx={{ mt: 2, py: 1.5 }}>
            Sign Up
          </Button>

          <Typography level="body-md" sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <Typography component="a" href="/Coach-login" fontWeight="bold" color="primary">
              Log In
            </Typography>
          </Typography>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default RegistrationForm;


