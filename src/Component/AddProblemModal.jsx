import React, { useState } from 'react';

const AddProblemModal = ({ show, onClose, onAdd }) => {
    const [problem, setProblem] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        isCritical: false,
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const rules = {
        name: (v) => {
            if (!v.trim()) return 'اسم المشكلة مطلوب';
            if (v.trim().length < 3) return 'الاسم يجب أن يكون 3 أحرف على الأقل';
            if (v.trim().length > 100) return 'الاسم يجب أن لا يتجاوز 100 حرف';
            return '';
        },
        description: (v) => {
            if (!v.trim()) return 'وصف المشكلة مطلوب';
            if (v.trim().length < 10) return 'الوصف يجب أن يكون 10 أحرف على الأقل';
            if (v.trim().length > 500) return 'الوصف يجب أن لا يتجاوز 500 حرف';
            return '';
        },
        price: (v) => {
            if (!v.toString().trim()) return 'السعر مطلوب';
            if (isNaN(v) || v.toString().trim() === '') return 'السعر يجب أن يكون رقمًا';
            if (Number(v) <= 0) return 'السعر يجب أن يكون أكبر من 0';
            if (Number(v) > 100000) return 'السعر مرتفع جداً';
            return '';
        },
        duration: (v) => {
            if (!v.toString().trim()) return 'المدة مطلوبة';
            if (isNaN(v) || v.toString().trim() === '') return 'المدة يجب أن تكون رقمًا';
            if (!Number.isInteger(Number(v))) return 'المدة يجب أن تكون عددًا صحيحًا';
            if (Number(v) <= 0) return 'المدة يجب أن تكون أكبر من 0';
            if (Number(v) > 1440) return 'المدة لا يمكن أن تتجاوز 1440 دقيقة';
            return '';
        },
    };

    const handleChange = (field, value) => {
        setProblem(prev => ({ ...prev, [field]: value }));
        if (touched[field]) {
            setErrors(prev => ({ ...prev, [field]: rules[field](value) }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(prev => ({ ...prev, [field]: rules[field](problem[field]) }));
    };

    const validate = () => {
        const newErrors = {};
        const allTouched = {};
        Object.keys(rules).forEach(field => {
            newErrors[field] = rules[field](problem[field]);
            allTouched[field] = true;
        });
        setErrors(newErrors);
        setTouched(allTouched);
        return Object.values(newErrors).every(e => e === '');
    };

    const handleAdd = () => {
        if (!validate()) return;
        onAdd({
            ...problem,
            price: Number(problem.price),
            duration: Number(problem.duration),
        });
        setProblem({ name: '', description: '', price: '', duration: '', isCritical: false });
        setErrors({});
        setTouched({});
        onClose();
    };

    const handleClose = () => {
        setProblem({ name: '', description: '', price: '', duration: '', isCritical: false });
        setErrors({});
        setTouched({});
        onClose();
    };

    if (!show) return null;

    return (
        <div
            style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000,
            }}
            onClick={handleClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '750px', maxWidth: '95%',
                    background: '#fff', borderRadius: '16px',
                    padding: '40px', display: 'flex',
                    flexDirection: 'column', gap: '8px',
                    position: 'relative', direction: 'rtl',
                }}
            >
                {/* Close */}
                <button onClick={handleClose} style={{
                    position: 'absolute', top: '20px', left: '20px',
                    fontSize: '20px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#9CA3AF',
                }}>✕</button>

                <h3 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '12px' }}>
                    <i className="fa-solid fa-triangle-exclamation text-primary px-2 fs-4" />
                    إضافة مشكلة إضافية
                </h3>

                {/* Name */}
                <Field
                    label="اسم المشكلة"
                    required
                    hint={`${problem.name.length}/100`}
                    error={errors.name}
                >
                    <input
                        type="text"
                        placeholder="مثال: تلف في الفرامل"
                        value={problem.name}
                        maxLength={100}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        style={inputStyle(errors.name)}
                    />
                </Field>

                {/* Description */}
                <Field
                    label="وصف المشكلة"
                    required
                    hint={`${problem.description.length}/500`}
                    error={errors.description}
                >
                    <textarea
                        placeholder="اشرح المشكلة بالتفصيل..."
                        value={problem.description}
                        maxLength={500}
                        rows={3}
                        onChange={(e) => handleChange('description', e.target.value)}
                        onBlur={() => handleBlur('description')}
                        style={{ ...inputStyle(errors.description), resize: 'none' }}
                    />
                </Field>

                {/* Price + Duration */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Field label="السعر (جنيه)" required error={errors.price} style={{ flex: 1 }}>
                        <input
                            type="number"
                            placeholder="0"
                            min="0"
                            value={problem.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            onBlur={() => handleBlur('price')}
                            style={inputStyle(errors.price)}
                        />
                    </Field>

                    <Field label="المدة (بالدقيقة)" required error={errors.duration} style={{ flex: 1 }}>
                        <input
                            type="number"
                            placeholder="0"
                            min="0"
                            value={problem.duration}
                            onChange={(e) => handleChange('duration', e.target.value)}
                            onBlur={() => handleBlur('duration')}
                            style={inputStyle(errors.duration)}
                        />
                    </Field>
                </div>
                {/* زرار إرسال تنبيه الموافقة للعميل */}
                <div
                    onClick={() => setProblem(prev => ({ ...prev, isCritical: !prev.isCritical }))}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `1.5px solid ${problem.isCritical ? '#FCD34D' : '#E5E7EB'}`,
                        background: problem.isCritical ? '#FFFBEB' : '#F6F7FB',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    {/* Toggle */}
                    <div style={{
                        width: '42px', height: '24px',
                        borderRadius: '999px',
                        background: problem.isCritical ? '#F59E0B' : '#D1D5DB',
                        position: 'relative',
                        transition: 'background 0.2s',
                        flexShrink: 0,
                    }}>
                        <div style={{
                            width: '18px', height: '18px',
                            borderRadius: '50%',
                            background: '#fff',
                            position: 'absolute',
                            top: '3px',
                            right: problem.isCritical ? '3px' : '21px',
                            transition: 'right 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }} />
                    </div>

                    <div>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: problem.isCritical ? '#92400E' : '#374151' }}>
                            {problem.isCritical ? '⚠️ سيتم إرسال تنبيه للعميل' : 'إرسال تنبيه موافقة للعميل'}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9CA3AF' }}>
                            العميل لازم يوافق على التكلفة عشان الخدمة تكمل
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button
                        onClick={handleAdd}
                        style={{
                            flex: 1, height: '46px', borderRadius: '12px',
                            border: 'none', background: '#2A5CAF',
                            color: '#fff', fontSize: '15px', fontWeight: '700',
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        إضافة المشكلة
                    </button>
                    <button
                        onClick={handleClose}
                        style={{
                            width: '100px', height: '46px', borderRadius: '12px',
                            border: '1.5px solid #FECACA', background: '#FFF5F5',
                            color: '#DC2626', fontSize: '14px', fontWeight: '600',
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, required, hint, error, children, style }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', ...style }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                {label}
                {required && <span style={{ color: '#EF4444', marginRight: '2px' }}>*</span>}
            </label>
            {hint && <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{hint}</span>}
        </div>
        {children}
        {error && (
            <small style={{ color: '#EF4444', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>⚠</span> {error}
            </small>
        )}
    </div>
);

const inputStyle = (hasError) => ({
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: `1.5px solid ${hasError ? '#FCA5A5' : '#E5E7EB'}`,
    background: hasError ? '#FFF5F5' : '#F6F7FB',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
    direction: 'rtl',
    transition: 'border-color 0.2s',
    boxShadow: hasError ? '0 0 0 3px rgba(239,68,68,0.08)' : 'none',
});

export default AddProblemModal;