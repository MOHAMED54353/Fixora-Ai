import React from "react";

const TechnicianCard = ({ technician, onDelete, onEdit, loading }) => {
    if (loading) return <p className="text-center">جارٍ تحميل الفنيين...</p>;

    if (!technician)
        return <p className="text-center text-muted">لا يوجد فنيون حالياً.</p>;

    const cardStyle = {
        borderRadius: "16px",
        border: "1px solid #F1F3F5",
        padding: "20px",
        width: "380px",
        height: "100%",
        background: "#FFFFFF",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        cursor: "default"
    };
    const isAvailable = technician.IsAvailable ?? technician.isAvailable;
    const statusBadgeStyle = {
        backgroundColor: isAvailable ? "#F0FDF4" : "#FEF2E8",
        color: isAvailable ? "#2E7D32" : "#EF6C00",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: "600",
        padding: "6px 12px",
    };

    return (
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <div
                className="card h-100 d-flex flex-column justify-content-between shadow-hover"
                style={cardStyle}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
                }}
            >
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                        <div style={{ position: "relative" }}>
                            <img
                                className="rounded-circle border"
                                src="26.png"
                                alt={technician.DisplayName}
                                width="56px"
                                height="56px"
                                style={{ objectFit: "cover" }}
                            />
                            <span style={{
                                position: "absolute",
                                bottom: "2px",
                                right: "2px",
                                width: "12px",
                                height: "12px",
                                backgroundColor: technician.IsAvailable ? "#4CAF50" : "#f3ff07",
                                border: "2px solid white",
                                borderRadius: "50%"
                            }}></span>
                        </div>
                        <div>
                            <h6 className="mb-0" style={{ fontSize: "18px", color: "#1A202C", fontWeight: "700" }}>
                                {technician.DisplayName}
                            </h6>
                            <small className="text-muted">{technician?.Specialization || "عام"}</small>
                        </div>
                    </div>
                    <span style={statusBadgeStyle}>
                        {technician.IsAvailable ? "متاح" : "مشغول"}
                    </span>
                </div>

                {/* المحتوى: الخبرة والتقييم */}
                <div className="d-flex flex-wrap gap-3 mb-3 mt-2">
                    <div className="d-flex align-items-center gap-2 bg-light px-2 py-1 rounded">
                        <i className="fa-solid fa-star text-warning" style={{ fontSize: "14px" }}></i>
                        <span className="fw-bold" style={{ fontSize: "14px" }}>{technician?.Rating ?? 0}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 bg-light px-2 py-1 rounded">
                        <i className="fa-solid fa-briefcase text-secondary" style={{ fontSize: "14px" }}></i>
                        <span style={{ fontSize: "14px" }}>{technician?.ExperienceYears ?? 0} سنة خبرة</span>
                    </div>
                </div>

                <hr style={{ borderTop: "4px dashed #aed0fc", margin: "15px 0" }} />

                <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted" style={{ fontSize: "13px" }}>
                        <i className="fa-solid fa-list-check px-1"></i>
                        المهام اليومية :  <strong>{technician.DailyTasks || "---"}</strong>
                    </div>

                    <div className="d-flex gap-1">
                        <button
                            className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                            onClick={onEdit}
                            style={{ width: "32px", height: "32px", borderRadius: "8px", color: "#2A5CAF" }}
                            title="تعديل"
                        >
                            <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button
                            className="btn btn-link p-0 text-danger btn-sm d-flex align-items-center justify-content-center"
                            onClick={onDelete}
                            style={{ width: "32px", height: "32px", borderRadius: "8px", }}
                            title="حذف"
                        >
                            <i className="far fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianCard;