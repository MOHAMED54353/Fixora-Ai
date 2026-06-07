import React from "react";

const ReviewCard = ({ review }) => {

    const renderStars = (count) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < count ? "#FFD700" : "#E0E0E0", fontSize: "22px",paddingRight:"4px" }}>★</span>
        ));
    };

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "16px",
                background: "#ffffff",
                padding: "24px",
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold m-0">
                    {review.customerName}
                </h5>
                <p>
                    {new Date(review.createdAt).toLocaleDateString("ar-EG")}
                </p>
            </div>

            <div
                style={{
                    marginBottom: "8px"
                }}
            >
                {renderStars(review.technicianRating)}
            </div>
            <p
                className="mb-0 pt-3 text-black"
            >
                {review.comment || "لا يوجد تعليق"}
            </p>
        </div>
    );
};
export default ReviewCard;