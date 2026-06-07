/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import NavUser from '../Component/NavUser'
import axios from '../Utils/axiosConfig'
import { useNavigate } from 'react-router'

const typeConfig = {
    TechnicianAssigned: { imgSrc: "/not.png" },
    NewReview: { imgSrc: "/rev.png" },
    AdditionalIssueAdded: { imgSrc: "/can.png" },
    BookingCompleted: { imgSrc: "/com.png" },
    AdditionalIssueApproved: { imgSrc: "/com.png" },
    AdditionalIssueRejected: { imgSrc: "/can.png" },
    BookingCancelled: { imgSrc: "/ff.png" },
    default: { imgSrc: "/not.png" },
}

const getConfig = (type) => typeConfig[type] || typeConfig.default

// Helper: يطلق event عشان NavUser يعمل re-fetch للـ unread count
const notifyNavbar = () => window.dispatchEvent(new Event("notificationsRead"))

const Notification = () => {
    const navigate = useNavigate()
    const [items, setItems] = useState([])
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchNotifications = async (retry = 1) => {
        try {
            setLoading(true)
            setError(null)
            const res = await axios.get('/api/Notifications', { params: { PageIndex: pageIndex, PageSize: pageSize } })
            setItems(res.data.data || [])
            setTotal(res.data.count || 0)
        } catch (err) {
            if (retry > 0) {
                fetchNotifications(retry - 1)
            } else {
                console.error(err)
                setError("حدث خطأ أثناء جلب الإشعارات")
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchUnreadCount = async () => {
        try {
            const res = await axios.get('/api/Notifications/unread-count')
            setUnreadCount(res.data.unreadCount ?? res.data ?? 0)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchNotifications()
        fetchUnreadCount()
    }, [pageIndex])

    const markAsRead = async (id, isRead) => {
        if (isRead) return
        try {
            await axios.patch(`/api/Notifications/${id}/mark-read`)
            setItems(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
            setUnreadCount(prev => Math.max(prev - 1, 0))
            notifyNavbar() // ← إشعار الـ NavUser
        } catch (err) {
            console.error(err)
        }
    }

    const markAllAsRead = async () => {
        try {
            await axios.patch('/api/Notifications/mark-all-read')
            setItems(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
            notifyNavbar() // ← إشعار الـ NavUser
        } catch (err) {
            console.error(err)
        }
    }

    const totalPages = Math.ceil(total / pageSize)

    return (
        <>
            <NavUser showMenu={false} />
            <div className="py-4 px-3" style={{ direction: "rtl" }}>
                <div className="d-flex justify-content-between align-items-center mx-auto" style={{ maxWidth: "1200px" }}>
                    <span
                        onClick={() => navigate(-1)}
                        style={{ cursor: "pointer", fontSize: "14", color: "#555", whiteSpace: "nowrap" }}
                    >
                        ← رجوع
                    </span>
                    <div className="text-center">
                        <h3 className="mb-1" style={{ fontSize: "clamp(18px, 4vw, 24px)" }}>الإشعارات</h3>
                        <p className="mb-0 text-muted" style={{ fontSize: "clamp(12px, 3vw, 14px)" }}>
                            {unreadCount} إشعار (
                            <span className="text-primary fw-semibold">{unreadCount} جديد</span>
                            )
                        </p>
                    </div>

                    {unreadCount > 0 ? (
                        <button
                            onClick={markAllAsRead}
                            className="btn btn-sm btn-outline-primary"
                            style={{ fontSize: "clamp(11px, 2.5vw, 13px)", whiteSpace: "nowrap" }}
                        >
                            اعتبار الكل مقروء
                        </button>
                    ) : (
                        <div style={{ width: "80px" }} />
                    )}
                </div>
            </div>

            <div className="mx-auto px-3 pb-5" style={{ maxWidth: "1200px", direction: "rtl" }}>
                {loading ? (
                    <p className="text-center py-5 text-muted">جاري التحميل...</p>
                ) : error ? (
                    <p className="text-center py-5 text-danger">{error}</p>
                ) : items.length === 0 ? (
                    <p className="text-center py-5 text-muted">مفيش إشعارات حالياً 📭</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {items.map(n => {
                            const { imgSrc } = getConfig(n.type)
                            return (
                                <div
                                    key={n.id}
                                    onClick={() => markAsRead(n.id, n.isRead)}
                                    style={{
                                        padding: "16px",
                                        borderRadius: "16px",
                                        backgroundColor: n.isRead ? "#fff" : "#dbeeff",
                                        borderRight: n.isRead ? "none" : "4px solid #3b82f6",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="flex-shrink-0" style={{ width: 44, height: 44 }}>
                                            <img
                                                src={imgSrc}
                                                alt={n.type}
                                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                                            />
                                        </div>

                                        <div className="flex-grow-1 overflow-hidden">
                                            <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                                                <h5 className="mb-1 fw-bold" >
                                                    {n.title}
                                                </h5>
                                                <span style={{ fontSize: "11px", color: "#aab0c3", whiteSpace: "nowrap" }}>
                                                    <i className="far fa-clock me-1"></i>
                                                    {new Date(n.createdAt).toLocaleString("ar-EG", {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: false
                                                    })}
                                                </span>
                                            </div>

                                            <p className="mb-2 text-muted">
                                                {n.message}
                                            </p>

                                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                                <span style={{
                                                    background: "#DFDFDF",
                                                    color: "#555",
                                                    fontSize: "11px",
                                                    padding: "3px 10px",
                                                    borderRadius: "20px",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "4"
                                                }}>
                                                    <span className="rounded-circle" style={{ width: "6px", height: "6px", background: "#888", flexShrink: 0 }} />
                                                    {n.type}
                                                </span>

                                                {!n.isRead && (
                                                    <span className="rounded-circle" style={{ width: "8px", height: "8px", background: "#3b82f6", flexShrink: 0 }} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {total > 0 && (
                    <div className="d-flex flex-wrap justify-content-between align-items-center mt-4 gap-2">
                        <p className="mb-0 text-muted" style={{ fontSize: "clamp(11px, 2.5vw, 13px)" }}>
                            عرض {(pageIndex - 1) * pageSize + 1} إلى {Math.min(pageIndex * pageSize, total)} من {total} إشعار
                        </p>
                        <div className="d-flex flex-wrap gap-1">
                            <button
                                onClick={() => setPageIndex(p => Math.max(p - 1, 1))}
                                disabled={pageIndex === 1}
                                style={btnStyle(false)}
                            >‹</button>
                            {(() => {
                                const pages = []
                                const delta = 1
                                const range = []
                                for (let i = Math.max(2, pageIndex - delta); i <= Math.min(totalPages - 1, pageIndex + delta); i++) {
                                    range.push(i)
                                }
                                pages.push(
                                    <button key={1} onClick={() => setPageIndex(1)} style={btnStyle(pageIndex === 1)}>1</button>
                                )
                                if (range[0] > 2) {
                                    pages.push(<span key="start-dots" style={{ alignSelf: "center", color: "#aaa" }}>...</span>)
                                }
                                range.forEach(i => {
                                    pages.push(
                                        <button key={i} onClick={() => setPageIndex(i)} style={btnStyle(pageIndex === i)}>{i}</button>
                                    )
                                })
                                if (range[range.length - 1] < totalPages - 1) {
                                    pages.push(<span key="end-dots" style={{ alignSelf: "center", color: "#aaa" }}>...</span>)
                                }
                                if (totalPages > 1) {
                                    pages.push(
                                        <button key={totalPages} onClick={() => setPageIndex(totalPages)} style={btnStyle(pageIndex === totalPages)}>{totalPages}</button>
                                    )
                                }
                                return pages
                            })()}
                            <button
                                onClick={() => setPageIndex(p => Math.min(p + 1, totalPages))}
                                disabled={pageIndex === totalPages}
                                style={btnStyle(false)}
                            >›</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

const btnStyle = (active) => ({
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: active ? "#2A5CAF" : "#fff",
    color: active ? "#fff" : "#555",
    fontWeight: active ? "bold" : "normal",
    cursor: "pointer",
    fontSize: "14px",
})

export default Notification