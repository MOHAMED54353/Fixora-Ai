import React, { useState } from 'react'

const statusStyles = {
    approved: { border: "#B7E4C7", bg: "#F0FBF4", text: "#1B7A43", label: "تمت الموافقة", icon: "fa-solid fa-circle-check" },
    pending: { border: "#F4A261", bg: "#FEF2E8", text: "#B15E1F", label: "بانتظار الموافقة", icon: "fa-solid fa-hourglass-half" },
    rejected: { border: "#F1B0B0", bg: "#FDEDED", text: "#B23A3A", label: "تم الرفض", icon: "fa-solid fa-circle-xmark" },
}

const getIssueStatus = (issue) => {
    if (issue.isApproved === true) return statusStyles.approved
    if (issue.status === "Pending") return statusStyles.pending
    return statusStyles.rejected
}
const AdditionalIssuesCard = ({ booking = {}, issues = [], onApprove, messages = {} }) => {
    const [openId, setOpenId] = useState(null)
    return (
        <>
            <div
                className='d-flex flex-column shadow-sm mb-5'
                style={{ width: "100%", maxWidth: "600px", backgroundColor: "white", padding: "1.5rem", maxHeight: "490px", borderRadius: "16px" }}
            >
                <h4 className='mb-3'>تفاصيل الخدمة</h4>
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
                                    <p className="mt-1 text-muted">الوصف: {item.serviceDescription || "لا يوجد وصف متاح"}</p>
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
                <h4 className='mb-3'> <img className="ps-2" src="/ff.png" alt="" />تكلفة إضافية مطلوبة</h4>

                {issues.length === 0 ? (
                    <p className="text-muted">لا توجد تكاليف إضافية</p>
                ) : issues.map(issue => {
                    const status = getIssueStatus(issue)
                    return (
                        <div
                            key={issue.id}
                            className="p-3 rounded-3 mb-3"
                            style={{ background: "#ffffff" }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="fw-bold mb-0 text-dark">
                                    {issue.title || "مشكلة غير محددة"}
                                </h6>

                                {issue.isCritical && (
                                    <span
                                        className="d-inline-flex align-items-center gap-1"
                                        style={{
                                            background: "#FDEDED", color: "#B23A3A",
                                            fontSize: "11px", fontWeight: "bold",
                                            padding: "4px 10px", borderRadius: "20px", whiteSpace: "nowrap"
                                        }}
                                    >
                                        <i className="bi bi-exclamation-triangle-fill"></i>
                                        ضروري
                                    </span>
                                )}
                            </div>

                            {issue.isCritical && (
                                <div
                                    className="d-flex gap-2 p-2 mb-2"
                                    style={{ background: "#FFF7ED", borderRadius: "8px", fontSize: "13px", color: "#92400E" }}
                                >
                                    <i className="bi bi-info-circle-fill mt-1" style={{ flexShrink: 0 }}></i>
                                    <span>
                                        الموافقة على التصليح مطلوبة لإتمام العملية. في حال عدم الموافقة،
                                        سيتم احتساب <strong>تكلفة الخدمة الأساسية</strong> فقط ولن يتم إكمال التصليح.
                                    </span>
                                </div>
                            )}

                            {issue.description && (
                                <p className="text-muted my-4">
                                    <strong>تفاصيل المشكلة : </strong> <br />
                                    {issue.description}
                                </p>
                            )}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-bold">التكلفة:</span>
                                <span style={{ color: "#0d6efd", fontWeight: "bold" }}>{issue.estimatedCost} جنيه</span>
                            </div>

                            <div className="d-flex justify-content-center align-items-center">
                                <span
                                    className="d-inline-flex align-items-center gap-1"
                                    style={{
                                        background: status.bg, color: status.text,
                                        fontSize: "12px", fontWeight: "bold",
                                        padding: "4px 10px", borderRadius: "20px"
                                    }}
                                >
                                    <i className={status.icon}></i>
                                    {status.label}
                                </span>
                            </div>

                            {issue.status === "Pending" && (
                                <div className="d-flex gap-2 mt-2 flex-wrap">
                                    <button
                                        className="btn flex-fill"
                                        style={{ background: "#EAF3DE", color: "#3B6D11", border: "0.5px solid #C0DD97" }}
                                        onClick={() => onApprove(issue.id, true)}
                                    >
                                        موافقة ✔
                                    </button>
                                    <button
                                        className="btn flex-fill"
                                        style={{ background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F7C1C1" }}
                                        onClick={() => onApprove(issue.id, false)}
                                    >
                                        رفض ✖
                                    </button>
                                </div>
                            )}

                            {messages[issue.id] && (
                                <p
                                    className="mt-2 mb-0 fw-bold"
                                    style={{
                                        fontSize: "14px",
                                        color: issue.isApproved === true
                                            ? "#198754"
                                            : issue.status === "Rejected"
                                                ? "#dc3545"
                                                : "#D97706"
                                    }}
                                >
                                    {messages[issue.id]}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default AdditionalIssuesCard