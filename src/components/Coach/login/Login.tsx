import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from '../../config';
import {
  Box,
  Button,
  Input,
  Container,
  Link,
  CircularProgress,
  
} from '@mui/joy';
import Email from '@mui/icons-material/Email'; // Import email icon
import Lock from '@mui/icons-material/Lock'; // Import lock icon

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // State to handle loading
  const [error, setError] = useState<string>(''); // State for error message
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting
    setError(''); // Reset error message on submit

    try {
      const response = await axios.post(`${Domain_URL}/coach/coachLogin`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Login successful:', response.data);

      // Save coach ID and email to local storage
      localStorage.setItem('coachId', response.data.coach.coachId);
      localStorage.setItem('email', response.data.coach.email);

      // Navigate to the home page after successful login
      navigate('/Coach-Profile'); // Change '/Homepage' to your actual home route
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Reset loading state after attempt
    }
  };
  {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}


  return (
    <Container
      maxWidth="sm" 
      sx={{
        height: '100vh', // Full viewport height
        display: 'flex',  // Enable flexbox
        flexDirection: 'column',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        marginLeft: '350px'
        
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          backgroundColor: 'background.body',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Add shadow for better aesthetics
          borderRadius: '8px', // Rounded corners
          width: '400px', // Card width
          minHeight: '400px', // Increase card height
        }}
      >
        <h1 style={{ marginBottom: '16px', fontSize: '2rem' }}>
          Welcome 
        </h1>
        <p style={{ marginBottom: '16px', color: 'gray' }}>
          Sign in to continue
        </p>

        

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          <Input
            fullWidth
            placeholder="Email"
            //type="email"
            value={email}
            onChange={handleEmailChange}
            required
            sx={{ mb: 2, backgroundColor: 'background.surface' }} // Light background for input
            startDecorator={<Email />} // Use Email icon as startDecorator
          />
          <Input
            fullWidth
            placeholder="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            sx={{ mb: 2, backgroundColor: 'background.surface' }} // Light background for input
            startDecorator={<Lock />} // Use Lock icon as startDecorator
          />
          <Link href="/Email-Otpp" sx={{ display: 'block', mb: 2, textAlign: 'right' }}>
            Forgot Password?
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="solid"
            color="primary"
            sx={{ mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size="sm" color="neutral" /> : 'Login'}
          </Button>
          <p style={{ textAlign: 'center', marginBottom: '16px' }}>
            Don't have an account? <Link href="/Coach-signup">Sign Up</Link>
          </p>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
