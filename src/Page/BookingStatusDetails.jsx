import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import axios from '../Utils/axiosConfig'
import NavUser from '../Component/NavUser'
import Status from "../Component/Status"
import BookingSummaryCards from "../Component/BookingSummaryCards"
import AdditionalIssuesCard from "../Component/AdditionalIssuesCard"
import RatingPopup from '../Component/RatingPopup'
import Invoice from '../Component/Invoice'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingStatusDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [loadingInvoice, setLoadingInvoice] = useState(false);
    const [issueMessages, setIssueMessages] = useState({});

    const fetchBooking = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/Bookings/${id}`);
            setBooking(res.data);
            console.log("data", res.data);

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

    const handleApproveIssue = async (issueId, isApprove) => {
        try {
            const issueToAdd = booking.additionalIssueDtos?.find(i => i.id === issueId);
            await axios.patch(`/api/Bookings/additional-issues/${issueId}/approve`, {
                isApproved: isApprove
            });
            await fetchBooking();

            if (isApprove && issueToAdd) {
                setBooking(prev => {
                    const alreadyAdded = prev.bookingServiceDetailsDtos?.some(
                        s => s.serviceId === issueId || s.serviceName === issueToAdd.title
                    );
                    if (alreadyAdded) return prev;
                    return {
                        ...prev,
                        bookingServiceDetailsDtos: [
                            ...(prev.bookingServiceDetailsDtos || []),
                            {
                                serviceId: issueId,
                                serviceName: issueToAdd.title,
                                description: issueToAdd.description || "تكلفة إضافية",
                                servicePrice: issueToAdd.estimatedCost,
                                duration: issueToAdd.duration || 0,
                            }
                        ],
                        totalCost: prev.totalCost + issueToAdd.estimatedCost,
                    };
                });
            }

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

    const handleRatingSubmit = async ({ serviceRating, technicianRating, comment }) => {
        try {
            await axios.post(`/api/Reviews/${booking.id}`, {
                serviceRating: Number(serviceRating),
                technicianRating: Number(technicianRating),
                comment: comment || "",
            });
            toast("تم إرسال التقييم بنجاح");
            setTimeout(() => {
                navigate("/profile");
            }, 1500);
            setShowRatingPopup(false);
        } catch (err) {
            const message = err.response?.data?.errorMessage || "حدث خطأ أثناء إرسال التقييم";
            toast(`❌ ${message}`);
        }
    };

    if (loading) return <p className="p-5">جارٍ تحميل تفاصيل الحجز...</p>;
    if (error) return <p className="p-5 text-danger">{error}</p>;
    if (!booking) return <p className="p-5 text-danger">الحجز غير موجود</p>;

    const isPaid =
        booking.isPaid === true ||
        booking.paymentStatus === "Paid" ||
        booking.paymentStatus === "paid";
    console.log("status:", booking.paymentStatus, "isPaid:", booking.isPaid);
    return (
        <>
            <NavUser showMenu={false} />
            <ToastContainer position="top-center" autoClose={3000} />

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
                <BookingSummaryCards booking={booking} technicianTitle="الفني المعين" />

                <div className='d-flex flex-column flex-md-row justify-content-around align-items-start gap-3 mb-5'>
                    <AdditionalIssuesCard
                        booking={booking}
                        issues={booking.additionalIssueDtos || []}
                        onApprove={handleApproveIssue}
                        messages={issueMessages}
                    />
                </div>

                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <span
                            className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary flex-shrink-0"
                            style={{ width: "38px", height: "38px" }}
                        >
                            <i className="fa-solid fa-clipboard-list"></i>
                        </span>
                        <h5 className="fw-bold mb-0">تقرير الفني</h5>
                    </div>

                    {booking.technicianReport ? (
                        <p
                            className="mb-0 text-secondary bg-light rounded-3 p-3 border"
                            style={{ lineHeight: "1.9", wordBreak: "break-word" }}
                        >
                            {booking.technicianReport}
                        </p>
                    ) : (
                        <div className="d-flex align-items-center gap-2 text-muted bg-light rounded-3 p-3 border border-dashed">
                            <i className="fa-regular fa-file-lines"></i>
                            لا يوجد تقرير حتى الآن
                        </div>
                    )}
                </div>

                <div
                    className="shadow-sm d-flex flex-wrap align-items-center justify-content-between"
                    style={{
                        width: "100%",
                        maxWidth: "1250px",
                        backgroundColor: "white",
                        padding: "24px",
                        borderRadius: "16px",
                        marginTop: "30px",
                        gap: "12px"
                    }}
                >
                    {booking.status === "Completed" && (
                        isPaid ? (
                            <span
                                className="d-flex align-items-center justify-content-center gap-2 fw-bold"
                                style={{
                                    minWidth: "150px",
                                    padding: "8px 16px",
                                    height: "45px",
                                    borderRadius: "12px",
                                    flexShrink: 0,
                                    backgroundColor: "#EAF3DE",
                                    color: "#3B6D11",
                                    border: "1px solid #C0DD97",
                                }}
                            >
                                <i className="fa-solid fa-circle-check"></i>
                                تم الدفع
                            </span>
                        ) : (
                            <button
                                className="btn btn-primary d-flex align-items-center justify-content-center gap-2 fw-bold"
                                style={{
                                    minWidth: "150px",
                                    padding: "8px 16px",
                                    height: "45px",
                                    borderRadius: "12px",
                                    flexShrink: 0
                                }}
                                onClick={() => navigate(`/Payment/${booking.id}`)}
                            >
                                <i className="fa-solid fa-credit-card"></i>
                                دفع الفاتورة
                            </button>
                        )
                    )}

                    <div
                        className="d-flex flex-wrap gap-2"
                        style={{
                            flexGrow: 1,
                            justifyContent: "flex-start"
                        }}
                    >
                        <button
                            className="btn  d-flex align-items-center gap-2 fw-bold"
                            style={{
                                minWidth: "150px",
                                height: "45px",
                                borderRadius: "10px",
                                color: "#2A5CAF",
                                border: "2px solid #2A5CAF",
                                backgroundColor: "transparent"
                            }}
                            onClick={() => setShowRatingPopup(true)}
                        >
                            <i className="fa-regular fa-star"></i>
                            تقييم الحجز
                        </button>

                        <button
                            className="btn d-flex align-items-center gap-2 fw-bold"
                            style={{
                                minWidth: "150px",
                                height: "45px",
                                color: "#2A5CAF",
                                backgroundColor: "transparent"
                            }}
                            onClick={async () => {
                                setShowInvoice(true);
                                if (invoice) return;
                                setLoadingInvoice(true);
                                try {
                                    const res = await axios.get(`/api/Bookings/${id}/invoice`);
                                    setInvoice(res.data);
                                    console.log("data", res.data);

                                } catch (err) {
                                    console.error("Error fetching invoice:", err);
                                } finally {
                                    setLoadingInvoice(false);
                                }
                            }}
                        >
                            <i className="fa-solid fa-download"></i>
                            تحميل الفاتورة
                        </button>
                    </div>
                </div>
            </section>

            {showInvoice && (
                <div
                    onClick={() => setShowInvoice(false)}
                    style={{
                        position: "fixed", inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.39)",
                        zIndex: 1050,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "24px",
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: "white", borderRadius: "16px",
                            padding: "32px", width: "100%", maxWidth: "800px",
                            maxHeight: "100vh", overflowY: "auto", position: "relative",
                        }}
                    >
                        <button
                            onClick={() => setShowInvoice(false)}
                            style={{
                                position: "absolute", top: "16px", left: "16px",
                                background: "none", border: "none",
                                fontSize: "22px", cursor: "pointer", color: "#6B7280",
                            }}
                        >
                            ✕
                        </button>
                        {loadingInvoice ? <p className="text-center">جاري تحميل الفاتورة...</p> : <Invoice invoice={invoice} />}
                    </div>
                </div>
            )}
            {showRatingPopup && (
                <RatingPopup
                    onClose={() => setShowRatingPopup(false)}
                    onSubmit={handleRatingSubmit}
                />
            )}
        </>
    );
};

export default BookingStatusDetails;