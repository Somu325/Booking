


"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { EnvelopeFill, LockFill, EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { Domain_URL } from "../../config";
import Cookies from "js-cookie";

// Theme customization for Material-UI components
const theme = createTheme({
  palette: {
    primary: { main: "#6C63FF" },
    secondary: { main: "#FF6584" },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
          },
        },
      },
    },
  },
});

const LoginForm = () => {
  // State variables for email, password, error messages, loading status, and password visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle form submission for login
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);    // Set loading state to show spinner
    setError(""); // Reset error state

    try {
      // API request to authenticate user
      const { data } = await axios.post(`${Domain_URL}/user/login`, { email, password });
      console.log("Login successful:", data);

      // Store user details in local storage
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("userId", data.user.id);

      // Store authentication token in a secure cookie
      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 1, // Token expiry time (1 day)
          secure: true, // Ensure token is only sent over HTTPS
          sameSite: "strict", // Prevent CSRF attacks
        });
        console.log("Token stored in cookie:", Cookies.get("token"));
      }

      // Redirect user based on email verification status
      navigate(data.user.verified === false ? "/verifyemail" : "/screen");
    } catch (error) {
      console.error("Login failed:", error);

      // Error handling based on Axios error response
      if (axios.isAxiosError(error)) {
      if (error.response) {
    // Server responded with a status code outside the 2xx range
    const status = error.response.status;
    if (status === 401) {
      setError("Incorrect email or password.");
    } else if (status === 404) {
      setError("You are not registered. Please sign up.");
    } else if (status === 500) {
      setError("The server is currently offline. Please try again later.");
    } else if (status === 403) {
      setError("Your account is currently not available. Please contact Admin for help.");
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  } else if (error.request) {
    setError("The server is currently offline. Please try again later.");
  } else {
    setError("An error occurred while logging in. Please try again.");
  }
} else {
  setError("An error occurred. Please try again later.");
}
    };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          backgroundSize: "cover",
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              padding: 4,
              borderRadius: 4,
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            {/* Logo and title for the login page */}
            <img src="/cric.jpg" alt="Logo" width={100} height={100} style={{ marginBottom: "16px" }} />
            <Typography component="h1" variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              Welcome
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              Sign in to continue your journey
            </Typography>

            {/* Display error message if login fails */}
            {error && <Alert severity="error" sx={{ borderRadius: "50px", mb: 2 }}>{error}</Alert>}
            
            {/* Form to input email and password */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
              {/* Email input field */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                placeholder="Enter Email.."
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EnvelopeFill color="#6C63FF" />
                    </InputAdornment>
                  ),
                }}
              />
              {/* Password input field with visibility toggle */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockFill color="#6C63FF" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <EyeSlashFill color="#6C63FF" /> : <EyeFill color="#6C63FF" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* Forgot password link */}
              <Button
                component="a"
                href="/Sendotp"
                variant="text"
                sx={{ textAlign: "right", display: "block", mt: 1 }}
              >
                Forgot Password?
              </Button>
              {/* Submit button with loading indicator */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
              </Button>
              {/* Link to sign-up page */}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  Don&apos;t have an account?{" "}
                  <Button component="a" href="/SignUp" variant="text" color="secondary">
                    Sign Up
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;

