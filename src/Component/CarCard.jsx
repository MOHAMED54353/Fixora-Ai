import React from "react";
import { FaCar, FaCalendarAlt, FaIdCard } from "react-icons/fa";
import { MdOutlineBuild } from "react-icons/md";

const CarCard = ({ car, onBook, onDelete }) => {
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
                    <div style={{ display: "flex", flexDirection: "column", paddingTop: "8px"}}>
                        <p style={{ display: "flex", alignItems: "center", fontSize: "14px",gap: "6px" }}>
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

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                    style={{
                        flex: 1,
                        height: "42px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#2A5CAF",
                        color: "#fff",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#1f4f9a"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#2A5CAF"}
                    onClick={() => onBook(car.id)}
                >
                    <MdOutlineBuild size={18} />
                    احجز صيانة
                </button>

                <button
                    style={{
                        width: "46px",
                        height: "42px",
                        borderRadius: "10px",
                        border: "1.5px solid #EF4444",
                        color: "#EF4444",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#EF4444";
                        e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#EF4444";
                    }}
                    onClick={() => onDelete && onDelete(car.id)}
                >
                    <i
                        className="far fa-trash-alt fs-5"
                        style={{ cursor: "pointer" }}
                    ></i>
                </button>
            </div>
        </div>
    );
};

export default CarCard;