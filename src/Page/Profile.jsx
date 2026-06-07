import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import NavUser from "../Component/NavUser";
import "../styles/profile.css";
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

    fetchBookings();
  }, [navigate, user]);

  const aiRecommendations = [
    {
      id: 2,
      title: "فحص الفرامل",
      description: "يُنصح بفحص نظام الفرامل قبل السفر",
      price: 1000,
      badge: "عاجل",
      recommend: "الخدمة المقترحة: فحص وصيانة الفرامل",
    },
    {
      id: 1,
      title: "صيانة دورية مستحقة",
      description: "يتم فحص نظام الفرامل لضمان السلامة والكفاءة المثلى.",
      price: 450,
      recommend: "الخدمة المقترحة: استبدال وسادات الفرامل",
    },
  ];

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
        <h2>توصيات الذكاء الإصطناعي</h2>
        <div className="row g-4">
          {aiRecommendations.map((item) => (
            <div className="col-md-6" key={item.id}>
              <AiRecommend item={item} />
            </div>
          ))}
        </div>
      </div>

      <Scrollbtn />
    </>
  );
};

export default Profile;