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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  const buttonStyle = {
    position: "fixed",
    bottom: "50px",
    left: "35px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: hovered ? "#0c64fc" : "#2A5CAF",
    color: "#fff",
    cursor: "pointer",
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: hovered
      ? "0 6px 15px rgba(0,0,0,0.3)"
      : "0 4px 8px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    transform: hovered ? "scale(1.3)" : "scale(1)",
    zIndex: 9999,
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={buttonStyle}
      aria-label="Scroll to top"
    >
      <i className="fa-solid fa-angles-up"></i>
    </button>
  );
};

export default ScrollToTopButton;
