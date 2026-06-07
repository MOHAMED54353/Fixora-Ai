import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import NavUser from '../Component/NavUser';
import AddProblemModal from '../Component/AddProblemModal';
import axios from '../Utils/axiosConfig.jsx';
import Technican from './Technican';

const statusOptions = [
    {
        key: 'InProgress',
        label: 'قيد التنفيذ',
        icon: 'fa-solid fa-arrow-rotate-right',
        borderClass: 'border-primary',
        bg: '#EBF3FE',
        color: '#3B82F6',
    },
    {
        key: 'WaitingClientApproval',
        label: 'في إنتظار الموافقة',
        icon: 'fa-solid fa-triangle-exclamation',
        borderClass: 'border-warning',
        bg: '#FEF2E8',
        color: '#B05713',
    },
    {
        key: 'Completed',
        label: 'مكتمل',
        icon: 'fa-solid fa-check',
        borderClass: 'border-success',
        bg: '#E9F7EF',
        color: '#2E7D32',
    },
];

const UpdateStatus = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loadingBooking, setLoadingBooking] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [technicianReport, setTechnicianReport] = useState('');
    const [problems, setProblems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    const user = (() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axios.get(`/api/Bookings/my-assignments`, {
                    params: {
                        TechnicianId: user?.id,
                        PageSize: 50,
                        PageIndex: 1,
                    },
                });

                const list = res.data?.data ?? [];
                const found = list.find((b) => b.id == id);

                if (!found) {
                    setFetchError('لم يتم العثور على الحجز');
                } else {
                    setBooking(found);
                    setSelectedStatus(found.status ?? null);
                    setTechnicianReport(found.technicianReport ?? '');
                }
            } catch (err) {
                console.error(' Error fetching booking:', err);
                setFetchError('تعذّر تحميل بيانات الحجز');
            } finally {
                setLoadingBooking(false);
            }
        };

        if (id) fetchBooking();
    }, [id, user?.id]);

    const handleAddProblem = async (problem) => {
        try {
            const res = await axios.post(`/api/Bookings/${id}/additional-issues`, {
                title: problem.name,
                estimatedCost: Number(problem.price),
                description: problem.description,
                estimatedDurationMinutes: Number(problem.duration) || 0,
                isCritical: problem.isCritical,
            });

            setProblems((prev) => [...prev, { ...problem, id: res.data.id }]);
            setSelectedStatus('WaitingClientApproval');
                        showToast('تمت إضافة المشكلة بنجاح، في انتظار موافقة العميل', 'success');
            navigate('/technican');
        } catch (err) {
            console.error(' Error adding problem:', err.response?.data);
            showToast('حدث خطأ أثناء إضافة المشكلة، يرجى المحاولة مرة أخرى');
        }
    };

    const handleChange = (index, field, value) => {
        setProblems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const removeProblem = (index) => {
        setProblems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!selectedStatus) {
            showToast('يرجى اختيار حالة أولاً');
            return;
        }

        if (selectedStatus === 'WaitingClientApproval' && problems.length === 0) {
            showToast('يجب إضافة مشكلة إضافية قبل اختيار "في انتظار الموافقة"');
            return;
        }

        setSaving(true);

        try {
            await axios.patch(`/api/Bookings/${id}/update-status`, {
                status: selectedStatus,
                technicianReport: technicianReport,
            });

            showToast('تم تحديث الحالة بنجاح', 'success');

            setTimeout(() => {
                navigate('/technican', { replace: true });
            }, 1500);
        } catch (err) {
            console.error(' Error updating status:', err.response?.data);
            const msg = err.response?.data?.errorMessage || 'حدث خطأ أثناء تحديث الحالة، يرجى المحاولة مرة أخرى';
            showToast(msg);
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const normalized =
            dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : dateStr + 'Z';
        const date = new Date(normalized);
        if (isNaN(date.getTime())) return '—';
        return date.toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const serviceName =
        booking?.bookingServiceDetailsDtos
            ?.map((s) => s.serviceNameAr ?? s.serviceName ?? s.name ?? '—')
            .join(' + ') ?? '—';

    const carName =
        `${booking?.brand ?? ''} ${booking?.model ?? ''}`.trim() || '—';

    return (
        <>
            <NavUser showMenu={false} />

            {/* Toast Notification */}
            {toast.show && (
                <div
                    style={{
                        position: 'fixed',
                        top: '80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        minWidth: '320px',
                        maxWidth: '90vw',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        direction: 'rtl',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        backgroundColor: toast.type === 'success' ? '#E9F7EF' : '#FEE2E2',
                        borderRight: `4px solid ${toast.type === 'success' ? '#2E7D32' : '#DC2626'}`,
                        color: toast.type === 'success' ? '#2E7D32' : '#DC2626',
                        fontWeight: '600',
                        fontSize: '15px',
                        animation: 'fadeInDown 0.3s ease',
                    }}
                >
                    <i
                        className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'
                            } fs-5`}
                    />
                    <span>{toast.message}</span>
                </div>
            )}

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>

            <section className="section1 m-5">
                {/* بيانات الحجز */}
                <section className="section1 p-3">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 gap-3">
                        <h3 style={{ fontSize: '36px', color: '#333D4D' }}>بيانات الحجز</h3>
                    </div>

                    {loadingBooking ? (
                        <p className="text-center">جاري تحميل البيانات...</p>
                    ) : fetchError ? (
                        <p className="text-center text-danger">{fetchError}</p>
                    ) : (
                        <div
                            className="d-flex flex-column flex-md-row justify-content-between align-items-center mx-auto p-3 bg-white"
                            style={{ maxWidth: '1240px', minHeight: '140px', borderRadius: '16px' }}
                        >
                            <div>
                                <p className="mb-1" style={{ fontSize: '22px' }}>نوع الخدمة :</p>
                                <span style={{ fontSize: '16px' }}>{serviceName}</span>
                            </div>
                            <div>
                                <p className="mb-1" style={{ fontSize: '22px' }}>السيارة :</p>
                                <span style={{ fontSize: '16px' }}>{carName}</span>
                            </div>
                            <div>
                                <p className="mb-1" style={{ fontSize: '22px' }}>التاريخ :</p>
                                <span style={{ fontSize: '16px' }}>
                                    {formatDate(booking?.scheduledDate)}
                                </span>
                            </div>
                        </div>
                    )}
                </section>

                {/* حالة العمل */}
                <section className="section2 p-3">
                    <div
                        className="d-flex flex-column gap-3 bg-white rounded-3 p-3 mx-auto"
                        style={{ maxWidth: '1240px' }}
                    >
                        <h3>حالة العمل</h3>

                        {statusOptions.map((option) => {
                            const isSelected = selectedStatus === option.key;
                            const isDimmed = selectedStatus !== null && !isSelected;

                            return (
                                <div
                                    key={option.key}
                                    className={`status-box p-3 d-flex align-items-center rounded-3 border ${option.borderClass}`}
                                    style={{
                                        backgroundColor: isDimmed ? '#F0F0F0' : option.bg,
                                        height: '70px',
                                        cursor: 'pointer',
                                        opacity: isDimmed ? 0.4 : 1,
                                        transition: 'all 0.2s ease',
                                        outline: isSelected ? `2px solid ${option.color}` : 'none',
                                    }}
                                    onClick={() => {
                                        if (problems.length > 0 && option.key !== 'waitingClientApproval') {
                                            showToast('لا يمكن تغيير الحالة بعد إضافة مشكلة إضافية');
                                            return;
                                        }
                                        setSelectedStatus(option.key);
                                    }}
                                >
                                    <i
                                        className={`${option.icon} fs-5 mx-2`}
                                        style={{ color: isDimmed ? '#aaa' : option.color }}
                                    ></i>
                                    <span
                                        style={{
                                            color: isDimmed ? '#aaa' : option.color,
                                            fontSize: '18px',
                                        }}
                                    >
                                        {option.label}
                                    </span>
                                    {isSelected && (
                                        <i
                                            className="fa-solid fa-circle-check fs-5 p-4"
                                            style={{ color: option.color }}
                                        ></i>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* التقرير الفني */}
                <section className="section3 p-3">
                    <div className="bg-white rounded-3 p-3 mx-auto" style={{ maxWidth: '1240px' }}>
                        <h3>التقرير الفني</h3>
                        <p className="mb-2">(اكتب وصف تفصيلي للعمل المنجز)</p>
                        <textarea
                            className="form-control"
                            placeholder="مثال: تم تغيير زيت المحرك واستخدام فلتر جديد عالي الجودة..."
                            value={technicianReport}
                            onChange={(e) => setTechnicianReport(e.target.value)}
                            style={{
                                backgroundColor: '#F6F7FB',
                                border: '1.5px solid #DFDFDF',
                                borderRadius: '8px',
                                height: '180px',
                                resize: 'none',
                            }}
                        />
                    </div>
                </section>

                {/* مشاكل إضافية */}
                <section className="section4 p-3">
                    <div className="bg-white rounded-3 p-3 mx-auto" style={{ maxWidth: '1240px' }}>
                        <h3>مشاكل إضافية</h3>
                        <p className="mb-3">(اختياري)</p>

                        {problems.length === 0 && (
                            <p className="text-muted">لم يتم إضافة أي مشاكل بعد.</p>
                        )}

                        {problems.map((problem, index) => (
                            <div
                                key={index}
                                className="d-flex flex-column flex-lg-row align-items-end gap-3 mb-3"
                            >
                                <div className="flex-fill">
                                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-screwdriver-wrench text-primary"></i>
                                        اسم المشكلة
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="مثال: تآكل في تيل الفرامل"
                                        value={problem.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="flex-fill">
                                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-file-lines text-secondary"></i>
                                        الوصف
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="وصف مختصر للمشكلة"
                                        value={problem.description || ''}
                                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                                    />
                                </div>
                                <div style={{ minWidth: '160px' }}>
                                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-money-bill-wave text-success"></i>
                                        السعر
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="مثال: 100"
                                        value={problem.price}
                                        onChange={(e) => handleChange(index, 'price', e.target.value)}
                                    />
                                </div>
                                <div style={{ minWidth: '160px' }}>
                                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                                        <i className="fa-regular fa-clock text-warning"></i>
                                        المدة المتوقعة
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="مثال: 2 ساعة"
                                        value={problem.duration}
                                        onChange={(e) => handleChange(index, 'duration', e.target.value)}
                                    />
                                </div>
                                <button
                                    className="btn btn-light fs-5 text-danger align-self-end"
                                    onClick={() => removeProblem(index)}
                                >
                                    <i className="fa-regular fa-trash-can"></i>
                                </button>
                            </div>
                        ))}

                        <button className="btn text-primary mt-2" onClick={() => setShowModal(true)}>
                            + إضافة مشكلة إضافية
                        </button>
                    </div>
                </section>

                <AddProblemModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onAdd={(newProblem) => {
                        handleAddProblem(newProblem);
                        setShowModal(false);
                    }}
                />

                <hr />

                <div className="text-center my-4">
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', maxWidth: '400px' }}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'جاري الحفظ...' : 'حفظ التحديث'}
                    </button>
                </div>
            </section>
        </>
    );
};

export default UpdateStatus;