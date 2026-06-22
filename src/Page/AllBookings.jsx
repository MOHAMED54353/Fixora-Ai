import React, { useEffect, useState } from 'react';
import BookingsTable from '../Component/BookingsTable';
import axios from '../Utils/axiosConfig';
import NavUser from '../Component/NavUser';

const PAGE_SIZE = 6;

const parseDate = (dateStr) => {
    if (!dateStr) return 0;
    const normalized = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : dateStr + 'Z';
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? 0 : date.getTime();
};

const STATUS_ORDER = {
    inprogress: 0,
    pending: 1,
    waitingclientapproval: 2,
    completed: 3,
    cancelled: 4,
};

const getStatusRank = (booking) => {
    const status = (booking.status || booking.Status || '').toLowerCase().replace(/\s/g, '');
    return STATUS_ORDER[status] ?? 99;
};

const AllBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [stats, setStats] = useState({ totalBookings: 0, inProgress: 0, completed: 0 });
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchAllBookings = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/Bookings/all", {
                    params: { PageSize: PAGE_SIZE, PageIndex: currentPage },
                });
                const raw = res.data.data || [];
                raw.sort((a, b) => {
                    const statusDiff = getStatusRank(a) - getStatusRank(b);
                    if (statusDiff !== 0) return statusDiff;
                    return parseDate(b.scheduledDate) - parseDate(a.scheduledDate);
                });
                setBookings(raw);
                setTotalCount(res.data.count || 0);
            } catch (err) {
                console.error("❌ Error fetching bookings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllBookings();
    }, [currentPage]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setStatsLoading(true);
                const res = await axios.get("/api/Admin/dashboard-stats");
                setStats({
                    totalBookings: res.data.totalBookings || 0,
                    inProgress: res.data.inProgressBookings || 0,
                    completed: res.data.completedBookings || 0,
                });
            } catch (err) {
                console.error("❌ Error fetching stats:", err);
            } finally {
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const goTo = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getPageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, 4, 5];
        if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };

    const statCards = [
        { label: "إجمالي الحجوزات", value: stats.totalBookings, icon: "fa-calendar-check", color: "#2A5CAF" },
        { label: "قيد التنفيذ", value: stats.inProgress, icon: "fa-spinner", color: "#F97316" },
        { label: "مكتملة", value: stats.completed, icon: "fa-circle-check", color: "#22C55E" },
    ];

    return (
        <>
            <NavUser showMenu={false} />
            <div className="px-3 py-3 px-md-5 mx-0 mx-md-4 mt-5 pt-3 text-center">
                <h3 style={{ fontSize: "30px", color: "#333D4D", marginTop: "20px" }}>كل الحجوزات</h3>
                <p style={{ fontSize: "18px", color: "#888" }}>عرض وإدارة جميع حجوزات الصيانة والخدمات</p>
            </div>

            <section className="px-3 px-md-5 mx-0 mx-md-4 pb-5">
                <div className="row py-5 g-3 mb-4">
                    {statCards.map(card => (
                        <div key={card.label} className="col-12 col-md-4">
                            <div style={{ backgroundColor: "white", padding: "28px 32px", borderRadius: "16px", height: "100%" }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <p className="mb-0" style={{ fontSize: "20px", color: "#333D4D" }}>{card.label}</p>
                                    <i className={`fa-solid ${card.icon}`} style={{ fontSize: "22px", color: card.color }} />
                                </div>
                                <h4 style={{ fontSize: "32px", fontWeight: "700", marginBottom: 0, color: "#1A202C" }}>
                                    {statsLoading ? "..." : card.value}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>

                <BookingsTable bookings={bookings} loading={loading} />

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="d-flex justify-content-center align-items-center flex-wrap gap-1 mt-4" style={{ direction: "ltr" }}>
                        <PagBtn onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}>‹</PagBtn>

                        {getPageNumbers()[0] > 1 && (
                            <>
                                <PagBtn onClick={() => goTo(1)} active={currentPage === 1}>1</PagBtn>
                                {getPageNumbers()[0] > 2 && <Ellipsis />}
                            </>
                        )}

                        {getPageNumbers().map(n => (
                            <PagBtn key={n} onClick={() => goTo(n)} active={currentPage === n}>{n}</PagBtn>
                        ))}

                        {getPageNumbers().at(-1) < totalPages && (
                            <>
                                {getPageNumbers().at(-1) < totalPages - 1 && <Ellipsis />}
                                <PagBtn onClick={() => goTo(totalPages)} active={currentPage === totalPages}>{totalPages}</PagBtn>
                            </>
                        )}

                        <PagBtn onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}>›</PagBtn>
                    </div>
                )}

                {!loading && totalCount > 0 && (
                    <p style={{ textAlign: "center", marginTop: "12px", fontSize: "13px", color: "#9CA3AF" }}>
                        عرض {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)} من {totalCount} حجز
                    </p>
                )}
            </section>
        </>
    );
};

const PagBtn = ({ children, onClick, active, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            width: "38px", height: "38px",
            borderRadius: "10px",
            border: active ? "none" : "1px solid #E5E7EB",
            background: active ? "#2A5CAF" : "white",
            color: active ? "#fff" : disabled ? "#D1D5DB" : "#374151",
            fontWeight: active ? "700" : "400",
            fontSize: "15px",
            cursor: disabled ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
        }}
    >
        {children}
    </button>
);

const Ellipsis = () => (
    <span style={{ width: "38px", textAlign: "center", color: "#9CA3AF", fontSize: "15px" }}>…</span>
);

export default AllBookings;