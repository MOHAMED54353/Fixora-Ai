import { Navigate, Outlet } from "react-router";

const ProtectedRoute = ({ allowedRoles }) => {
    const userData = localStorage.getItem("user");

    if (!userData) {
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch {
        console.log("🚨 Invalid user in localStorage");
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/profile" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;