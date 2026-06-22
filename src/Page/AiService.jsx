import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AiResult from "../Component/AiResult";

const AiService = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState("");

    const [result, setResult] = useState(() => {
        try {
            const saved = sessionStorage.getItem("aiResult");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        const trimmed = description.trim();

        if (!trimmed) {
            setError("من فضلك اكتب وصف المشكلة");
            return;
        }

        if (trimmed.length < 10) {
            setError(
                "الوصف قصير جداً، اكتب على الأقل 10 حروف للحصول على تشخيص دقيق"
            );
            return;
        }

        if (trimmed.length > 500) {
            setError("الوصف طويل جداً، الحد الأقصى 500 حرف");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);
        sessionStorage.removeItem("aiResult");

        try {
            const response = await fetch("/api/Services/analyze-problem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    problemDescription: trimmed,
                    vehicleId: null,
                }),
            });

            if (!response.ok) {
                let errMsg = "حدث خطأ في الخادم، حاول مرة أخرى";

                try {
                    const errData = await response.json();
                    errMsg = errData?.message || errData?.title || errMsg;
                } catch {
                    // Ignore JSON parsing errors
                }
                throw new Error(errMsg);
            }
            const data = await response.json();
            setResult(data);
            sessionStorage.setItem("aiResult", JSON.stringify(data));
            console.log("data", data);
        } catch (err) {
            setError(err.message || "حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setDescription("");
        setError("");
        sessionStorage.removeItem("aiResult");
    };

    const charCount = description.length;
    const isNearLimit = charCount > 450;
    const isOverLimit = charCount > 500;

    return (
        <>
            <nav
                className="d-block p-3 bg-white"
                style={{ direction: "rtl" }}
            >
                <div
                    className="logo2"
                    onClick={() => navigate("/home")}
                    style={{
                        cursor: "pointer",
                        marginRight: "50px",
                        fontWeight: "bold",
                    }}
                >
                    <img src="/logo.svg" alt="Logo" />
                </div>
            </nav>

            {!result && (
                <>
                    <section>
                        <div className="text-center mt-4 p-5">
                            <h2
                                className="fw-bold"
                                style={{ color: "#2A5CAF" }}
                            >
                                شخّص مشكلة سيارتك بالذكاء الاصطناعي
                            </h2>

                            <p>
                                أكتب وصف دقيق للمشكلة وسيتم تحليلها باستخدام
                                تقنية AI المتطورة
                            </p>
                        </div>
                    </section>

                    <section className="d-flex justify-content-center">
                        <div
                            className="bg-white"
                            style={{
                                direction: "rtl",
                                width: "100%",
                                maxWidth: "920px",
                                minHeight: "auto",
                                borderRadius: "22px",
                                padding: "32px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "24px",
                                marginBottom: "80px",
                            }}
                        >
                            <label
                                htmlFor="aiDescription"
                                style={{
                                    fontSize: "22px",
                                    fontWeight: "400",
                                }}
                            >
                                وصف المشكلة
                            </label>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                }}
                            >
                                <textarea
                                    id="aiDescription"
                                    className="form-control bg-white"
                                    placeholder="مثال: أسمع صوت طقطقة في الموتور عند التشغيل الصباحي، ويزداد الصوت عند السرعات العالية فوق 80 كم/س. أيضاً ألاحظ اهتزاز خفيف في المقود..."
                                    style={{
                                        height: "300px",
                                        width: "100%",
                                        border: `2px solid ${isOverLimit
                                                ? "#b91c1c"
                                                : "#2A5CAF"
                                            }`,
                                        fontSize: "18px",
                                        resize: "vertical",
                                    }}
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);

                                        if (error) {
                                            setError("");
                                        }
                                    }}
                                />

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <small
                                        style={{
                                            fontSize: "14px",
                                            color: "#333D4D",
                                        }}
                                    >
                                        💡 كلما كان الوصف أدق كان التشخيص أكثر
                                        دقة
                                    </small>

                                    <small
                                        style={{
                                            fontSize: "13px",
                                            color: isOverLimit
                                                ? "#b91c1c"
                                                : isNearLimit
                                                    ? "#c2570a"
                                                    : "#6B7280",
                                            fontWeight: isNearLimit
                                                ? "600"
                                                : "400",
                                            direction: "ltr",
                                        }}
                                    >
                                        {charCount} / 500
                                    </small>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary mt-auto"
                                style={{
                                    backgroundColor: "#2A5CAF",
                                    border: "none",
                                    padding: "12px",
                                    fontSize: "18px",
                                    width: "100%",
                                    maxWidth: "850px",
                                    alignSelf: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    opacity: loading ? 0.8 : 1,
                                }}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading && (
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                )}

                                {loading
                                    ? "جاري التشخيص..."
                                    : "إبدأ التشخيص الذكي"}
                            </button>

                            {error && (
                                <div
                                    style={{
                                        backgroundColor: "#FEF2F2",
                                        border: "1px solid #FECACA",
                                        borderRadius: "12px",
                                        padding: "12px 16px",
                                        color: "#b91c1c",
                                        fontSize: "15px",
                                        marginTop: "8px",
                                    }}
                                >
                                    ⚠️ {error}
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            {result && (
                <AiResult
                    result={result}
                    onReset={handleReset}
                />
            )}
        </>
    );
};

export default AiService;