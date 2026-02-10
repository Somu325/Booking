"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnvelopeFill, LockFill, EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { Domain_URL } from "../../config";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  interface CustomJwtPayload extends JwtPayload {
    role: string;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const { data } = await axios.post(`${Domain_URL}/user/login`, { email, password });
      console.log("Login successful:", data);
  
      localStorage.setItem("useremail", data.user.email);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.name);
  
      if (data.token) {
        Cookies.set("Usertoken", data.token, {
          expires: 1, // 1 day
          secure: true,
          sameSite: "strict",
        });
        console.log("Token stored in cookie:", Cookies.get("Usertoken"));
  
        // Decode the JWT token to extract the user role
        const decodedToken : CustomJwtPayload= jwtDecode(data.token);
        const userRole = decodedToken.role; 
        console.log(userRole)// Assuming 'role' is stored in the token
  
        // Store the role in localStorage (optional but useful for global access)
        localStorage.setItem("role", userRole);
  
        // Navigate based on role
        if (userRole === 'user') {
          navigate(data.user.verified === false ? "/verifyemail" : "/screen");
        } else if (userRole === 'admin') {
          navigate("/dashboard"); // Admin route
        } else if (userRole === 'coach') {
          navigate("/Coach-Dashboard"); // Coach route
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
  
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          if (status === 401) setError("Incorrect email or password.");
          else if (status === 404) setError("You are not registered. Please sign up.");
          else if (status === 500) setError("The server is currently offline. Please try again later.");
          else if (status === 403) setError("Your account is currently not available. Please contact Admin for help.");
          else setError("An unexpected error occurred. Please try again.");
        } else if (error.request) {
          setError("The server is currently offline. Please try again later.");
        } else {
          setError("An error occurred while logging in. Please try again.");
        }
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] bg-cover p-4"
    >
      <div className="w-full max-w-xs">
        <div
          className="flex flex-col items-center bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
        >
          <img src="/cric.jpg" alt="Logo" width={100} height={100} className="mb-4 rounded-full" />
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
            Welcome
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Sign in to continue your journey
          </p>

          {error && (
            <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-[50px] relative mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-2 w-full">
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeFill color="#6C63FF" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                placeholder="Enter Email.."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-10 pr-3 rounded-[50px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent"
              />
            </div>

            <div className="mb-2 relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockFill color="#6C63FF" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-10 rounded-[50px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer bg-transparent border-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                 {showPassword ? <EyeSlashFill color="#6C63FF" /> : <EyeFill color="#6C63FF" />}
              </button>
            </div>

            <div className="text-right mb-4">
              <a href="/Sendotp" className="text-[#6C63FF] hover:underline text-sm font-medium">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#6C63FF] hover:bg-[#5a52d5] text-white font-semibold rounded-[50px] shadow-md focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-opacity-75 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Sign In"}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a href="/SignUp" className="text-[#FF6584] hover:underline font-medium">
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
