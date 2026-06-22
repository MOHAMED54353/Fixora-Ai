import React from "react";

const SPEC_LABEL = {
    engine: "ميكانيكا سيارات",
    transmission: "عمرة محركات وفتيس",
    brakes: "عفشة وفرامل",
    suspension: "تعليق",
    oil_leak: "تسريب الزيت",
    oil_change: "تغيير زيوت",
    electrical: "كهرباء السيارة",
    starting: "فحص كمبيوتر وبرمجة",
    battery: "بطاريات",
    ac: "تكييف",
    cooling: "تبريد المحرك",
    body_paint: "سمكرة ودهان",
    glass_accessories: "زجاج وإكسسوارات",
    cleaning: "تلميع ونظافة",
    tires: "إطارات",
    alignment_balancing: "ضبط زوايا وتوازن",
    exhaust: "عادم",
    steering: "توجيه",
};

const TechnicianCard = ({ technician, onDelete, onEdit, loading }) => {
    if (loading) return <p className="text-center">جارٍ تحميل الفنيين...</p>;
    if (!technician) return <p className="text-center text-muted">لا يوجد فنيون حالياً.</p>;

    const isAvailable = technician.IsAvailable ?? technician.isAvailable;

    const cardStyle = {
        borderRadius: "16px",
        border: "1px solid #F1F3F5",
        padding: "20px",
        width: "100%",
        height: "100%",
        background: "#FFFFFF",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        cursor: "default",
    };

    const statusBadgeStyle = {
        backgroundColor: isAvailable ? "#F0FDF4" : "#FEF2E8",
        color: isAvailable ? "#2E7D32" : "#EF6C00",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: "600",
        padding: "6px 12px",
        whiteSpace: "nowrap",
        flexShrink: 0,
    };

    return (
        <div
            className="card d-flex flex-column justify-content-between"
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
            <div className="d-flex justify-content-between align-items-start mb-3" style={{ gap: "8px" }}>
                <div className="d-flex align-items-start gap-3" style={{ minWidth: 0 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
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
                            backgroundColor: isAvailable ? "#4CAF50" : "#f3ff07",
                            border: "2px solid white",
                            borderRadius: "50%",
                        }} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <h6 className="mb-0" style={{ fontSize: "16px", color: "#1A202C", fontWeight: "700" }}>
                            {technician.DisplayName}
                        </h6>
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                            marginTop: "6px",
                            maxHeight: "52px",
                            overflow: "hidden",
                        }}>
                            {technician?.Specialization
                                ? technician.Specialization.split(",").map((s) => (
                                    <span key={s} style={{
                                        background: "#f4f6f8",
                                        color: "#555",
                                        borderRadius: "6px",
                                        padding: "2px 8px",
                                        fontSize: "11px",
                                        whiteSpace: "nowrap",
                                    }}>
                                        {SPEC_LABEL[s.trim()] || s.trim()}
                                    </span>
                                ))
                                : <span style={{ fontSize: "12px", color: "#888" }}>عام</span>}
                        </div>
                    </div>
                </div>

                <span style={statusBadgeStyle}>
                    {isAvailable ? "متاح" : "مشغول"}
                </span>
            </div>

            <div className="d-flex flex-wrap gap-3 mb-3 mt-2">
                <div className="d-flex align-items-center gap-2 bg-light px-2 py-1 rounded">
                    <i className="fa-solid fa-star text-warning" style={{ fontSize: "14px" }} />
                    <span className="fw-bold" style={{ fontSize: "14px" }}>{technician?.Rating ?? 0}</span>
                </div>
                <div className="d-flex align-items-center gap-2 bg-light px-2 py-1 rounded">
                    <i className="fa-solid fa-briefcase text-secondary" style={{ fontSize: "14px" }} />
                    <span style={{ fontSize: "14px" }}>{technician?.ExperienceYears ?? 0} سنة خبرة</span>
                </div>
            </div>

            <hr style={{ borderTop: "4px dashed #aed0fc", margin: "15px 0" }} />

            <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted" style={{ fontSize: "13px" }}>
                    <i className="fa-solid fa-list-check px-1" />
                    المهام اليومية : <strong>{technician.DailyTasks || "---"}</strong>
                </div>
                <div className="d-flex gap-1">
                    <button
                        className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                        onClick={onEdit}
                        style={{ width: "32px", height: "32px", borderRadius: "8px", color: "#2A5CAF" }}
                        title="تعديل"
                    >
                        <i className="fa-regular fa-pen-to-square" />
                    </button>
                    <button
                        className="btn btn-link p-0 text-danger btn-sm d-flex align-items-center justify-content-center"
                        onClick={onDelete}
                        style={{ width: "32px", height: "32px", borderRadius: "8px" }}
                        title="حذف"
                    >
                        <i className="far fa-trash-alt" />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default TechnicianCard;