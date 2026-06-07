import React, { useState } from "react";
import { useNavigate } from "react-router";
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
        if (!description.trim()) {
            alert("من فضلك اكتب وصف المشكلة");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);
        sessionStorage.removeItem("aiResult");

        try {
            const response = await fetch("/api/Services/analyze-problem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    problemDescription: description,
                    vehicleId: null,
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || "حدث خطأ أثناء الاتصال بالخادم");
            }

            const data = await response.json();
            setResult(data);
            sessionStorage.setItem("aiResult", JSON.stringify(data)); // ← احفظ النتيجة
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
        sessionStorage.removeItem("aiResult"); // ← امسح لما يعمل تشخيص جديد
    };

    return (
        <>
            <nav className="d-block p-3 bg-white" style={{ direction: "rtl" }}>
                <a
                    className="logo2"
                    onClick={() => navigate("/home")}
                    style={{ cursor: "pointer", marginRight: "50px", fontWeight: "bold" }}
                >
                    <img src="/logo.svg" alt="" />
                </a>
            </nav>

            {!result && (
                <>
                    <section>
                        <div className="text-center mt-4 p-5">
                            <h2 className="fw-bold" style={{ color: "#2A5CAF" }}>
                                شخّص مشكلة سيارتك بالذكاء الاصطناعي
                            </h2>
                            <p>
                                أكتب وصف دقيق للمشكلة وسيتم تحليلها باستخدام تقنية AI المتطورة
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
                            <label htmlFor="aiDescription" style={{ fontSize: "22px", fontWeight: "400" }}>
                                وصف المشكلة
                            </label>

                            <textarea
                                id="aiDescription"
                                className="form-control bg-white"
                                placeholder="مثال: أسمع صوت طقطقة في الموتور عند التشغيل الصباحي، ويزداد الصوت عند السرعات العالية فوق 80 كم/س. أيضاً ألاحظ اهتزاز خفيف في المقود.... "
                                style={{
                                    height: "300px",
                                    width: "100%",
                                    border: "2px solid #2A5CAF",
                                    fontSize: "18px",
                                    resize: "vertical",
                                }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>

                            <small style={{ fontSize: "14px", color: "#333D4D" }}>
                                💡 يعتمد التشخيص على الوصف المُدخل، وكلما كان الوصف أدق كان التشخيص أكثر دقة.
                            </small>

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
                                }}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : null}
                                {loading ? " جاري التشخيص..." : "إبدأ التشخيص الذكي"}
                            </button>

                            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
                        </div>
                    </section>
                </>
            )}

            {result && <AiResult result={result} onReset={handleReset} />}
        </>
    );
};

export default AiService;