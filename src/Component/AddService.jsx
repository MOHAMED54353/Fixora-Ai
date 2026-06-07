import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "../Utils/axiosConfig";
import { toast } from "react-toastify";

const serviceSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    price: z.coerce.number().positive(),
    duration: z.coerce.number().positive(),
    category: z.string().min(1),
    specialization: z.string().min(1),
});

const AddService = ({ onClose, onServiceAdded, serviceToEdit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(serviceSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (serviceToEdit) {
            reset({
                name:           serviceToEdit.Name || serviceToEdit.name,
                category:       serviceToEdit.Category || serviceToEdit.category,
                description:    serviceToEdit.Description || serviceToEdit.description,
                price:          serviceToEdit.BasePrice || serviceToEdit.basePrice,
                duration:       serviceToEdit.EstimatedDurationMinutes || serviceToEdit.estimatedDurationMinutes,
                specialization: serviceToEdit.Specialization || serviceToEdit.specialization,
            });
        }
    }, [serviceToEdit, reset]);

    const onSubmit = async (data) => {
        try {
            const requestBody = {
                Name: data.name,
                Category: data.category,
                Description: data.description,
                BasePrice: data.price,
                EstimatedDurationMinutes: data.duration,
                Specialization: data.specialization,
            };

            if (serviceToEdit) {
                await axios.put(`/api/Services/${serviceToEdit.id}`, requestBody);
                toast.success("تم تعديل الخدمة بنجاح ");
            } else {
                await axios.post("/api/Services", requestBody);
                toast.success("تم إضافة الخدمة بنجاح ");
            }

            onServiceAdded();
            reset();
            onClose();
        } catch (err) {
            console.error(err.response?.data || err);
            toast.error("حدث خطأ أثناء حفظ الخدمة ❌");
        }
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1050 }}
            onClick={onClose}
        >
            <div
                className="bg-white p-4"
                style={{
                    width: "750px",
                    borderRadius: "16px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="mb-4">
                    {serviceToEdit ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">اسم الخدمة</label>
                        <input
                            {...register("name")}
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            placeholder="مثال : تغيير زيت المحرك"
                        />
                        {errors.name && (
                            <div className="text-danger">{errors.name.message}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">الفئة</label>
                        <select
                            {...register("category")}
                            className={`form-control ${errors.category ? "is-invalid" : ""}`}
                            placeholder="اختر الفئة"
                            style={{
                                color: "#9A9A9A",
                                appearance: "auto",
                                WebkitAppearance: "auto",
                                MozAppearance: "auto",
                                cursor: "pointer",
                            }}
                        >
                            <option value="">اختر الفئة</option>
                            <option value="فحص">فحص</option>
                            <option value="إصلاح">إصلاح</option>
                            <option value="صيانة دورية">صيانة دورية</option>
                            <option value="تنظيف">تنظيف</option>
                            <option value="electrical">كهرباء</option>
                            <option value="suspension">نظام التعليق (Suspension)</option>
                        </select>
                        {errors.category && (
                            <div className="text-danger">{errors.category.message}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">الوصف</label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            placeholder="اكتب وصف الخدمة..."
                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                            style={{ height: "80px" }}
                        />
                        {errors.description && (
                            <div className="text-danger">{errors.description.message}</div>
                        )}
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">السعر</label>
                            <input
                                type="number"
                                placeholder="0"
                                {...register("price")}
                                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                            />
                            {errors.price && (
                                <div className="text-danger">{errors.price.message}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">المدة (دقيقة)</label>
                            <input
                                type="number"
                                placeholder="0"
                                {...register("duration")}
                                className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                            />
                            {errors.duration && (
                                <div className="text-danger">{errors.duration.message}</div>
                            )}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">التخصص</label>
                        <select
                            {...register("specialization")}
                            className={`form-control ${errors.specialization ? "is-invalid" : ""}`}
                            style={{
                                color: "#9A9A9A",
                                appearance: "auto",
                                WebkitAppearance: "auto",
                                MozAppearance: "auto",
                                cursor: "pointer",
                            }}
                        >
                            <option value="">اختر التخصص</option>
                            <option value="ميكانيكا">ميكانيكا</option>
                            <option value="كهرباء">كهرباء</option>
                            <option value="سمكرة">سمكرة</option>
                            <option value="عفشة">عفشة</option>
                            <option value="نظافة">نظافة</option>
                        </select>
                        {errors.specialization && (
                            <div className="text-danger">{errors.specialization.message}</div>
                        )}
                    </div>
                    <div className="d-flex justify-content-center gap-3">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: "550px", height: "50px", fontWeight: "bold" }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "⏳ جاري التنفيذ..."
                                : serviceToEdit
                                    ? "تعديل الخدمة"
                                    : "إضافة الخدمة"}
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={onClose}
                            disabled={isSubmitting}
                            style={{
                                width: "150px",
                                height: "50px",
                                fontWeight: "bold",
                                border: "2px solid red",
                                color: "red",
                            }}
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AddService;
