import React, { useState } from "react";
import axios from "../Utils/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("من فضلك أدخل الإيميل");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                "https://carmaintenance.runasp.net/api/Account/forgot-password",
                { email }
            );

            setMessage(res.data.message);
            toast.success(res.data.message);
            setEmail("");
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "حدث خطأ، حاول مرة أخرى";
            setMessage(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-center" />
            <div className="container d-flex justify-content-center align-items-center vh-100" >
                <div className="card shadow-sm p-5" style={{ width: "100%", maxWidth: "400px" }}>
                    <h4 className="text-center mb-5">نسيت كلمة المرور</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="mb-2 fs-6" htmlFor="email"> البريد الإلكتروني </label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="أدخل الإيميل"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "جاري الإرسال..." : "إرسال"}
                        </button>

                        {message && (
                            <p className="text-center mt-4 text-success">
                                {message}
                            </p>
                        )}
                    </form>

                </div>
            </div>
        </>
    );
};

export default ForgotPassword;