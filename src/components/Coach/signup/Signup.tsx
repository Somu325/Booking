// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { TextField, Box } from '@mui/material';
// import { Container, Typography, Button, Input } from '@mui/joy';
// import { Domain_URL } from '../../config';

// interface FormData {
//   name: string;
//   gender: string;
//   phoneNumber: string;
//   email: string;
//   sport: string; 
//   password: string;
//   confirmPassword?: string;
//   bio?: string; 
// }

// const SignUp: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     gender: '',
//     phoneNumber: '',
//     email: '',
//     sport: '', 
//     password: '',
//     confirmPassword: '',
//     bio: '', 
//   });

//   const [error, setError] = useState('');
//   const navigate = useNavigate(); 

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Updated regex for alphanumeric, special characters, and length 8-16
//     const alphanumericNameRegex = /^[a-zA-Z0-9]*$/;
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;

//     if (!alphanumericNameRegex.test(formData.name)) {
//       setError('Name should be alphanumeric.');
//       return;
//     }

//     if (!passwordRegex.test(formData.password)) {
//       setError('Password must be 8-16 characters long, containing letters, numbers, and special characters.');
//       return;
//     }

//     const requiredFields = {
//       name: formData.name,
//       email: formData.email,
//       phoneNumber: formData.phoneNumber,
//       password: formData.password,
//       gender: formData.gender,
//       sport: formData.sport,
//       bio: formData.bio, 
//     };

//     try {
//       const response = await axios.post(
//         `${Domain_URL}/coach/createCoache`,
//         requiredFields,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       console.log(response.data);
//       navigate('/Coach-login'); 
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred during sign-up. Please try again.');
//     }
//   };

//   return (
//     <Container maxWidth="lg"> 
//       <Box 
//         sx={{ 
//           padding: 3, 
//           borderRadius: '8px', 
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
//           backgroundColor: 'background.body',
//           width: '380px', 
//           marginLeft: '400px' ,
        
//         }}
//       >
//         <h2 style={{ textAlign: 'center' }}>Coach Sign Up</h2>
//         <br></br>

//         {error && (
//           <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <Box sx={{ mb: 2 }}>
//             <Input
//               fullWidth
//               placeholder="Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               sx={{
//                 backgroundColor: 'white'
               
//               }}
//             />
//           </Box>


//           <Box sx={{ mb: 2 }}>
//   <select
//     style={{
//       width: '100%',
//       padding: '8px',
//       background: 'transparent',
//       borderRadius: '4px',
//       border: '1px solid #ccc',
//       fontSize: '16px',
//       outline: 'none',
//       appearance: 'none',
//       backgroundColor: 'white',
//       color: formData.gender ? 'black' : '#a9a9a9', // Gray text for placeholder effect
//     }}
//     defaultValue=""
//     onChange={(e) => {
//       setFormData({ ...formData, gender: e.target.value });
//     }}
//   >
//     <option value="" disabled hidden>
//       Gender
//     </option>
//     <option value="male">Male</option>
//     <option value="female">Female</option>
//   </select>
// </Box>

          


//           <Box sx={{ mb: 2 }}>
//             <Input
//               fullWidth
//               placeholder="Phone Number *"
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               required
//               sx={{
//                 backgroundColor: 'white'
               
//               }}
//             />
//           </Box>

//           <Box sx={{ mb: 2 }}>
//             <Input
//               fullWidth
//               placeholder="Email *"
//               name="email"
//               type=""
//               value={formData.email}
//               onChange={handleChange}
//               required
//               sx={{
//                 backgroundColor: 'white'
               
//               }}
//             />
//           </Box>

//           <Box sx={{ mb: 2 }}>
//   <select
//     style={{
//       width: '100%',
//       padding: '8px',
//       background: 'transparent',
//       borderRadius: '4px',
//       border: '1px solid #ccc',
//       fontSize: '16px',
//       outline: 'none',
//       appearance: 'none',
//       backgroundColor: 'white',
//       color: formData.sport ? 'black' : '#a9a9a9', // Gray text for placeholder effect
//     }}
//     value={formData.sport}
//     onChange={(e) => {
//       setFormData({ ...formData, sport: e.target.value });
//     }}
//     required
//   >
//     <option value="" disabled selected hidden>
//       Select Sport
//     </option>
//     <option value="Cricket">Cricket</option>
   
//   </select>
// </Box>


// <Box sx={{ mb: 2 }}>
//   <TextField
//     fullWidth
//     placeholder="Bio "
//     name="bio"
//     value={formData.bio}
//     onChange={handleChange}
//     inputProps={{ maxLength: 500 }}
//     variant="standard"
//     sx={{
//       backgroundColor: 'white',
//       '& .MuiInput-underline:before': {
//         borderBottom: 'none', // Remove the underline before focusing
//       },
//       '& .MuiInput-underline:after': {
//         borderBottom: 'none', // Remove the underline after focusing
//       },
//       '& .MuiInput-underline:hover:before': {
//         borderBottom: 'none', // Remove underline on hover
//       },
//     }}
    
//   />
// </Box>


//           <Box sx={{ mb: 2 }}>
//             <Input
//               fullWidth
//               placeholder="Password *"
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               sx={{
//                 backgroundColor: 'white'
               
//               }}
//             />
//           </Box>

//           <Box sx={{ mb: 2 }} >
//             <Input
//               fullWidth
//               placeholder="Confirm Password *"
//               name="confirmPassword"
//               type="password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               sx={{
//                 backgroundColor: 'white'
                
//               }}
//             />
//           </Box>

//           <Button
//             fullWidth
//             type="submit"
//             variant="solid"
//             color="primary"
//           >
//             Sign Up
//           </Button>
//         </form>

//         <Typography level="body-md" sx={{ mt: 3, textAlign: 'center' }}>
//           Already have an account?{' '}
//           <Typography
//             component="a"
//             href="/Coach-login"
//             fontWeight="bold"
//             color="primary"
//           >
//             Log In
//           </Typography>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default SignUp;


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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

   const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const alphanumericNameRegex = /^[a-zA-Z\s]*$/; // Updated to allow only letters and spaces
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;

    if (!alphanumericNameRegex.test(formData.name)) {
    setError('Name should contain only letters and spaces.');
   return;
   }
 
     if (!passwordRegex.test(formData.password)) {
     setError('Password must be 8-16 characters long, containing letters, numbers, and special characters.');
   return;
   }

    if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match.');
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
        setSuccess('User registered successfully!');
        setTimeout(() => navigate('/Coach-login'), 2000);
      }
    } catch (error) {
      setError('An error occurred during sign-up. Please try again.');
      console.error(error);
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
              required
              startDecorator={<Person />}
            />
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
             if (e.target.value.length <= 10) {
            handleChange(e);
             }
            }}
          required
            startDecorator={<Phone />}
            />
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
          </FormControl>

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
