import React from "react";

const Invoice = ({ invoice }) => {
    if (!invoice) return <p className="text-center">جاري تحميل الفاتورة...</p>;

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const normalized = dateStr.endsWith("Z") || dateStr.includes("+") ? dateStr : dateStr + "Z";
        const d = new Date(normalized);
        if (isNaN(d.getTime())) return "—";
        return d.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
    };

    const paymentMethodMap = {
        CreditCard: "💳 بطاقة ائتمان",
        Cash: "💵 نقداً",
        DebitCard: "💳 بطاقة خصم",
    };

    const paymentStatusMap = {
        Paid: "مدفوع",
        Pending: "معلق",
        Unpaid: "غير مدفوع",
    };

    const allServices = [
        ...(invoice.services || []).map(s => ({ name: s.serviceName, price: s.price })),
        ...(invoice.approvedIssues || []).map(s => ({ name: s.title, price: s.estimatedCost })),
    ];

    return (
        <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <style>{`
        .inv-card { background: white; border-radius: 20px; overflow: hidden; max-width: 760px; margin: 0 auto; }
        .inv-header { background: linear-gradient(135deg, #1a3f8f 0%, #2A5CAF 60%, #4b7fd4 100%); padding: 32px 36px 28px; color: white; position: relative; overflow: hidden; }
        .inv-header::before { content: ''; position: absolute; top: -40px; left: -40px; width: 180px; height: 180px; border-radius: 50%; background: rgba(255,255,255,0.06); }
        .inv-header::after { content: ''; position: absolute; bottom: -60px; right: -20px; width: 240px; height: 240px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .inv-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); padding: 5px 14px; border-radius: 30px; font-size: 13px; font-weight: 600; }
        .inv-badge::before { content: '●'; color: #4ade80; font-size: 10px; }
        .inv-meta { font-size: 13px; opacity: 0.75; margin-top: 4px; }
        .inv-body { padding: 32px 36px; }
        .section-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #2A5CAF; margin-bottom: 12px; margin-top: 28px; display: flex; align-items: center; gap: 8px; }
        .section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to left, #e5eaf5, transparent); }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .info-item { background: #F8FAFF; border-radius: 10px; padding: 12px 14px; border: 1px solid #EBF0FB; }
        .info-item .label { font-size: 11px; color: #8a9bbf; font-weight: 500; margin-bottom: 3px; }
        .info-item .value { font-size: 14px; color: #1e2d4a; font-weight: 600; }
        .services-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
        .services-table th { background: #F1F6FF; color: #2A5CAF; font-size: 12px; font-weight: 600; padding: 10px 14px; text-align: right; }
        .services-table td { padding: 12px 14px; border-bottom: 1px solid #f0f4fb; font-size: 14px; color: #334466; }
        .services-table tr:last-child td { border-bottom: none; }
        .price-cell { font-weight: 700; color: #2A5CAF; direction: ltr; text-align: left; }
        .total-bar { background: linear-gradient(135deg, #1a3f8f, #2A5CAF); border-radius: 14px; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
        .total-bar .label { color: rgba(255,255,255,0.8); font-size: 14px; }
        .total-bar .amount { color: white; font-size: 22px; font-weight: 800; }
        .payment-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px; }
        .pay-item { background: #F8FAFF; border-radius: 10px; padding: 12px 14px; border: 1px solid #EBF0FB; }
        .pay-item .label { font-size: 11px; color: #8a9bbf; font-weight: 500; margin-bottom: 3px; }
        .pay-item .value { font-size: 14px; font-weight: 600; }
        .paid-tag { color: #16a34a; display: flex; align-items: center; gap: 5px; }
        .paid-tag::before { content: '✓'; background: #dcfce7; border-radius: 50%; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; }
        .inv-footer { padding: 20px 36px 28px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #EEF2FB; }
        .btn-primary-inv { background: linear-gradient(135deg, #1a3f8f, #2A5CAF); color: white; border: none; border-radius: 12px; padding: 11px 26px; font-family: 'Cairo', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 7px; }
        .btn-secondary-inv { background: white; color: #334466; border: 1.5px solid #DDEAF8; border-radius: 12px; padding: 11px 26px; font-family: 'Cairo', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 7px; }
        .inv-number-big { font-size: 28px; font-weight: 800; }
        .inv-number-big span { opacity: 0.55; font-weight: 400; font-size: 14px; display: block; margin-bottom: 2px; }
        
      `}</style>

            <div className="inv-card">
                <div className="inv-header">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ textAlign: "left" }}>
                            <img src="/logo.png" alt="FIXORA" style={{ height: "36px" }} />
                            <div className="inv-meta mt-4" style={{ marginLeft: "50px" }}>
                                <span className="inv-badge">{invoice.bookingStatus || "مؤكد"}</span>
                            </div>
                        </div>
                        <div>
                            <div className="inv-number-big">
                                <span>رقم الفاتورة</span>
                                #{invoice.bookingNumber}
                            </div>
                            <div className="inv-meta">تاريخ الحجز: {formatDate(invoice.scheduledDate)}</div>
                        </div>
                    </div>
                </div>

                <div className="inv-body">
                    <div className="section-label"><h4>بيانات العميل</h4></div>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="label">الاسم</div>
                            <div className="value">{invoice.customerName || "—"}</div>
                        </div>
                        <div className="info-item">
                            <div className="label">البريد الإلكتروني</div>
                            <div className="value">{invoice.customerEmail || "—"}</div>
                        </div>
                        <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                            <div className="label">رقم الهاتف</div>
                            <div className="value" style={{ direction: "ltr", textAlign: "right" }}>{invoice.customerPhone || "—"}</div>
                        </div>
                    </div>

                    <div className="section-label"><h4>بيانات السيارة</h4></div>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="label">الماركة</div>
                            <div className="value">{invoice.vehicleBrand || "—"}</div>
                        </div>
                        <div className="info-item">
                            <div className="label">الموديل</div>
                            <div className="value">{invoice.vehicleModel || "—"}</div>
                        </div>
                        <div className="info-item">
                            <div className="label">السنة</div>
                            <div className="value">{invoice.vehicleYear || "—"}</div>
                        </div>
                        <div className="info-item">
                            <div className="label">رقم اللوحة</div>
                            <div className="value">{invoice.vehiclePlateNumber || "—"}</div>
                        </div>
                    </div>

                    <div className="section-label"><h4>بيانات الفني</h4></div>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="label">اسم الفني</div>
                            <div className="value">{invoice.technicianName || "—"}</div>
                        </div>
                        <div className="info-item">
                            <div className="label">التخصص</div>
                            <div className="value">{invoice.technicianSpecialization || "—"}</div>
                        </div>
                    </div>

                    <div className="section-label"><h4>تفاصيل الخدمة</h4></div>
                    <div style={{ border: "1px solid #EBF0FB", borderRadius: "12px", overflow: "hidden" }}>
                        <table className="services-table">
                            <thead>
                                <tr>
                                    <th>اسم الخدمة</th>
                                    <th style={{ width: 130, textAlign: "left" }}>السعر</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allServices.length > 0 ? allServices.map((s, i) => (
                                    <tr key={i}>
                                        <td>{s.name}</td>
                                        <td className="price-cell">{s.price} جنيه</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={2} style={{ textAlign: "center", color: "#aaa" }}>لا توجد خدمات</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="total-bar">
                        <span className="label">الإجمالي الكلي</span>
                        <span className="amount">{invoice.totalCost} جنيه</span>
                    </div>

                    <div className="section-label"><h4>بيانات الدفع</h4></div>
                    <div className="payment-row">
                        <div className="pay-item">
                            <div className="label">طريقة الدفع</div>
                            <div className="value">{paymentMethodMap[invoice.paymentMethod] ?? invoice.paymentMethod ?? "—"}</div>
                        </div>
                        <div className="pay-item">
                            <div className="label">حالة الدفع</div>
                            <div className={`value ${invoice.paymentStatus === "Paid" ? "paid-tag" : ""}`}>
                                {paymentStatusMap[invoice.paymentStatus] ?? invoice.paymentStatus ?? "—"}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ height: "1px", background: "#EEF2FB", margin: "0 36px" }} />
                <div className="inv-footer">
                    <button className="btn-primary-inv" onClick={() => window.print()}>
                        <i className="fa-solid fa-download"></i> تحميل PDF
                    </button>
                    <button className="btn-secondary-inv" onClick={() => window.print()}>
                        <i className="fa-solid fa-print"></i> طباعة
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Invoice;