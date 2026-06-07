import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../Utils/axiosConfig";
import { scheduleTokenRefresh } from "../Utils/tokenService.jsx"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import "../styles/login.css";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';


const loginSchema = z.object({
  Email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .min(1, "البريد الإلكتروني مطلوب"),
  Password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .max(20, "كلمة المرور يجب أن تكون أقل من 20 حرف"),
});

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({ Email: "", Password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({ ...user, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse(user);

    if (!result.success) {
      const errorMessage = {};
      result.error.issues.forEach(
        (err) => (errorMessage[err.path[0]] = err.message)
      );
      setErrors(errorMessage);

      const firstError = Object.values(errorMessage)[0];
      toast.error(firstError);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/Account/Login",
        {
          Email: user.Email,
          Password: user.Password,
          rememberMe: rememberMe,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("FULL LOGIN RESPONSE:", response.data);

      // تخزين الـ token
      if (response.data.token) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("tokenExpiry", response.data.tokenExpiry);

        scheduleTokenRefresh(); // ✅ مهم جدًا هنا
      }
      let role = "User";
      if (response.data.token) {
        try {
          const decoded = jwtDecode(response.data.token);

          const roleClaim =
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

          if (roleClaim === "Admin") role = "Admin";
          else if (roleClaim === "Technician") role = "Technician";
          else role = "User";
        } catch (e) {
          console.error("Invalid token", e);
        }
      }


      const userData = {
        id: response.data.id,
        displayName: response.data.displayName,
        email: response.data.email,
        role: role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      console.log("User data saved:", userData);


      // إطلاق حدث لتحديث الـ Navbar فوراً
      window.dispatchEvent(new Event("authChanged"));
      toast.success("تم تسجيل الدخول بنجاح!");

      setTimeout(() => {
        if (role === "Admin") {
          navigate("/manager");
        } else if (role === "Technician") {
          navigate("/technican");
        } else {
          navigate("/home");
        }
      }, 2000);

    } catch (err) {
      console.error("Login Error:", err);
      let errorMsg = "فشل تسجيل الدخول!";
      if (err.response) {
        if (err.response.status === 401) {
          errorMsg = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        } else if (err.response.status === 403) {
          errorMsg = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        } else if (err.response.status === 400) {
          errorMsg = "بيانات غير صحيحة";
        } else if (err.response.status === 500) {
          errorMsg = "مشكلة في السيرفر، حاول لاحقًا";
        } else {
          errorMsg = err.response.data?.message || "حدث خطأ";
        }
      } else if (err.request) {
        errorMsg = "لا يوجد اتصال بالخادم";
      } else {
        errorMsg = "حدث خطأ غير متوقع";
      }
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/Account/google-login", {
        idToken: credentialResponse.credential,
      });

      if (res.data.token) {
        localStorage.setItem('accessToken', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('tokenExpiry', res.data.tokenExpiry);
        scheduleTokenRefresh();

        const decoded = jwtDecode(res.data.token);
        const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const role = roleClaim === 'Admin' ? 'Admin' : roleClaim === 'Technician' ? 'Technician' : 'User';

        localStorage.setItem('user', JSON.stringify({
          id: res.data.id,
          displayName: res.data.displayName,
          email: res.data.email,
          role,
        }));

        window.dispatchEvent(new Event('storage'));
        toast.success('تم تسجيل الدخول بجوجل بنجاح!');

        setTimeout(() => {
          if (role === 'Admin') navigate('/manager');
          else if (role === 'Technician') navigate('/technican');
          else navigate('/home');
        }, 2000);
      }
    } catch (err) {
      console.error("Google Login Error Details:", err.response?.data);
      toast.error('❌ فشل تسجيل الدخول بجوجل - تأكد من بيانات السيرفر');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/");
      return;
    }

    if (user.role === "Admin") {
      navigate("/manager");
    } else if (user.role === "Technician") {
      navigate("/technican");
    } else {
      navigate("/home");
    }
  };
  
  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} rtl={true} />
      <div
        className="containerrr d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "50px",
            color: "#333D4D",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={handleLogoClick}
        >
          رجوع <i className="fa-solid fa-right-long px-1 fs-6"></i>
        </div>
        <div className="login-card-container ">
          <form className="login-card  my-3" style={{ height: "650px" }} onSubmit={handleSubmit}>
            <div className="">
              <h2 className="logo text-center pe-5 " onClick={handleLogoClick}>
                <img src="logo.svg" alt="logo" width="150px" />
              </h2>
              <h3 className="form-title text-center">قم بتسجيل الدخول إلى حسابك</h3>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                name="Email"
                value={user.Email}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="ادخل البريد الإلكتروني الخاص بك"
              />
              {errors.Email && <div className="error-message">{errors.Email}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                كلمة المرور
              </label>
              <div className="position-relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.Password ? "is-invalid" : ""}`}
                  name="Password"
                  value={user.Password}
                  onChange={handleChange}
                  placeholder="ادخل كلمة المرور"
                  disabled={isLoading}
                  style={{ paddingLeft: "48px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  <i
                    className={
                      showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
                    }
                  ></i>
                </button>
              </div>
              {errors.Password && (
                <div className="error-message">{errors.Password}</div>
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <label
                  className="form-check-label"
                  htmlFor="rememberMe"
                  style={{ fontSize: "14px" }}
                >
                  تذكرني في هذا الجهاز
                </label>
              </div>

              <a
                href="#"
                className="forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgot-password");
                }}
              >
                نسيت كلمة المرور؟
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-login"
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>

            <div className="divider">
              <span>أو</span>
            </div>

            <div className="d-flex justify-content-center w-100">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('❌ فشل تسجيل الدخول بجوجل')}
                theme="outline"
                width="400"
              />
            </div>

            <p className="signup-text">
              ليس لديك حساب ؟
              <a
                href="#"
                className="signup-link px-1"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                إنشاء حساب
              </a>
            </p>
          </form >
        </div>
      </div>
    </>
  );
};

export default Login;