import React, { useState, useEffect } from 'react';
import NavUser from '../Component/NavUser';
import TechnicianCard from '../Component/TechnicianCard.jsx';
import AddTechnician from "../Component/AddTechnician.jsx";
import AddService from "../Component/AddService.jsx";
import axios from "../Utils/axiosConfig";
import ServiceTable from "../Component/ServiceTable.jsx";
import BookingsTable from '../Component/BookingsTable.jsx';
import { Link } from "react-router";
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const PAGE_SIZE = 5;

const Manager = ({ user }) => {
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showModal, setShowModal] = useState({ open: false, tech: null });
  const [showServiceModal, setShowServiceModal] = useState({ open: false, service: null });

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesPage, setServicesPage] = useState(1);
  const [servicesTotalCount, setServicesTotalCount] = useState(0);
  const servicesTotalPages = Math.ceil(servicesTotalCount / PAGE_SIZE);

  const [dashboardStats, setDashboardStats] = useState({
    availableTechnicians: 0,
    averageRating: 0,
    todayBookings: 0,
    totalBookings: 0,
    totalCustomers: 0,
    totalTechnicians: 0,
    totalRevenue: 0,
    todayRevenue: 0,
  });

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/Technicians");
      const formatted = res.data.map(t => ({
        id: t.id,
        Specialization: t.specialization || t.Specialization || "غير محدد",
        Rating: t.rating ?? t.Rating ?? 0,
        IsAvailable: t.isAvailable ?? t.IsAvailable,
        UserId: t.userId ?? t.UserId,
        UserName: t.userName ?? t.UserName,
        DisplayName: t.displayName ?? t.DisplayName,
        Email: t.email ?? t.Email,
        PhoneNumber: t.phoneNumber ?? t.PhoneNumber,
        DailyTasks: t.dailyTasks ?? t.DailyTasks ?? 0,
        ExperienceYears: t.experienceYears ?? t.ExperienceYears ?? 0,
      }));
      setTechnicians(formatted);
    } catch (err) {
      console.error("❌ خطأ في جلب الفنيين:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchTechnicians(); }, []);

  const fetchServices = async (page = 1) => {
    try {
      setServicesLoading(true);
      const res = await axios.get("/api/Services", {
        params: { PageIndex: page, PageSize: PAGE_SIZE },
      });
      const resData = res.data;
      setServices(resData.data || []);
      setServicesTotalCount(resData.count || 0);
      setServicesPage(page);
    } catch (err) {
      console.error("❌ خطأ في جلب الخدمات:", err);
    } finally {
      setServicesLoading(false);
    }
  };
  useEffect(() => { fetchServices(1); }, []);

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const res = await axios.get("/api/Bookings/today", {
        params: { PageIndex: 1, PageSize: 20 },
      });
      setBookings(res.data.data || res.data || []);
    } catch (err) {
      console.error("❌ خطأ في جلب حجوزات اليوم:", err);
    } finally {
      setBookingsLoading(false);
    }
  };
  useEffect(() => { fetchBookings(); }, []);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const res = await axios.get("/api/Admin/dashboard-stats");
      setDashboardStats(res.data);
    } catch (err) {
      console.error("❌ خطأ في جلب إحصائيات لوحة الإدارة:", err);
    } finally {
      setStatsLoading(false);
    }
  };
  useEffect(() => { fetchDashboardStats(); }, []);

  const handleAddOrUpdateTechnician = () => { fetchTechnicians(); };

  const handleDeleteTechnician = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الفني؟")) return;
    try {
      await axios.delete(`/api/Technicians/${id}`);
      setTechnicians(prev => prev.filter(t => t.id !== id));
      toast.success("تم حذف الفني بنجاح");
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      let message = "حدث خطأ أثناء حذف الفني";
      if (status === 404) message = "الفني غير موجود أو تم حذفه بالفعل";
      else if (status === 403) message = "ليس لديك صلاحية حذف هذا الفني";
      else if (data?.errorMessage) message = data.errorMessage;
      toast.error(message);
    }
  };

  const handleServiceAdded = () => {
    fetchServices(servicesPage);
  };

  const handleDeleteService = async (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    const serviceName = service?.name || service?.Name || "هذه الخدمة";
    if (!window.confirm(`تحذير: حذف "${serviceName}" سيؤثر على الحجوزات المرتبطة بها.\nهل أنت متأكد؟`)) return;
    try {
      await axios.delete(`/api/Services/${serviceId}`);
      toast.success("تم حذف الخدمة بنجاح");
      const newCount = servicesTotalCount - 1;
      const maxPage = Math.max(1, Math.ceil(newCount / PAGE_SIZE));
      fetchServices(Math.min(servicesPage, maxPage));
    } catch (err) {
      const data = err.response?.data;
      if (data?.errorMessage?.includes("REFERENCE constraint") || data?.errorMessage?.includes("BookingServices")) {
        toast.error("❌ لا يمكن حذف الخدمة لأنها مرتبطة بحجوزات موجودة");
        return;
      }
      toast.error(`❌ ${data?.errorMessage || "حدث خطأ أثناء الحذف"}`);
    }
  };

  const statCardStyle = {
    backgroundColor: "white",
    padding: "28px 32px",
    borderRadius: "16px",
    height: "100%",
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <NavUser showMenu={false} user={user} />
      <section className="px-3 px-md-5 py-5 mx-0 mx-md-4">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div style={statCardStyle}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0" style={{ fontSize: "18px" }}>الفنيين المتاحين</p>
                <i className="fa-solid fa-user-check fs-5 text-success"></i>
              </div>
              <h4>{statsLoading ? "..." : dashboardStats.availableTechnicians}</h4>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div style={{ ...statCardStyle, cursor: "pointer" }} onClick={() => navigate("all-rating")}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0" style={{ fontSize: "18px" }}>متوسط التقييم</p>
                <i className="fa-solid fa-star fs-5 text-warning"></i>
              </div>
              <h4>{statsLoading ? "..." : dashboardStats.averageRating}</h4>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div style={statCardStyle}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0" style={{ fontSize: "18px" }}>الحجوزات اليوم</p>
                <i className="fa-solid fa-calendar-days fs-5"></i>
              </div>
              <h4>{bookings.length}</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-3 px-md-5 py-2 mx-0 mx-md-4">

        {/* Technicians Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <h2 className="fw-normal mb-0" style={{ fontSize: "24px" }}>
            إدارة الفنيين
            <span className="mx-2" style={{ fontSize: "16px", color: "#888" }}>({technicians.length})</span>
          </h2>
          <button
            className="btn btn-primary px-3"
            style={{ backgroundColor: "#2A5CAF", fontSize: "15px", fontWeight: "bold", borderRadius: "12px" }}
            onClick={() => setShowModal({ open: true, tech: null })}
          >
            + إضافة فني جديد
          </button>
        </div>

        {/* Technicians Grid */}
        {loading ? (
          <p className="text-center">جارٍ تحميل الفنيين...</p>
        ) : (
          <div className="row g-4 my-2">
            {technicians.map(tech => (
              <div className="col-12 col-sm-6 col-xl-4" key={tech.id}>
                <TechnicianCard
                  technician={tech}
                  onDelete={() => handleDeleteTechnician(tech.id)}
                  onEdit={() => setShowModal({ open: true, tech })}
                />
              </div>
            ))}
          </div>
        )}

        {/* Services Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 my-5">
          <h2 className="fw-normal mb-0" style={{ fontSize: "24px" }}>
            إدارة الخدمات
            <span className="mx-2" style={{ fontSize: "16px", color: "#888" }}>({servicesTotalCount})</span>
          </h2>
          <button
            className="btn px-3"
            style={{ backgroundColor: "#ffffff", color: "#2A5CAF", border: "2px solid #2A5CAF", fontSize: "15px", fontWeight: "bold", borderRadius: "12px" }}
            onClick={() => setShowServiceModal({ open: true, service: null })}
          >
            + إضافة خدمة جديدة
          </button>
        </div>

        <ServiceTable
          services={services}
          loading={servicesLoading}
          onDelete={handleDeleteService}
          onEdit={(service) => setShowServiceModal({ open: true, service })}
          page={servicesPage}
          totalPages={servicesTotalPages}
          totalCount={servicesTotalCount}
          pageSize={PAGE_SIZE}
          onPageChange={(p) => fetchServices(p)}
        />

        {/* Bookings Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 my-5">
          <h2 className="fw-normal mb-0" style={{ fontSize: "24px" }}>
            الحجوزات
            <span className="mx-2" style={{ fontSize: "16px", color: "#888" }}>({bookings.length})</span>
          </h2>
          <Link to="/all-bookings" style={{ color: "#2A5CAF", fontSize: "16px", fontWeight: "bold" }}>
            مشاهدة الكل <i className="fa-solid fa-left-long"></i>
          </Link>
        </div>

        <BookingsTable
          bookings={bookings}
          loading={bookingsLoading}
          onDelete={(id) => console.log("Delete booking", id)}
          onEdit={(booking) => console.log("Edit booking", booking)}
        />

      </section>

      {showModal.open && (
        <AddTechnician
          onClose={() => setShowModal({ open: false, tech: null })}
          onAdded={handleAddOrUpdateTechnician}
          technicianToEdit={showModal.tech}
        />
      )}

      {showServiceModal.open && (
        <AddService
          onClose={() => setShowServiceModal({ open: false, service: null })}
          onServiceAdded={handleServiceAdded}
          serviceToEdit={showServiceModal.service}
        />
      )}
    </>
  );
};

export default Manager;