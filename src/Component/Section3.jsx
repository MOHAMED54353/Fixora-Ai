import React from "react";
import { useNavigate } from "react-router";
import "../styles/section3.css";

const Section3 = () => {
  const navigate = useNavigate();

  return (
    <>

      {/* section 3  بداية خدامتنا */}
      <div className="section3-container">
        <div className="section3-header">
          <h3 className="section3-title">خدماتنا</h3>
          <p className="view-all-link" onClick={() => navigate("/Service")}>
            مشاهدة الكل <i className="fa-solid fa-arrow-left"></i>
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="card shadow-sm p-4 text-center service-card service-card-wrapper">
              <br />
              <div className="service-icon" style={{ fontSize: "3rem" }}>
                <img src="/streamline-ultimate_car-actions-check-1.png" alt="picture" />
              </div>
              <h5
                className="mt-3 fw-bold"
                style={{
                  fontSize: "18px",
                  color: "#333D4D",
                  marginBottom: "20px",
                }}
              >
                صيانة دورية
              </h5>
              <p style={{ color: "#A9A9A9", fontSize: "16px" }}>
                تغيير زيت - فلاتر - فحص عام
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-4 text-center service-card service-card-wrapper">
              <br />
              <div className="service-icon" style={{ fontSize: "3rem" }}>
                <img src="/heroicons_wrench-screwdriver.png" alt="picture" />
              </div>
              <h5
                className="mt-3 fw-bold"
                style={{
                  fontSize: "18px",
                  color: "#333D4D",
                  marginBottom: "20px",
                }}
              >
                إصلاح أعطال
              </h5>
              <p style={{ color: "#A9A9A9", fontSize: "16px" }}>
                كهرباء - موتور - عفشة
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-4 text-center service-card service-card-wrapper">
              <br />
              <div className="service-icon" style={{ fontSize: "3rem" }}>
                <img src="/arcticons_carinfo.png" alt="picture" />
              </div>
              <h5
                className="mt-3 fw-bold"
                style={{
                  fontSize: "18px",
                  color: "#333D4D",
                  marginBottom: "20px",
                }}
              >
                فحص شامل
              </h5>
              <p style={{ color: "#A9A9A9", fontSize: "16px" }}>
                45 نقطة فحص - تقرير كامل
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-4 text-center service-card service-card-wrapper">
              <br />
              <div className="service-icon" style={{ fontSize: "3rem" }}>
                <img src="s.png" alt="picture" />
              </div>
              <h5
                className="mt-3 fw-bold"
                style={{
                  fontSize: "18px",
                  color: "#333D4D",
                  marginBottom: "20px",
                }}
              >
                تنظيف وغسيل
              </h5>
              <p style={{ color: "#A9A9A9", fontSize: "16px" }}>
                تنظيف داخلي وخارجي - تلميع
              </p>
            </div>
          </div>
        </div>

        {/* بداية الصورة اللي بعرض الشاشة */}
        <div className="cta-banner">
          <div className="cta-banner-inner shadow-lg">
            <div className="row align-items-center h-100">
              <div className="col-md-6 text-end">
                <h2 className="fw-bold mb-3" style={{ fontSize: "28px", color: "#FFFFFF" }}>
                  جاهز لتجربة مختلفة في صيانة السيارات؟
                </h2>
                <p className="mb-4" style={{ fontSize: "20px", color: "#FFFFFF" }}>
                  احجز موعدك الآن واحصل على خصم 10% على أول خدمة
                </p>
                <button
                  className="btn btn-light btn-lg px-4 py-2 fw-bold"
                  style={{ borderRadius: "8px", color: "#2A5CAF" }}
                  onClick={() => navigate("/Service")}
                >
                  ابدأ الآن
                </button>
              </div>

              <div className="col-md-6">
                <img
                  src="/3e6126604e4d9c4886c795cbfd25c73d655f946d.png"
                  alt="logo"
                  className="cta-image"
                />
              </div>
            </div>
          </div>
        </div>

        {/* بداية لماذا موقعنا */}
        <div className="why-section">
          <div>
            <h3
              className="fw-bold"
              style={{ color: "#333D4D", fontSize: "36px" }}
            >
              لماذا FIXORA ؟
            </h3>
            <p
              style={{
                color: "#A9A9A9",
                fontSize: "22px",
                marginTop: "18px",
                marginBottom: "55px",
              }}
            >
              نقدم لكم تجربة فريدة في صيانة السيارات من خلال فريق متخصص، أدوات
              حديثة، وخدمات متميزة تضمن رضاكم التام.
            </p>

            <div
              className="row"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div className="col-md-3">
                <div className="card p-4 text-center service-card why-card">
                  <div
                    className="service-icon"
                    style={{
                      fontSize: "40px",
                      color: "#2A5CAF",
                      marginTop: "5px",
                    }}
                  >
                    🤖
                  </div>
                  <h5
                    className="mt-3 fw-bold"
                    style={{ fontSize: "18px", color: "#333D4D" }}
                  >
                    تشخيص ذكي بالذكاء الاصطناعي
                  </h5>
                  <p style={{ color: "#A9A9A9", fontSize: "16px" }}>
                    نستخدم أحدث تقنيات الذكاء الاصطناعي لتشخيص مشاكل سيارتك بدقة
                    عالية
                  </p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card p-4 text-center service-card why-card">
                  <div
                    className="service-icon"
                    style={{
                      fontSize: "3rem",
                      color: "#2A5CAF",
                      marginTop: "5px",
                    }}
                  >
                    <div className="fs-1">💵</div>
                  </div>
                  <h5
                    className="mt-3 fw-bold"
                    style={{ fontSize: "18px", color: "#333D4D" }}
                  >
                    شفافية كاملة في الأسعار
                  </h5>
                  <p style={{ color: "#A9A9A9", fontSize: "16px" }}>
                    أسعار واضحة ومحددة مسبقاً بدون أي تكاليف خفية أو مفاجآت
                  </p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card p-3 text-center service-card why-card">
                  <div
                    className="service-icon"
                    style={{
                      fontSize: "3rem",
                      color: "#2A5CAF",
                      marginTop: "5px",
                    }}
                  >
                    <img src="/location.png" alt="" />
                  </div>
                  <h5
                    className="mt-3 fw-bold"
                    style={{ fontSize: "18px", color: "#333D4D" }}
                  >
                    تتبع فوري لحالة سيارتك
                  </h5>
                  <p style={{ color: "#A9A9A9", fontSize: "16px" }}>
                    تابع كل مرحلة من مراحل صيانة سيارتك لحظة بلحظة عبر تطبيقنا
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Section3;