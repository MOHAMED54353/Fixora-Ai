import React from "react";

const Section2 = () => {
  return (
    <>
      <style>{`
        .section2-container {
          margin-bottom: 100px;
          margin-left: 100px;
          margin-right: auto;
        }

        .section2-content {
          direction: rtl;
          text-align: right;
          margin-right: 60px;
          margin-left: auto;
        }

        .section2-title {
          color: #333D4D;
          font-size: 36px;
          margin-bottom: 12px;
          font-weight: bold;
        }

        .section2-subtitle {
          color: #A9A9A9;
          font-size: 20px;
          padding: 12px 0;
        }

        .steps-container {
          display: flex;
          justify-content: right;
          gap: 145px;
          direction: rtl;
          margin-top: 50px;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .step-icon-box {
          position: relative;
          background-color: white;
          border-radius: 20px;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid #1255acff;
          margin-bottom: 40px;
        }

        .step-icon {
          color: #315ab5ff;
          font-size: 2rem;
        }

        .step-number {
          position: absolute;
          bottom: -20px;
          background-color: #2A5CAF;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .step-title {
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 22px;
          color: #333D4D;
        }

        .step-description {
          color: #A9A9A9;
          font-size: 16px;
        }

        /* Tablet - 1024px */
        @media (max-width: 1024px) {
          .section2-container {
            margin-left: 50px;
            margin-right: 50px;
            margin-bottom: 80px;
          }

          .section2-content {
            margin-right: 30px;
            margin-left: 30px;
          }

          .steps-container {
            gap: 60px;
            justify-content: center;
          }

          .section2-title {
            font-size: 30px;
          }

          .section2-subtitle {
            font-size: 18px;
          }

          .step-icon-box {
            width: 90px;
            height: 90px;
          }

          .step-title {
            font-size: 20px;
          }

          .step-description {
            font-size: 15px;
          }
        }

        /* Mobile - 768px */
        @media (max-width: 768px) {
          .section2-container {
            margin: 0 15px 60px 15px;
          }

          .section2-content {
            margin: 0 10px;
            text-align: center;
          }

          .section2-title {
            font-size: 26px;
            text-align: center;
          }

          .section2-subtitle {
            font-size: 16px;
            text-align: center;
          }

          .steps-container {
            flex-wrap: wrap;
            gap: 50px;
            justify-content: center;
            margin-top: 40px;
          }

          .step-item {
            width: calc(50% - 25px);
            min-width: 150px;
          }

          .step-icon-box {
            width: 80px;
            height: 80px;
            margin-bottom: 30px;
          }

          .step-icon {
            font-size: 1.6rem;
          }

          .step-number {
            width: 35px;
            height: 35px;
            font-size: 1rem;
            bottom: -17px;
          }

          .step-title {
            font-size: 18px;
          }

          .step-description {
            font-size: 14px;
          }
        }

        /* Small Mobile - 480px */
        @media (max-width: 480px) {
          .section2-container {
            margin: 0 10px 50px 10px;
          }

          .section2-title {
            font-size: 22px;
            margin-bottom: 15px;
          }

          .section2-subtitle {
            font-size: 14px;
          }

          .steps-container {
            flex-direction: column;
            gap: 40px;
            margin-top: 30px;
          }

          .step-item {
            width: 100%;
            max-width: 250px;
            margin: 0 auto;
          }

          .step-icon-box {
            width: 75px;
            height: 75px;
            margin-bottom: 25px;
          }

          .step-icon {
            font-size: 1.4rem;
          }

          .step-number {
            width: 32px;
            height: 32px;
            font-size: 0.95rem;
            bottom: -16px;
          }

          .step-title {
            font-size: 17px;
          }

          .step-description {
            font-size: 13px;
          }
        }

        /* Extra Small - 360px */
        @media (max-width: 360px) {
          .section2-title {
            font-size: 20px;
          }

          .section2-subtitle {
            font-size: 13px;
          }

          .step-icon-box {
            width: 70px;
            height: 70px;
          }

          .step-icon {
            font-size: 1.3rem;
          }

          .step-number {
            width: 30px;
            height: 30px;
            font-size: 0.9rem;
            bottom: -15px;
          }

          .step-title {
            font-size: 16px;
          }

          .step-description {
            font-size: 12px;
          }
        }
      `}</style>

      {/* section 2 بداية كيف نعمل ? */}
      <div id="how" className="section2-container ">
        <div className="section2-content">
          <h3 className="section2-title">كيف نعمل ؟</h3>
          <p className="section2-subtitle">
            أربع خطوات بسيطة للحصول على أفضل خدمة.
          </p>

          <div className="steps-container">
            {/* خطوة 1 */}
            <div className="step-item">
              <div className="step-icon-box">
                <i className="fa-regular fa-calendar step-icon"></i>
                <div className="step-number">1</div>
              </div>
              <h5 className="step-title">احجز الخدمة</h5>
              <p className="step-description">
                اختر الخدمة المناسبة واحجز موعدك بسهولة
              </p>
            </div>

            {/* خطوة 2 */}
            <div className="step-item">
              <div className="step-icon-box">
                <i className="fa-solid fa-screwdriver-wrench step-icon"></i>
                <div className="step-number">2</div>
              </div>
              <h5 className="step-title">تعيين فني متخصص</h5>
              <p className="step-description">
                يتم تعيين أفضل فني متخصص لسيارتك
              </p>
            </div>

            {/* خطوة 3 */}
            <div className="step-item">
              <div className="step-icon-box">
                <i className="fa-solid fa-bell step-icon"></i>
                <div className="step-number">3</div>
              </div>
              <h5 className="step-title">تتبع العمل لحظيا</h5>
              <p className="step-description">
                تابع سير العمل والتحكم في الصيانة
              </p>
            </div>

            {/* خطوة 4 */}
            <div className="step-item">
              <div className="step-icon-box">
                <i className="fa-solid fa-car-side step-icon"></i>
                <div className="step-number">4</div>
              </div>
              <h5 className="step-title">استلم سيارتك</h5>
              <p className="step-description">استلم سيارتك جاهزة وبأفضل حال</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Section2;
