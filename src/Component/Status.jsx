import React from 'react';

const Status = ({ status }) => {
    const steps = [
        { id: 1, label: "تم التأكيد" },
        { id: 2, label: "قيد التنفيذ" },
        { id: 3, label: "تم الاستلام" },
    ];

    let activeIndex = 0;
    if (status === "Pending") activeIndex = 1;
    else if (status === "InProgress") activeIndex = 2;
    else if (status === "Completed") activeIndex = 3;

    const stepCount = steps.length;

    // نحسب نسبة الخط الملون من اليمين (RTL)
    const progressPercent = ((activeIndex - 1) / (stepCount - 1)) * 100;

    return (
        <div className="d-block">
            <div
                className="card mx-auto"
                style={{
                    borderRadius: "16px",
                    padding: "24px",
                    background: "white",
                    width: "100%",
                    maxWidth: "1240px",
                    minHeight: "192px",
                    border: "none",
                }}
            >
                <h4 className="mb-5">حالة الحجز</h4>

                <div className="d-flex align-items-center justify-content-between position-relative">

                    {/* wrapper للخطين */}
                    <div
                        style={{
                            position: "absolute",
                            top: "18px",
                            left: "18px",
                            right: "18px",
                            height: "2px",
                            zIndex: 1,
                        }}
                    >
                        {/* الخط الرمادي الخلفي */}
                        <div style={{ position: "absolute", inset: 0, background: "#E5E7EB" }} />

                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                height: "2px",
                                width: `${progressPercent}%`,
                                background: "#2A5CAF",
                                transition: "width 0.3s",
                            }}
                        />
                    </div>

                    {steps.map((step, index) => {
                        const done = index + 1 < activeIndex;
                        const active = index + 1 === activeIndex;

                        return (
                            <div
                                key={step.id}
                                className="d-flex flex-column align-items-center"
                                style={{ zIndex: 3 }}
                            >
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        background: active || done ? "#2A5CAF" : "#E5E7EB",
                                        color: active || done ? "#fff" : "#6b7280",
                                    }}
                                >
                                    {done ? "✓" : step.id}
                                </div>

                                <small
                                    className="mt-2 text-center"
                                    style={{
                                        color: active ? "#333D4D" : "#6b7280",
                                        fontWeight: active ? 600 : 400,
                                    }}
                                >
                                    {step.label}
                                </small>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default Status;