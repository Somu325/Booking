"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnvelopeFill, LockFill, EyeFill, EyeSlashFill, ArrowLeft } from "react-bootstrap-icons";
import { Domain_URL } from "../../config";
import Cookies from "js-cookie";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${Domain_URL}/coach/coachLogin`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Login successful:', response.data);

      localStorage.setItem('coachId', response.data.coach.coachId);
      localStorage.setItem('email', response.data.coach.email);
      localStorage.setItem('coachName', response.data.coach.name);

      if (response.data.token) {
        Cookies.set('Coachtoken', response.data.token, {
          expires: 1,
          secure: true,
          sameSite: 'strict',
        });
        console.log('Token stored:', Cookies.get('Coachtoken'));
      }

      if (response.data.coach.emailVerified === true) {
        navigate('/Coach-Dashboard');
      } else {
        navigate('/coach-verify');
      }

    } catch (error) {
      console.error('Login error:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            setError('Incorrect Email OR Password');
          } else if (error.response.status === 404) {
            setError('You are not registered. Please sign up.');
          } else if (error.response.status === 500) {
            setError('The server is currently offline. Please try again later.');
          } else if(error.response.status === 403){
            setError('Your Account is Currently not avaliable . Please contact Admin for futher process');
          } else {
            setError('An unexpected error occurred. Please try again.');
          }
        } else if (error.request) {
          setError('No response from the server. Please check your connection.');
        } else {
          setError('An error occurred while logging in. Please try again.');
        }
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white p-6 font-sans text-slate-900"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 p-2 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors duration-300"
        aria-label="Change role"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Change role</span>
      </button>

      <div className="w-full max-w-[400px]">
        <div
          className="flex flex-col items-center bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm"
        >
          <img src="/cric.jpg" alt="Logo" width={80} height={80} className="mb-6 rounded-full" />
          <h1 className="text-3xl font-light tracking-tight mb-2 text-center text-slate-900">
            Welcome back
          </h1>
          <p className="text-slate-500 mb-8 text-center text-sm">
            Sign in to your Coach account
          </p>

          {error && (
            <div className="w-full bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl relative mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                <EnvelopeFill />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                <LockFill />
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
                 className="w-full py-3.5 pl-11 pr-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all duration-200"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer bg-transparent border-none text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                 {showPassword ? <EyeSlashFill /> : <EyeFill />}
              </button>
            </div>

            <div className="text-right">
              <a href="/Email-Otpp" className="text-indigo-600 hover:text-indigo-800 text-xs font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-lg shadow-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Sign In"}
            </button>

            <div className="text-center mt-8 pt-4 border-t border-slate-50">
              <p className="text-sm text-slate-500">
                No account yet?{" "}
                <a href="/Coach-signup" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  Create one
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
