import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NavUser from "../Component/NavUser.jsx";
import CardService from "../Component/CardService.jsx";
import Scrollbtn from "../Component/scrollbtn";
import axios from "../Utils/axiosConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ITEMS_PER_PAGE = 9;

const Service = ({ user }) => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const fetchServices = async (page = 1, search = "", category = "") => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/Services", {
        params: {
          PageIndex: page,
          PageSize: ITEMS_PER_PAGE,
          Search: search || undefined,
          Category: category || undefined,
        },
      });

      const servicesData = res.data.data || [];
      setServices(servicesData);
      setTotalCount(res.data.count || 0);

      if (allCategories.length === 0 && servicesData.length > 0) {
        const cats = [...new Set(servicesData.map((s) => s.category).filter(Boolean))];
        setAllCategories(cats);
      }
    } catch (err) {
      console.error("❌ Error fetching services:", err);
      setError(err.message || "حدث خطأ أثناء تحميل الخدمات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1, "", "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchServices(1, searchText, filterCategory);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, filterCategory]);

  useEffect(() => {
    fetchServices(currentPage, searchText, filterCategory);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleBookClick = (service) => {
    setCart((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) return prev.filter((s) => s.id !== service.id);
      return [...prev, service];
    });
  };

  const handleCheckout = () => {
    navigate("/booking-details", { state: { services: cart } });
  };

  const onDetailsClick = (service) => {
    navigate(`/service-details/${service.id}`, { state: { service } });
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <NavUser user={user} showMenu={false} />

      <div className="service-page text-center m-5">
        <h2 className="fw-bold mb-3">خدماتنا</h2>
        <p>اختر الخدمة المناسبة لسيارتك من مجموعة واسعة من الخدمات المتخصصة</p>
      </div>

      <div className="banner-container">
        <div className="booking-banner">
          <div className="banner-content">
            <div className="text-section d-flex justify-content-around">
              <div className="text-container d-flex align-items-center gap-3">
                <img src="/si_ai-line.png" alt="picture" width="60px" height="65px" />
                <div className="text-content d-flex flex-column">
                  <h2 className="main-title mb-3">مش متأكد من الخدمة المناسبة؟</h2>
                  <p className="sub-title">
                    استخدم الذكاء الاصطناعي لتشخيص مشكلة سيارتك واقتراح الخدمات المناسبة
                  </p>
                </div>
              </div>
            </div>
            <button
              className="booking-button"
              onClick={() => navigate("/ai-service")}
            >
              <span className="plus-icon">🤖</span>
              ابدأ فحص AI
            </button>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center gap-3 mb-4 flex-wrap my-5">
        <div style={{ position: "relative" }}>
          <input
            type="text"
            className="form-control"
            placeholder="ابحث عن خدمة..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              paddingRight: "40px",
              width: "300px",
              height: "45px",
              borderRadius: "10px",
              border: "1.5px solid #dee2e6",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6c757d",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
        </div>

        <select
          className="form-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            maxWidth: "200px",
            height: "45px",
            borderRadius: "10px",
            border: "1.5px solid #dee2e6",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <option value="">كل التخصصات</option>
          {allCategories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center my-5">⏳ جاري تحميل الخدمات...</div>
      )}
      {error && (
        <div className="alert alert-danger text-center m-5">{error}</div>
      )}
      {!loading && !error && services.length === 0 && (
        <div className="text-center my-5">
          <p className="text-muted">لا توجد خدمات متاحة حالياً</p>
        </div>
      )}

      <div className="row g-4 justify-content-center m-5">
        {!loading &&
          !error &&
          services.map((service, index) => (
            <div className="col-lg-4 col-md-6 p-3" key={service.id || index}>
              <CardService
                title={service.name || "خدمة"}
                category={service.category || "عام"}
                description={service.description || "وصف الخدمة غير متوفر حالياً"}
                price={service.basePrice || 0}
                rating={service.averageRating || 0}
                reviewCount={service.reviewCount || 0}
                duration={service.estimatedDurationMinutes || 0}
                specialty={service.category || "عام"}
                isInCart={cart.some((s) => s.id === service.id)}
                onDetailsClick={() => onDetailsClick(service)}
                onBookClick={() => handleBookClick(service)}
              />
            </div>
          ))}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 my-5" dir="ltr">
          <button
            className="btn btn-outline-primary"
            style={{ borderRadius: "10px", width: "42px", height: "42px", padding: 0 }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span key={idx} style={{ padding: "0 4px", color: "#6c757d" }}>
                ...
              </span>
            ) : (
              <button
                key={idx}
                className={`btn ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
                style={{
                  borderRadius: "10px",
                  width: "42px",
                  height: "42px",
                  padding: 0,
                  fontWeight: currentPage === page ? "bold" : "normal",
                }}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className="btn btn-outline-primary"
            style={{ borderRadius: "10px", width: "42px", height: "42px", padding: 0 }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}

      {/* Results Info */}
      {!loading && !error && totalCount > 0 && (
        <p className="text-center text-muted mb-4" style={{ fontSize: "14px" }}>
          عرض {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} من {totalCount} خدمة
        </p>
      )}

      {cart.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "16px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "14px 24px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            border: "2px solid #2A5CAF",
          }}
        >
          <span style={{ fontWeight: "bold", color: "#333D4D" }}>
            🛒 {cart.length} {cart.length === 1 ? "خدمة" : "خدمات"} —{" "}
            <span className="text-primary">
              {cart.reduce((sum, s) => sum + (s.basePrice || 0), 0)} ج.م
            </span>
          </span>
          <button
            className="btn btn-primary fw-bold px-4"
            style={{ borderRadius: "12px", height: "44px" }}
            onClick={handleCheckout}
          >
            استكمال الحجز ←
          </button>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} rtl pauseOnHover />
      <Scrollbtn />
    </>
  );
};

export default Service;