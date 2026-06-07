import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import axios from "../Utils/axiosConfig";
import "../styles/nav.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get("/api/Notifications/unread-count");
      setUnreadCount(res.data.unreadCount ?? res.data ?? 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const userData = JSON.parse(localStorage.getItem("user"));
      setIsLoggedIn(!!token);
      setUserRole(userData?.role || null);
      setUserName(userData?.displayName || userData?.Email || "مستخدم");

      if (token) fetchUnreadCount();
      else setUnreadCount(0);
    };

    checkAuth();
    window.addEventListener("authChanged", checkAuth);
    window.addEventListener("notificationsRead", fetchUnreadCount);

    return () => {
      window.removeEventListener("authChanged", checkAuth);
      window.removeEventListener("notificationsRead", fetchUnreadCount);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName(null);
    setUnreadCount(0);
    setUserMenuOpen(false);
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  const profileLink = () => {
    if (userRole === "Admin") return "/manager";
    if (userRole === "Technician") return "/technican";
    return "/Profile";
  };

  return (
    <nav className="navbar">
      <div className="container">
        <a className="logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <img src="/logo.svg" alt="logo" />
        </a>

        <ul className="nav-links">
          {isLoggedIn && (
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >
                حسابي
              </NavLink>
            </li>
          )}
          <li>
            <a href="#how" className="nav-link">كيف نعمل</a>
          </li>
          <li>
            <NavLink
              to="/Service"
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              خدماتنا
            </NavLink>
          </li>

          <li>
            <a href="#footer" className="nav-link" onClick={() => navigate("/chatbot")}>
              تواصل معنا
            </a>
          </li>
        </ul>

        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className="user-dropdown-wrapper" ref={menuRef}>
              <button
                className="user-dropdown-trigger"
                onClick={() => setUserMenuOpen((prev) => !prev)}
              >
                <div className="user-avatar">
                  <i className="fa-solid fa-user"></i>
                </div>
                <span className="user-name">
                  مرحباً : <strong>{userName}</strong>
                </span>
                {unreadCount > 0 && (
                  <span className="nav-bell-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
                <i
                  className="fa-solid fa-chevron-down chevron"
                  style={{
                    transition: "transform 0.25s",
                    transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => { navigate(profileLink()); setUserMenuOpen(false); }}
                  >
                    <i className="fa-solid fa-user"></i>
                    البروفايل
                  </div>

                  <div className="dropdown-divider" />
                  <div
                    className="dropdown-item"
                    onClick={() => { navigate("/notification"); setUserMenuOpen(false); }}
                  >
                    <span style={{ position: "relative", display: "inline-flex" }}>
                      <i className="fa-solid fa-bell"></i>
                      {unreadCount > 0 && (
                        <span className="dropdown-bell-badge">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </span>
                    الإشعارات
                  </div>
                  <div className="dropdown-divider" />
                  <div className="dropdown-item dropdown-item--danger" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    تسجيل الخروج
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <NavLink to="/Login" className="btn btn-primary ms-3">تسجيل الدخول</NavLink>
              <NavLink to="/Register" className="btn btn-outline">إنشاء حساب</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;