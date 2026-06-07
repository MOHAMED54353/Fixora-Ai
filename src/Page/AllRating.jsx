import React, { useEffect, useState } from 'react'
import NavUser from '../Component/NavUser'
import RatingCard from '../Component/RatingCard'
import axios from '../Utils/axiosConfig'

const AllRating = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get('/api/Reviews/all');
                console.log(' Reviews response:', res.data);
                setReviews(Array.isArray(res.data) ? res.data : res.data.data ?? []);
            } catch (err) {
                console.error('❌ Error fetching reviews:', err);
                setError("حدث خطأ أثناء جلب التقييمات");
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    return (
        <>
            <NavUser showMenu={false} />
            <div className="all-rating d-flex flex-column align-items-center p-5">
                <h3 style={{ fontSize: "34px", color: "#333D4D" }}>جميع التقييمات</h3>
                <p>عرض وإدارة تقييمات العملاء لخدمات الفنيين</p>
            </div>

            <div className="px-4 pb-5">
                {loading && <p className="text-center">جاري تحميل التقييمات...</p>}
                {error && <p className="text-center text-danger">{error}</p>}
                {!loading && !error && reviews.length === 0 && (
                    <p className="text-center text-muted">لا توجد تقييمات بعد</p>
                )}
                {reviews.map((review) => (
                    <RatingCard key={review.id} review={review} />
                ))}
            </div>
        </>
    );
};

export default AllRating;