import React from "react";

const PaymentModal = ({ iFrameUrl, onClose, title = "صفحة الدفع" }) => {
    if (!iFrameUrl) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "700px",
                    maxWidth: "95vw",
                    height: "90vh",
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "white",
                }}
            >
                <button
                    onClick={onClose}
                    aria-label="إغلاق"
                    style={{
                        position: "absolute",
                        top: "10px",
                        left: "15px",
                        zIndex: 10,
                        width: "35px",
                        height: "40px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        cursor: "pointer",
                        fontSize: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    ✕
                </button>
                <iframe
                    src={iFrameUrl}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title={title}
                />
            </div>
        </div>
    );
};

export default PaymentModal;