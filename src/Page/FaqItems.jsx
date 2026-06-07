import React, { useState } from "react";

const faqs = [
    {
        question: "كيف أحجز خدمة؟",
        answer:
            "يمكنك الضغط على زر 'احجز الآن' في صفحة الخدمة، ثم اتباع خطوات استكمال الحجز واختيار الموعد وطريقة الدفع.",
    },
    {
        question: "هل يمكن تعديل الحجز بعد تأكيده؟",
        answer:
            "نعم، يمكنك تعديل الحجز قبل الموعد المحدد من خلال صفحة 'حجوزاتي'. التغييرات تشمل الوقت أو الخدمة أو التفاصيل الأخرى.",
    },
    {
        question: "ما طرق الدفع المتاحة؟",
        answer:
            "يمكنك الدفع نقدًا عند الاستلام، أو باستخدام البطاقات البنكية، أو من خلال الدفع الإلكتروني عبر محفظة الهاتف.",
    },
    {
        question: "هل أستلم إيصال بعد الحجز؟",
        answer:
            "نعم، سيتم إرسال إيصال تأكيد الحجز عبر البريد الإلكتروني أو الرسائل النصية بعد اكتمال الدفع.",
    },
    {
        question: "هل يمكن إلغاء الحجز؟",
        answer:
            "نعم، يمكنك إلغاء الحجز قبل موعد الخدمة المحدد بمدة كافية حسب سياسة الإلغاء الموضحة في الموقع.",
    },
    {
        question: "هل تتوفر خدمات الطوارئ؟",
        answer:
            "نعم، بعض الخدمات متاحة على مدار الساعة، ويمكنك التواصل مع مركز الدعم لمعرفة التفاصيل.",
    },
    {
        question: "كيف أقدم شكوى أو اقتراح؟",
        answer:
            "يمكنك التواصل معنا عبر صفحة 'اتصل بنا' أو من خلال البريد الإلكتروني أو رقم الهاتف المتاح في الموقع.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div style={{ maxWidth: "900px", margin: "50px auto", padding: "20px" }}>
            <h1
                style={{
                    fontSize: "32px",
                    fontWeight: "600",
                    color: "#333D4D",
                    marginBottom: "50px",
                }}
            >
                الأسئلة الشائعة
            </h1>

            <div className="d-flex flex-column gap-3">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        style={{
                            border: "1px solid #E0E0E0",
                            borderRadius: "12px",
                            padding: "20px",
                            backgroundColor: "#FAFAFA",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                            cursor: "pointer",
                            transition: "0.3s all",
                        }}
                        onClick={() => toggle(index)}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h3 style={{ margin: 0, color: "#2A5CAF", fontSize: "24px" }}>
                                {faq.question}
                            </h3>
                            <span
                                style={{
                                    display: "inline-block",
                                    transition: "transform 0.3s",
                                    transform: openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                                    fontSize: "16px",
                                    color: "#2A5CAF",
                                }}
                            >
                                ▼
                            </span>
                        </div>

                        <p
                            style={{
                                marginTop: "10px",
                                color: "#555",
                                fontSize: "16px",
                                lineHeight: "1.6",
                                display: openIndex === index ? "block" : "none",
                            }}
                        >
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
