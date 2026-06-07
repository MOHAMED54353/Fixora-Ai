import React from "react";
import { useNavigate } from "react-router";

const BookingsTable = ({ bookings, loading }) => {
    const navigate = useNavigate();

    if (loading) return <p className="text-center">جارٍ تحميل الحجوزات...</p>;
    if (!bookings || bookings.length === 0)
        return <p className="text-center text-muted"> مفيش حجوزات النهاردة ي معلم</p>;

    const tableContainerStyle = {
        borderTop: "1px solid #DFDFDF",
        borderRight: "1px solid #DFDFDF",
        borderBottom: "0",
        borderLeft: "1px solid #DFDFDF",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
    };

    const headerStyle = {
        backgroundColor: "#f6f7fb",
        color: "#333D4D",
        fontSize: "16px",
        padding: "24px",
        fontWeight: "bold",
        borderBottom: "1px solid #DFDFDF",
    };

    const cellStyle = {
        padding: "24px",
        verticalAlign: "middle",
        color: "#333D4D",
        fontSize: "16px",
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
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
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
                        const status = statusMap[rawStatus] || rawStatus;
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
                                    {booking.brand || booking.Brand || "-"}
                                    <br />
                                    {booking.model || booking.Model || "-"}
                                </td>

                                <td style={cellStyle} className="text-center">
                                    <span
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: "16px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            ...badgeStyle,
                                        }}
                                    >
                                        {status}
                                    </span>
                                </td>

                                <td style={cellStyle} className="text-center">
                                    {booking.technicianName || booking.TechnicianName || "غير محدد"}
                                </td>

                                <td style={cellStyle} className="text-center">
                                    {formatDate(booking.scheduledDate || booking.ScheduledDate)}
                                </td>

                                <td style={cellStyle} className="text-center">
                                    <div className="d-flex justify-content-center gap-2">
                                        <button
                                            className="btn"
                                            onClick={() =>
                                                navigate(`/booking-dto-manager/${booking.id}`)                                            }
                                            style={{
                                                fontSize: "14px",
                                                backgroundColor: "#EAEAEA",
                                                padding: "8px 16px",
                                                color: "#666666",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            التفاصيل
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BookingsTable;