import React, { useEffect, useState } from 'react';
import axios from '../Utils/axiosConfig';
import BookingCard from '../Component/BookingCard.jsx';
import NavUser from '../Component/NavUser.jsx';
import AiBtn from '../Component/AiBtn.jsx';

const ITEMS_PER_PAGE = 5;

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/Bookings/my-bookings', {
                    params: { PageIndex: 1, PageSize: 1000 }
                });
                setBookings(response.data.data);
            } catch (err) {
                console.error(err);
                setError('حدث خطأ أثناء جلب الحجوزات');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const inProgressStatuses = ["InProgress", "WaitingClientApproval"];
    const pendingCount = bookings.filter(b =>
        inProgressStatuses.includes(b.status)
    ).length;
    const completedCount = bookings.filter(b =>
        b.status === "Completed"
    ).length;

    const filteredBookings = bookings.filter((b) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "inProgress") {
            return inProgressStatuses.includes(b.status);
        }
        if (activeFilter === "completed") {
            return b.status === "Completed";
        }
        return true;
    });

    // Pagination
    const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
    const indexOfFirst = (currentPage - 1) * ITEMS_PER_PAGE;
    const indexOfLast = indexOfFirst + ITEMS_PER_PAGE;

    const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 4) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 3) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <>
            <NavUser />
            <section className="section1 p-4 mx-3">
                <div
                    className="d-flex flex-wrap justify-content-around gap-5"
                    style={{ marginTop: "50px" }}
                >
                    {[
                        { title: "إجمالي الحجوزات", count: bookings.length, icon: "fa-paperclip text-warning", filter: "all" },
                        { title: "قيد التنفيذ", count: pendingCount, icon: "fa-gear text-primary", filter: "inProgress" },
                        { title: "مكتملة", count: completedCount, icon: "fa-circle-check text-success", filter: "completed" }
                    ].map((item, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setActiveFilter(item.filter);
                                setCurrentPage(1);
                            }}
                            style={{
                                backgroundColor: activeFilter === item.filter ? "#e7f1ff" : "white",
                                border: activeFilter === item.filter ? "2px solid #0d6dfdbe" : "none",
                                padding: "24px",
                                borderRadius: "16px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                maxWidth: "350px",
                                flex: "1 250px",
                                cursor: "pointer",
                                transition: "0.3s"
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <p style={{ fontSize: "22px", margin: 0 }}>{item.title}</p>
                                <i className={`fa-solid ${item.icon} fs-5 pb-3`}></i>
                            </div>
                            <h4>{item.count}</h4>
                        </div>
                    ))}
                </div>
            </section>

            <div className="profile-bookings-container p-3 m-5">
                <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '50px' }}>
                    <h2 className="m-0">جميع الحجوزات</h2>
                    {!loading && filteredBookings.length > 0 && (
                        <span className="text-muted" style={{ fontSize: "14px" }}>
                            عرض {indexOfFirst + 1}-{Math.min(indexOfLast, filteredBookings.length)} من {filteredBookings.length}
                        </span>
                    )}
                </div>
                {loading && <p>جارٍ تحميل الحجوزات...</p>}
                {error && <p className="text-danger">{error}</p>}
                {!loading && filteredBookings.length === 0 && <p>لا توجد حجوزات</p>}

                {currentBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                ))}

                {/*Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-5 flex-wrap">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                border: "1px solid #dee2e6",
                                borderRadius: "8px",
                                padding: "8px 14px",
                                backgroundColor: currentPage === 1 ? "#f8f9fa" : "white",
                                cursor: currentPage === 1 ? "not-allowed" : "pointer"
                            }}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>

                        {/* Pages */}
                        {getPageNumbers().map((page, idx) =>
                            page === '...' ? (
                                <span key={idx}>...</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    style={{
                                        border: "1px solid",
                                        borderColor: currentPage === page ? "#0d6efd" : "#dee2e6",
                                        borderRadius: "8px",
                                        padding: "8px 14px",
                                        backgroundColor: currentPage === page ? "#333DAD" : "white",
                                        color: currentPage === page ? "white" : "#495057"
                                    }}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                border: "1px solid #dee2e6",
                                borderRadius: "8px",
                                padding: "8px 14px",
                                backgroundColor: currentPage === totalPages ? "#f8f9fa" : "white",
                                cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                            }}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                    </div>
                )}
            </div>
            <AiBtn />
        </>
    );
};

export default Bookings;