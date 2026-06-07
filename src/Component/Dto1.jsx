import React from 'react'
import { useNavigate } from 'react-router'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #2A5CAF;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    padding: 8px 14px 8px 10px;
    border-radius: 10px;
    transition: background 0.2s, transform 0.15s;
    background: transparent;
    border: none;
  }
  .back-btn:hover {
    background: #dce9fb;
    transform: translateX(-3px);
  }

  .header-card {
    background: linear-gradient(135deg, #2A5CAF 0%, #1A3D7C 100%);
    border-radius: 20px;
    padding: 28px 28px 24px;
    margin-top: 16px;
    color: #fff;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(42, 92, 175, 0.35);
  }
  .header-card::before {
    content: '';
    position: absolute;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    top: -70px; left: -60px;
  }
  .header-card::after {
    content: '';
    position: absolute;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    bottom: -50px; right: 20px;
  }

  .booking-title {
    font-size: 26px;
    font-weight: 800;
    margin: 0 0 6px;
    position: relative;
  }
  .booking-number {
    font-size: 15px;
    font-weight: 400;
    opacity: 0.8;
    margin: 0 0 16px;
    position: relative;
  }
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.18);
    border: 1px solid white;
    font-size: 13px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 30px;
    backdrop-filter: blur(4px);
    position: relative;
  }
  .header-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 4px;
    position: relative;
  }
  .date-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.15);
    padding: 7px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 16px;
    margin-top: 50px;
    margin-bottom: -60px;
  }

  .section-card {
    background: #fff;
    border-radius: 18px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(42, 92, 175, 0.07);
    transition: box-shadow 0.25s, transform 0.2s;
  }
  .section-card:hover {
    box-shadow: 0 6px 24px rgba(42, 92, 175, 0.13);
    transform: translateY(-2px);
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 2px solid #EFF4FF;
  }
  .card-icon {
    width: 38px; height: 38px;
    background: #EBF3FE;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .card-icon i { color: #2A5CAF; font-size: 16px; }
  .card-title {
    font-size: 17px;
    font-weight: 700;
    color: #1A2744;
    margin: 0;
  }

  .avatar-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
  }
  .avatar-initials {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #2A5CAF, #5B8FE8);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 17px;
    font-weight: 800;
    color: #fff;
    box-shadow: 0 4px 14px rgba(42, 92, 175, 0.3);
    letter-spacing: 1px;
  }
  .customer-name {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 3px;
  }
  .prev-bookings {
    font-size: 13px;
    color: #7A8CAB;
    font-weight: 500;
    margin: 0;
  }
  .contact-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .contact-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #3A4A66;
    font-weight: 500;
    background: #F6F9FF;
    padding: 9px 12px;
    border-radius: 10px;
  }
  .contact-item i { color: #2A5CAF; width: 16px; text-align: center; }

  .car-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #EBF3FE, #D6E8FF);
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 18px;
  }
  .car-visual i { font-size: 48px; color: #2A5CAF; opacity: 0.85; }
  .car-specs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .car-spec-item {
    background: #F6F9FF;
    border-radius: 10px;
    padding: 10px 12px;
  }
  .spec-label {
    font-size: 11px;
    color: #7A8CAB;
    font-weight: 600;
    margin-bottom: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .spec-value { font-size: 15px; font-weight: 700; color: #1A2744; }

  .tech-avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF8C42, #E05A10);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(255, 120, 50, 0.35);
    overflow: hidden;
    border: 3px solid #fff;
    outline: 2px solid #FFD4B0;
  }
  .tech-avatar i { color: #fff; font-size: 26px; }
  .tech-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #FFF3EB;
    color: #C05000;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    margin-top: 4px;
  }
  .tech-badge i { font-size: 11px; }
  .stars-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #F6F9FF;
    padding: 10px 14px;
    border-radius: 10px;
    margin-top: 38px;
  }
  .stars { display: flex; gap: 3px; }
  .stars i { color: #F5A623; font-size: 14px; }
  .rating-num { font-size: 15px; font-weight: 800; color: #1A2744; margin-right: 2px; }
`

const formatDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    const opts = { year: 'numeric', month: 'long', day: 'numeric' }
    const date = d.toLocaleDateString('ar-EG', opts)
    const time = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    return `${date} · ${time}`
}

const getInitials = (name = '') => {
    const parts = name.trim().split(' ')
    return parts.length >= 2
        ? parts[0][0] + parts[1][0]
        : parts[0]?.[0] ?? '؟'
}

const renderStars = (rate = 0) => {
    const full = Math.floor(rate)
    const half = rate - full >= 0.5
    const stars = []
    for (let i = 0; i < full; i++) stars.push(<i key={i} className="fa-solid fa-star" />)
    if (half) stars.push(<i key="h" className="fa-solid fa-star-half-stroke" />)
    const empty = 5 - stars.length
    for (let i = 0; i < empty; i++) stars.push(<i key={`e${i}`} className="fa-regular fa-star" />)
    return stars
}

const Dto1 = ({ booking, onCancel }) => {
    const navigate = useNavigate()
    if (!booking) return null

    const getStatusInfo = (status) => {
        switch (status) {
            case "Pending":
                return { label: "معلقة", color: "#F5A623" };
            case "InProgress":
                return { label: "قيد التنفيذ", color: "#E27019" };
            case "Cancelled":
                return { label: "ملغية", color: "#E24B4A" };
            case "Completed":
                return { label: "مكتملة", color: "#2ECC71" };
            case "AwaitingApproval":
                return { label: "بانتظار الموافقة", color: "#9B59B6" };
            default:
                return { label: "معلقة", color: "#F5A623" };
        }
    };
    const statusInfo = getStatusInfo(booking.status)

    return (
        <>
            <style>{styles}</style>
            <div className="booking-page m-3 p-5">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-right"></i>
                    رجوع
                </button>
                <div className="header-card">
                    <div className='d-flex justify-content-between'>
                        <h3 className="booking-title">تفاصيل الحجز</h3>
                        <span
                            className="status-badge"
                            style={{
                                background: `${statusInfo.color}20`,
                                border: `1px solid ${statusInfo.color}`,
                                color: statusInfo.color
                            }}
                        >
                            {statusInfo.label}
                        </span>

                    </div>
                    <p className="booking-number"># {booking.bookingNumber}</p>

                    <div className="header-meta">
                        <div className="date-chip">
                            <i className="fas fa-calendar-alt"></i>
                            {formatDate(booking.scheduledDate)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <button className="btn btn-danger"
                                onClick={onCancel}
                                disabled={booking.status === "Cancelled" || booking.status === "Completed"}>
                                <i className="fa-solid fa-times-circle" style={{ marginLeft: '6px' }}></i>
                                إلغاء الحجز
                            </button>
                        </div>
                    </div>
                </div>

                <div className="cards-grid">
                    {/* Customer */}
                    <div className="section-card">
                        <div className="card-header">
                            <div className="card-icon"><i className="fa-solid fa-user"></i></div>
                            <h4 className="card-title"> العميل</h4>
                        </div>
                        <div className="avatar-row">
                            <div className="avatar-initials">{getInitials(booking.customerName) || "غير متاح حاليا"}</div>
                            <div>
                                <p className="customer-name mt-3" style={{ fontWeight: "700", color: "#2A5CAF" }}>{booking.customerName || 'غير متاح'}</p>
                                <p>
                                    <span>
                                        {booking.previousBookingsCount ?? 'غير معروف'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="contact-list mt-3">
                            <div className="contact-item">
                                <i className="fa-solid fa-phone"></i>
                                {booking.customerPhone}
                            </div>
                            <div className="contact-item">
                                <a className="contact-item" href={`mailto:${booking.customerEmail}`} target="_blank" rel="noopener noreferrer">
                                    <i className="fa-solid fa-envelope"></i>
                                    {booking.customerEmail || 'غير متاح'}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Car */}
                    <div className="section-card">
                        <div className="card-header">
                            <div className="card-icon"><i className="fa-solid fa-car"></i></div>
                            <h4 className="card-title"> السيارة</h4>
                        </div>
                        <div className="car-visual">
                            <i className="fa-solid fa-car-side"></i>
                        </div>
                        <div className="car-specs">
                            <div className="car-spec-item full-width">
                                <div className="spec-label">الماركة والموديل</div>
                                <div className="spec-value">{booking.brand || 'غير متاح'} {booking.model || 'غير متاح'}</div>
                            </div>
                            <div className="car-spec-item">
                                <div className="spec-label">رقم اللوحة</div>
                                <div className="spec-value">{booking.plateNumber || 'غير متاح'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Technician */}
                    <div className="section-card">
                        <div className="card-header">
                            <div className="card-icon" style={{ background: '#FFF3EB' }}>
                                <i className="fa-solid fa-wrench" style={{ color: '#C05000' }}></i>
                            </div>
                            <h4 className="card-title"> الفني</h4>
                        </div>
                        <div className="avatar-row">
                            <div className="tech-avatar">
                                <i className="fa-solid fa-user-tie"></i>
                            </div>
                            <div>
                                <p className="customer-name">{booking.technicianName || 'غير متاح'}</p>
                                <div className="tech-badge">
                                    <i className="fa-solid fa-shield-check"></i>
                                    {booking.technicianSpecialization || 'غير متاح'}
                                </div>
                            </div>
                        </div>
                        <div className="stars-row">
                            <div className="stars">{renderStars(booking.technicianRate)}</div>
                            <span className="rating-num">{booking.technicianRate?.toFixed(1)}</span>
                        </div>
                        <div className="stars-row mt-2">
                            سنوات الخبرة: {booking.technicianExperienceYears ?? 'غير متاح'}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dto1