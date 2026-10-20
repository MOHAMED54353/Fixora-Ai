import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import NavUser from "../Component/NavUser";
import axios from "../Utils/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router";
const BookingDetails = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const services = useMemo(() => {
        const { services: servicesFromCart, service: singleService } = location.state || {};
        return servicesFromCart || (singleService ? [singleService] : []);
    }, [location.state]);

    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [creatingBooking, setCreatingBooking] = useState(false);
    const [slotsData, setSlotsData] = useState(null);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const hasFetchedSlots = useRef(false);

    const totalPrice = services.reduce(
        (sum, s) => sum + (s.BasePrice || s.basePrice || 0),
        0
    );

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await axios.get("/api/Vehicles");
                setVehicles(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchVehicles();
    }, []);

    const fetchAvailableSlots = async () => {
        if (services.length === 0) return;
        if (hasFetchedSlots.current) return;
        hasFetchedSlots.current = true;
        const serviceIds = services
            .map((s) => s.id ?? s.serviceId ?? s.Id)
            .filter((id) => id !== undefined && id !== null);
        if (serviceIds.length === 0) {
            toast.error("لم يتم العثور على معرّفات الخدمات");
            return;
        }
        setSlotsLoading(true);
        setSelectedTechnician(null);
        setSelectedSlot(null);
        try {
            const params = new URLSearchParams();
            serviceIds.forEach((id) => params.append("serviceIds", id));
            const res = await axios.get(`/api/Bookings/available-slots?${params.toString()}`);
            setSlotsData(res.data);
        } catch (err) {
            const backendMessage = err.response?.data?.errorMessage;
            if (backendMessage) {
                toast.error(backendMessage);
            } else {
                toast.error("فشل تحميل المواعيد المتاحة");
            }
            hasFetchedSlots.current = false;
        } finally {
            setSlotsLoading(false);
        }
    };

    useEffect(() => {
        if (services.length === 0) {
            toast.error("لم يتم تمرير خدمات، يرجى العودة للخلف");
            setTimeout(() => navigate(-1), 2000);
            return;
        }
        fetchAvailableSlots();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleConfirmBooking = async () => {
        if (!selectedVehicleId) return toast.error("اختر السيارة أولاً");
        if (services.length === 0) return toast.error("لا توجد خدمات محددة");
        if (!selectedSlot) return toast.error("اختر موعداً متاحاً أولاً");

        const payload = {
            vehicleId: selectedVehicleId,
            technicianId: selectedTechnician.technicianId,
            scheduledDate: selectedSlot.slotDateTime,
            description: `حجز خدمات: ${services.map((s) => s.Name || s.name).join("، ")}`,
            services: services.map((s) => ({
                serviceId: s.id,
                duration: s.EstimatedDurationMinutes || s.estimatedDurationMinutes || 60,
            })),
        };
        let toastId;
        try {
            setCreatingBooking(true);
            toastId = toast.loading("جاري إنشاء الحجز...");
            await axios.post("/api/Bookings", payload);
            toast.dismiss(toastId);
            toast.success("تم الحجز بنجاح، هيتم تحصيل المبلغ بعد إتمام الخدمة");
            setTimeout(() => navigate("/profile"), 2500);
        } catch (err) {
            console.error(err.response?.data || err);
            if (toastId) toast.dismiss(toastId);
            toast.error(err.response?.data?.errorMessage || "حدث خطأ أثناء الحجز");
        } finally {
            setCreatingBooking(false);
        }
    };
    const isSubmitting = creatingBooking;

    return (
        <>
            <NavUser showMenu={false} user={user} />
            <section className="section3-container m-4 p-5">
                <div className="section3-header d-block">
                    <h2 style={{ fontSize: "36px", color: "#333D4D", marginBottom: "50px" }}>
                        تفاصيل الحجز
                    </h2>
                </div>

                <div className="d-flex flex-column flex-lg-row flex-wrap gap-4" style={{ alignItems: "flex-start" }}>
                    <div className="d-flex flex-column gap-4" style={{ flex: "1", minWidth: "0" }}>
                        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px" }}>
                            <h3 style={{ fontSize: "28px", color: "#333D4D", marginBottom: "30px" }}>
                                اختر سيارة
                            </h3>
                            <select
                                className="form-control mb-3"
                                style={{
                                    padding: "8px", borderRadius: "8px",
                                    border: "1px solid #A9A9A9", backgroundColor: "#ffffff",
                                    fontSize: "16px", height: "48px",
                                }}
                                value={selectedVehicleId || ""}
                                onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                            >
                                <option value="">اختر السيارة</option>
                                {vehicles.map((car) => (
                                    <option key={car.id} value={car.id}>
                                        {car.brand} {car.model} - {car.plateNumber}
                                    </option>
                                ))}
                            </select>
                            <Link to="/car">إضافة سيارة جديدة +</Link>
                        </div>

                        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px" }}>
                            <h3 style={{ fontSize: "28px", color: "#333D4D", marginBottom: "30px" }}>
                                الخدمات المطلوبة
                            </h3>
                            <div className="d-flex flex-column gap-3">
                                {services.map((s, i) => (
                                    <div key={s.id || i} className="d-flex flex-column gap-3"
                                        style={{
                                            backgroundColor: "#FEF2E8", padding: "24px",
                                            borderRadius: "8px", border: "2px solid #F87B1B",
                                        }}>
                                        <h4 style={{ fontSize: "20px", color: "#333D4D", marginBottom: "6px" }}>
                                            {s?.Name || s?.name}
                                        </h4>
                                        <p className="m-0">{s?.description || s?.Description}</p>
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold">
                                                {s?.BasePrice || s?.basePrice}
                                                <i className="fa-solid fa-sack-dollar text-warning p-2"></i>
                                                ج.م
                                            </span>
                                            <span>
                                                <i className="fa-regular fa-clock p-2"></i>
                                                {s?.EstimatedDurationMinutes || s?.estimatedDurationMinutes} دقيقة
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "16px" }}>
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h3 style={{ fontSize: "28px", color: "#333D4D", margin: 0 }}>
                                    الفني والمواعيد المتاحة
                                </h3>
                            </div>

                            {slotsLoading && (
                                <div className="text-center py-4">
                                    <span className="spinner-border text-primary" />
                                    <p className="mt-2 text-muted">جاري تحميل الفنيين...</p>
                                </div>
                            )}

                            {!slotsLoading && slotsData?.technicians?.length === 0 && (
                                <div className="alert alert-warning text-center">
                                    لا يوجد فنيون متاحون حالياً، حاول لاحقاً.
                                </div>
                            )}

                            {!slotsLoading && slotsData?.technicians?.map((tech) => {
                                const isSelected = selectedTechnician?.technicianId === tech.technicianId;
                                return (
                                    <div
                                        key={tech.technicianId}
                                        onClick={() => { setSelectedTechnician(tech); setSelectedSlot(null); }}
                                        style={{
                                            border: isSelected ? "2px solid #2A5CAF" : "1px solid #e0e0e0",
                                            borderRadius: "12px", padding: "20px", marginBottom: "16px",
                                            cursor: "pointer",
                                            backgroundColor: isSelected ? "#EBF3FE" : "white",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                                            <div className="d-flex gap-3 align-items-center">
                                                <img
                                                    src="26.png"
                                                    alt={tech.technicianName}
                                                    style={{ width: "52px", height: "52px", borderRadius: "12px", objectFit: "cover" }}
                                                />
                                                <div>
                                                    <h5 style={{ margin: 0, color: "#333D4D", fontSize: "18px" }}>
                                                        {tech.technicianName}
                                                    </h5>
                                                    <div className="d-flex align-items-center gap-1">
                                                        <small> {tech.experienceYears} سنوات خبرة</small>
                                                        <small className="text-muted">
                                                            {tech.specialization}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column align-items-end gap-1">
                                                <span>{tech.rating} <i className="fas fa-star text-warning"></i> </span>
                                                {tech.availableSlots?.[0]?.label && (
                                                    <span style={{
                                                        fontSize: "12px", padding: "3px 10px", borderRadius: "20px",
                                                        backgroundColor: "#d4edda", color: "#155724"
                                                    }}>
                                                        أقرب موعد: {tech.availableSlots[0].label}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <div>
                                                <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
                                                    اختر موعداً:
                                                </p>
                                                {tech.availableSlots.length === 0 ? (
                                                    <p className="text-muted" style={{ fontSize: "14px" }}>
                                                        لا توجد مواعيد متاحة لهذا الفني.
                                                    </p>
                                                ) : (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {tech.availableSlots.map((slot) => {
                                                            const isSlotSelected = selectedSlot?.slotDateTime === slot.slotDateTime;
                                                            return (
                                                                <button
                                                                    key={slot.slotDateTime}
                                                                    onClick={(e) => { e.stopPropagation(); setSelectedSlot(slot); }}
                                                                    className="btn"
                                                                    style={{
                                                                        padding: "6px 16px", borderRadius: "8px",
                                                                        border: isSlotSelected ? "2px solid #2A5CAF" : "1px solid #ccc",
                                                                        backgroundColor: isSlotSelected ? "#2A5CAF" : "white",
                                                                        color: isSlotSelected ? "white" : "#333",
                                                                        fontSize: "14px", transition: "all 0.15s",
                                                                    }}
                                                                >
                                                                    {slot.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{
                        width: "100%",
                        maxWidth: "470px", flexShrink: 1, backgroundColor: "white",
                        borderRadius: "16px", padding: "24px",
                        position: "sticky", top: "20px",
                    }}>
                        <h3 style={{ fontSize: "28px", color: "#333D4D", marginBottom: "30px" }}>
                            ملخص الطلب
                        </h3>
                        <div className="d-flex flex-column gap-3">
                            {services.map((s, i) => (
                                <div key={s.id || i} className="d-flex justify-content-between">
                                    <p className="m-0">{s?.Name || s?.name}</p>
                                    <span className="text-primary fw-bold">
                                        {s?.BasePrice || s?.basePrice} ج.م
                                    </span>
                                </div>
                            ))}
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold mb-3">
                            <span>الإجمالي</span>
                            <span className="text-primary fs-5">{totalPrice} ج.م</span>
                        </div>
                        <hr />

                        {selectedSlot && selectedTechnician && (
                            <>
                                <div className="d-flex justify-content-between mb-3">
                                    <span style={{ fontSize: "14px", color: "#555" }}>الفني : {selectedTechnician.technicianName}</span>
                                    <span style={{ fontSize: "14px", color: "#555" }}>الموعد : {selectedSlot.label}</span>
                                </div>
                                <hr />
                            </>
                        )}

                        <div className="alert alert-light border text-center" style={{ fontSize: "14px" }}>
                            سيتم تحديد طريقة الدفع بعد اكتمال الخدمة
                        </div>
                        <hr />
                        <button
                            className="btn btn-primary mt-3"
                            style={{ width: "100%", height: "50px" }}
                            onClick={handleConfirmBooking}
                            disabled={isSubmitting || !selectedSlot}
                        >
                            {isSubmitting ? "جاري الحجز..." : `تأكيد الحجز (${services.length} خدمة)`}
                        </button>
                        {!selectedSlot && (
                            <p className="text-muted text-center mt-2" style={{ fontSize: "13px" }}>
                                اختر فنياً وموعداً للمتابعة
                            </p>
                        )}
                    </div>
                </div>
            </section>
            <ToastContainer position="top-center" autoClose={3000} rtl pauseOnHover />
        </>
    );
};

export default BookingDetails;