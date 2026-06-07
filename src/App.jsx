import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { scheduleTokenRefresh } from "./Utils/tokenService.jsx";
import StartTop from "./Component/StartTop.jsx";
import Default from "./Layout/Default";
import Home from "./Page/Home";
import Service from "./Page/Service";
import Profile from "./Page/Profile";
import Login from "./Page/Login";
import Register from "./Page/Register";
import Car from "./Page/Car";
import AiService from "./Page/AiService";
import Bookings from "./Page/Bookings.jsx";
import ForgotPassword from "./Page/ForgotPassword.jsx";
import ResetPassword from "./Page/ResetPassword.jsx";
import Technican from "./Page/Technican.jsx";
import Manager from "./Page/Manager.jsx";
import ProtectedRoute from "./Layout/ProtectedRoute.jsx";
import ServiceDetails from "./Page/ServiceDetails.jsx";
import Privacy from "./Page/Privacy.jsx";
import Terms from "./Page/Terms.jsx";
import FaqItems from "./Page/FaqItems.jsx";
import BookingDetails from "./Page/BookingDetails.jsx";
import AllBookings from "./Page/AllBookings.jsx";
import Error from "./Page/Error.jsx";
import BookingStatus from "./Page/BookingStatus.jsx";
import BookingStatusDetails from "./Page/BookingStatusDetails.jsx";
import UpdateStatus from "./Page/UpdateStatus.jsx";
import AllRating from "./Page/AllRating.jsx";
import ChatBot from "./Page/ChatBot.jsx";
import Landing from "./Page/Landing.jsx";
import Notification from "./Page/Notification.jsx";
import AllTasks from "./Page/AllTasks.jsx";
import BookingDtoManager from "./Page/BookingDtoManager.jsx";

function App() {

  // 🔥 تشغيل auto refresh أول ما الموقع يفتح
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      scheduleTokenRefresh();
    }
  }, []);

  // Google Client ID
  const googleClientId = "704597799772-e3ajullsj3fj5lacb60gj81jiouerlmg.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <StartTop />

        <Routes>

          {/* الصفحة الرئيسية */}
          <Route path="/" element={<Default />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />
          </Route>

          {/* صفحات عامة */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faq" element={<FaqItems />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/landing" element={<Landing />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["User", "Customer", "Technician", "Admin"]} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/booking-details" element={<BookingDetails />} />
            <Route path="/booking-status/:id" element={<BookingStatus />} />
            <Route path="/booking-status-details/:id" element={<BookingStatusDetails />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/car" element={<Car />} />
            <Route path="/ai-service" element={<AiService />} />
            <Route path="/service-details/:id" element={<ServiceDetails />} />
            <Route path="/service" element={<Service />} />
          </Route>

          {/* Technician */}
          <Route element={<ProtectedRoute allowedRoles={["Technician"]} />}>
            <Route path="/technican" element={<Technican />} />
            <Route path="/update-status/:id" element={<UpdateStatus />} />
            <Route path="/all-tasks" element={<AllTasks />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/manager" element={<Manager />} />
            <Route path="/all-bookings" element={<AllBookings />} />
            <Route path="/manager/all-rating" element={<AllRating />} />
            <Route path="/booking-dto-manager/:id" element={<BookingDtoManager />} />
          </Route>

          {/* Errors */}
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<Error />} />

        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;