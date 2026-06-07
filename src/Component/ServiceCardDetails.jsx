import React from "react";
import { useNavigate } from "react-router";

const ServiceCardDetails = ({
    title = "",
    description = "",
    price = 0,
    duration = 0,
    category = "",
    specialty = "",
    IncludeItems = [],
    excludeItems = [],
    requirements = [],
    service,
}) => {
    const navigate = useNavigate();

    const onBookClick = () => {
        navigate("/booking-details", {
            state: { service },
        });
    };

    return (
        <>
            <section
                className="card shadow-sm mx-auto mb-4"
                style={{
                    maxWidth: "100%",
                    width: "1200px",
                    borderRadius: "16px",
                    border: "none",
                    padding: "24px",
                }}
            >
                <div className="card-body p-0">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 gap-3">
                        <h5 className="mb-2" style={{ color: "#333D4D", fontSize: "28px" }}>
                            {title}
                        </h5>
                        <span
                            className="badge bg-primary bg-opacity-10 text-primary px-3 py-2"
                            style={{ fontSize: "14px", borderRadius: "18px" }}
                        >
                            {category}
                        </span>
                    </div>

                    <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3">
                        <p className="mb-2 mb-md-0">التخصص : {specialty}</p>

                        <div className="d-flex align-items-center gap-1">
                            <span className="fw-bold fs-5 text-primary">{price}</span>
                            <span className="text-muted">ج.م</span>
                            <i className="fa-solid fa-sack-dollar text-warning"></i>
                        </div>

                        <div className="d-flex align-items-center gap-2 text-muted small">
                            <i className="fa-regular fa-clock"></i>
                            <span style={{ color: "#A9A9A9", fontSize: "16px" }}>{duration} دقيقة</span>
                        </div>

                        <button
                            className="btn btn-primary d-flex justify-content-center align-items-center gap-2 fw-bold p-2 mt-2 mt-md-0"
                            style={{ minWidth: "200px" }}
                            onClick={onBookClick}
                        >
                            <i className="fa-solid fa-plus"></i>
                            احجز الآن
                        </button>
                    </div>
                </div>
            </section>

            <section
                className="card mx-auto mb-4"
                style={{
                    maxWidth: "100%",
                    width: "1200px",
                    borderRadius: "16px",
                    border: "none",
                    padding: "24px",
                }}
            >
                <div className="card-body p-0">
                    <h5 className="mb-3" style={{ color: "#333D4D", fontSize: "28px" }}>
                        وصف الخدمة
                    </h5>
                    <p>{description || "لا يوجد وصف متاح لهذه الخدمة حاليا سيتم إضافة الوصف في أقرب وقت"}</p>
                </div>
            </section>

            <section
                className="d-flex flex-column flex-lg-row gap-4 mb-4 justify-content-center"
                style={{ maxWidth: "100%" }}
            >
                <div
                    className="card flex-fill"
                    style={{
                        borderRadius: "16px",
                        border: "none",
                        padding: "24px",
                        minHeight: "400px",
                        maxWidth: "590px",
                    }}
                >
                    <h5 className="mb-4" style={{ color: "#333D4D", fontSize: "28px" }}>
                        ماذا تشمل الخدمة ؟
                    </h5>
                    <ul className="list-unstyled m-0 p-0">
                        {IncludeItems?.length > 0
                            ? IncludeItems.map((item, index) => (
                                <li key={index} className="d-flex align-items-start gap-3 mb-3">
                                    <div
                                        style={{
                                            backgroundColor: "#E6F7EE",
                                            color: "#28A745",
                                            borderRadius: "50%",
                                            minWidth: "28px",
                                            height: "28px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginTop: "4px",
                                        }}
                                    >
                                        <i className="fa-solid fa-check" style={{ fontSize: "14px" }}></i>
                                    </div>
                                    <p className="fs-5 mb-0">{item}</p>
                                </li>
                            ))
                            : (
                                <li className="text-muted">
                                    لا يوجد وصف متاح لهذه الخدمة حاليا سيتم إضافة الوصف في أقرب وقت
                                </li>
                            )}
                    </ul>
                </div>

                <div
                    className="card flex-fill"
                    style={{
                        borderRadius: "16px",
                        border: "none",
                        padding: "24px",
                        minHeight: "400px",
                        maxWidth: "590px",
                    }}
                >
                    <h5 className="mb-4" style={{ color: "#333D4D", fontSize: "28px" }}>
                        غير مشمول في الخدمة ⚠️
                    </h5>
                    <ul className="list-unstyled m-0 p-0">
                        {excludeItems?.length > 0
                            ? excludeItems.map((item, index) => (
                                <li key={index} className="d-flex align-items-start gap-3 mb-3">
                                    <div
                                        style={{
                                            backgroundColor: "#FDECEC",
                                            color: "#DC3545",
                                            borderRadius: "50%",
                                            minWidth: "28px",
                                            height: "28px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginTop: "4px",
                                        }}
                                    >
                                        <i className="fa-solid fa-xmark" style={{ fontSize: "14px" }}></i>
                                    </div>
                                    <p className="fs-5 mb-0">{item}</p>
                                </li>
                            ))
                            : (
                                <li className="text-muted">
                                    لا يوجد وصف متاح لهذه الخدمة حاليا سيتم إضافة الوصف في أقرب وقت
                                </li>
                            )}
                    </ul>
                </div>
            </section>

            <section
                className="card mx-auto mb-4"
                style={{
                    maxWidth: "100%",
                    width: "1210px",
                    borderRadius: "16px",
                    border: "3px solid #2A5CAF",
                    padding: "24px",
                }}
            >
                <h5 className="mb-3" style={{ color: "#333D4D", fontSize: "28px" }}>
                    متى تحتاج الخدمة ؟
                </h5>
                <ul className="ps-3">
                    {requirements?.length > 0
                        ? requirements.map((item, index) => (
                            <li key={index} className="mb-2">
                                {item}
                            </li>
                        ))
                        : (
                            <li className="text-muted">
                                لا يوجد وصف متاح لهذه الخدمة حاليا سيتم إضافة الوصف في أقرب وقت
                            </li>
                        )}
                </ul>
            </section>
        </>
    );
};

export default ServiceCardDetails;
