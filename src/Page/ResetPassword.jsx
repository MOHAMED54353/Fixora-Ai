import React, { useState } from "react";
import axios from "../Utils/axiosConfig";
import { useSearchParams, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!token) {
            setError("الرابط غير صالح أو منتهي");
            return;
        }

        if (password !== confirmPassword) {
            setError("كلمتا المرور غير متطابقتين");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                "/api/Account/reset-password",
                {
                    Email: email,
                    token: token,
                    NewPassword: password,
                    password_confirmation: confirmPassword,
                }
            );
            toast.success("تم تغيير كلمة المرور بنجاح 🎉");

            setTimeout(() => {
                navigate("/profile");
            }, 2000);

        } catch (err) {
            console.log(err.response?.data);
            setError(err.response?.data?.message || "حصل خطأ، حاول مرة أخرى");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar
                rtl
            />
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div
                className="card shadow p-4"
                style={{ maxWidth: "400px", width: "100%" }}
            >
                <h4 className="text-center mb-4">إعادة تعيين كلمة المرور</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control pe-5"
                            placeholder="كلمة المرور الجديدة"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#555",
                                padding: "4px",
                                borderRadius: "50%",
                                transition: "0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            {showPassword ? (
                                <i className="fas fa-eye-slash"></i>
                            ) : (
                                <i className="fas fa-eye"></i>
                            )}
                        </span>
                    </div>

                    <div className="mb-3 position-relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            className="form-control pe-5"
                            placeholder="تأكيد كلمة المرور"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span
                            onClick={() => setShowConfirm(!showConfirm)}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#555",
                                padding: "4px",
                                borderRadius: "50%",
                                transition: "0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            {showConfirm ? (
                                <i className="fas fa-eye-slash"></i>
                            ) : (
                                <i className="fas fa-eye"></i>
                            )}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
                    </button>

                    {message && (
                        <p className="text-center mt-3 text-success">{message}</p>
                    )}
                    {error && (
                        <p className="text-center mt-3 text-danger">{error}</p>
                    )}
                </form>
            </div>
        </div>
        </>
    );
};

export default ResetPassword;
