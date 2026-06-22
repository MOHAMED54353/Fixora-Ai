import React from "react";
import { useNavigate } from "react-router";

const BookingsTable = ({ bookings, loading }) => {
    const navigate = useNavigate();

    if (loading) return <p className="text-center">جارٍ تحميل الحجوزات...</p>;
    if (!bookings || bookings.length === 0)
        return <p className="text-center text-muted">مفيش حجوزات النهاردة ي معلم</p>;

    const tableContainerStyle = {
        border: "1px solid #DFDFDF",
        borderBottom: 0,
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
    };

    const headerStyle = {
        backgroundColor: "#f6f7fb",
        color: "#333D4D",
        fontSize: "16px",
        padding: "20px 24px",
        fontWeight: "bold",
        borderBottom: "1px solid #DFDFDF",
    };

    const cellStyle = {
        padding: "16px 24px",
        verticalAlign: "middle",
        color: "#333D4D",
        fontSize: "15px",
        borderBottom: "1px solid #DFDFDF",
    };

    const statusMap = {
        InProgress: "قيد التنفيذ",
        WaitingClientApproval: "بانتظار موافقة العميل",
        Cancelled: "ملغاة",
        Completed: "مكتملة",
        Pending: "معلقة",
    };

    const getBadgeStyle = (status) => {
        const styles = {
            Completed: { backgroundColor: "#F0FDF4", color: "#22C55E" },
            InProgress: { backgroundColor: "#FEF2E8", color: "#F97316" },
            Pending: { backgroundColor: "#FEF2E8", color: "#F97316" },
            Cancelled: { backgroundColor: "#FEE2E2", color: "#DC2626" },
            WaitingClientApproval: { backgroundColor: "#EEF2FF", color: "#6366F1" },
        };
        return styles[status] || { backgroundColor: "#F3F4F6", color: "#6B7280" };
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("ar-EG", {
            year: "numeric", month: "short", day: "numeric",
        });
    };

    return (
        <div>
            {/* Desktop Table */}
            <div className="d-none d-md-block">
                <div className="table-responsive" style={tableContainerStyle}>
                    <table className="table m-0">
                        <thead>
                            <tr>
                                <th style={headerStyle}>رقم الحجز</th>
                                <th style={{ ...headerStyle, textAlign: "center" }}>العميل</th>
                                <th style={{ ...headerStyle, textAlign: "center" }}>السيارة</th>
                                <th style={{ ...headerStyle, textAlign: "center" }}>الحالة</th>
                                <th style={{ ...headerStyle, textAlign: "center" }}>الفني المعين</th>
                                <th style={{ ...headerStyle, textAlign: "center" }}>التاريخ</th>
                                <th style={{ ...headerStyle, textAlign: "center" }}>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => {
                                const rawStatus = booking.Status || booking.status || "Unknown";
                                const badgeStyle = getBadgeStyle(rawStatus);

                                return (
                                    <tr key={booking.id ?? booking.bookingNumber ?? index}>
                                        <td style={cellStyle} className="fw-bold">
                                            {booking.bookingNumber || booking.BookingNumber || "-"}
                                        </td>
                                        <td style={cellStyle} className="text-center">
                                            {booking.customerName || booking.CustomerName || "-"}
                                        </td>
                                        <td style={cellStyle} className="text-center text-muted">
                                            {booking.brand || booking.Brand || "-"}{" "}
                                            {booking.model || booking.Model || "-"}
                                        </td>
                                        <td style={cellStyle} className="text-center">
                                            <span style={{ padding: "6px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: "bold", ...badgeStyle }}>
                                                {statusMap[rawStatus] || rawStatus}
                                            </span>
                                        </td>
                                        <td style={cellStyle} className="text-center">
                                            {booking.technicianName || booking.TechnicianName || "غير محدد"}
                                        </td>
                                        <td style={cellStyle} className="text-center">
                                            {formatDate(booking.scheduledDate || booking.ScheduledDate)}
                                        </td>
                                        <td style={cellStyle} className="text-center">
                                            <button
                                                className="btn"
                                                onClick={() => navigate(`/booking-dto-manager/${booking.id}`)}
                                                style={{ fontSize: "14px", backgroundColor: "#EAEAEA", padding: "6px 16px", color: "#666", borderRadius: "8px" }}
                                            >
                                                التفاصيل
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="d-md-none">
                <div className="d-flex flex-column gap-3">
                    {bookings.map((booking, index) => {
                        const rawStatus = booking.Status || booking.status || "Unknown";
                        const badgeStyle = getBadgeStyle(rawStatus);

                        return (
                            <div key={booking.id ?? booking.bookingNumber ?? index} style={{
                                background: "#fff", borderRadius: "12px",
                                border: "1px solid #DFDFDF", padding: "16px",
                            }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-bold" style={{ fontSize: "15px" }}>
                                        {booking.bookingNumber || booking.BookingNumber || "-"}
                                    </span>
                                    <span style={{ padding: "4px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: "bold", ...badgeStyle }}>
                                        {statusMap[rawStatus] || rawStatus}
                                    </span>
                                </div>

                                <div className="d-flex flex-column gap-1 mb-3" style={{ fontSize: "14px", color: "#555" }}>
                                    <div>
                                        <i className="fa-solid fa-user px-1 text-muted" />
                                        {booking.customerName || booking.CustomerName || "-"}
                                    </div>
                                    <div>
                                        <i className="fa-solid fa-car px-1 text-muted" />
                                        {booking.brand || booking.Brand || "-"} {booking.model || booking.Model || "-"}
                                    </div>
                                    <div>
                                        <i className="fa-solid fa-wrench px-1 text-muted" />
                                        {booking.technicianName || booking.TechnicianName || "غير محدد"}
                                    </div>
                                    <div>
                                        <i className="fa-regular fa-calendar px-1 text-muted" />
                                        {formatDate(booking.scheduledDate || booking.ScheduledDate)}
                                    </div>
                                </div>

                                <button
                                    className="btn w-100"
                                    onClick={() => navigate(`/booking-dto-manager/${booking.id}`)}
                                    style={{ fontSize: "14px", backgroundColor: "#EAEAEA", padding: "8px", color: "#666", borderRadius: "8px" }}
                                >
                                    التفاصيل
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BookingsTable;