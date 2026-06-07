import { useState, useEffect } from "react";
import { useNavigate } from "react-router"
import NavUser from "../Component/NavUser";
import axios from "../Utils/axiosConfig.jsx";
import TechnicianBookingCard from "../Component/TechnicianBookingCard";
import ReviewCard from "../Component/ReviewCard";

const Technican = () => {
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [errorTasks, setErrorTasks] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const navigate = useNavigate();

    const user = (() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch {
                localStorage.removeItem("user");
                return null;
            }
        }
        return null;
    })();

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user?.id) {
                setLoadingTasks(false);
                return;
            }
            try {
                const res = await axios.get("/api/Bookings/my-assignments", {
                    params: {
                        TechnicianId: user.id,
                        PageSize: 50,
                        PageIndex: 1,
                    },
                });

                const sorted = (res.data.data ?? [])
                    .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
                    .slice(0, 4); // أحدث 4 مهام فقط

                setTasks(sorted);
            } catch (err) {
                console.error("❌ Error fetching tasks:", err);
                setErrorTasks("حدث خطأ أثناء تحميل المهمات");
            } finally {
                setLoadingTasks(false);
            }
        };
        fetchTasks();
    }, [user?.id]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get("/api/Reviews/my-reviews");
                const sortedReviews = (res.data ?? []).sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setReviews(sortedReviews.slice(0, 6));
            } catch (err) {
                console.error("❌ Error fetching reviews:", err);
            } finally {
                setLoadingReviews(false);
            }
        };
        fetchReviews();
    }, []);

    if (!user) {
        return (
            <div className="text-center mt-5">
                يجب تسجيل الدخول أولاً
            </div>
        );
    }

    return (
        <>
            <NavUser showMenu={false} />
            <section className="p-5">
                <div className="d-flex align-items-center justify-content-between  my-5">
                    <h2 className="mb-3">مهامي الحالية</h2>
                    <p
                        className="ms-3"
                        onClick={() => navigate("/all-tasks")}
                        style={{cursor: "pointer", color: "#007bff"}}
                        >
                        جميع المهام <i className="fa-solid fa-arrow-left px-2"></i>
                    </p>
                </div>

                {/* المهام الأخيرة */}
                <div className="d-flex mb-4">
                    {!loadingTasks && tasks.length > 0 && (
                        <span style={{
                            fontSize: "13px",
                            color: "#363535",
                            background: "#c7daff",
                            padding: "4px 12px",
                            borderRadius: "20px",
                        }}>
                            آخر {tasks.length} مهام
                        </span>
                    )}
                </div>

                <div className="task-list d-block mx-auto" style={{ width: "100%" }}>
                    {loadingTasks ? (
                        <p className="text-center">جاري تحميل المهمات...</p>
                    ) : errorTasks ? (
                        <p className="text-center text-danger">{errorTasks}</p>
                    ) : tasks.length === 0 ? (
                        <p className="text-center">لا توجد مهمات حالياً</p>
                    ) : (
                        tasks.map((booking) => (
                            <TechnicianBookingCard key={booking.id} booking={booking} />
                        ))
                    )}
                </div>

                <div className="d-block my-5">
                    <h2>تقييماتي الأخيرة</h2>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "16px",
                    }}
                    loading={loadingReviews}
                >
                    {reviews.slice(0, 6).map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>

            </section>
        </>
    );
};

export default Technican;