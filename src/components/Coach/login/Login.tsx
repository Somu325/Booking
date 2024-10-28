import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from '../../config';
import Cookies from 'js-cookie'; // Include js-cookie for token handling
import {
  Box,
  Button,
  Input,
  Container,
  Link,
  CircularProgress,
} from '@mui/joy';
import Email from '@mui/icons-material/Email'; // Email icon
import Lock from '@mui/icons-material/Lock'; // Lock icon

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(''); // Error state
  const navigate = useNavigate(); // Initialize navigation

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Enable loading state
    setError(''); // Reset error message

    try {
      const response = await axios.post(
        `${Domain_URL}/coach/coachLogin`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Login successful:', response.data);

      // Store coach data in local storage
      localStorage.setItem('coachId', response.data.coach.coachId);
      localStorage.setItem('email', response.data.coach.email);

      // Store token in cookies (if provided)
      if (response.data.token) {
        Cookies.set('token', response.data.token, {
          expires: 1, // 1-day expiration
          secure: true, // Use HTTPS in production
          sameSite: 'strict', // Prevent CSRF attacks
        });
        console.log('Token stored:', Cookies.get('token'));
      }

      // Navigate to Coach Dashboard on success
      navigate('/Coach-Dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false); // Disable loading state
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '350px',
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
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          width: '400px',
          minHeight: '400px',
        }}
      >
        <h1 style={{ marginBottom: '16px', fontSize: '2rem' }}>Welcome Back!</h1>
        <p style={{ marginBottom: '16px', color: 'gray' }}>Sign in to continue</p>

        {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          <Input
            fullWidth
            placeholder="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            sx={{ mb: 2, backgroundColor: 'background.surface' }}
            startDecorator={<Email />}
          />
          <Input
            fullWidth
            placeholder="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            sx={{ mb: 2, backgroundColor: 'background.surface' }}
            startDecorator={<Lock />}
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
