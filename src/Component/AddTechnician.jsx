import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "../Utils/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SPECIALIZATIONS = [
    {
        group: "🛠️ الميكانيكا والقدرة",
        items: [
            { value: "engine", label: "ميكانيكا سيارات" },
            { value: "transmission", label: "عمرة محركات وفتيس" },
            { value: "brakes", label: "عفشة وفرامل" },
            { value: "suspension", label: "تعليق" },
            { value: "oil_leak", label: "تسريب الزيت" },
            { value: "oil_change", label: "تغيير زيوت وسوائل" },
        ],
    },
    {
        group: "⚡ الكهرباء والإلكترونيات",
        items: [
            { value: "electrical", label: "كهرباء السيارة" },
            { value: "starting", label: "فحص كمبيوتر وبرمجة" },
            { value: "battery", label: "أنظمة البطاريات والشحن" },
            { value: "ac", label: "تبريد وتكييف" },
            { value: "cooling", label: "تبريد المحرك" },
        ],
    },
    {
        group: " الهيكل والمظهر",
        items: [
            { value: "body_paint", label: "سمكرة ودهان" },
            { value: "glass_accessories", label: "زجاج وإكسسوارات" },
            { value: "cleaning", label: "تلميع ونظافة" },
        ],
    },
    {
        group: " الخدمات السريعة والإطارات",
        items: [
            { value: "tires", label: "ترصيص وضبط زوايا" },
            { value: "alignment_balancing", label: "ضبط الزوايا والتوازن" },
            { value: "exhaust", label: "العادم" },
            { value: "steering", label: "نظام التوجيه" },
        ],
    },
];

const technicianSchema = z.object({
    UserName: z
        .string()
        .min(2, "اسم المستخدم يجب ان يكون 6 أحرف على الاقل")
        .max(20, "اسم المستخدم يجب ان يكون اقل من 20 حرف")
        .regex(
            /^[\u0621-\u064A\sA-Za-z0-9]+$/,
            "اسم المستخدم يمكن أن يحتوي على أحرف عربية، لاتينية وأرقام فقط"
        ),
    Email: z.string().email("البريد الإلكتروني غير صحيح"),
    PhoneNumber: z
        .string()
        .regex(
            /^(010|011|012|015)\d{8}$/,
            "رقم الهاتف غير صحيح (يجب أن يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015)"
        )
        .length(11, "يرجى إدخال رقم هاتف مصري صحيح"),
    Password: z
        .string()
        .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
        .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).+$/,
            "كلمة المرور يجب أن تحتوي على حرف كبير، رقم، ورمز"
        )
        .optional()
        .or(z.literal("")),
    ExperienceYears: z
        .string()
        .regex(/^\d+$/, "سنوات الخبرة لازم تكون رقم صحيح")
        .optional()
        .or(z.literal("")),
});

const AddTechnician = ({ onClose, onAdded, technicianToEdit }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedSpecs, setSelectedSpecs] = useState([]);
    const [specsError, setSpecsError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(technicianSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (technicianToEdit) {
            reset({
                UserName: technicianToEdit.userName || technicianToEdit.UserName || "",
                Email: technicianToEdit.email || technicianToEdit.Email || "",
                PhoneNumber: technicianToEdit.phoneNumber || "",
                Password: "",
                ExperienceYears: technicianToEdit.experienceYears?.toString() || technicianToEdit.ExperienceYears?.toString() || "",
            });

            const specs = technicianToEdit.specialization || technicianToEdit.Specialization || "";
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedSpecs(specs ? specs.split(",").map((s) => s.trim()) : []);
        } else {
            reset({ UserName: "", Email: "", PhoneNumber: "", Password: "", ExperienceYears: "" });
            setSelectedSpecs([]);
        }
    }, [technicianToEdit, reset]);

    const toggleSpec = (value) => {
        setSelectedSpecs((prev) =>
            prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
        );
        setSpecsError("");
    };

    const onSubmit = async (data) => {
        if (selectedSpecs.length === 0) {
            setSpecsError("يجب اختيار تخصص واحد على الأقل");
            return;
        }

        try {
            const requestBody = {
                DisplayName: data.UserName,
                UserName: data.UserName,
                Email: data.Email,
                PhoneNumber: data.PhoneNumber,
                Specialization: selectedSpecs.join(","),
                ExperienceYears: Number(data.ExperienceYears) || 0,
            };

            if (!technicianToEdit) {
                requestBody.Password = data.Password;
                const res = await axios.post("/api/Technicians", requestBody);
                const newTech = {
                    ...res.data,
                    Specialization: requestBody.Specialization,
                    Rating: res.data.Rating || 0,
                    IsAvailable: true,
                };
                if (onAdded) onAdded(newTech);
                alert("تم إضافة الفني بنجاح!");
            } else {
                const res = await axios.put(`/api/Technicians/${technicianToEdit.id}`, requestBody);
                const updatedTech = {
                    ...technicianToEdit,
                    ...res.data,
                    Specialization: requestBody.Specialization,
                };
                if (onAdded) onAdded(updatedTech);
                alert("تم تعديل بيانات الفني بنجاح! ");
            }

            reset();
            setSelectedSpecs([]);
            onClose();
        } catch (err) {
            console.error("Full error:", err.response?.data || err.message);
            let message = "حدث خطأ أثناء العملية";
            const errData = err.response?.data;
            if (errData?.errorMessage) {
                if (errData.errorMessage.includes("Email")) message = "البريد الإلكتروني مستخدم بالفعل";
                else if (errData.errorMessage.includes("UserName")) message = "اسم المستخدم مستخدم بالفعل";
                else if (errData.errorMessage.includes("PhoneNumber")) message = "رقم الهاتف مستخدم بالفعل";
                else message = errData.errorMessage;
            }
            toast.error(message);
        }
    };

    return (
        <>
            <div
                className="modal"
                onClick={(e) => e.target === e.currentTarget && onClose()}
                style={{
                    position: "fixed", inset: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "20px", zIndex: 1050,
                }}
            >
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        maxWidth: "700px", width: "100%",
                        background: "#ffffff", borderRadius: "16px",
                        maxHeight: "90vh", overflowY: "auto", padding: "24px",
                    }}
                >
                    <h3 style={{ marginBottom: "25px", fontSize: "30px", fontWeight: 400 }}>
                        {technicianToEdit ? "تعديل الفني" : "إضافة فني جديد"}
                    </h3>

                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                            <label style={{ color: "#333D4D", fontWeight: "400", fontSize: "16px", marginBottom: "4px" }}>
                                اسم المستخدم
                            </label>
                            <input
                                {...register("UserName")}
                                placeholder="اكتب اسم الفني"
                                className={`form-control ${errors.UserName ? "is-invalid" : ""}`}
                                disabled={isSubmitting}
                            />
                            {errors.UserName && <div className="text-danger">{errors.UserName.message}</div>}
                        </div>

                        <div>
                            <label style={{ color: "#333D4D", fontWeight: "400", fontSize: "16px", marginBottom: "4px" }}>
                                البريد الإلكتروني
                            </label>
                            <input
                                {...register("Email")}
                                type="email"
                                placeholder="example@domain.com"
                                className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                                disabled={isSubmitting}
                            />
                            {errors.Email && <div className="text-danger">{errors.Email.message}</div>}
                        </div>

                        <div>
                            <label style={{ color: "#333D4D", fontWeight: "400", fontSize: "16px", marginBottom: "4px" }}>
                                رقم الهاتف
                            </label>
                            <input
                                {...register("PhoneNumber")}
                                type="text"
                                placeholder="مثال: 01012345678"
                                maxLength={11}
                                className={`form-control ${errors.PhoneNumber ? "is-invalid" : ""}`}
                                disabled={isSubmitting}
                            />
                            {errors.PhoneNumber && <small className="text-danger">{errors.PhoneNumber.message}</small>}
                        </div>

                        {!technicianToEdit && (
                            <div>
                                <label style={{ color: "#333D4D", fontWeight: "400", fontSize: "16px", marginBottom: "4px" }}>
                                    كلمة المرور المؤقتة
                                </label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        {...register("Password")}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="كلمة المرور (8 أحرف على الأقل، تحتوي على حرف كبير، رقم، ورمز)"
                                        className={`form-control ${errors.Password ? "is-invalid" : ""}`}
                                        style={{ paddingLeft: "40px" }}
                                        disabled={isSubmitting}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", cursor: "pointer", fontSize: "18px", userSelect: "none" }}
                                    >
                                        {showPassword ? "🔏" : "👀"}
                                    </span>
                                </div>
                                {errors.Password && <div className="text-danger">{errors.Password.message}</div>}
                            </div>
                        )}

                        <div>
                            <label style={{ color: "#333D4D", fontWeight: "400", fontSize: "16px", marginBottom: "8px", display: "block" }}>
                                التخصصات
                            </label>

                            {selectedSpecs.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                                    {selectedSpecs.map((spec) => {
                                        const label = SPECIALIZATIONS.flatMap((g) => g.items).find((i) => i.value === spec)?.label || spec;
                                        return (
                                            <span
                                                key={spec}
                                                style={{
                                                    background: "#e8f0fe", color: "#1a56db",
                                                    borderRadius: "20px", padding: "4px 12px",
                                                    fontSize: "13px", display: "flex", alignItems: "center", gap: "6px",
                                                }}
                                            >
                                                {label}
                                                <span
                                                    onClick={() => toggleSpec(spec)}
                                                    style={{ cursor: "pointer", fontWeight: "bold", fontSize: "15px", lineHeight: 1 }}
                                                >×</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            <div style={{
                                border: specsError ? "1px solid #dc3545" : "1px solid #dee2e6",
                                borderRadius: "8px", padding: "12px", background: "#fafafa",
                            }}>
                                {SPECIALIZATIONS.map((group) => (
                                    <div key={group.group} style={{ marginBottom: "12px" }}>
                                        <div style={{ fontSize: "13px", color: "#6c757d", fontWeight: "500", marginBottom: "8px" }}>
                                            {group.group}
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                            {group.items.map((item) => {
                                                const isSelected = selectedSpecs.includes(item.value);
                                                return (
                                                    <label
                                                        key={item.value}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: "6px",
                                                            cursor: "pointer", padding: "6px 12px",
                                                            borderRadius: "20px", fontSize: "13px",
                                                            border: isSelected ? "1.5px solid #1a56db" : "1.5px solid #dee2e6",
                                                            background: isSelected ? "#e8f0fe" : "#fff",
                                                            color: isSelected ? "#1a56db" : "#333",
                                                            transition: "all 0.15s",
                                                            userSelect: "none",
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleSpec(item.value)}
                                                            disabled={isSubmitting}
                                                            style={{ display: "none" }}
                                                        />
                                                        {isSelected && <span style={{ fontSize: "12px" }}>✓</span>}
                                                        {item.label}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {specsError && <div className="text-danger mt-1" style={{ fontSize: "14px" }}>{specsError}</div>}
                        </div>

                        <div>
                            <label style={{ color: "#333D4D", fontWeight: "400", fontSize: "16px", marginBottom: "4px" }}>
                                سنوات الخبرة
                            </label>
                            <input
                                {...register("ExperienceYears")}
                                type="number"
                                min="0"
                                placeholder="مثال: 5"
                                className={`form-control ${errors.ExperienceYears ? "is-invalid" : ""}`}
                                disabled={isSubmitting}
                            />
                            {errors.ExperienceYears && <div className="text-danger">{errors.ExperienceYears.message}</div>}
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: "550px", height: "50px" }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "⏳ جاري التنفيذ..." : technicianToEdit ? "حفظ التعديل" : "+ إضافة الفني"}
                            </button>
                            <button
                                type="button"
                                className="btn"
                                onClick={onClose}
                                disabled={isSubmitting}
                                style={{ width: "100px", border: "2px solid red", color: "#ff0707", backgroundColor: "white" }}
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={4000} rtl={true} />
        </>
    );
};
export default AddTechnician;