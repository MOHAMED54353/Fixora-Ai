import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavUser from "../Component/NavUser.jsx";
import PaymentModal from "../Component/PaymentModal.jsx";
import usePaymentProcessor from "../Component/usePaymentProcessor.jsx";

const PaymentPage = ({ user }) => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("Cash");

    const { loading, iFrameUrl, processPayment, closePaymentModal } = usePaymentProcessor({
        onCashSuccess: () => {
            toast.success("تم تسجيل الدفع النقدي بنجاح");
            setTimeout(() => navigate("/profile"), 2000);
        },
    });

    const handleConfirmPayment = () => {
        if (!bookingId) {
            toast.error("لم يتم تحديد الحجز المطلوب دفعه");
            return;
        }
        processPayment({ referenceId: bookingId, paymentMethod });
    };

    const handleCloseModal = () => {
        closePaymentModal();
    };

    const paymentOptions = [
        {
            id: "Cash",
            label: "الدفع عند الاستلام",
            desc: "دفع نقدي",
            icon: "fa-solid fa-money-bill-wave",
        },
        {
            id: "Card",
            label: "الدفع الإلكتروني",
            desc: "بطاقة بنكية",
            icon: "fa-regular fa-credit-card",
        },
    ];

    return (
        <>
            <NavUser showMenu={false} user={user} />
            <PaymentModal iFrameUrl={iFrameUrl} onClose={handleCloseModal} />
            <section
                className="d-flex justify-content-center"
                style={{
                    minHeight: "calc(100vh - 80px)",
                    backgroundColor: "#F7F8FA",
                    padding: "40px 20px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "820px",
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        border: "0.79px solid #E8EDF5",
                        padding: "20px 22px",
                    }}
                >
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h3
                                style={{
                                    fontSize: "22px",
                                    fontWeight: "700",
                                    color: "#333D4D",
                                    marginBottom: "6px",
                                }}
                            >
                                إتمام الدفع
                            </h3>
                            <p style={{ fontSize: "13px", color: "#8A94A6", margin: 0 }}>
                                تم الانتهاء من صيانة سيارتك، يرجى إتمام عملية الدفع لاستلام السيارة
                            </p>
                        </div>

                        <button
                            onClick={() => navigate(-1)}
                            className="d-flex align-items-center gap-1"
                            style={{
                                background: "none",
                                border: "none",
                                color: "#8A94A6",
                                fontSize: "14px",
                                whiteSpace: "nowrap",
                                cursor: "pointer",
                            }}
                        >
                            <i className="fa-solid fa-arrow-right"></i>
                            رجوع
                        </button>
                    </div>

                    <div
                        style={{
                            border: "1px solid #E8EDF5",
                            borderRadius: "14px",
                            padding: "20px",
                            marginBottom: "20px",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "15px",
                                fontWeight: "700",
                                color: "#333D4D",
                                marginBottom: "16px",
                            }}
                        >
                            طريقة الدفع
                        </p>

                        <div className="row g-3 mb-3">
                            {paymentOptions.map((option) => {
                                const isSelected = paymentMethod === option.id;
                                return (
                                    <div className="col-12 col-sm-6" key={option.id}>
                                        <div
                                            onClick={() => setPaymentMethod(option.id)}
                                            style={{
                                                position: "relative",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                padding: "16px",
                                                borderRadius: "12px",
                                                cursor: "pointer",
                                                height: "100%",
                                                backgroundColor: isSelected ? "#F3F8FF" : "#FAFBFC",
                                                border: isSelected
                                                    ? "1.5px solid #2A5CAF"
                                                    : "1.5px solid #EDEFF3",
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            {isSelected && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "-8px",
                                                        insetInlineStart: "-8px",
                                                        width: "20px",
                                                        height: "20px",
                                                        borderRadius: "50%",
                                                        backgroundColor: "#2A5CAF",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        border: "2px solid #ffffff",
                                                    }}
                                                >
                                                    <i
                                                        className="fa-solid fa-check"
                                                        style={{ fontSize: "10px", color: "#fff" }}
                                                    ></i>
                                                </div>
                                            )}

                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "10px",
                                                    flexShrink: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: isSelected ? "#2A5CAF" : "#EEF1F5",
                                                    color: isSelected ? "#ffffff" : "#8A94A6",
                                                    transition: "all 0.2s ease",
                                                }}
                                            >
                                                <i className={option.icon} style={{ fontSize: "16px" }}></i>
                                            </div>

                                            <div>
                                                <p
                                                    className="m-0"
                                                    style={{
                                                        fontSize: "14.5px",
                                                        fontWeight: "700",
                                                        color: "#333D4D",
                                                    }}
                                                >
                                                    {option.label}
                                                </p>
                                                <p
                                                    className="m-0"
                                                    style={{ fontSize: "12.5px", color: "#9AA3B2" }}
                                                >
                                                    {option.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "8px",
                                backgroundColor: "#FAEEDA",
                                border: "0.5px solid #FAC775",
                                borderRadius: "10px",
                                padding: "12px 14px",
                            }}
                        >
                            <i
                                className="fa-solid fa-circle-info"
                                style={{ color: "#854F0B", fontSize: "13px", marginTop: "2px" }}
                            ></i>
                            <p
                                className="m-0"
                                style={{ fontSize: "13px", color: "#633806", lineHeight: "1.7" }}
                            >
                                {paymentMethod === "Cash"
                                    ? "سيتم تسليم السيارة بعد سداد المبلغ نقداً عند الاستلام من مركز الصيانة"
                                    : "سيتم تحويلك لصفحة دفع آمنة لإتمام العملية إلكترونياً"}
                            </p>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            className="d-flex align-items-center justify-content-center gap-2 flex-fill"
                            style={{
                                height: "50px",
                                border: "none",
                                borderRadius: "12px",
                                backgroundColor: "#2A5CAF",
                                color: "#ffffff",
                                fontSize: "15px",
                                fontWeight: "700",
                                opacity: loading ? 0.75 : 1,
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "opacity 0.2s ease",
                            }}
                            onClick={handleConfirmPayment}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    جاري التجهيز...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-lock"></i>
                                    إتمام الدفع
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                height: "50px",
                                minWidth: "110px",
                                borderRadius: "12px",
                                border: "1.5px solid #E8EDF5",
                                backgroundColor: "#ffffff",
                                color: "#333D4D",
                                fontSize: "15px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            رجوع
                        </button>
                    </div>

                    <p
                        className="text-center mt-3 mb-0"
                        style={{ fontSize: "12px", color: "#B0B7C3" }}
                    >
                        <i className="fa-solid fa-shield-halved ps-1"></i>
                        جميع عمليات الدفع مشفرة وآمنة
                    </p>
                </div>
            </section>
            <ToastContainer position="top-center" autoClose={3000} rtl pauseOnHover />
        </>
    );
};

export default PaymentPage;