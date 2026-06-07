import React from "react";

const Terms = () => {
    const sectionStyle = {
        backgroundColor: "#f9f9f9",
        padding: "20px 25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        marginBottom: "25px",
    };

    return (
        <div style={{ maxWidth: "900px", margin: "50px auto", padding: "20px" }}>
            <h1
                style={{
                    textAlign: "center",
                    fontSize: "36px",
                    fontWeight: "700",
                    color: "#333D4D",
                    marginBottom: "40px",
                }}
            >
                الشروط والأحكام
            </h1>

            <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555", marginBottom: "30px" }}>
                مرحبًا بك في موقعنا. باستخدامك لهذا الموقع أو الخدمات المقدمة من خلاله، فإنك توافق على الالتزام بالشروط والأحكام التالية:
            </p>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#E27019", marginBottom: "15px" }}>
                    1. الاستخدام المسموح
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    يُسمح لك باستخدام الموقع لأغراض شخصية وغير تجارية فقط. أي استخدام غير قانوني أو مخالف لهذه الشروط غير مسموح.
                </p>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333D4D", marginBottom: "15px" }}>
                    2. القيود والمسؤولية
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    نحن لا نتحمل أي مسؤولية عن أي خسارة أو ضرر ناتج عن استخدام الموقع أو الخدمات، أو عن أي محتوى يتم نشره بواسطة المستخدمين.
                </p>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333D4D", marginBottom: "15px" }}>
                    3. حقوق الملكية
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    جميع المحتويات، النصوص، الصور، والشعارات الموجودة في الموقع محمية بحقوق الطبع والنشر والملكية الفكرية. لا يجوز نسخ أو إعادة نشر أي محتوى بدون إذن صريح.
                </p>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333D4D", marginBottom: "15px" }}>
                    4. التعديلات على الشروط
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إعلام المستخدمين بأي تغييرات مهمة عن طريق الموقع.
                </p>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333D4D", marginBottom: "15px" }}>
                    5. الاتصال
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
                    إذا كان لديك أي استفسارات حول هذه الشروط، يمكنك التواصل معنا عبر البريد الإلكتروني أو وسائل الاتصال المتاحة في الموقع.
                </p>
            </div>

            <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#555", marginTop: "30px", textAlign: "center" }}>
                شكراً لاستخدامك موقعنا.
            </p>
        </div>
    );
};

export default Terms;