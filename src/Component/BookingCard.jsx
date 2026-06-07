import React from "react";
import { useNavigate } from "react-router";
import Aibtn from "./AiBtn.jsx";

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();
  const isCompleted = booking.status === "Completed";
  const isCancelled =
    booking.status === "Cancelled" || booking.status === "Canceled";


  const scheduled = new Date(booking.scheduledDate);
  const dateStr = scheduled.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = scheduled.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusMap = {
    "InProgress": "قيد التنفيذ",
    "WaitingClientApproval": "بإنتظار موافقة العميل",
    "Cancelled": "ملغاة",
    "Completed": "مكتملة",
    "Pending": "معلقة",
  };
  return (
    <>
      <section
        className="booking-card"
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "16px 24px",
          marginBottom: "16px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center w-100 mb-3">
          <div style={{ fontSize: "16px", color: "#A9A9A9" }}>
            {booking.bookingNumber}
          </div>

          <span
            style={{
              background: isCompleted
                ? "#afffc781"
                : isCancelled
                  ? "#fee2e2"
                  : "#fef2e8",
              color: isCompleted
                ? "#15803D"
                : isCancelled
                  ? "#b91c1c"
                  : "#E27019",
              padding: "8px 16px",
              borderRadius: "24px",
              fontSize: "16px",
            }}
          >
            {statusMap[booking.status] || "غير محدد"}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div style={{ fontWeight: "600", fontSize: "16px", color: "#333D4D" }}>
              <i className="fa-solid fa-car-side mb-2"></i> {booking.brand} {booking.model}
            </div>

            <span style={{ fontSize: "14px", color: "#A9A9A9" }}>
              لوحة : {booking.plateNumber}
            </span>

            <div className="d-flex gap-4 mt-3" style={{ fontSize: "14px", color: "#A9A9A9" }}>
              <span>
                <i className="fa-regular fa-calendar ps-1"></i> {dateStr}
              </span>
              <span>
                <i className="fa-regular fa-clock ps-1"></i> {timeStr}
              </span>
            </div>
          </div>

          <div className="mb-3">
            <p style={{ marginBottom: "8px", fontWeight: "400" }}>الخدمات المطلوبة</p>
            {Array.isArray(booking.bookingServiceDetailsDtos) && booking.bookingServiceDetailsDtos.length > 0 ? (
              booking.bookingServiceDetailsDtos.map((service, i) => {
                const name =
                  service.serviceName ||
                  service.ServiceName ||
                  "خدمة غير محددة";
                return (
                  <span
                    key={i}
                    style={{
                      background: "#F6F7FB",
                      borderRadius: "12px",
                      padding: "8px 16px",
                      fontSize: "12px",
                      marginRight: "8px",
                      display: "inline-block",
                      marginBottom: "6px",
                    }}
                  >
                    {name}
                  </span>
                );
              })
            ) : (
              <span style={{ fontSize: "12px", color: "#A9A9A9" }}>لا توجد خدمات</span>
            )}
          </div>


          {/* الفني */}
          <div className="mb-2">
            <p style={{ marginBottom: "8px", fontWeight: "400" }}>
              <i className="fa-solid fa-users ps-2"></i> الفني
            </p>
            <div>
              <img className="rounded-circle ps-2" src="/dd.png" alt="" />
              {booking.technicianName || "لم يتم تحديد الفني بعد"}
            </div>
          </div>

          {/* الزر */}
          <div>
            <button
              className="btn btn-primary btn-sm"
              disabled={isCancelled}
              onClick={() => {
                if (!isCancelled) {
                  navigate(
                    isCompleted
                      ? `/booking-status-details/${booking.id}`
                      : `/booking-status/${booking.id}`
                  );
                }
              }}
              style={{
                borderRadius: "12px",
                padding: "8px 16px",
                fontSize: "16px",
                fontWeight: "700",
                opacity: isCancelled ? 0.6 : 1,
                cursor: isCancelled ? "not-allowed" : "pointer",
              }}
            >
              {isCompleted
                ? "عرض التفاصيل"
                : isCancelled
                  ? "الحجز ملغي"
                  : "متابعة الحالة"}
            </button>
          </div>
        </div>
      </section>
      <Aibtn />
    </>
  );
};

export default BookingCard;