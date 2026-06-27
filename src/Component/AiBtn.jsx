import { useState } from "react";
import { useNavigate } from "react-router";

const Aibtn = () => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <button
      className="chat-bot-button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("/chatbot")}
      style={{
        position: "fixed",
        top: "75%",
        left: "0",
        transform: hovered ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(-30%)",
        height: "44px",
        padding: "0 16px",
        borderRadius: "0 24px 24px 0",
        background: hovered ? "#0c64fc" : "#2A5CAF",
        color: "white",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: hovered ? "4px 0 16px rgba(42,92,175,0.4)" : "4px 0 12px rgba(42,92,175,0.3)",
        transition: "all 0.3s ease",
        zIndex: 9999,
        whiteSpace: "nowrap",
      }}
    >
      <i className="fas fa-robot" style={{ fontSize: "18px" }} />
      مساعد  AI
    </button>
  );
};

export default Aibtn;