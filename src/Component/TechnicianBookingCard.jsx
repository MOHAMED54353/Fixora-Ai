import React from "react";
import { useNavigate } from "react-router";

const statusMap = {
    "InProgress": "قيد التنفيذ",
    "WaitingClientApproval": "بإنتظار موافقة العميل",
    "Cancelled": "ملغاة",
    "Completed": "مكتملة",
    "Pending": "معلقة",
};

const getStatusStyle = (status) => {
    switch (status) {
        case "InProgress":
            return { backgroundColor: "#E8F4FD", color: "#2196F3" };
        case "WaitingClientApproval":
            return { backgroundColor: "#FEF2E8", color: "#E27019" };
        case "Cancelled":
            return { backgroundColor: "#fde3e3", color: "#D32F2F" };
        case "Completed":
            return { backgroundColor: "#e8fdf0", color: "#1e8c45" };
        case "Pending":
            return { backgroundColor: "#F0F0F0", color: "#555" };
        default:
            return { backgroundColor: "#F0F0F0", color: "#0d0d0d" };
    }
};

const TechnicianBookingCard = ({ booking }) => {
    const navigate = useNavigate();

    const scheduled = new Date(booking.scheduledDate);
    const dateStr = scheduled.toLocaleDateString("ar-EG", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    const timeStr = scheduled.toLocaleTimeString("ar-EG", {
        hour: "2-digit", minute: "2-digit",
    });

    const serviceName = booking.bookingServiceDetailsDtos?.map(s => s.serviceName).join(" + ") ?? "—";
    const carName = `${booking.brand ?? ""} ${booking.model ?? ""}`.trim();

    return (
        <div
            className="card shadow-sm mb-4"
            style={{
                maxWidth: "1250px",
                borderRadius: "16px",
                border: "none",
                padding: "16px 24px",
                backgroundColor: "#FFFFFF",
            }}
        >
            <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                <div className="flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span style={{ fontSize: "16px", color: "#A9A9A9" }}>
                            #{booking.bookingNumber}
                        </span>
                        <span
                            style={{
                                borderRadius: "24px",
                                fontSize: "16px",
                                padding: "8px 16px",
                                ...getStatusStyle(booking.status),
                            }}
                        >
                            {statusMap[booking.status] || booking.status}
                        </span>
                    </div>

                    <h3 className="mb-1" style={{ color: "#333D4D", fontSize: "22px" }}>
                        {serviceName}
                    </h3>

                    <div className="d-flex flex-wrap align-items-center gap-4 text-muted mt-4">
                        <span>
                            <i className="fa-solid fa-car ps-2"></i>{carName}
                        </span>
                        <span>
                            <i className="fa-regular fa-calendar px-2"></i>{dateStr}
                        </span>
                        <span>
                            <i className="fa-regular fa-clock px-2"></i>{timeStr}
                        </span>
                    </div>

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-1 gap-3">
                        <p className="pe-4 mb-0" style={{ fontSize: "14px" }}>
                            لوحة : {booking.plateNumber}
                        </p>
                        <button
                            className="btn btn-primary"
                            style={{ minWidth: "230px", padding: "8px 16px" }}
                            onClick={() => navigate(`/update-status/${booking.id}`)}
                            disabled={booking.status === "Cancelled" || booking.status === "Completed"}
                        >
                            تحديث الحالة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianBookingCard;