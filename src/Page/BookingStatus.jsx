import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router'
import axios from '../Utils/axiosConfig'
import NavUser from '../Component/NavUser'
import Status from "../Component/Status"
import { useNavigate } from 'react-router'

const BookingStatus = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [booking, setBooking] = useState(null);
    const [openId, setOpenId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [issueMessages, setIssueMessages] = useState({});

    const fetchBooking = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/Bookings/${id}`);
            setBooking(res.data);
            console.log("Booking Data:", res.data);
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
                                serviceDescription: issueToAdd.description || "تكلفة إضافية",
                                servicePrice: issueToAdd.estimatedCost,
                                duration: issueToAdd.duration || 0,
                            }
                        ],
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

    if (loading) return <p className="p-5">جارٍ تحميل تفاصيل الحجز...</p>;
    if (error) return <p className="p-5 text-danger">{error}</p>;
    if (!booking) return <p className="p-5 text-danger">الحجز غير موجود</p>;

    const additionalIssues = booking.additionalIssueDtos || [];

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
                        <div>
                            <h4 className='mb-3'>بيانات الفني</h4>
                        </div>
                        <div className='d-flex align-items-center gap-3'>
                            <img src="/wrapper.png" alt="" style={{ width: "80px", maxWidth: "100%", height: "auto" }} />
                            <div>
                                <h5 className="mb-1">
                                    {booking.technicianName?.trim() ||
                                        (booking.status === "Pending" ? "لم يتم تعيين فني بعد" : "غير محدد")}
                                </h5>
                                <p className='mb-1'>التخصص: {booking.technicianSpecialization || "غير محدد"}</p>
                                <p className='mb-1'>⭐ {booking.technicianRate ?? "لا يوجد تقييم"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='d-flex flex-column flex-md-row justify-content-around align-items-start gap-3 mb-5'>
                    <div
                        className='d-flex flex-column shadow-sm'
                        style={{ width: "100%", maxWidth: "600px", backgroundColor: "white", padding: "1.5rem", maxHeight: "490px", borderRadius: "16px" }}
                    >
                        <h4 className='mb-3'>تفاصيل الخدمة</h4>
                        <div className="d-flex flex-column gap-3">
                            {(booking.bookingServiceDetailsDtos || []).map((item, i) => (
                                <div
                                    key={item.serviceId || i}
                                    className="border rounded-3"
                                    style={{ background: "#fff", padding: "0.75rem 1rem", cursor: "pointer" }}
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
                                            <p className="mt-1 text-muted">الوصف : {item.serviceDescription || "لا يوجد وصف للحجز"}</p>
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

                        {additionalIssues.length === 0 ? (
                            <p className="text-muted">لا توجد تكاليف إضافية</p>
                        ) : additionalIssues.map(issue => (
                            <div
                                key={issue.id}
                                className="p-3 rounded-3 mb-3"
                                style={{ background: "#fff", border: "1px dashed #F4A261" }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-2 p-2 rounded border">
                                    <h6 className="fw-bold mb-0 text-dark">
                                        {issue.title || "مشكلة غير محددة"}
                                    </h6>

                                    {issue.isCritical && (
                                        <span className="badge bg-danger px-3 py-2">
                                            ⚠️ ضروري
                                        </span>
                                    )}
                                </div>

                                {/* ملاحظة الموافقة - تظهر لما الفني يفعّل requiresApproval */}
                                {issue.isCritical && (
                                    <div className="alert alert-warning py-2 px-3 mt-1 mb-2 small" role="alert">
                                        <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                        <strong>تنبيه:</strong> الموافقة على التصليح مطلوبة لإتمام العملية.
                                        في حال عدم الموافقة، سيتم احتساب <strong>تكلفة الخدمة الأساسية</strong> فقط ولن يتم إكمال التصليح.
                                    </div>
                                )}

                                {issue.description && (
                                    <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                                        {issue.description || "لا يوجد وصف للمشكلة"}
                                    </p>
                                )}
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">التكلفة :</span>
                                    <span style={{ color: "#0d6efd", fontWeight: "bold" }}>{issue.estimatedCost} جنيه</span>
                                </div>
                                <p className="mt-2 text-muted">
                                    الحالة : {issue.isApproved === true
                                        ? "تمت الموافقة"
                                        : issue.status === "Pending"
                                            ? "بانتظار الموافقة"
                                            : "تم الرفض"}
                                </p>
                                {issue.status === "Pending" && (
                                    <div className="d-flex gap-2 mt-2 flex-wrap">
                                        <button
                                            className="btn btn-success flex-fill"
                                            onClick={() => handleApproveIssue(issue.id, true)}
                                        >
                                            موافقة ✔
                                        </button>
                                        <button
                                            className="btn btn-danger flex-fill"
                                            onClick={() => handleApproveIssue(issue.id, false)}
                                        >
                                            رفض ✖
                                        </button>
                                    </div>
                                )}
                                {issueMessages[issue.id] && (
                                    <p
                                        className="mt-2 fw-bold"
                                        style={{
                                            color: issue.isApproved === true
                                                ? "green"
                                                : issue.status === "Rejected"
                                                    ? "red"
                                                    : "orange"
                                        }}
                                    >
                                        {issueMessages[issue.id]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
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