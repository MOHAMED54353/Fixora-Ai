import React from 'react'
import { useNavigate } from 'react-router';

const RatingCard = ({ review, }) => {
    const navigate = useNavigate();

    const renderStars = (count) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < count ? "#FFD700" : "#E0E0E0", fontSize: "18px" }}>★</span>
        ));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("ar-EG", {
            year: "numeric", month: "long", day: "numeric"
        });
    };

    return (
        <div
            className="mx-auto mb-4"
            style={{
                width: "100%",
                maxWidth: "1240px",
                backgroundColor: "white",
                padding: "24px 28px",
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
        >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                    <div style={{
                        width: "42px", height: "42px", borderRadius: "50%",
                        backgroundColor: "#EBF3FE", display: "flex",
                        alignItems: "center", justifyContent: "center"
                    }}>
                        <i className="fa-solid fa-user" style={{ color: "#2A5CAF", fontSize: "16px" }}></i>
                    </div>
                    <h5 className="mb-0" style={{ color: "#333D4D", fontWeight: "700" }}>
                        {review?.customerName || "اسم العميل"}
                    </h5>
                </div>

                <div className="d-flex align-items-center gap-2" style={{ color: "#A9A9A9", fontSize: "14px" }}>
                    <i className="fa-regular fa-calendar"></i>
                    <span>{formatDate(review?.createdAt)}</span>
                </div>
            </div>

            {/* Stars */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <div>{renderStars(review?.serviceRating || 0)}</div>
                <span style={{ fontSize: "13px", color: "#A9A9A9" }}>
                    ({review?.serviceRating || 0}/5)
                </span>
            </div>

            {/* Comment */}
            <div
                className="mb-3 p-3"
                style={{ backgroundColor: "#F6F7FB", borderRadius: "10px", borderRight: "3px solid #2A5CAF" }}
            >
                <i className="fa-solid fa-quote-right ps-2" style={{ color: "#2A5CAF", fontSize: "13px" }}></i>
                <span style={{ color: "#555", fontSize: "15px" }}>
                    {review?.comment || "لا يوجد تعليق"}
                    <i className="fa-solid fa-quote-left pe-2" style={{ color: "#2A5CAF", fontSize: "13px" }}></i>
                </span>
            </div>


            <hr className="mt-0 mb-3" />

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="d-flex gap-4 flex-wrap" style={{ fontSize: "14px", color: "#6B7280" }}>
                    <span>
                        <i className="fa-solid fa-hashtag ps-1" style={{ color: "#2A5CAF" }}></i>
                        رقم الحجز: {review?.bookingNumber || "—"}
                    </span>
                    <span>
                        <i className="fa-solid fa-screwdriver-wrench ps-1" style={{ color: "#2A5CAF" }}></i>
                        الفني: {review?.technicianName || "—"}
                    </span>
                </div>

                <button
                    className="btn"
                    style={{
                        padding: "8px 20px",
                        color: "#2A5CAF",
                        border: "2px solid #2A5CAF",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#2A5CAF"; e.currentTarget.style.color = "white"; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#2A5CAF"; }}
                    onClick={() => navigate(`/booking-dto-manager/${review.bookingId}`)}
                >
                    <i className="fa-regular fa-eye ps-2"></i>
                    عرض الحجز
                </button>
            </div>
        </div>
    );
};
export default RatingCard;