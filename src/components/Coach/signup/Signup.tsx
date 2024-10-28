import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Box } from '@mui/material';
import { Container, Typography, Button, Input } from '@mui/joy';
import { Domain_URL } from '../../config';

interface FormData {
  name: string;
  gender: string;
  phoneNumber: string;
  email: string;
  sport: string; 
  password: string;
  confirmPassword?: string;
  bio?: string; 
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: '',
    phoneNumber: '',
    email: '',
    sport: '', 
    password: '',
    confirmPassword: '',
    bio: '', 
  });

  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Updated regex for alphanumeric, special characters, and length 8-16
    const alphanumericNameRegex = /^[a-zA-Z0-9]*$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;

    if (!alphanumericNameRegex.test(formData.name)) {
      setError('Name should be alphanumeric.');
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError('Password must be 8-16 characters long, containing letters, numbers, and special characters.');
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
      const response = await axios.post(
        `${Domain_URL}/coach/createCoache`,
        requiredFields,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      navigate('/Coach-login'); 
    } catch (error) {
      console.error(error);
      setError('An error occurred during sign-up. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg"> 
      <Box 
        sx={{ 
          padding: 3, 
          borderRadius: '8px', 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
          backgroundColor: 'background.body',
          width: '380px', 
          marginLeft: '400px' ,
        
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Coach Sign Up</h2>
        <br></br>

        {error && (
          <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <Input
              fullWidth
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{
                backgroundColor: 'white'
               
              }}
            />
          </Box>


          <Box sx={{ mb: 2 }}>
  <select
    style={{
      width: '100%',
      padding: '8px',
      background: 'transparent',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '16px',
      outline: 'none',
      appearance: 'none',
      backgroundColor: 'white',
      color: formData.gender ? 'black' : '#a9a9a9', // Gray text for placeholder effect
    }}
    defaultValue=""
    onChange={(e) => {
      setFormData({ ...formData, gender: e.target.value });
    }}
  >
    <option value="" disabled hidden>
      Gender
    </option>
    <option value="male">Male</option>
    <option value="female">Female</option>
  </select>
</Box>

          


          <Box sx={{ mb: 2 }}>
            <Input
              fullWidth
              placeholder="Phone Number *"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              sx={{
                backgroundColor: 'white'
               
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Input
              fullWidth
              placeholder="Email *"
              name="email"
              type=""
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                backgroundColor: 'white'
               
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
  <select
    style={{
      width: '100%',
      padding: '8px',
      background: 'transparent',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '16px',
      outline: 'none',
      appearance: 'none',
      backgroundColor: 'white',
      color: formData.sport ? 'black' : '#a9a9a9', // Gray text for placeholder effect
    }}
    value={formData.sport}
    onChange={(e) => {
      setFormData({ ...formData, sport: e.target.value });
    }}
    required
  >
    <option value="" disabled selected hidden>
      Select Sport
    </option>
    <option value="Cricket">Cricket</option>
   
  </select>
</Box>


<Box sx={{ mb: 2 }}>
  <TextField
    fullWidth
    placeholder="Bio "
    name="bio"
    value={formData.bio}
    onChange={handleChange}
    inputProps={{ maxLength: 500 }}
    variant="standard"
    sx={{
      backgroundColor: 'white',
      '& .MuiInput-underline:before': {
        borderBottom: 'none', // Remove the underline before focusing
      },
      '& .MuiInput-underline:after': {
        borderBottom: 'none', // Remove the underline after focusing
      },
      '& .MuiInput-underline:hover:before': {
        borderBottom: 'none', // Remove underline on hover
      },
    }}
    
  />
</Box>


          <Box sx={{ mb: 2 }}>
            <Input
              fullWidth
              placeholder="Password *"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{
                backgroundColor: 'white'
               
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }} >
            <Input
              fullWidth
              placeholder="Confirm Password *"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{
                backgroundColor: 'white'
                
              }}
            />
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="solid"
            color="primary"
          >
            Sign Up
          </Button>
        </form>

        <Typography level="body-md" sx={{ mt: 3, textAlign: 'center' }}>
          Already have an account?{' '}
          <Typography
            component="a"
            href="/Coach-login"
            fontWeight="bold"
            color="primary"
          >
            Log In
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignUp;
