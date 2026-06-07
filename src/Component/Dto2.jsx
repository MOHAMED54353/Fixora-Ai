import React from 'react'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');

  .dto2-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 20px;
  }

  .dto2-card {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(42, 92, 175, 0.07);
    transition: box-shadow 0.25s, transform 0.2s;
  }
  .dto2-card:hover {
    box-shadow: 0 6px 24px rgba(42, 92, 175, 0.13);
    transform: translateY(-2px);
  }
  .dto2-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 2px solid #EFF4FF;
  }
  .dto2-card-icon {
    width: 38px; height: 38px;
    background: #EBF3FE;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .dto2-card-icon i { color: #2A5CAF; font-size: 16px; }
  .dto2-card-title { font-size: 17px; font-weight: 700; color: #1A2744; margin: 0; }

  .service-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px dashed #EEF2FF;
  }
  .service-item:last-of-type { border-bottom: none; }
  .service-name { font-size: 15px; font-weight: 600; color: #1A2744; margin: 0 0 4px; }
  .service-duration {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; color: #7A8CAB; font-weight: 500;
  }
  .service-price { font-size: 16px; font-weight: 800; color: #2A5CAF; }

  .services-total-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 14px; padding: 12px 16px;
    background: #EBF3FE; border-radius: 12px;
  }
  .total-label { font-size: 15px; font-weight: 700; color: #1A3D7C; }
  .total-amount { font-size: 18px; font-weight: 800; color: #1A3D7C; }

  .issue-card {
    border-radius: 12px; padding: 12px 14px;
    margin-bottom: 10px; border: 1.5px solid transparent;
  }
  .issue-card:last-child { margin-bottom: 0; }
  .issue-card.approved { background: #F0FBF6; border-color: #B7E8D0; }
  .issue-card.pending  { background: #FFFBF0; border-color: #FFE4A0; }
  .issue-card.rejected { background: #FFECEC; border-color: #FFB3B3; }

  .issue-top {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 6px;
  }
  .issue-title { font-size: 14px; font-weight: 700; color: #1A2744; margin: 0; }
  .issue-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 700; padding: 4px 10px;
    border-radius: 20px;
  }
  .issue-badge.approved { background: #D0F2E2; color: #0A6B3E; }
  .issue-badge.pending  { background: #FFF0C0; color: #8A6000; }
  .issue-badge.rejected { background: #FFD6D6; color: #A61B1B; }

  .issue-bottom { display: flex; align-items: center; justify-content: space-between; }
  .issue-time { font-size: 12px; color: #7A8CAB; display: flex; align-items: center; gap: 4px; }
  .issue-price { font-size: 15px; font-weight: 800; color: #1A2744; }

  .issues-total-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 16px; padding-top: 12px; border-top: 2px solid #EFF4FF;
    font-size: 14px; color: #3A4A66; font-weight: 600;
  }
  .issues-total-amount { font-size: 15px; font-weight: 800; color: #1A2744; }

  /* Payment Section */
  .payment-section {
    margin-top: 20px;
    background: #fff;
    border-radius: 16px;
    padding: 20px 24px;
    box-shadow: 0 2px 12px rgba(42, 92, 175, 0.07);
  }
  .payment-section .dto2-card-header { margin-bottom: 16px; }

  .payment-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px dashed #e3eafe;
    font-size: 14px;
    color: #3A4A66;
    font-weight: 600;
  }
  .payment-row:last-child { border-bottom: none; }
  .payment-row-label { display: flex; align-items: center; gap: 8px; color: #7A8CAB; }
  .payment-row-label i { color: #2A5CAF; font-size: 14px; }
  .payment-row-value { font-weight: 700; color: #1A2744; font-size: 15px; }

  .pay-status { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 700; }
  .pay-status.Paid    { background: #D0F2E2; color: #0A6B3E; }
  .pay-status.Pending { background: #FFF0C0; color: #8A6000; }
  .pay-status.Failed  { background: #FFD6D6; color: #A61B1B; }

  .payment-total {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 14px; padding: 12px 16px;
    background: linear-gradient(135deg, #2A5CAF, #1A3D7C);
    border-radius: 12px;
  }
  .payment-total-label { font-size: 15px; font-weight: 700; color: #fff; }
  .payment-total-amount { font-size: 20px; font-weight: 800; color: #fff; }
`

const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '—'

const Dto2 = ({ booking }) => {
    if (!booking) return null
    const services = booking.bookingServiceDetailsDtos ?? []
    const issues = booking.additionalIssueDtos ?? []

    const servicesTotal = services.reduce((s, x) => s + (x.servicePrice ?? 0), 0)
    const issuesTotal = issues.filter(i => i.isApproved).reduce((s, x) => s + (x.estimatedCost ?? 0), 0)
    const grandTotal = booking.totalCost ?? (servicesTotal + issuesTotal)

    const methodLabels = { Cash: 'كاش', Card: 'بطاقة بنكية', Online: 'محفظة إلكترونية' }
    const statusLabels = { Paid: 'مدفوع', Pending: 'لسا مدفعش', Failed: 'فشل الدفع' }
    const statusIcons = { Paid: 'fa-circle-check', Pending: 'fa-clock', Failed: 'fa-circle-xmark' }

    return (
        <>
            <style>{styles}</style>
            <div className="m-3 p-5">
                <div className="dto2-grid">

                    <div className="dto2-card">
                        <div className="dto2-card-header">
                            <div className="dto2-card-icon"><i className="fa-solid fa-clipboard-list"></i></div>
                            <h4 className="dto2-card-title">الخدمات المطلوبة</h4>
                        </div>
                        {services.map((s, i) => (
                            <div className="service-item" key={i}>
                                <div>
                                    <p className="service-name">{s.serviceName || '—'}</p>
                                    <div className="service-duration"><i className="fa-regular fa-clock"></i>{s.duration || '—'} دقيقة</div>
                                </div>
                                <span className="service-price">{s.servicePrice || '—'} جنيه</span>
                            </div>
                        ))}
                        <div className="services-total-row">
                            <span className="total-label">المجموع</span>
                            <span className="total-amount">{servicesTotal} جنيه</span>
                        </div>
                    </div>

                    <div className="dto2-card">
                        <div className="dto2-card-header">
                            <div className="dto2-card-icon" style={{ background: '#FFF8E6' }}>
                                <i className="fa-solid fa-triangle-exclamation" style={{ color: '#C07000' }}></i>
                            </div>
                            <h4 className="dto2-card-title">مشاكل إضافية</h4>
                        </div>
                        {issues.length === 0 && <p style={{ color: '#7A8CAB', fontSize: 14, textAlign: 'center', padding: '16px 0' }}>لا توجد مشاكل إضافية</p>}
                        {issues.map((issue) => {
                            const st = issue.isApproved === true ? 'approved' : issue.isApproved === false ? 'rejected' : 'pending'
                            const stLabels = { approved: 'تمت الموافقة', pending: 'قيد الانتظار', rejected: 'مرفوض' }
                            const stIcons = { approved: 'fa-circle-check', pending: 'fa-clock', rejected: 'fa-circle-xmark' }
                            return (
                                <div className={`issue-card ${st}`} key={issue.id}>
                                    <div className="issue-top">
                                        <p className="issue-title">{issue.title}</p>
                                        <span className={`issue-badge ${st}`}><i className={`fa-solid ${stIcons[st]}`}></i>{stLabels[st]}</span>
                                    </div>
                                    <div className="issue-bottom">
                                        <span className="issue-time"><i className="fa-regular fa-clock"></i>{formatTime(issue.createdAt)}</span>
                                        <span className="issue-price">{issue.estimatedCost} جنيه</span>
                                    </div>
                                </div>
                            )
                        })}
                        {issues.length > 0 && (
                            <div className="issues-total-row">
                                <span>إجمالي التكاليف الإضافية</span>
                                <span className="issues-total-amount">{issuesTotal} جنيه</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="payment-section">
                    <div className="dto2-card-header">
                        <div className="dto2-card-icon"><i className="fa-solid fa-wallet"></i></div>
                        <h4 className="dto2-card-title">معلومات الدفع</h4>
                    </div>

                    <div className="payment-row">
                        <span className="payment-row-label"><i className="fa-solid fa-money-bill-wave"></i>طريقة الدفع</span>
                        <span className="payment-row-value">{methodLabels[booking.paymentMethod] ?? booking.paymentMethod}</span>
                    </div>

                    <div className="payment-row">
                        <span className="payment-row-label"><i className="fa-solid fa-circle-dot"></i>حالة الدفع</span>
                        <span className={`pay-status ${booking.paymentStatus}`}>
                            <i className={`fa-solid ${statusIcons[booking.paymentStatus] ?? 'fa-question'}`}></i>
                            {statusLabels[booking.paymentStatus] ?? booking.paymentStatus}
                        </span>
                    </div>

                    <div className="payment-total">
                        <span className="payment-total-label">الإجمالي الكلي</span>
                        <span className="payment-total-amount">{grandTotal} جنيه</span>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Dto2