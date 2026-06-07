import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../Utils/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import "../styles/register.css";
import { z } from "zod";

const registerSchema = z.object({
  Email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
  Password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير")
    .regex(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير")
    .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم")
    .regex(/[^a-zA-Z0-9]/, "كلمة المرور يجب أن تحتوي على رمز خاص (!@#$%)")
    .max(20, "كلمة المرور يجب أن تكون أقل من 20 حرف"),
  UserName: z
    .string()
    .min(8, "اسم المستخدم يجب ان يكون 8 أحرف على الاقل")
    .max(20, "اسم المستخدم يجب ان يكون اقل من 20 حرف")
    .regex(
      /^[\u0621-\u064A\sA-Za-z0-9]+$/,
      "اسم المستخدم يمكن أن يحتوي على أحرف عربية، لاتينية وأرقام فقط"
    ),
  PhoneNumber: z
    .string()
    .regex(/^0\d{10}$/, "يرجى إدخال رقم هاتف مصري صحيح"),
});

const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    Email: "",
    Password: "",
    UserName: "",
    PhoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({ ...user, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async () => {
    const result = registerSchema.safeParse(user);

    if (!agreeTerms) {
      toast.error("❌ يجب الموافقة على الشروط وسياسة الخصوصية");
      return;
    }

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
      const requestData = {
        DisplayName: user.UserName,
        UserName: user.UserName,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
        Password: user.Password,
        ConfirmPassword: user.Password,
      };

      const response = await axios.post(
        "/api/Account/Register",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("نجح التسجيل:", JSON.stringify(response.data, null, 2));

      if (response.data.token) {
        localStorage.setItem("accessToken", response.data.token);
      }

      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      const userData = {
        id: response.data.id,
        displayName: response.data.displayName || user.UserName,
        email: response.data.email || user.Email,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      console.log("User data saved:", userData);

      window.dispatchEvent(new Event("authChanged"));
      toast.success(" !تم إنشاء الحساب بنجاح!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(
        "❌ خطأ في التسجيل:",
        JSON.stringify(err.response?.data, null, 2) || err.message
      );

      let errorMsg = "فشل إنشاء الحساب! حاول مرة أخرى.";

      if (err.response?.data) {
        const data = err.response.data;

        if (data.errors) {
          const errorsList = Object.entries(data.errors)
            .map(([field, messages]) => {
              const msgs = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgs.join(", ")}`;
            })
            .join(" • ");
          errorMsg = errorsList;
        } else if (data.errorMessage) {
          errorMsg = data.errorMessage;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.title) {
          errorMsg = data.title;
        }
      } else if (err.request) {
        errorMsg = "لا يوجد اتصال بالخادم";
      }

      toast.error(`❌ ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return null;
    const checks = {
      len: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      num: /[0-9]/.test(password),
      sym: /[^a-zA-Z0-9]/.test(password),
      long: password.length >= 8,
    };
    const score = Object.values(checks).filter(Boolean).length;
    const level = score <= 1 ? 0 : score <= 3 ? 1 : score <= 4 ? 2 : 3;
    const levels = [
      { label: "ضعيف جداً", color: "#ef4444", hint: "يُنصح بإعادة المحاولة" },
      { label: "ضعيف", color: "#f97316", hint: "أضف أرقاماً ورموزاً" },
      { label: "متوسط", color: "#eab308", hint: "يمكن تحسينها أكثر" },
      { label: "قوي", color: "#22c55e", hint: "كلمة مرور ممتازة!" },
    ];
    return { ...levels[level], level, checks };
  };

  const handleGoogleRegister = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/Account/google-login", {
        idToken: credentialResponse.credential,
      });

      if (res.data.token) {
        localStorage.setItem('accessToken', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);

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
        toast.success('تم إنشاء الحساب بجوجل بنجاح!');

        setTimeout(() => {
          if (role === 'Admin') navigate('/manager');
          else if (role === 'Technician') navigate('/technican');
          else navigate('/profile');
        }, 2000);
      }
    } catch (err) {
      const msg = err.response?.data?.errorMessage || 'فشل التسجيل بجوجل';
      toast.error(`❌ ${msg}`);
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
      navigate("/profile");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} rtl={true} />
      <div className="register-page" style={{ position: "relative", minHeight: "100vh" }}>
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "50px",
            color: "#333D4D",
            cursor: "pointer",
            fontSize: "16px",
            zIndex: 1000,
          }}
          onClick={handleLogoClick}
        >
          رجوع <i className="fa-solid fa-right-long px-1 fs-6"></i>
        </div>
        <div className="login-card my-4" dir="rtl">
          <div className="logo text-center pe-5" style={{ cursor: "pointer" }}>
            <img src="/logo.svg" alt="logo" width={150} onClick={handleLogoClick} />
          </div>
          <h3 className="form-title text-center">قم بانشاء حسابك</h3>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              الإسم بالكامل
            </label>
            <input
              id="name"
              type="text"
              className={`form-control ${errors.UserName ? "is-invalid" : ""}`}
              name="UserName"
              value={user.UserName}
              onChange={handleChange}
              placeholder="ادخل الاسم الكامل"
            />
            {errors.UserName && (
              <div className="error-message">{errors.UserName}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="number" className="form-label">
              رقم الهاتف
            </label>
            <div className="position-relative">
              <input
                id="number"
                type="text"
                name="PhoneNumber"
                value={user.PhoneNumber}
                className={`form-control ${errors.PhoneNumber ? "is-invalid" : ""}`}
                placeholder="ادخل رقم الهاتف"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setUser({ ...user, PhoneNumber: value });
                  if (errors.PhoneNumber) {
                    setErrors({ ...errors, PhoneNumber: "" });
                  }
                }}
                maxLength={11}
                style={{ paddingRight: "10px" }}
              />
            </div>
            {errors.PhoneNumber && (
              <div className="error-message">{errors.PhoneNumber}</div>
            )}
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
              placeholder="ادخل البريد الإلكتروني الخاص بك"
            />
            {errors.Email && <div className="error-message">{errors.Email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">كلمة المرور</label>
            <div className="position-relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.Password ? "is-invalid" : ""}`}
                name="Password"
                value={user.Password}
                onChange={handleChange}
                placeholder="ادخل كلمة المرور"
                style={{ paddingLeft: "48px" }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#666"
                }}>
                <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
              </button>
            </div>

            {user.Password && (() => {
              const s = getPasswordStrength(user.Password);
              return (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "6px" }}>
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} style={{
                        flex: 1, height: "5px", borderRadius: "3px",
                        background: i <= s.level ? s.color : "#e5e7eb",
                        transition: "background 0.35s ease",
                      }} />
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: s.color, fontWeight: "500" }}>{s.label}</span>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>{s.hint}</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 12px" }}>
                    {[
                      ["len", "8 أحرف على الأقل"],
                      ["upper", "حرف كبير (A-Z)"],
                      ["lower", "حرف صغير (a-z)"],
                      ["num", "رقم (0-9)"],
                      ["sym", "رمز خاص (!@#$)"],
                      ["long", "8 أحرف أو أكثر"],
                    ].map(([key, text]) => (
                      <div key={key} style={{
                        display: "flex", alignItems: "center", gap: "5px",
                        fontSize: "12px",
                        color: s.checks[key] ? "#22c55e" : "#9ca3af"
                      }}>
                        <div style={{
                          width: "6px", height: "6px", borderRadius: "50%", flexShrink: "0",
                          background: s.checks[key] ? "#22c55e" : "#d1d5db",
                          transition: "background 0.3s"
                        }} />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {errors.Password && <div className="error-message">{errors.Password}</div>}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label
                className="form-check-label"
                htmlFor="agreeTerms"
                style={{ fontSize: "14px" }}
              >
                أوافق على <a href="/privacy">الشروط وسياسة الخصوصية</a>
              </label>
            </div>
          </div>

          <button
            className="btn btn-login"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </button>

          <div className="divider">
            <span>أو</span>
          </div>

          <div className="d-flex justify-content-center w-100">
            <GoogleLogin
              onSuccess={handleGoogleRegister}
              onError={() => toast.error('❌ فشل التسجيل بجوجل')}
              theme="outline"
              width="400"
            />
          </div>

          <p className="signup-text">
            لديك حساب ؟
            <a
              href="#"
              className="signup-link px-1"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              تسجيل الدخول
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;