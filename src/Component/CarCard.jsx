import React from "react";
import { useNavigate } from "react-router";
import { FaCar, FaCalendarAlt, FaIdCard, FaHistory, FaTrashAlt } from "react-icons/fa";
import { MdOutlineBuild } from "react-icons/md";

const CarCard = ({ car, onBook, onDelete }) => {
    const navigate = useNavigate();
    const brand = car.Brand || car.brand || "غير معروف";
    const model = car.Model || car.model || "";
    const year = car.Year || car.year || "";
    const plate = car.PlateNumber || car.plateNumber || car.Plate || car.plate || "غير محدد";
    const img = car.Image || car.image || car.Img || car.img || null;

    return (
        <div
            style={{
                width: "100%",
                background: "#fff",
                borderRadius: "20px",
                padding: "20px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                transition: "0.3s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {img ? (
                    <img
                        src={img}
                        alt={`صورة ${brand}`}
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100px",
                            height: "100px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#F6F7FB",
                            borderRadius: "8px",
                        }}
                    >
                        <FaCar size={50} color="#9a9b9d" />
                    </div>
                )}

                <div>
                    <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "500", paddingTop: "15px" }}>
                        {brand} {model}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", paddingTop: "8px" }}>
                        <p style={{ display: "flex", alignItems: "center", fontSize: "14px", gap: "6px" }}>
                            <FaCalendarAlt color="#2A5CAF" />
                            سنة الصنع : {year}
                        </p>

                        <p style={{ display: "flex", alignItems: "center", fontSize: "14px", gap: "6px" }}>
                            <FaIdCard color="#2A5CAF" />
                            لوحة : {plate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                    style={{
                        width: "100%",
                        height: "44px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#2A5CAF",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "15px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#1f4f9a"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#2A5CAF"}
                    onClick={() => onBook(car.id)}
                >
                    <MdOutlineBuild size={18} />
                    احجز صيانة
                </button>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        style={{
                            flex: 1,
                            height: "40px",
                            borderRadius: "10px",
                            border: "1px solid #E5E7EB",
                            background: "#F8FAFC",
                            color: "#374151",
                            fontWeight: "500",
                            fontSize: "13.5px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            transition: "0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#EEF2FF";
                            e.currentTarget.style.borderColor = "#2A5CAF";
                            e.currentTarget.style.color = "#2A5CAF";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#F8FAFC";
                            e.currentTarget.style.borderColor = "#E5E7EB";
                            e.currentTarget.style.color = "#374151";
                        }}
                        onClick={() => navigate(`/car-history/${car.id}`)}
                    >
                        <FaHistory size={13} />
                        تاريخ الصيانة
                    </button>

                    <button
                    className="btn btn"
                        style={{
                            width: "40px",
                            height: "40px",
                            flexShrink: 0,
                            borderRadius: "10px",
                            border: "1px solid #E5E7EB",
                            background: "#F8FAFC",
                            color: "#9CA3AF",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#FEE2E2";
                            e.currentTarget.style.borderColor = "#EF4444";
                            e.currentTarget.style.color = "#EF4444";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#F8FAFC";
                            e.currentTarget.style.borderColor = "#E5E7EB";
                            e.currentTarget.style.color = "#9CA3AF";
                        }}
                        onClick={() => onDelete && onDelete(car.id)}
                        title="حذف السيارة"
                    >
                        <FaTrashAlt size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarCard;