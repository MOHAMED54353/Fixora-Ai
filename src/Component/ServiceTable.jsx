import React from "react";

const CATEGORY_MAP = {
    oil_change: { label: "تغيير زيت", color: "#ebf7fe", text: "#2563EB", icon: "fa-oil-can" },
    oil_leak: { label: "تسريب زيت", color: "#fff3e0", text: "#e65100", icon: "fa-droplet" },
    brakes: { label: "فرامل", color: "#fce4ec", text: "#c2185b", icon: "fa-circle-stop" },
    tires: { label: "إطارات", color: "#f3e5f5", text: "#7b1fa2", icon: "fa-circle" },
    alignment_balancing: { label: "ضبط زوايا وتوازن", color: "#e8f5e9", text: "#2e7d32", icon: "fa-sliders" },
    suspension: { label: "تعليق", color: "#e3f2fd", text: "#1565c0", icon: "fa-car-bump" },
    steering: { label: "توجيه", color: "#fce4ec", text: "#880e4f", icon: "fa-steering-wheel" },
    transmission: { label: "ناقل حركة", color: "#fff8e1", text: "#f57f17", icon: "fa-gears" },
    ac: { label: "تكييف", color: "#e1f5fe", text: "#0277bd", icon: "fa-snowflake" },
    cooling: { label: "تبريد", color: "#e0f7fa", text: "#00695c", icon: "fa-temperature-low" },
    engine: { label: "محرك", color: "#fbe9e7", text: "#bf360c", icon: "fa-engine" },
    exhaust: { label: "عادم", color: "#efebe9", text: "#4e342e", icon: "fa-pipe-smoking" },
    starting: { label: "تشغيل", color: "#f9fbe7", text: "#558b2f", icon: "fa-key" },
    electrical: { label: "كهرباء", color: "#e4f6fb", text: "#05a0fa", icon: "fa-bolt" },
    battery: { label: "بطارية", color: "#fffde7", text: "#f9a825", icon: "fa-battery-full" },
    cleaning: { label: "تنظيف", color: "#F0FDF4", text: "#059669", icon: "fa-spray-can-sparkles" },
    فحص: { label: "فحص", color: "#ffe1ef", text: "#7E60BF", icon: "fa-magnifying-glass" },
    "صيانة دورية": { label: "صيانة دورية", color: "#ebf7fe", text: "#2563EB", icon: "fa-screwdriver-wrench" },
    إصلاح: { label: "إصلاح", color: "#e2eefa", text: "#05a0fa", icon: "fa-wrench" },
};

const getCategoryInfo = (category) =>
    CATEGORY_MAP[category] || { label: category, color: "#fad5d5", text: "#333D4D", icon: "fa-gear" };

const ServiceTable = ({ services, loading, onDelete, onEdit, page, totalPages, totalCount, pageSize, onPageChange }) => {

    const btnBase = {
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: "36px", height: "36px", borderRadius: "8px",
        border: "1px solid #DFDFDF", backgroundColor: "#fff",
        cursor: "pointer", fontSize: "14px", transition: "all 0.15s",
    };

    if (loading) return <p className="text-center py-4">جارٍ تحميل الخدمات...</p>;
    if (!services || services.length === 0) return <p className="text-center text-muted py-4">لا توجد خدمات متاحة</p>;

    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, totalCount);

    return (
        <div>
            {/* Desktop Table */}
            <div className="d-none d-md-block">
                <div style={{
                    border: "1px solid #DFDFDF", borderBottom: 0,
                    borderRadius: "16px", overflow: "hidden", backgroundColor: "#fff",
                }}>
                    <table className="table m-0">
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: "#f6f7fb", color: "#333D4D", fontSize: "16px", padding: "20px 24px", fontWeight: "bold", borderBottom: "1px solid #DFDFDF" }}>اسم الخدمة</th>
                                <th style={{ backgroundColor: "#f6f7fb", color: "#333D4D", fontSize: "16px", padding: "20px 24px", fontWeight: "bold", borderBottom: "1px solid #DFDFDF", textAlign: "center" }}>الفئة</th>
                                <th style={{ backgroundColor: "#f6f7fb", color: "#333D4D", fontSize: "16px", padding: "20px 24px", fontWeight: "bold", borderBottom: "1px solid #DFDFDF", textAlign: "center" }}>السعر</th>
                                <th style={{ backgroundColor: "#f6f7fb", color: "#333D4D", fontSize: "16px", padding: "20px 24px", fontWeight: "bold", borderBottom: "1px solid #DFDFDF", textAlign: "center" }}>المدة</th>
                                <th style={{ backgroundColor: "#f6f7fb", color: "#333D4D", fontSize: "16px", padding: "20px 24px", fontWeight: "bold", borderBottom: "1px solid #DFDFDF", textAlign: "center" }}>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service, index) => {
                                const cat = getCategoryInfo(service.category || service.Category);
                                return (
                                    <tr key={service.id || index}>
                                        <td style={{ padding: "20px 24px", verticalAlign: "middle", color: "#333D4D", fontSize: "16px", borderBottom: "1px solid #DFDFDF" }} className="fw-bold">
                                            <div className="d-flex align-items-center gap-2">
                                                <i className={`fa-solid ${cat.icon}`} style={{ color: cat.text, fontSize: "15px" }} />
                                                {service.name || service.Name}
                                            </div>
                                        </td>
                                        <td style={{ padding: "20px 24px", verticalAlign: "middle", borderBottom: "1px solid #DFDFDF", textAlign: "center" }}>
                                            <span style={{ padding: "6px 14px", borderRadius: "24px", fontSize: "12px", fontWeight: "500", backgroundColor: cat.color, color: cat.text }}>
                                                {cat.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: "20px 24px", verticalAlign: "middle", color: "#666", borderBottom: "1px solid #DFDFDF", textAlign: "center" }}>
                                            <i className="fa-solid fa-sack-dollar text-warning px-1" />
                                            {service.basePrice || service.BasePrice} جنيه
                                        </td>
                                        <td style={{ padding: "20px 24px", verticalAlign: "middle", color: "#666", borderBottom: "1px solid #DFDFDF", textAlign: "center" }}>
                                            <i className="fa-regular fa-clock px-1" />
                                            {service.estimatedDurationMinutes || service.EstimatedDurationMinutes} دقيقة
                                        </td>
                                        <td style={{ padding: "20px 24px", verticalAlign: "middle", borderBottom: "1px solid #DFDFDF", textAlign: "center" }}>
                                            <div className="d-flex justify-content-center gap-2">
                                                <button className="btn btn-link p-0 text-primary" onClick={() => onEdit(service)} style={{ fontSize: "18px" }}>
                                                    <i className="fa-regular fa-pen-to-square fs-5" />
                                                </button>
                                                <button className="btn btn-link p-0 text-danger" onClick={() => onDelete(service.id)} style={{ fontSize: "18px" }}>
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
            </div>

            {/* Mobile Cards */}
            <div className="d-md-none">
                <div className="d-flex flex-column gap-3">
                    {services.map((service, index) => {
                        const cat = getCategoryInfo(service.category || service.Category);
                        return (
                            <div key={service.id || index} style={{
                                background: "#fff", borderRadius: "12px",
                                border: "1px solid #DFDFDF", padding: "16px",
                            }}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="d-flex align-items-center gap-2 fw-bold" style={{ fontSize: "15px", color: "#333D4D" }}>
                                        <i className={`fa-solid ${cat.icon}`} style={{ color: cat.text }} />
                                        {service.name || service.Name}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-link p-0 text-primary" onClick={() => onEdit(service)} style={{ fontSize: "16px" }}>
                                            <i className="fa-regular fa-pen-to-square" />
                                        </button>
                                        <button className="btn btn-link p-0 text-danger" onClick={() => onDelete(service.id)} style={{ fontSize: "16px" }}>
                                            <i className="fa-regular fa-trash-can" />
                                        </button>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                                    <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500", backgroundColor: cat.color, color: cat.text }}>
                                        {cat.label}
                                    </span>
                                    <span style={{ fontSize: "13px", color: "#666" }}>
                                        <i className="fa-solid fa-sack-dollar text-warning px-1" />
                                        {service.basePrice || service.BasePrice} جنيه
                                    </span>
                                    <span style={{ fontSize: "13px", color: "#666" }}>
                                        <i className="fa-regular fa-clock px-1" />
                                        {service.estimatedDurationMinutes || service.EstimatedDurationMinutes} دقيقة
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3" style={{ direction: "rtl" }}>
                    <span style={{ fontSize: "14px", color: "#888" }}>
                        عرض {from}–{to} من {totalCount} خدمة
                    </span>
                    <div className="d-flex gap-1 align-items-center flex-wrap">
                        <button
                            style={{ ...btnBase, color: page === 1 ? "#ccc" : "#333D4D", cursor: page === 1 ? "not-allowed" : "pointer" }}
                            onClick={() => onPageChange(page - 1)} disabled={page === 1}
                        >
                            <i className="fa-solid fa-chevron-right" style={{ fontSize: "12px" }} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <button key={num} style={{
                                ...btnBase,
                                backgroundColor: num === page ? "#2A5CAF" : "#fff",
                                color: num === page ? "#fff" : "#333D4D",
                                border: `1px solid ${num === page ? "#2A5CAF" : "#DFDFDF"}`,
                                fontWeight: num === page ? "bold" : "normal",
                            }} onClick={() => onPageChange(num)}>{num}</button>
                        ))}
                        <button
                            style={{ ...btnBase, color: page === totalPages ? "#ccc" : "#333D4D", cursor: page === totalPages ? "not-allowed" : "pointer" }}
                            onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
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