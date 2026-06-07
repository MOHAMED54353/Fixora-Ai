import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import CardServiceDetails from "../Component/ServiceCardDetails.jsx";
import NavUser from "../Component/NavUser.jsx";
import Scrollbtn from "../Component/scrollbtn";
import axios from "../Utils/axiosConfig";

const ServiceDetails = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [service, setService] = useState(location.state?.service || null);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        const fetchService = async () => {
            const finalId = id || service?.serviceId;
            if (!finalId) {
                setError("❌ بيانات الخدمة غير موجودة");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await axios.get(`/api/Services/${finalId}/details`);
                setService(res.data);
                console.log("Service details", res.data);
                setTechnicians(res.data.availableTechnicians || []);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.errorMessage ||
                    err.message ||
                    "حدث خطأ أثناء جلب الخدمة"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading)
        return <div className="text-center mt-5">⏳ جاري تحميل الخدمة...</div>;
    if (error)
        return <div className="text-center text-danger mt-5">{error}</div>;
    if (!service)
        return (
            <div className="text-center mt-5">
                <p>⚠️ الخدمة غير موجودة</p>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(-1)}
                >
                    العودة للخدمات
                </button>
            </div>
        );

    return (
        <>
            <NavUser showMenu={false} user={user} />
            <section className="service-details-section p-5 m-4">
                {/*SERVICE*/}
                <div className="service-details-page">
                    <div className="service-details-header mb-5">
                        <h2
                            className="text-center"
                            style={{
                                color: "#333D4D",
                                fontSize: "32px",
                                fontWeight: "bold",
                            }}
                        >
                            تفاصيل الخدمة
                        </h2>
                    </div>

                    <CardServiceDetails
                        service={service}
                        title={service.name}
                        category={service.category}
                        description={service.description || "لا يوجد وصف متاح حاليا"}
                        price={service.basePrice}
                        duration={service.estimatedDurationMinutes}
                        specialty={service.specialization || service.category}
                        IncludeItems={
                            Array.isArray(service.includedItems)
                                ? service.includedItems
                                : [service.includedItems || "لا يوجد وصف متاح حاليا"]
                        }
                        excludeItems={
                            Array.isArray(service.excludedItems)
                                ? service.excludedItems
                                : [service.excludedItems || "لا يوجد وصف متاح حاليا"]
                        }
                        requirements={
                            Array.isArray(service.requirements)
                                ? service.requirements
                                : [service.requirements || "لا يوجد وصف متاح حاليا"]
                        }
                    />
                </div>

                {/*TECHNICIANS */}
                <div className="service-details-header mt-5">
                    <h3>فنيين متخصصين</h3>
                </div>

                <div className="technicians-container d-flex flex-wrap gap-4">
                    {technicians.length === 0 ? (
                        <p className="text-muted mt-3">
                            لا يوجد فنيين متاحين حالياً
                        </p>
                    ) : (
                        technicians.map((tech) => (
                            <div
                                key={tech.id}
                                className="service-details-page shadow-sm d-flex flex-column justify-content-center align-items-center gap-2"
                                style={{
                                    maxWidth: "285px",
                                    width: "100%",
                                    padding: "24px",
                                    backgroundColor: "white",
                                    borderRadius: "16px",
                                    textAlign: "center",
                                    marginTop: "50px",
                                }}
                            >
                                <img
                                    src="/26.png"
                                    alt={tech.displayName}
                                    style={{
                                        borderRadius: "50%",
                                        marginBottom: "15px",
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                    }}
                                />
                                <h4>{tech.displayName || "اسم الفني"}</h4>
                                <p>{tech.specialization || "تخصص الفني"}</p>
                                <p>⭐ {tech.rating ?? "—"}</p>
                                <p>
                                    {tech.experienceYears} سنوات خبرة
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <Scrollbtn />
        </>
    );
};

export default ServiceDetails;