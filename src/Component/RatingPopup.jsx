import React, { useState } from "react";

const RatingPopup = ({ onClose, onSubmit }) => {
    const [serviceRating, setServiceRating] = useState(0);
    const [technicianRating, setTechnicianRating] = useState(0);
    const [comment, setComment] = useState('');

    const renderStars = (rating, setRating) => {
        return [...Array(5)].map((_, index) => {
            const starNumber = index + 1;
            return (
                <span
                    key={index}
                    onClick={() => setRating(starNumber)}
                    style={{
                        fontSize: "35px",
                        color: starNumber <= rating ? "#FFD700" : "#dfdfdfe3",
                        cursor: "pointer",
                        marginRight: "4px",
                    }}
                >
                    ★
                </span>
            );
        });
    };

    const handleSubmit = () => {
        if (!serviceRating || !technicianRating) {
            alert('يرجى تقييم الخدمة والفني');
            return;
        }
        onSubmit({ serviceRating, technicianRating, comment });
        onClose();
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0,
                width: "100%", height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex", justifyContent: "center", alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    width: "600px",
                    padding: "40px",
                    borderRadius: "16px",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    textAlign: "right",
                }}
            >
                <h3 style={{ fontSize: "36px" }}>
                    <span style={{ fontSize: "26px" }}>⭐</span> تقييم الحجز
                </h3>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "22px", color: "#333D4D" }}>تقييم جودة الخدمة</p>
                    <div>{renderStars(serviceRating, setServiceRating)}</div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "22px", color: "#333D4D" }}>تقييم الفني</p>
                    <div>{renderStars(technicianRating, setTechnicianRating)}</div>
                </div>

                {/* حقل التعليق */}
                <div>
                    <p style={{ fontSize: "18px", color: "#333D4D", marginBottom: "8px" }}>تعليق (اختياري)</p>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="اكتب تعليقك هنا..."
                        style={{
                            width: "100%",
                            height: "100px",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1.5px solid #E5E7EB",
                            backgroundColor: "#F6F7FB",
                            resize: "none",
                            outline: "none",
                            fontSize: "15px",
                            direction: "rtl",
                        }}
                    />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: "8px 16px",
                            width: "170px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: "#2A5CAF",
                            color: "#ffffff",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                    >
                        إرسال التقييم
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "12px",
                            border: "1.5px solid red",
                            backgroundColor: "#ffffff",
                            color: "red",
                            cursor: "pointer",
                        }}
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingPopup;