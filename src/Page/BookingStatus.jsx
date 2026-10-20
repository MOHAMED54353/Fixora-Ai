import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router'
import axios from '../Utils/axiosConfig'
import NavUser from '../Component/NavUser'
import Status from "../Component/Status"
import BookingSummaryCards from "../Component/BookingSummaryCards"
import AdditionalIssuesCard from "../Component/AdditionalIssuesCard"
import { useNavigate } from 'react-router'

const BookingStatus = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [issueMessages, setIssueMessages] = useState({});

    const fetchBooking = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/Bookings/${id}`);
            setBooking(res.data);
        } catch (err) {
            console.error(err);
            setError("حصل خطأ أثناء جلب تفاصيل الحجز");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBooking();
    }, [fetchBooking]);

    const handleCancelBooking = async () => {
        if (!window.confirm("متأكد إنك عايز تلغي الحجز؟")) return;
        try {
            await axios.patch(`/api/Bookings/${id}/cancel`);
            alert("تم إلغاء الحجز بنجاح");
            navigate("/profile");
        } catch (err) {
            console.error(err);
            alert("حصل خطأ أثناء إلغاء الحجز");
        }
    };

    // بعد ما الموافقة/الرفض تتخزن في الباك، بنعيد جلب الحجز بس.
    // AdditionalIssuesCard بقى بيدمج المشاكل المعتمدة مع تفاصيل الخدمة
    // تلقائيًا وقت العرض، فمش محتاجين نعدّل booking يدويًا هنا زي الأول.
    const handleApproveIssue = async (issueId, isApprove) => {
        try {
            await axios.patch(`/api/Bookings/additional-issues/${issueId}/approve`, {
                isApproved: isApprove
            });
            await fetchBooking();

            setIssueMessages(prev => ({
                ...prev,
                [issueId]: `تم ${isApprove ? "الموافقة" : "الرفض"} على التكلفة بنجاح`
            }));

        } catch (err) {
            console.error(err);
            setIssueMessages(prev => ({
                ...prev,
                [issueId]: "حصل خطأ أثناء تعديل حالة التكلفة الإضافية"
            }));
        }
    };

    if (loading) return <p className="p-5">جارٍ تحميل تفاصيل الحجز...</p>;
    if (error) return <p className="p-5 text-danger">{error}</p>;
    if (!booking) return <p className="p-5 text-danger">الحجز غير موجود</p>;

    return (
        <>
            <NavUser showMenu={false} />
            <section className="section1 p-4 mx-auto" style={{ maxWidth: "1300px" }}>
                <div className="text-center mb-5">
                    <h3 style={{ fontSize: "2rem", color: "#333D4D", marginTop: "50px" }}>
                        تفاصيل الحجز رقم {booking.bookingNumber}
                    </h3>
                    <p style={{ fontSize: "1.2rem" }}>تتبع حالة الحجز وتفاصيل الخدمة</p>
                </div>
                <div className='d-block mb-5'>
                    <Status status={booking.status} />
                </div>

                <BookingSummaryCards booking={booking} />

                <div className='d-flex flex-column flex-md-row justify-content-around align-items-start gap-3 mb-5'>
                    <AdditionalIssuesCard
                        booking={booking}
                        issues={booking.additionalIssueDtos || []}
                        onApprove={handleApproveIssue}
                        messages={issueMessages}
                    />
                </div>

                <div
                    className="d-flex gap-4 align-items-center"
                    style={{ width: "100%", maxWidth: "1245px", backgroundColor: "white", padding: "24px", borderRadius: "16px" }}
                >
                    <button
                        className="btn ms-4 fw-bold"
                        style={{
                            width: "170px",
                            height: "50px",
                            backgroundColor: "#DC2626",
                            color: "white",
                            opacity: booking.status !== "Pending" ? 0.5 : 1,
                            cursor: booking.status !== "Pending" ? "not-allowed" : "pointer"
                        }}
                        onClick={handleCancelBooking}
                        disabled={booking.status !== "Pending"}
                    >
                        <i className="fa-regular fa-circle-xmark ps-2"></i>
                        إلغاء الحجز
                    </button>
                    {booking.status !== "Pending" && (
                        <small className="text-danger">لا يمكن إلغاء الحجز بعد بدء التنفيذ</small>
                    )}
                </div>
            </section>
        </>
    )
}

export default BookingStatus;