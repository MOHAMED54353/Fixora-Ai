import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import axios from '../Utils/axiosConfig'
import NavUser from '../Component/NavUser'
import Status from "../Component/Status"
import RatingPopup from '../Component/RatingPopup'
import Invoice from '../Component/Invoice'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingStatusDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [openId, setOpenId] = useState(null);
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

                <div className='d-flex flex-column flex-md-row justify-content-around align-items-start gap-3 mb-5'>
                    <div
                        className='d-flex flex-column shadow-sm'
                        style={{ width: "100%", maxWidth: "600px", backgroundColor: "white", padding: "1.5rem", minHeight: "150px", borderRadius: "16px" }}
                    >
                        <h4 className='mb-3'>بيانات السيارة</h4>
                        <div className='d-flex align-items-center gap-3'>
                            <img src="/Frame 429.jpg" alt="" style={{ width: "80px", maxWidth: "100%", height: "auto" }} />
                            <div>
                                <p className='mb-1'>{booking.brand} {booking.model}</p>
                                <p className='mb-1'>رقم اللوحة: {booking.plateNumber}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className='d-flex flex-column shadow-sm'
                        style={{ width: "100%", maxWidth: "600px", backgroundColor: "white", padding: "1.5rem", minHeight: "150px", borderRadius: "16px" }}
                    >
                        <h4 className='mb-3'>الفني المعين</h4>
                        <div className='d-flex align-items-center gap-3'>
                            <img src="/wrapper.png" alt="" style={{ width: "80px", maxWidth: "100%", height: "auto" }} />
                            <div>
                                <h5 className="mb-1">
                                    {booking.technicianName?.trim() ||
                                        (booking.status === "Pending"
                                            ? "لم يتم تعيين فني بعد"
                                            : "غير محدد")}
                                </h5>
                                <p className='mb-1'>التخصص: {booking.technicianSpecialization || "غير محدد"}</p>
                                <p className='mb-1'>⭐ {booking.review?.technicianRating ?? "---"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='d-flex flex-column flex-md-row justify-content-around align-items-start gap-3 mb-5'>
                    <div
                        className='d-flex flex-column shadow-sm'
                        style={{ width: "100%", maxWidth: "600px", backgroundColor: "white", padding: "1.5rem", maxHeight: "490px", borderRadius: "16px" }}
                    >
                        <h4 className='mb-3' style={{ fontSize: "1.5rem" }}>تفاصيل الخدمة</h4>
                        <div className="d-flex flex-column gap-3">
                            {(booking.bookingServiceDetailsDtos || []).map((item, i) => (
                                <div
                                    key={item.serviceId || i}
                                    className="border rounded-3"
                                    style={{ background: "#fff", padding: "1rem", cursor: "pointer" }}
                                >
                                    <div
                                        className="d-flex justify-content-between align-items-center"
                                        onClick={() => setOpenId(openId === i ? null : i)}
                                    >
                                        <h6 className="mb-0 fw-bold">{item.serviceName || "خدمة غير محددة"}</h6>
                                        <span style={{ fontSize: "1.2rem", transform: openId === i ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}>⌄</span>
                                    </div>
                                    {openId === i && (
                                        <div className="mt-2 p-2 rounded-2" style={{ background: "#F8F9FA" }}>
                                            <p className="mt-1 text-muted">الوصف: {item.serviceDescription || "الوصف غير متاح حاليا"}</p>
                                            <div className="d-flex justify-content-between">
                                                <span style={{ color: "#0d6efd", fontWeight: "bold" }}>{item.servicePrice} جنيه</span>
                                                <span className="text-muted">{item.duration} دقيقة</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <p>إجمالي التكلفة</p>
                                <span style={{ color: "#0d6efd" }}>{booking.totalCost} جنيه</span>
                            </div>
                        </div>
                    </div>

                    <div
                        className='d-flex flex-column shadow-sm'
                        style={{ width: "100%", maxWidth: "600px", backgroundColor: "#FEF2E8", padding: "24px", minHeight: "250px", borderRadius: "16px" }}
                    >
                        <h4 className='mb-3'>تكلفة إضافية مطلوبة</h4>

                        {(booking.additionalIssueDtos || []).length === 0 ? (
                            <p className="text-muted">لا توجد تكاليف إضافية</p>
                        ) : (
                            booking.additionalIssueDtos.map(issue => (
                                <div
                                    key={issue.id}
                                    className="p-3 rounded-3 mb-3"
                                    style={{ background: "#fff", border: "1px dashed #F4A261" }}
                                >
                                    {/* Header: العنوان + Badge */}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                                        <h6 className="fw-bold mb-0 text-dark">
                                            {issue.title || "مشكلة غير محددة"}
                                        </h6>
                                        {issue.isCritical && (
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", gap: "5px",
                                                fontSize: "12px", fontWeight: "500", padding: "4px 10px",
                                                borderRadius: "999px", background: "#FCEBEB", color: "#A32D2D",
                                                border: "0.5px solid #F7C1C1"
                                            }}>
                                                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "11px" }}></i>
                                                ضروري
                                            </span>
                                        )}
                                    </div>

                                    {/* Alert التحذير */}
                                    {issue.isCritical && (
                                        <div style={{
                                            background: "#FAEEDA", border: "0.5px solid #FAC775",
                                            borderRadius: "8px", padding: "10px 12px",
                                            marginBottom: "12px", display: "flex", gap: "8px", alignItems: "flex-start"
                                        }}>
                                            <i className="bi bi-exclamation-triangle-fill"
                                                style={{ color: "#854F0B", fontSize: "13px", marginTop: "2px", flexShrink: 0 }}></i>
                                            <p className="mb-0" style={{ fontSize: "13px", color: "#633806", lineHeight: "1.6" }}>
                                                <strong>تنبيه:</strong> الموافقة على التصليح مطلوبة لإتمام العملية.
                                                في حال عدم الموافقة، سيتم احتساب <strong>تكلفة الخدمة الأساسية</strong> فقط.
                                            </p>
                                        </div>
                                    )}

                                    {issue.description && (
                                        <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                                            {issue.description}
                                        </p>
                                    )}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold">التكلفة:</span>
                                        <span style={{ color: "#0d6efd", fontWeight: "bold" }}>{issue.estimatedCost} جنيه</span>
                                    </div>
                                    <p className="mt-2 text-muted">
                                        الحالة: {issue.isApproved === true
                                            ? "تمت الموافقة"
                                            : issue.status === "Pending"
                                                ? "بانتظار الموافقة"
                                                : "تم الرفض"}
                                    </p>
                                    {issue.status === "Pending" && (
                                        <div className="d-flex gap-2 mt-2 flex-wrap">
                                            <button
                                                className="btn flex-fill"
                                                style={{ background: "#EAF3DE", color: "#3B6D11", border: "0.5px solid #C0DD97" }}
                                                onClick={() => handleApproveIssue(issue.id, true)}
                                            >
                                                موافقة ✔
                                            </button>
                                            <button
                                                className="btn flex-fill"
                                                style={{ background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F7C1C1" }}
                                                onClick={() => handleApproveIssue(issue.id, false)}
                                            >
                                                رفض ✖
                                            </button>
                                        </div>
                                    )}
                                    {issueMessages[issue.id] && (
                                        <p className="mt-2 fw-bold"
                                            style={{ color: issue.isApproved === true ? "green" : "red" }}>
                                            {issueMessages[issue.id]}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div
                    className='d-flex flex-column shadow-sm'
                    style={{ width: "100%", backgroundColor: "white", padding: "24px", borderRadius: "16px", marginBottom: "24px" }}
                >
                    <h4 className='mb-2'>تقرير الفني</h4>
                    {booking.technicianReport ? (
                        <p style={{ color: "#444", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                            {booking.technicianReport}
                        </p>
                    ) : (
                        <p className="text-muted">لم يتم إضافة تقرير من الفني بعد</p>
                    )}
                </div>

                <div
                    className="d-flex shadow-sm gap-4 align-items-center"
                    style={{ width: "100%", maxWidth: "1245px", backgroundColor: "white", padding: "24px", borderRadius: "16px", marginTop: "30px" }}
                >
                    <button
                        className="btn fw-bold"
                        style={{ width: "170px", height: "50px", backgroundColor: "#2A5CAF", color: "white" }}
                        onClick={() => setShowRatingPopup(true)}
                    >
                        <i className="fa-regular fa-star ps-2"></i>
                        تقييم الحجز
                    </button>

                    <button
                        className="btn fw-bold"
                        style={{ width: "170px", height: "50px", border: "2px solid #DFDFDF" }}
                        onClick={async () => {
                            setShowInvoice(true);
                            if (invoice) return;
                            setLoadingInvoice(true);
                            try {
                                const res = await axios.get(`/api/Bookings/${id}/invoice`);
                                setInvoice(res.data);
                            } catch (err) {
                                console.error("Error fetching invoice:", err);
                            } finally {
                                setLoadingInvoice(false);
                            }
                        }}
                    >
                        <i className="fa-solid fa-download ps-2"></i>
                        تحميل
                    </button>
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