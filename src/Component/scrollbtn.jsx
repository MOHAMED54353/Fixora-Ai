import { useEffect, useState, useCallback } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!visible) return null;

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        top: "85%",
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
      aria-label="Scroll to top"
    >
      <i className="fa-solid fa-angles-up" style={{ fontSize: "18px" }} />
      للأعلى
    </button>
  );
};

export default ScrollToTopButton;