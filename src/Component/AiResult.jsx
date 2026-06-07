import React from 'react'
import { useNavigate } from 'react-router'

const AiResult = ({ result, onReset }) => {
    const navigate = useNavigate()

    const getConfidenceBg = (confidence) => {
        if (confidence >= 0.75) return { bg: "#F0FDF4", text: "#15803D" }
        if (confidence >= 0.5) return { bg: "#FFF7ED", text: "#c2570a" }
        return { bg: "#FEF2F2", text: "#b91c1c" }
    }

    const topConfidence = result?.suggestedServices?.length
        ? Math.round(
            Math.max(...result.suggestedServices.map(s => s.confidence || 0)) * 100
        )
        : null

    const hasServices = result?.suggestedServices?.length > 0

    return (
        <section className="ai-result p-5 m-3" style={{ direction: "rtl" }}>

            <div
                className="containerr d-flex flex-column"
                style={{ width: "100%", maxWidth: "1240px", backgroundColor: "white", borderRadius: "16px", padding: "24px" }}
            >
                <div className="d-flex justify-content-start align-items-center mb-4 gap-3">
                    <img src="/ai.png" alt="" />
                    <h4 style={{ fontSize: "28px", margin: 0 }}>تم تحليل المشكلة</h4>
                    {topConfidence !== null && (
                        <span style={{ backgroundColor: "#16A34A", borderRadius: "24px", color: "white", padding: "8px 16px" }}>
                            دقة التشخيص {topConfidence}%
                        </span>
                    )}
                </div>

                {/* رسالة السيرفر — تظهر دايماً لو موجودة */}
                {result?.message && (
                    <div
                        style={{
                            backgroundColor: hasServices ? "#f0f9ff" : "#FFF7ED",
                            border: `1px solid ${hasServices ? "#bae6fd" : "#fed7aa"}`,
                            borderRadius: "12px",
                            padding: "12px 16px",
                            marginBottom: "16px",
                            color: hasServices ? "#0369a1" : "#c2570a",
                            fontSize: "15px",
                        }}
                    >
                        💬 {result.message}
                    </div>
                )}

                {/* لو مفيش خدمات — رسالة واضحة */}
                {!hasServices && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "32px",
                            color: "#888",
                        }}
                    >
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
                        <p style={{ fontSize: "16px", marginBottom: "0" }}>
                            لم يتم العثور على خدمات مناسبة لهذا الوصف، حاول إعادة الوصف بشكل أكثر تفصيلاً
                        </p>
                    </div>
                )}

                {hasServices && (
                    <>
                        <div>
                            <p style={{ fontSize: "16px", color: "#333", marginBottom: "8px" }}>
                                وصف المشكلة:
                            </p>
                            {result.suggestedServices.map((service) => (
                                <p key={service.serviceId}>
                                    • {service.description || "هذه هي الخدمة المتخصصة التي تناسب وصفك"}
                                </p>
                            ))}
                        </div>

                        <div>
                            <ul className="d-flex flex-column gap-2 p-0" style={{ listStyle: "none" }}>
                                <li style={{ fontWeight: "600", color: "#555" }}>احتمالية المشاكل في:</li>
                                {result.suggestedServices.map((service) => (
                                    <li key={service.serviceId} style={{ color: "#2A5CAF" }}>
                                        • {service.category || service.serviceName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>

            {hasServices && (
                <>
                    <div className="d-flex mt-5 mb-4">
                        <h3>الخدمات المقترحة</h3>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        {result.suggestedServices.map((service) => {
                            const colors = getConfidenceBg(service.confidence)
                            return (
                                <div
                                    key={service.serviceId}
                                    className="containerr d-flex flex-column"
                                    style={{ width: "100%", maxWidth: "1240px", backgroundColor: "white", borderRadius: "16px", padding: "24px" }}
                                >
                                    <div>
                                        <span style={{ backgroundColor: colors.bg, borderRadius: "24px", color: colors.text, padding: "8px 16px" }}>
                                            دقة التشخيص {Math.round(service.confidence * 100)}%
                                        </span>
                                    </div>

                                    <h3 className="mt-4">{service.serviceName}</h3>

                                    <div className="d-flex justify-content-between w-100 mt-2" style={{ flexWrap: "wrap", gap: "12px" }}>
                                        <p style={{ color: "#555", margin: 0 }}>
                                            {service.category || "خدمة صيانة متخصصة"}
                                        </p>
                                        <div className="d-flex gap-3">
                                            <button
                                                onClick={() => navigate(`/booking-details`, { state: { service } })}
                                                className="btn btn-primary"
                                                style={{ padding: "8px 16px", backgroundColor: "#2A5CAF", borderRadius: "12px", width: "150px", border: "none" }}
                                            >
                                                + أضف للحجز
                                            </button>
                                            <button
                                                onClick={() => navigate(`/service-details/${service.serviceId}`, { state: { service } })}
                                                style={{ padding: "8px 16px", border: "2px solid #2A5CAF", color: "#2A5CAF", borderRadius: "12px", background: "transparent", cursor: "pointer" }}
                                            >
                                                تفاصيل
                                            </button>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-4 mt-3">
                                        <span className="text-primary">
                                            <i className="fa-solid fa-sack-dollar text-warning ps-2"></i>
                                            {service.basePrice} ج.م
                                        </span>
                                        <p style={{ margin: 0 }}>
                                            <i className="fa-solid fa-clock px-2"></i>
                                            {service.estimatedDurationMinutes} دقيقة
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}

            <div className="d-flex justify-content-center w-100 mt-4 gap-3" style={{ flexWrap: "wrap" }}>
                {hasServices && (
                    <button
                        onClick={() => navigate("/service")}
                        style={{ padding: "8px 16px", border: "2px solid #2A5CAF", color: "#2A5CAF", borderRadius: "12px", width: "450px", background: "transparent", cursor: "pointer" }}
                    >
                        عرض جميع الخدمات
                    </button>
                )}
                <button
                    onClick={onReset}
                    style={{
                        padding: "8px 16px",
                        border: "2px solid #2A5CAF",
                        color: "#2A5CAF",
                        borderRadius: "12px",
                        width: "216px",
                        background: "transparent",
                        cursor: "pointer"
                    }}
                >
                    🤖 تشخيص جديد
                </button>
            </div>
        </section>
    )
}

export default AiResult