import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import NavUser from "../Component/NavUser";
import CarCard from "../Component/CarCard.jsx";
import AiBtn from "../Component/AiBtn.jsx";
import AddCar from "../Component/AddCar.jsx";
import  axios  from "../Utils/axiosConfig.jsx";
import { ToastContainer } from "react-toastify";

const Car = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                console.log("access Token:", token ? "OK" : "Missing");
                const response = await axios.get("/api/Vehicles");
                setCars(Array.isArray(response.data) ? response.data : []);
                console.log("number of cars:", Array.isArray(response.data) ? response.data.length : 0,":the data",response.data);
                setCars(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("❌ Error fetching cars:", error);
                if (error.response && error.response.status === 401) {
                    toast.error("يجب تسجيل الدخول أولاً");
                    navigate("/login");
                } else {
                    toast.error("حدث خطأ أثناء تحميل السيارات");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, [navigate]);


    const handleDelete = async (carId) => {
        if (!window.confirm("هل أنت متأكد من حذف هذه السيارة؟"))
            return;

        try {
            await axios.delete(`/api/Vehicles/${carId}`);

            setCars((prev) => prev.filter((car) => car.id !== carId));
            toast.success("تم حذف السيارة بنجاح");
        } catch (error) {
            console.error("❌ Error deleting car:", error);

            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message;

                if (status === 500) {
                    toast.error("لا يمكن حذف السيارة لأنها مرتبطة بحجز قائم أو حجوزات سابقة");
                } else if (status === 403) {
                    toast.error("غير مصرح لك بحذف هذه السيارة");
                } else if (status === 404) {
                    toast.error("السيارة غير موجودة");
                } else {
                    toast.error(message || "حدث خطأ أثناء حذف السيارة");
                }
            } else {
                toast.error("فشل الاتصال بالسيرفر");
            }
        }
    };


    const handleBookClick = (carId) => {
        console.log(`Go to Service page for car ${carId}`);
        navigate(`/service?carId=${carId}`);
    };


    return (
        <>
            <NavUser />
            <div style={{ minHeight: "100vw", backgroundColor: "#f8f9fa" }}>
                <div className="container mt-5 d-block">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 style={{ color: "#333D4D", fontSize: "36px", fontWeight: "400" }}>سياراتي</h4>
                        <button
                            className="btn btn-primary px-4"
                            onClick={() => setShowModal(true)}
                            style={{
                                backgroundColor: "#2A5CAF",
                                borderColor: "#2A5CAF",
                                fontSize: "18px",
                                borderRadius: "12px",
                                padding: "10px 24px",
                            }}
                        >
                            + إضافة سيارة
                        </button>
                    </div>

                    {!loading && cars.length === 0 && (
                        <div className="text-center py-5">
                            <div className="mb-4" style={{ fontSize: "80px", opacity: "0.3" }}>🚗</div>
                            <h5 style={{ color: "#666", marginBottom: "10px" }}>لا توجد سيارات مضافة</h5>
                            <p style={{ color: "#999" }}>ابدأ بإضافة سيارتك الأولى</p>
                        </div>
                    )}

                    <div className="container my-5 d-block">
                        <div className="row justify-content-center g-4">
                            {cars.map((car) => (
                                <div key={car.id || car.Id} className="col-12 col-md-6 col-lg-6 d-flex justify-content-center">
                                    <div className="my-3" style={{ maxWidth: "600px", width: "100%" }}>
                                        <CarCard car={car} onBook={handleBookClick} onDelete={handleDelete} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AddCar
                show={showModal}
                onClose={() => setShowModal(false)}
                onCarAdded={(newCar) => {
                    setCars((prev) => {
                        const updatedCars = [...prev, newCar];
                        console.log("Car added. Total cars:", updatedCars.length, "Cars data:", updatedCars);
                        return updatedCars;
                    });
                }}
            />
            <ToastContainer position="top-center" autoClose={3000} />
            <AiBtn />
        </>
    );
};

export default Car;
