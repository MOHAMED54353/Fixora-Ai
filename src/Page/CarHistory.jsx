import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from '../Utils/axiosConfig';
import NavUser from '../Component/NavUser';
import { FaCar, FaIdCard, FaCalendarCheck, FaMoneyBillWave, FaArrowRight, FaWrench, FaUserCog, FaChevronLeft } from 'react-icons/fa';

const statusMap = {
    InProgress: "قيد التنفيذ",
    WaitingClientApproval: "بانتظار موافقة العميل",
    Cancelled: "ملغاة",
    Completed: "مكتملة",
    Pending: "معلقة",
};

const getBadgeStyle = (status) => {
    const styles = {
        Completed: { backgroundColor: "#DCFCE7", color: "#16A34A" },
        InProgress: { backgroundColor: "#FFEDD5", color: "#EA580C" },
        Pending: { backgroundColor: "#FEF9C3", color: "#CA8A04" },
        Cancelled: { backgroundColor: "#FEE2E2", color: "#DC2626" },
        WaitingClientApproval: { backgroundColor: "#EEF2FF", color: "#4F46E5" },
    };
    return styles[status] || { backgroundColor: "#F3F4F6", color: "#6B7280" };
};

const formatDate = (date) => {
    if (!date) return "-";
    const normalized = date.endsWith('Z') || date.includes('+') ? date : date + 'Z';
    const d = new Date(normalized);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
};

const formatMoney = (value) => {
    if (value === null || value === undefined) return "-";
    return `${value.toLocaleString("ar-EG")} ج.م`;
};

const CarHistory = () => {
    const { id: vehicleId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(`/api/Vehicles/${vehicleId}/history`);
                setData(res.data);
            } catch (err) {
                console.error("❌ Error fetching car history:", err);
                setError("تعذر تحميل تاريخ الصيانة الآن، حاول مرة أخرى.");
            } finally {
                setLoading(false);
            }
        };
        if (vehicleId) fetchHistory();
    }, [vehicleId]);

    const summaryCards = data ? [
        { label: "عدد الزيارات", value: `${data.totalVisits ?? 0} زيارات`, icon: FaCalendarCheck, color: "#2A5CAF" },
        { label: "إجمالي المصروف", value: formatMoney(data.totalSpent), icon: FaMoneyBillWave, color: "#22C55E" },
        { label: "آخر صيانة", value: formatDate(data.lastMaintenanceDate), icon: FaWrench, color: "#F97316" },
    ] : [];

    return (
        <>
            <style>{`
                .custom-timeline {
                    position: relative;
                    border-right: 3px solid #E2E8F0;
                    padding-right: 28px;
                }
                .timeline-item-container {
                    position: relative;
                    margin-bottom: 24px;
                }
                .timeline-item-container::before {
                    content: '';
                    position: absolute;
                    right: -36px;
                    top: 24px;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background-color: #2A5CAF;
                    border: 4px solid #FFF;
                    box-shadow: 0 0 0 2px #CBD5E1;
                    z-index: 2;
                }
                .service-tag {
                    background-color: #EFF6FF;
                    color: #1E40AF;
                    border: 1px solid #BFDBFE;
                    font-size: 13px;
                    padding: 4px 12px;
                    border-radius: 8px;
                    font-weight: 500;
                }
                .history-card-hover {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .history-card-hover:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05) !important;
                }
            `}</style>
            <NavUser showMenu={false} />
            <div className="px-3 py-3 px-md-5 mx-0 mx-md-4 mt-5 pt-3">
                <button
                    className="btn btn-light d-flex align-items-center gap-2 rounded-pill shadow-sm"
                    onClick={() => navigate(-1)}
                    style={{ color: "#2A5CAF", fontWeight: "600", fontSize: "14px", border: "1px solid #E2E8F0" }}
                >
                    <FaArrowRight size={13} />
                    رجوع
                </button>

                <div className="text-center mt-3">
                    <h3 className="fw-bold" style={{ color: "#333D4D" }}>تاريخ الصيانة</h3>
                </div>
            </div>

            <section className="px-3 px-md-5 mx-0 mx-md-4 pb-5">
                {loading && (
                    <p className="text-center text-muted py-5">جارٍ تحميل بيانات السيارة...</p>
                )}

                {!loading && error && (
                    <div className="text-center py-5">
                        <p style={{ color: "#DC2626" }}>{error}</p>
                        <button
                            className="btn rounded-pill px-4"
                            onClick={() => window.location.reload()}
                            style={{ backgroundColor: "#2A5CAF", color: "#fff" }}
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                )}

                {!loading && !error && data && (
                    <>
                        <div className="card shadow-sm border-0 rounded-4 mb-4">
                            <div className="card-body p-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                                        style={{ width: "64px", height: "64px", backgroundColor: "#F6F7FB" }}
                                    >
                                        <FaCar size={30} color="#2A5CAF" />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1" style={{ color: "#1A202C" }}>
                                            {data.brand} {data.model}
                                        </h5>
                                    </div>
                                </div>
                                
                                <div className="d-flex align-items-center gap-2">
                                    <FaIdCard size={18} color="#475569" />
                                    <span>{data.plateNumber || "غير محدد"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-5">
                            {summaryCards.map(card => (
                                <div key={card.label} className="col-12 col-md-4">
                                    <div className="card shadow-sm border-0 rounded-4 h-100">
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <p className="mb-0 text-muted" style={{ fontSize: "15px" }}>{card.label}</p>
                                                <card.icon size={20} color={card.color} />
                                            </div>
                                            <h4 className="fw-bold mb-0" style={{ color: "#1A202C" }}>
                                                {card.value}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h5 className="fw-bold mb-4" style={{ color: "#333D4D" }}>الجدول الزمني للإصلاحات</h5>

                        {(!data.history || data.history.length === 0) ? (
                            <p className="text-center text-muted py-5">لا يوجد سجل صيانة لهذه السيارة بعد</p>
                        ) : (
                            <div className="custom-timeline mx-2">
                                {data.history.map((item) => {
                                    const badgeStyle = getBadgeStyle(item.status);
                                    return (
                                        <div key={item.bookingId} className="timeline-item-container">
                                            <div
                                                className="card border-0 rounded-4 shadow-sm history-card-hover"
                                                role="button"
                                                onClick={() => navigate(`/booking-dto-manager/${item.bookingId}`)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-3 mb-3" style={{ borderBottom: "1px dashed #E2E8F0" }}>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <span className="fw-bold" style={{ fontSize: "16px", color: "#1A202C" }}>
                                                                حجز {item.bookingNumber}
                                                            </span>
                                                            <span className="text-muted" style={{ fontSize: "13px" }}>
                                                                {formatDate(item.scheduledDate)}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className="rounded-pill px-3 py-1 fw-semibold text-center"
                                                            style={{ fontSize: "12px", ...badgeStyle }}
                                                        >
                                                            {statusMap[item.status] || item.status}
                                                        </span>
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {item.services && item.services.length > 0 ? (
                                                                item.services.map((service, index) => (
                                                                    <span key={index} className="service-tag">
                                                                        {service}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-muted small">لا توجد خدمات مسجلة</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2">
                                                        <p className="mb-0 d-flex align-items-center gap-2" style={{ fontSize: "13px", color: "#475569" }}>
                                                            <FaUserCog size={14} color="#9CA3AF" />
                                                            <span>الفني المسؤول: <strong>{item.technicianName || "غير محدد"}</strong></span>
                                                        </p>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <p className="mb-0 fw-bold" style={{ fontSize: "16px", color: "#16A34A" }}>
                                                                {formatMoney(item.totalCost)}
                                                            </p>
                                                            <FaChevronLeft size={12} color="#9CA3AF" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    );
};

export default CarHistory;