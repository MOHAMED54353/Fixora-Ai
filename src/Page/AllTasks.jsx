import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import NavUser from "../Component/NavUser";
import axios from "../Utils/axiosConfig.jsx";
import TechnicianBookingCard from "../Component/TechnicianBookingCard";

const AllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [errorTasks, setErrorTasks] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const tasksPerPage = 4;
    const navigate = useNavigate();

    const user = useMemo(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            localStorage.removeItem("user");
            return null;
        }
    }, []);

    useEffect(() => {
        if (!user?.id) {
            setLoadingTasks(false);
            return;
        }

        const fetchTasks = async () => {
            setLoadingTasks(true);
            setErrorTasks(null);
            try {
                const res = await axios.get("/api/Bookings/my-assignments", {
                    params: {
                        TechnicianId: user.id,
                        PageSize: 100,
                        PageIndex: 1,
                    },
                });

                const allTasks = res.data?.data || res.data || [];
                const sortedTasks = allTasks.sort(
                    (a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate)
                );

                setTasks(Array.isArray(sortedTasks) ? sortedTasks : []);
            } catch (err) {
                console.error("❌ Error fetching tasks:", err);
                setErrorTasks("حدث خطأ أثناء تحميل المهمات");
            } finally {
                setLoadingTasks(false);
            }
        };

        fetchTasks();
    }, [user]);

    if (!user) {
        return (
            <div className="text-center mt-5">
                يجب تسجيل الدخول أولاً
            </div>
        );
    }

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(tasks.length / tasksPerPage);

    const renderTasks = () => {
        if (loadingTasks) return <p className="text-center">جاري تحميل المهمات...</p>;
        if (errorTasks) return <p className="text-center text-danger">{errorTasks}</p>;
        if (!tasks.length) return <p className="text-center">لا توجد مهمات حالياً</p>;

        return currentTasks.map((booking) => (
            <TechnicianBookingCard key={booking.id} booking={booking} />
        ));
    };

    return (
        <>
            <NavUser showMenu={false} />
            <section className="p-5">
                <div className="d-flex align-items-center justify-content-between my-5">
                    <h2 className="mb-3">جميع المهام</h2>
                    <p
                        className="ms-3"
                        onClick={() => navigate(-1)}
                        style={{ cursor: "pointer", color: "#007bff" }}
                    >
                        الرجوع <i className="fa-solid fa-arrow-left px-2"></i>
                    </p>
                </div>

                <div className="d-flex mb-4">
                    {!loadingTasks && tasks.length > 0 && (
                        <span
                            style={{
                                fontSize: "13px",
                                color: "#363535",
                                background: "#c7daff",
                                padding: "4px 12px",
                                borderRadius: "20px",
                            }}
                        >
                            عدد المهام ({tasks.length})
                        </span>
                    )}
                </div>

                <div className="task-list d-block mx-auto" style={{ width: "100%" }}>
                    {renderTasks()}
                </div>

                {/* Pagination */}
                {tasks.length > tasksPerPage && (
                    <div className="d-flex justify-content-center mt-4 gap-2">
                        <button
                            className="btn btn-outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            السابق
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="btn btn-outline"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            التالي
                        </button>
                    </div>
                )}
            </section>
        </>
    );
};

export default AllTasks;