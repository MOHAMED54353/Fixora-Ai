import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import NavUser from "../Component/NavUser";
import "../styles/Profile.css";
import Scrollbtn from "../Component/scrollbtn";
import BookingCard from "../Component/BookingCard";
import AiRecommend from "../Component/AiRecommend.jsx";
import axios from "../Utils/axiosConfig";

const Profile = () => {
  const navigate = useNavigate();

  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [aiServices, setAiServices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!user || !token) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const response = await axios.get("/api/Bookings/my-bookings");
        const dataArray = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setBookings(dataArray.slice(0, 3));
      } catch (error) {
        console.error("خطأ في جلب الحجوزات:", error);
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    const fetchServices = async () => {
      try {
        const ids = [1, 2, 3, 11,5];
        const responses = await Promise.all(
          ids.map((id) => axios.get(`/api/Services/${id}`))
        );
        const all = responses.map((res) => res.data.data || res.data);
        const shuffled = all.sort(() => Math.random() - 0.5).slice(0, 2);
        setAiServices(shuffled);
      } catch (error) {
        console.error("خطأ في جلب الخدمات:", error);
      }
    };

    fetchBookings();
    fetchServices();
  }, [navigate, user]);

  if (!user || loadingBookings) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px",
        }}
      >
        جاري التحميل...
      </div>
    );
  }

  return (
    <>
      <NavUser user={user} />

      <div className="banner-container">
        <div className="booking-banner">
          <div className="banner-content">
            <div className="text-section">
              <h2 className="main-title">جاهز لحجز خدمة جديد؟</h2>
              <p className="sub-title">
                استخدم الذكاء الاصطناعي أو احجز خدمة مباشرة
              </p>
            </div>

            <button
              className="booking-button"
              onClick={() => navigate("/Service")}
            >
              <span className="plus-icon">+</span>
              احجز خدمة جديدة
            </button>
          </div>
        </div>
      </div>

      <div className="profile-bookings-container p-3 m-5">
        <h2 style={{ marginBottom: "50px" }}>أحدث حجوزاتي</h2>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <p>لا توجد حجوزات حالياً</p>
        )}
      </div>

      <div className="m-5 p-3">
        <h2 style={{ marginBottom: "50px" }}>توصيات قبل السفر</h2>
        <div className="row g-4">
          {aiServices.map((service) => (
            <div className="col-md-6" key={service.id}>
              <AiRecommend
                item={{
                  title: service.name,
                  description: service.description,
                  price: service.basePrice,
                  recommend: `الخدمة المقترحة: ${service.name}`,
                  service: service,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <Scrollbtn />
    </>
  );
};

export default Profile;