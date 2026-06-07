import React, { useEffect, useState } from 'react';
import BookingsTable from '../Component/BookingsTable';
import axios from '../Utils/axiosConfig';
import NavUser from '../Component/NavUser';

const PAGE_SIZE = 6;

const parseDate = (dateStr) => {
    if (!dateStr) return 0;
    const normalized =
        dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : dateStr + 'Z';
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
    const [stats, setStats] = useState({
        totalBookings: 0,
        inProgress: 0,
        completed: 0,
    });
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchAllBookings = async () => {
            try {
                setLoading(true);
                let allBookings = [];
                let pageIndex = 1;
                let totalPages = 1;

                do {
                    const res = await axios.get("/api/Bookings/all", {
                        params: {
                            PageSize: 50,
                            PageIndex: pageIndex,
                        }
                    });
                    allBookings = allBookings.concat(res.data.data || []);
                    totalPages = Math.ceil(res.data.count / (res.data.pageSize || 50));
                    pageIndex++;
                } while (pageIndex <= totalPages);

                allBookings.sort((a, b) => {
                    const statusDiff = getStatusRank(a) - getStatusRank(b);
                    if (statusDiff !== 0) return statusDiff;
                    return parseDate(b.scheduledDate || b.ScheduledDate) - parseDate(a.scheduledDate || a.ScheduledDate);
                });

                setBookings(allBookings);
            } catch (err) {
                console.error("❌ Error fetching bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllBookings();
    }, []);

    // fetch stats from API
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

    // pagination
    const totalPages = Math.ceil(bookings.length / PAGE_SIZE);
    const paginatedData = bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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

    return (
        <>
            <NavUser showMenu={false} />
            <div className="container d-flex flex-column justify-content-center mx-auto mt-5">
                <h3 style={{ fontSize: "36px", color: "#333D4D", marginTop: "50px" }}>كل الحجوزات</h3>
                <p style={{ fontSize: "22px" }}>عرض وإدارة جميع حجوزات الصيانة والخدمات</p>
            </div>

            <section className="section1 p-5 mx-auto">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    {[
                        { label: "إجمالي الحجوزات", value: statsLoading ? "جارٍ التحميل..." : stats.totalBookings },
                        { label: "قيد التنفيذ", value: statsLoading ? "جارٍ التحميل..." : stats.inProgress },
                        { label: "مكتملة", value: statsLoading ? "جارٍ التحميل..." : stats.completed },
                    ].map(card => (
                        <div key={card.label} style={{ minWidth: "380px", backgroundColor: "white", padding: "24px", borderRadius: "16px", margin: "12px 0" }}>
                            <p style={{ fontSize: "22px", marginBottom: "8px" }}>{card.label}</p>
                            <h4>{card.value}</h4>
                        </div>
                    ))}
                </div>

                <BookingsTable bookings={paginatedData} loading={loading} />

                {/* pagination */}
                {!loading && totalPages > 1 && (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "28px",
                        direction: "ltr",
                    }}>
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

                {!loading && bookings.length > 0 && (
                    <p style={{ textAlign: "center", marginTop: "12px", fontSize: "13px", color: "#9CA3AF" }}>
                        عرض {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, bookings.length)} من {bookings.length} حجز
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