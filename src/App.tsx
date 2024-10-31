import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Screen from "./components/UserPro/dashboard/Screen";
import LoginForm from "./components/UserPro/login/LoginForm";
import ResetPassword from "./components/UserPro/login/ResetPassword";
import RegistrationForm from "./components/UserPro/signup/RegistrationForm";
import SendEmailOTP from "./components/UserPro/login/SendEmailOTP";
import Verifyprofile from "./components/UserPro/dashboard/Verifyprofile";
import LandingPage from "./components/UserPro/LandingPage/LandingPage";
import SlotBooking from "./components/UserPro/SlotBooking/SlotBooking";
import UserProfile from "./components/UserPro/dashboard/Profile";
import Login from "./components/admin/AdminLogin/Login";
import Dashboard from "./components/admin/Dashboard/Dashboard";
import AdminOverview from "./components/admin/AdminOverview/AdminOverview";
import RealTime from "./components/admin/RealTimeAnalytics/RealTime";
import ManageCoach from "./components/admin/ManageCoach/ManageCoach";
import ManageUser from "./components/admin/user/ManageUser";
import BookingList from "./components/admin/BookingList/BookingList";
import CoachProfile from "./components/Coach/Coachprofile/Coachprofile";
import Loginn from "./components/Coach/login/Login";
import Reset from "./components/Coach/Resetpassword/Resetpassword";
import SendOtpp from "./components/Coach/Resetpassword/Sendemailotp";
import Sign from "./components/Coach/signup/Signup";
import CoachAnalytics from "./components/Coach/CoachAnalytics/CoachAnalytics"
import BookingHistory from "./components/UserPro/BookingHistory/BookingHistory";
import Generateslots from "./components/GenerateWeeklySlots/GenWeekSlots";
import CoachVerification from "./components/Coach/Coachprofile/coachverification";
import Schedule from "./components/GenerateWeeklySlots/scheduler";
import Coachdashboard from "./components/Coach/Homepage/Homepage";


//import CombinedApp1 from "./components/Coach/Homepage/Homepage1";



function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/user-login" element={<LoginForm />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/SignUp" element={<RegistrationForm />} />
        <Route path="/verifyemail" element={<Verifyprofile />} />
        <Route path="/Sendotp" element={<SendEmailOTP />} />
        <Route path="/screen" element={<Screen />} />
        <Route path="/booking-history" element={<BookingHistory/>}/>
        <Route path="/selectslot/:coachId" element={<SlotBooking />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/Coach-login" element={<Loginn />} />  
        <Route path="/Coach-Signup" element={<Sign />} />
        <Route path="/Reset-password" element={<Reset />} />
        <Route path="/Coach-Profile" element={<CoachProfile />} />
        <Route path="/Coach-Dashboard" element={<Coachdashboard />} />
        <Route path="/Email-Otpp" element={<SendOtpp />} />

        <Route path="/Coach-Analytics" element={<CoachAnalytics />} />
        <Route path="/Adminlogin" element={<Login />} />
        <Route path="/Schedule" element={<Schedule/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/AdminOverview" element={<AdminOverview/>} />
        <Route path="/Analyst" element={<RealTime/>} />
        <Route path="/ManageCoach" element={<ManageCoach/>} />
        <Route path="/ManageUser" element={<ManageUser/>} />
        <Route path="/Booking" element={<BookingList/>} />
        <Route path="/Week-Slots" element={<Generateslots/>} />
        <Route path="/coach-verify" element={<CoachVerification/>} />
      </Routes>
    </Router>
  );
}

export default App;
