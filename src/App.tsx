// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Screen from "./components/UserPro/dashboard/Screen";
// import LoginForm from "./components/UserPro/login/LoginForm";
// import ResetPassword from "./components/UserPro/login/ResetPassword";
// import RegistrationForm from "./components/UserPro/signup/RegistrationForm";
// import SendEmailOTP from "./components/UserPro/login/SendEmailOTP";
// import Verifyprofile from "./components/UserPro/dashboard/Verifyprofile";
// import LandingPage from "./components/UserPro/LandingPage/LandingPage";
// import SlotBooking from "./components/UserPro/SlotBooking/SlotBooking";
// import UserProfile from "./components/UserPro/dashboard/Profile";
// import Login from "./components/admin/AdminLogin/Login";
// import Dashboard from "./components/admin/Dashboard/Dashboard";
// import AdminOverview from "./components/admin/AdminOverview/AdminOverview";
// import RealTime from "./components/admin/RealTimeAnalytics/RealTime";
// import ManageCoach from "./components/admin/ManageCoach/ManageCoach";
// import ManageUser from "./components/admin/user/ManageUser";
// import BookingList from "./components/admin/BookingList/BookingList";
// import CoachProfile from "./components/Coach/Coachprofile/Coachprofile";
// import Loginn from "./components/Coach/login/Login";
// import Reset from "./components/Coach/Resetpassword/Resetpassword";
// import SendOtpp from "./components/Coach/Resetpassword/Sendemailotp";
// import Sign from "./components/Coach/signup/Signup";
// import CoachAnalytics from "./components/Coach/CoachAnalytics/CoachAnalytics"
// import BookingHistory from "./components/UserPro/BookingHistory/BookingHistory";
// import CoachVerification from "./components/Coach/Coachprofile/coachverification";
// import Schedule from "./components/GenerateWeeklySlots/scheduler";
// import Coachdashboard from "./components/Coach/Homepage/Homepage";
// import BookingTable from "./components/admin/Booking-cancel/Bookingcancel";


// //import CombinedApp1 from "./components/Coach/Homepage/Homepage1";



// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* //user login */}
//       <Route path="/" element={<LandingPage />} />
//         <Route path="/user-login" element={<LoginForm />} />
//         <Route path="/ResetPassword" element={<ResetPassword />} />
//         <Route path="/SignUp" element={<RegistrationForm />} />
//         <Route path="/verifyemail" element={<Verifyprofile />} />
//         <Route path="/Sendotp" element={<SendEmailOTP />} />

//         {/* user-screens */}
//         <Route path="/screen" element={<Screen />} />
//         <Route path="/booking-history" element={<BookingHistory/>}/>
//         <Route path="/selectslot/:coachId" element={<SlotBooking />} />
//         <Route path="/userprofile" element={<UserProfile />} />


//          {/* coachlogin */}
//         <Route path="/Coach-login" element={<Loginn />} />  
//         <Route path="/Coach-Signup" element={<Sign />} />
//         <Route path="/Reset-password" element={<Reset />} />
//         <Route path="/Email-Otpp" element={<SendOtpp />} />

//         {/* coachscreens */}
//         <Route path="/Schedule" element={<Schedule/>} />
//         <Route path="/Coach-Profile" element={<CoachProfile />} />
//         <Route path="/Coach-Dashboard" element={<Coachdashboard />} />
//         <Route path="/Coach-Analytics" element={<CoachAnalytics />} />
//         {/* <Route path="/Week-Slots" element={<Generateslots/>} /> */}
//         <Route path="/coach-verify" element={<CoachVerification/>} />

//         {/* admin-login */}
//         <Route path="/Adminlogin" element={<Login />} />

//          {/* admin-screens */}
//         <Route path="/dashboard" element={<Dashboard/>} />
//         <Route path="/AdminOverview" element={<AdminOverview/>} />
//         <Route path="/Analyst" element={<RealTime/>} />
//         <Route path="/ManageCoach" element={<ManageCoach/>} />
//         <Route path="/ManageUser" element={<ManageUser/>} />
//         <Route path="/Booking" element={<BookingList/>} />
//         <Route path="/Booking-cancel" element={<BookingTable/>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import CoachAnalytics from "./components/Coach/CoachAnalytics/CoachAnalytics";
import BookingHistory from "./components/UserPro/BookingHistory/BookingHistory";
import CoachVerification from "./components/Coach/Coachprofile/coachverification";
import Schedule from "./components/GenerateWeeklySlots/scheduler";
import Coachdashboard from "./components/Coach/Homepage/Homepage";
import BookingTable from "./components/admin/Booking-cancel/Bookingcancel";
import ProtectedRoute from "./components/UserProtectedRoutes";
import ProtectedCoachRoute from "./components/CoachProtectedRoutes"; // Import ProtectedCoachRoute
import ProtectedAdminRoute from "./components/adminProtectedRoute"; // Import ProtectedAdminRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-login" element={<LoginForm />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/SignUp" element={<RegistrationForm />} />
        <Route path="/verifyemail" element={<Verifyprofile />} />
        <Route path="/Sendotp" element={<SendEmailOTP />} />

        {/* Protected User Routes */}
        <Route
          path="/screen"
          element={
            <ProtectedRoute role="user">
              <Screen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-history"
          element={
            <ProtectedRoute role="user">
              <BookingHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/selectslot/:coachId"
          element={
            <ProtectedRoute role="user">
              <SlotBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userprofile"
          element={
            <ProtectedRoute role="user">
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Coach Routes */}
        <Route path="/Coach-login" element={<Loginn />} />
        <Route path="/Coach-Signup" element={<Sign />} />
        <Route path="/Reset-password" element={<Reset />} />
        <Route path="/Email-Otpp" element={<SendOtpp />} />

        {/* Protected Coach Routes */}
        <Route
          path="/Schedule"
          element={
            <ProtectedCoachRoute>
              <Schedule />
            </ProtectedCoachRoute>
          }
        />
        <Route
          path="/Coach-Profile"
          element={
            <ProtectedCoachRoute>
              <CoachProfile />
            </ProtectedCoachRoute>
          }
        />
        <Route
          path="/Coach-Dashboard"
          element={
            <ProtectedCoachRoute>
              <Coachdashboard />
            </ProtectedCoachRoute>
          }
        />
        <Route
          path="/Coach-Analytics"
          element={
            <ProtectedCoachRoute>
              <CoachAnalytics />
            </ProtectedCoachRoute>
          }
        />
        <Route
          path="/coach-verify"
          element={
            <ProtectedCoachRoute>
              <CoachVerification />
            </ProtectedCoachRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/Adminlogin" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/AdminOverview" element={<AdminOverview />} />
          <Route path="/Analyst" element={<RealTime />} />
          <Route path="/ManageCoach" element={<ManageCoach />} />
          <Route path="/ManageUser" element={<ManageUser />} />
          <Route path="/Booking" element={<BookingList />} />
          <Route path="/Booking-cancel" element={<BookingTable />} />
        </Route>

        {/* Redirect to login if not authenticated */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
