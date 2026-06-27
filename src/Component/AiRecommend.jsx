import React from 'react'
import { useNavigate } from 'react-router'

const AiRecommend = ({ item }) => {
  const navigate = useNavigate()

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "24px",
        width: "100%",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderTop: "4px solid #2A5CAF",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <i className="fa-solid fa-screwdriver-wrench fs-4" style={{ color: "#2A5CAF" }}></i>
        <i className="fa-solid fa-microchip fs-4" style={{ color: "#2A5CAF" }}></i>
      </div>

      <div className='d-flex flex-column align-items-center gap-3 text-center'>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#333D4D", margin: 0 }}>
            {item.title}
          </h3>
          {item.badge && (
            <span style={{
              background: "#FEF2F2",
              color: "#DC2626",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "700",
            }}>
              {item.badge}
            </span>
          )}
        </div>
        <p style={{ color: "#64748B", margin: 0, fontSize: "14px" }}>
          {item.description}
        </p>
      </div>

      <div className="d-flex flex-column align-items-center gap-3">
        <div style={{ fontWeight: "bold", fontSize: "22px", color: "#2A5CAF" }}>
          <i className="fa-solid fa-sack-dollar text-warning ps-2"></i>
          {item.price} جنيه
        </div>

        <button
          onClick={() => navigate("/booking-details", { state: { service: item.service } })}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#1E4A9A"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#2A5CAF"
            e.currentTarget.style.transform = "translateY(0)"
          }}
          style={{
            background: "#2A5CAF",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 0",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "15px",
            width: "50%",
            transition: "all 0.2s ease",
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
  )
}

export default AiRecommend