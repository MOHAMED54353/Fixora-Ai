import React from "react";

const StarRating = ({ rating = 0, reviewCount = 0 }) => (
    <div className="d-flex align-items-center gap-2 mb-3">
        <div className="d-flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ color: star <= Math.round(rating) ? "#F59E0B" : "#D1D5DB", fontSize: "16px" }}>
                    ★
                </span>
            ))}
        </div>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#F59E0B" }}>{rating.toFixed(1)}</span>
        <span style={{ fontSize: "12px", color: "#9CA3AF" }}>({reviewCount} تقييم)</span>
    </div>
);

const ServiceCard = ({
    title = "",
    description = "",
    price = 0,
    duration = 0,
    category = "",
    specialty = "",
    rating = 0,
    reviewCount = 0,
    isInCart = false,
    onDetailsClick = () => { },
    onBookClick = () => { },
}) => {
    return (
        <div
            className="card shadow-sm mx-auto mb-4"
            style={{
                maxWidth: "100%",
                width: "380px",
                minHeight: "334px",
                borderRadius: "16px",
                border: isInCart ? "2px solid #2A5CAF" : "none",
                transition: "border 0.2s",
            }}
        >
            <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3 gap-2">
                    <h5
                        className="mb-2"
                        style={{
                            color: "#333D4D",
                            fontSize: "22px",
                            wordBreak: "break-word",
                        }}
                    >
                        {title || "اسم الخدمة"}
                    </h5>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <span
                            className="badge bg-primary bg-opacity-10 text-primary px-3 py-2"
                            style={{ fontSize: "14px", borderRadius: "16px" }}
                        >
                            {category || "فئة الخدمة"}
                        </span>
                    </div>
                </div>

                <StarRating rating={rating} reviewCount={reviewCount} />

                <p className="mb-3" style={{ minHeight: "60px" }}>
                    {description || "وصف الخدمة"}
                </p>

                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-2">
                    <div className="d-flex align-items-center gap-1">
                        <span className="fw-bold fs-5 text-primary">{price || 0}</span>
                        <span className="text-muted">ج.م</span>
                        <i className="fa-solid fa-sack-dollar text-warning"></i>
                    </div>

                    <div className="d-flex align-items-center gap-2 text-muted small">
                        <i className="fa-regular fa-clock"></i>
                        <span style={{ color: "#A9A9A9", fontSize: "16px" }}>
                            {duration || 0} دقيقة
                        </span>
                    </div>
                </div>

                <div>
                    <p className="mb-4">التخصص : {specialty || "التخصص"}</p>
                </div>
                <hr />

                <div className="d-flex flex-column flex-md-row gap-3">
                    <button
                        className="btn btn-primary w-100 w-md-50 d-flex justify-content-center align-items-center gap-2 fw-bold"
                        style={{
                            backgroundColor: isInCart ? "#dc3545" : "#2A5CAF",
                            color: "white",
                            borderRadius: "12px",
                            border: "none",
                        }}
                        onClick={onBookClick}
                    >
                        <i className={`fa-solid ${isInCart ? "fa-minus" : "fa-plus"}`}></i>
                        {isInCart ? "إزالة من السلة" : "احجز الآن"}
                    </button>

                    <button
                        className="btn btn-outline w-100 w-md-40 fw-bold"
                        style={{
                            color: "#2A5CAF",
                            border: "2px solid #2A5CAF",
                            padding: "8px 16px",
                            borderRadius: "12px",
                            backgroundColor: "transparent",
                        }}
                        onClick={onDetailsClick}
                    >
                        تفاصيل
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;