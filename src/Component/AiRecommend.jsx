import React from 'react'

const AiRecommend = ({ item }) => {
  return (
    <>
      <div
        style={{
          background: "#FFFFFF",
          // border: "1px solid #E9ECEF",
          borderRadius: "16px",
          padding: "24px",
          width: "100%",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginTop: "50px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <i className="fa-solid fa-screwdriver-wrench fs-4" style={{ color: "#2A5CAF" }}></i>
          <i className="fa-solid fa-microchip fs-4" style={{ color: "#2A5CAF" }}></i>
        </div>
        <div className='d-flex flex-column align-items-center gap-3'>
          <div className="d-flex justify-content-center align-items-center gap-4">
            <h3 style={{ marginTop: "12px", fontSize: "22px", fontWeight: "400", color: "#333D4D" }}>
              {item.title}
            </h3>
            {item.badge && (
              <span
                style={{
                  background: "#FEF2F2",
                  color: "#DC2626",
                  padding: "8px 16px",
                  borderRadius: "24px",
                  fontSize: "16px",
                }}
              >
                {item.badge}
              </span>
            )}
          </div>
          <p className=''>
            {item.description}
          </p>
        </div>

        {/* ....................... */}
        <div className="d-flex flex-column align-items-center gap-3">
          <p style={{ marginBottom: "8px", color: "#333D4D" }}>
            {item.recommend}
          </p>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "22px",
              marginBottom: "12px",
              color: "#2A5CAF",
            }}
          >
            <i className="fa-solid fa-sack-dollar text-warning ps-2"></i>
            {item.price} جنيه
          </div>

          <button
            style={{
              background: "#2A5CAF",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            + أضف للحجز
          </button>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <i className="fa-solid fa-microchip fs-4" style={{ color: "#2A5CAF" }}></i>
          <i className="fa-solid fa-screwdriver-wrench fs-4" style={{ color: "#2A5CAF" }}></i>
        </div>
      </div>
    </>
  )
}

export default AiRecommend
