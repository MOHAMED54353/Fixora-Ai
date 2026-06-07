import React from "react";

const ServiceTable = ({ services, loading, onDelete, onEdit, page, totalPages, totalCount, pageSize, onPageChange }) => {

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

    const getBadgeStyle = (category) => {
        const styles = {
            "فحص": { backgroundColor: "#ffe1ef", color: "#7E60BF" },
            "صيانة دورية": { backgroundColor: "#ebf7fe", color: "#2563EB" },
            "تنظيف": { backgroundColor: "#F0FDF4", color: "#059669" },
            "كهرباء": { backgroundColor: "#e4f6fb", color: "#05a0fa" },
            "إصلاح": { backgroundColor: "#e2eefa", color: "#05a0fa" },
        };
        return styles[category] || { backgroundColor: "#fad5d5", color: "#333D4D" };
    };

    const getBadgeIcon = (category) => {
        const icons = {
            "فحص": "fa-magnifying-glass",
            "صيانة دورية": "fa-screwdriver-wrench",
            "تنظيف": "fa-spray-can-sparkles",
            "كهرباء": "fa-bolt",
            "إصلاح": "fa-wrench",
        };
        return icons[category] || "fa-gear";
    };

    const btnBase = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        border: "1px solid #DFDFDF",
        backgroundColor: "#fff",
        cursor: "pointer",
        fontSize: "14px",
        fontFamily: "Cairo, sans-serif",
        transition: "all 0.15s",
    };

    if (loading) return <p className="text-center py-4">جارٍ تحميل الخدمات...</p>;
    if (!services || services.length === 0) return <p className="text-center text-muted py-4">لا توجد خدمات متاحة</p>;

    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, totalCount);

    return (
        <div>
            <div className="table-responsive" style={tableContainerStyle}>
                <table className="table m-0">
                    <thead>
                        <tr>
                            <th style={headerStyle}>اسم الخدمة</th>
                            <th style={{ ...headerStyle, textAlign: "center" }}>الفئة</th>
                            <th style={{ ...headerStyle, textAlign: "center" }}>السعر</th>
                            <th style={{ ...headerStyle, textAlign: "center" }}>المدة</th>
                            <th style={{ ...headerStyle, textAlign: "center" }}>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service, index) => {
                            const categoryName = service.category || service.Category;
                            const badgeStyle = getBadgeStyle(categoryName);

                            return (
                                <tr key={service.id || index}>
                                    <td style={cellStyle} className="fw-bold">
                                        <div className="d-flex align-items-center gap-2">
                                            <i
                                                className={`fa-solid ${getBadgeIcon(categoryName)}`}
                                                style={{ color: badgeStyle.color, fontSize: "15px" }}
                                            />
                                            {service.name || service.Name}
                                        </div>
                                    </td>
                                    <td style={cellStyle} className="text-center">
                                        <span style={{ padding: "8px 16px", borderRadius: "24px", fontSize: "12px", ...badgeStyle }}>
                                            {categoryName}
                                        </span>
                                    </td>
                                    <td style={cellStyle} className="text-center text-muted">
                                        <i className="fa-solid fa-sack-dollar text-warning px-1" />
                                        {service.basePrice || service.BasePrice} جنيه
                                    </td>
                                    <td style={cellStyle} className="text-center text-muted">
                                        <i className="fa-regular fa-clock px-1" />
                                        {service.estimatedDurationMinutes || service.EstimatedDurationMinutes} دقيقة
                                    </td>
                                    <td style={cellStyle} className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button
                                                className="btn btn-link p-0 text-primary"
                                                onClick={() => onEdit(service)}
                                                style={{ fontSize: "18px" }}
                                            >
                                                <i className="fa-regular fa-pen-to-square fs-5" />
                                            </button>
                                            <button
                                                className="btn btn-link p-0 text-danger"
                                                onClick={() => onDelete(service.id)}
                                                style={{ fontSize: "18px" }}
                                            >
                                                <i className="fa-regular fa-trash-can fs-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "16px",
                    padding: "0 4px",
                    direction: "rtl",
                }}>
                    <span style={{ fontSize: "14px", color: "#888" }}>
                        عرض {from}–{to} من {totalCount} خدمة
                    </span>

                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <button
                            style={{ ...btnBase, color: page === 1 ? "#ccc" : "#333D4D", cursor: page === 1 ? "not-allowed" : "pointer" }}
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                        >
                            <i className="fa-solid fa-chevron-right" style={{ fontSize: "12px" }} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <button
                                key={num}
                                style={{
                                    ...btnBase,
                                    backgroundColor: num === page ? "#2A5CAF" : "#fff",
                                    color: num === page ? "#fff" : "#333D4D",
                                    border: `1px solid ${num === page ? "#2A5CAF" : "#DFDFDF"}`,
                                    fontWeight: num === page ? "bold" : "normal",
                                }}
                                onClick={() => onPageChange(num)}
                            >
                                {num}
                            </button>
                        ))}

                        <button
                            style={{ ...btnBase, color: page === totalPages ? "#ccc" : "#333D4D", cursor: page === totalPages ? "not-allowed" : "pointer" }}
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            <i className="fa-solid fa-chevron-left" style={{ fontSize: "12px" }} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceTable;