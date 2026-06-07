import React from "react";
import { useNavigate } from "react-router";

const Herosection = () => {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        .hero-section {
          direction: rtl;
          margin-top: 350px;
          width: 100%;
          margin-bottom: 250px;
        }

        .hero-row {
          direction: rtl;
          text-align: right;
          margin-right: -80px;
          margin-left: -80px;
        }

        .hero-title {
          font-size: 48px;
          color: #1e293b;
          margin-bottom: 30px;
          font-weight: bold;
        }

        .hero-text {
          font-size: 16px;
          color: #A9A9A9;
        }

        .hero-buttons {
          display: flex;
          gap: 40px;
          justify-content: start;
          flex-wrap: wrap;
          direction: rtl;
        }

        .btn-outline-hero {
          background-color: white;
          color: #2A5CAF;
          border: 2px solid #195be1ff;
          border-radius: 12px;
          gap : 10px;
          font-size: 16px;
          font-weight: 600;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          white-space: nowrap;
        }

        .hero-image {
          width: 100%;
          height: auto;
          padding: 3rem;
          margin: 3rem;
        }


        /* Tablet - 1024px */
        @media (max-width: 1024px) {
          .hero-section {
            margin-top: 100px;
            margin-bottom: 50px;
          }

          .hero-row {
            margin-right: -50px;
            margin-left: -50px;
          }

          .hero-title {
            font-size: 40px;
          }

          .hero-text {
            font-size: 15px;
          }

          .hero-image {
            padding: 2rem;
            margin: 2rem;
          }
        }

        /* Mobile - 768px */
        @media (max-width: 768px) {
          .hero-section {
            margin-top: 50px;
            margin-bottom: 60px;
            padding: 0 15px;
          }

          .hero-row {
            margin-right: 0;
            margin-left: 0;
          }

          .hero-title {
            font-size: 28px;
            margin-bottom: 20px;
            text-align: center;
          }

          .hero-text {
            font-size: 14px;
            margin-bottom: 30px;
            text-align: center;
          }

          .hero-buttons {
            justify-content: center;
            gap: 15px;
          }

          .btn-primary-hero,
          .btn-outline-hero {
            padding: 10px 25px;
            font-size: 14px;
          }

          .col-lg-6.order-2.order-lg-1 {
            text-align: center !important;
          }

          .hero-image {
            padding: 1rem;
            margin: 1rem;
          }
        }

        /* Small Mobile - 480px */
        @media (max-width: 480px) {
          .hero-section {
            margin-top: 0px;
            margin-bottom: 50px;
            padding: 0 10px;
          }

          .hero-title {
            font-size: 22px;
            margin-bottom: 15px;
          }

          .hero-text {
            font-size: 13px;
            margin-bottom: 25px;
          }

          .btn-primary-hero,
          .btn-outline-hero {
            padding: 8px 20px;
            font-size: 13px;
            width: 100%;
          }

          .hero-buttons {
            gap: 10px;
            flex-direction: column;
          }

          .hero-image {
            padding: 0.5rem;
            margin: 0.5rem;
          }
        }

        /* Extra Small - 360px */
        @media (max-width: 360px) {
          .hero-section {
            margin-top: 70px;
          }

          .hero-title {
            font-size: 20px;
          }

          .hero-text {
            font-size: 12px;
          }

          .btn-primary-hero,
          .btn-outline-hero {
            padding: 7px 15px;
            font-size: 12px;
          }
        }
      `}</style>

      {/* ------------------------------------------------------------------- */}
      <div className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-5 hero-row">
            <div className="col-lg-6 order-2 order-lg-1 text-end">
              <h2 className="hero-title" style={{ color: "#333D4D" }}>
                صيانة سيارتك أصبحت
                <span style={{ color: "#2A5CAF" }}> أذكى وأسهل </span>
                من أي وقت!
              </h2>
              <p className="mb-5 hero-text">
                أول منصة مصرية متكاملة لصيانة السيارات تعتمد على الذكاء
                الاصطناعي لتقديم خدمة صيانة وتشخيص وحجز ذكية وموثوقة. أُنشئت
                المنصة لتجاوز القيود التقليدية في السوق المصرية، حيث تربط
                العملاء بمركز صيانة رئيسي.
              </p>

              <div className="hero-buttons">
                <button className="btn btn-primary"
                  onClick={() => navigate("/ai-service")}>
                  ابدأ فحصك الذكي الأن
                </button>
                <button className="btn-outline-hero"
                  onClick={() => navigate("/service")}>احجز الأن</button>
              </div>
            </div>


            <div className="photo col-lg-6 order-1 order-lg-2 mb-5 mb-lg-0 my-5">
              <div className="">
                <img
                  src="/Screenshot 2025-11-30 213241.png"
                  alt="image"
                  className="hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Herosection;
