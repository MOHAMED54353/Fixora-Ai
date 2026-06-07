import React from "react";

const Privacy = () => {
    const sectionStyle = {
        backgroundColor: "#f9f9f9",
        padding: "20px 25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        marginBottom: "25px",
    };

    return (
        
        
        <div style={{ maxWidth: "900px", margin: "50px auto", padding: "20px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "35px",
                }}
            >
                <img
                    src="/fix.jpeg"
                    alt=""
                    style={{
                        objectFit: "cover",
                        width: "500px",
                        height: "auto",
                        borderRadius: "12px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
            </div>

            <h1
                style={{
                    textAlign: "center",
                    fontSize: "36px",
                    fontWeight: "700",
                    color: "#333D4D",
                    marginBottom: "30px",
                }}
            >
                مرحبا بكم في FIXORA
            </h1>

           

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#E27019", marginBottom: "15px" }}>
                    سياسة الخصوصية
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    مرحبًا بك في موقعنا. نحن نحترم خصوصيتك ونلتزم بحماية المعلومات الشخصية التي تقدمها عند استخدامك لموقعنا أو خدماتنا.
                </p>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333D4D", marginBottom: "15px" }}>
                    جمع المعلومات
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    نقوم بجمع المعلومات التي تقدمها مباشرة عند التسجيل أو استخدام خدماتنا، مثل الاسم، البريد الإلكتروني، وبيانات الحساب. كما نقوم بجمع بعض المعلومات تلقائيًا مثل بيانات التصفح والملفات المرفوعة.
                </p>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333D4D", marginBottom: "15px" }}>
                    استخدام المعلومات
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    نستخدم المعلومات لتقديم وتحسين خدماتنا، للتواصل معك عند الحاجة، ولتخصيص تجربة المستخدم وجعلها أفضل.
                </p>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333D4D", marginBottom: "15px" }}>
                    مشاركة المعلومات
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    نحن لا نشارك معلوماتك الشخصية مع أي طرف ثالث إلا إذا كان ذلك ضروريًا لتقديم الخدمة أو إذا طلب القانون ذلك.
                </p>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333D4D", marginBottom: "15px" }}>
                    حماية المعلومات
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    نحن نتخذ التدابير الأمنية المناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الاستخدام أو التغيير.
                </p>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333D4D", marginBottom: "15px" }}>
                    حقوقك
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    يمكنك طلب تعديل أو حذف معلوماتك الشخصية في أي وقت عن طريق التواصل معنا عبر البريد الإلكتروني أو وسائل الاتصال المتاحة.
                </p>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333D4D", marginBottom: "15px" }}>
                    التغييرات على سياسة الخصوصية
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    نحتفظ بالحق في تعديل سياسة الخصوصية هذه في أي وقت. سيتم إعلام المستخدمين بأي تغييرات مهمة عن طريق الموقع أو البريد الإلكتروني.
                </p>
            </div>

            <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555", marginTop: "30px", textAlign: "center" }}>
                شكراً لثقتك بنا.
            </p>
        </div>
    );
};

export default Privacy;