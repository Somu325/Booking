import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Screen from "./components/UserPro/dashboard/Screen";
import LoginForm from "./components/UserPro/login/LoginForm";
import ResetPassword from "./components/UserPro/login/ResetPassword";
import RegistrationForm from "./components/UserPro/signup/RegistrationForm";
import SendEmailOTP from "./components/UserPro/login/SendEmailOTP";
import LandingPage from "./components/UserPro/LandingPage/LandingPage";
import SlotBooking from "./components/UserPro/SlotBooking/SlotBooking";
import UserProfile from "./components/UserPro/dashboard/Profile";


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/user-login" element={<LoginForm />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/SignUp" element={<RegistrationForm />} />
        <Route path="/Sendotp" element={<SendEmailOTP />} />
        <Route path="/screen" element={<Screen />} />
        <Route path="/selectslot/:coachId" element={<SlotBooking />} />
        <Route path="/userprofile" element={<UserProfile />} />
     
      </Routes>
    </Router>
  );
}

export default App;
