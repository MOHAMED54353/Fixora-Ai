import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axios from '../Utils/axiosConfig'
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavUser from '../Component/NavUser'
import Dto1 from '../Component/Dto1'
import Dto2 from '../Component/Dto2'

const BookingDtoManager = () => {
    const { id } = useParams()
    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await axios.get(`/api/Admin/bookings/${id}`)
                setBooking(res.data)
                console.log("data", res.data)
            } catch (err) {
                if (err.response) {
                    setError(err.response.data?.message || ' خطأ من السيرفر')
                } else if (err.request) {
                    setError('مفيش استجابة من السيرفر')
                } else {
                    setError(' خطأ غير متوقع')
                }
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchBooking()
    }, [id])

    const handleCancelBooking = async () => {
        if (!booking?.id) return;

        const confirmCancel = window.confirm("متأكد إنك عايز تلغي الحجز؟");
        if (!confirmCancel) return;

        let toastId;
        try {
            setLoading(true);
            toastId = toast.loading("جاري إلغاء الحجز...");
            await axios.patch(`/api/Bookings/${booking.id}/admin-cancel`);
            toast.dismiss(toastId);
            toast.success("تم إلغاء الحجز بنجاح ");
            setBooking(prev => ({
                ...prev,
                status: "Cancelled"
            }));
            setTimeout(() => {
                navigate("/all-bookings");
            }, 2000);

        } catch (err) {
            console.error(err);
            if (toastId) toast.dismiss(toastId);
            toast.error("حصل خطأ أثناء إلغاء الحجز");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '60vh', flexDirection: 'column', gap: 16,
            fontFamily: 'Cairo, sans-serif', direction: 'rtl'
        }}>
            <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '4px solid #EBF3FE', borderTopColor: '#2A5CAF',
                animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: '#7A8CAB', fontSize: 15, margin: 0 }}>
                جاري تحميل بيانات الحجز...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    if (error) return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '60vh', flexDirection: 'column', gap: 12,
            fontFamily: 'Cairo, sans-serif', direction: 'rtl'
        }}>
            <i className="fa-solid fa-circle-exclamation"
                style={{ fontSize: 40, color: '#E24B4A' }} />
            <p style={{ color: '#E24B4A', fontSize: 16, margin: 0, fontWeight: 700 }}>
                {error}
            </p>
        </div>
    )

    return (
        <>
            <ToastContainer position="top-center" autoClose={3000} rtl />
            <NavUser showMenu={false} />
            <Dto1 booking={booking} onCancel={handleCancelBooking} />
            <Dto2 booking={booking} />
        </>
    )
}

export default BookingDtoManager