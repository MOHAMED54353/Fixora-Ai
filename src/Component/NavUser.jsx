import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import userImg from "../assets/x.png";
import axios from "../Utils/axiosConfig";

const navItems = [
    { path: "/profile", label: "الرئيسية" },
];

const userNavItems = [
    { path: "/bookings", label: "حجوزاتي" },
    { path: "/car", label: "سيارتي" },
];

const NavUser = ({ showMenu = true }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [unreadCount, setUnreadCount] = useState(0);
    const [preview, setPreview] = useState([]);
    const [open, setOpen] = useState(false);
    const [shake] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const fetchUnreadCount = async () => {
        try {
            const res = await axios.get("/api/Notifications/unread-count");
            setUnreadCount(res.data.unreadCount ?? res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPreview = async () => {
        try {
            const res = await axios.get("/api/Notifications", {
                params: { PageIndex: 1, PageSize: 5 },
            });
            setPreview(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        fetchPreview();

        // ← يسمع لـ event من Notification page لما يتعلم مقروء
        const handleRead = () => {
            fetchUnreadCount();
            fetchPreview();
        };

        window.addEventListener("notificationsRead", handleRead);
        return () => window.removeEventListener("notificationsRead", handleRead);
    }, []);

    const handleLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        try {
            await axios.post("/api/Account/Logout");
        } catch (err) {
            console.error("Logout API error:", err);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("tokenExpiry");
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("authChanged"));
            navigate("/login");
        }
    };

    return (
        <header className="profile">
            <nav className="container-profile">
                <div className="top-row">
                    <div className="logo2" onClick={() => {
                        if (!user) return navigate("/login");
                        switch (user.role) {
                            case "User":
                                navigate("/home");
                                break;
                            case "Technician":
                                navigate("/technican");
                                break;
                            case "Admin":
                                navigate("/manager");
                                break;
                            default:
                                navigate("/profile");
                        }
                    }}>
                        <img src="/logo.svg" alt="" />
                    </div>

                    <div className="info">
                        {/* NOTIFICATION */}
                        <div className="notification" style={{ position: "relative" }}>
                            <div
                                onClick={() => {
                                    setOpen(prev => !prev);
                                    if (!open) {
                                        fetchPreview();
                                        fetchUnreadCount();
                                    }
                                }}
                                style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}
                            >
                                <i className="fa-solid fa-chevron-down"></i>
                                <span>الإشعارات</span>
                                <i
                                    className="fa-regular fa-bell"
                                    style={{
                                        transition: "0.3s",
                                        transform: shake ? "rotate(-20deg)" : "rotate(0deg)"
                                    }}
                                ></i>

                                {/* Badge */}
                                {unreadCount > 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "-8px",
                                            left: "-14px",
                                            background: "red",
                                            color: "#fff",
                                            borderRadius: "50%",
                                            fontSize: "10px",
                                            padding: "3px 6px",
                                            minWidth: "18px",
                                            textAlign: "center",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {unreadCount}
                                    </span>
                                )}
                            </div>

                            {/* DROPDOWN */}
                            {open && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "40px",
                                        right: "0",
                                        width: "320px",
                                        background: "#fff",
                                        borderRadius: "12px",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                                        overflow: "hidden",
                                        zIndex: 999
                                    }}
                                >
                                    <div style={{ padding: "10px 15px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
                                        آخر الإشعارات
                                    </div>

                                    {preview.length === 0 ? (
                                        <p className="text-center py-3 text-muted">مفيش إشعارات</p>
                                    ) : (
                                        preview.map(n => (
                                            <div
                                                key={n.id}
                                                onClick={() => navigate("/notification")}
                                                style={{
                                                    padding: "10px 15px",
                                                    borderBottom: "1px solid #f2f2f2",
                                                    cursor: "pointer",
                                                    background: n.isRead ? "#fff" : "#eef5ff"
                                                }}
                                            >
                                                <div style={{ fontSize: "14px", fontWeight: 600 }}>
                                                    {n.title}
                                                </div>
                                                <div style={{ fontSize: "12px", color: "#777" }}>
                                                    {n.message}
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    <div
                                        onClick={() => navigate("/notification")}
                                        style={{
                                            textAlign: "center",
                                            padding: "10px",
                                            cursor: "pointer",
                                            background: "#f9fafc",
                                            fontSize: "13px"
                                        }}
                                    >
                                        عرض الكل
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* USER */}
                        <div className="user-welcome" style={{ position: "relative" }}>
                            <div
                                onClick={() => setUserMenuOpen(prev => !prev)}
                                style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                            >
                                <img src={userImg} alt="" width="35px" />
                                {user ? (
                                    <span className="welcome-text">
                                        مرحباً: <strong>{user.displayName || user.Email || "مستخدم"}</strong>
                                    </span>
                                ) : (
                                    <span className="welcome-text">مرحباً بك</span>
                                )}
                                <i className="fa-solid fa-chevron-down"></i>
                            </div>

                            {/* DROPDOWN */}
                            {userMenuOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "50px",
                                        left: "0",
                                        width: "180px",
                                        background: "#fff",
                                        borderRadius: "10px",
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                                        overflow: "hidden",
                                        zIndex: 999
                                    }}
                                >
                                    <div
                                        onClick={() => {
                                            if (!user) return navigate("/login");
                                            switch (user.role) {
                                                case "User":
                                                    navigate("/profile");
                                                    break;
                                                case "Technician":
                                                    navigate("/technican");
                                                    break;
                                                case "Admin":
                                                    navigate("/manager");
                                                    break;
                                                default:
                                                    navigate("/profile");
                                            }
                                        }}
                                        style={{
                                            padding: "10px",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #eee"
                                        }}
                                    >
                                        <i className="fa-solid fa-user px-2"></i>
                                        البروفايل
                                    </div>

                                    <div
                                        onClick={handleLogout}
                                        style={{
                                            padding: "10px",
                                            cursor: loggingOut ? "not-allowed" : "pointer",
                                            color: loggingOut ? "#aaa" : "red",
                                            pointerEvents: loggingOut ? "none" : "auto"
                                        }}
                                    >
                                        <i className="fa-solid fa-right-from-bracket px-2"></i>
                                        {loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showMenu && (
                    <div className="nav-menu">
                        {navItems.map((item) => (
                            <div
                                key={item.path}
                                className={`nav-item ${window.location.pathname === item.path ? "active" : ""}`}
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                            </div>
                        ))}

                        {user?.role === "User" &&
                            userNavItems.map((item) => (
                                <div
                                    key={item.path}
                                    className={`nav-item ${window.location.pathname === item.path ? "active" : ""}`}
                                    onClick={() => navigate(item.path)}
                                >
                                    {item.label}
                                </div>
                            ))}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default NavUser;