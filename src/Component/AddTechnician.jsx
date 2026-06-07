import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "../Utils/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        ).length(11, "يرجى إدخال رقم هاتف مصري صحيح"),
    Password: z
        .string()
        .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
        .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).+$/,
            "كلمة المرور يجب أن تحتوي على حرف كبير، رقم، ورمز",
        )
        .optional()
        .or(z.literal("")),
    Specialization: z.string().min(1, "يجب اختيار التخصص"),
    ExperienceYears: z
        .string()
        .regex(/^\d+$/, "سنوات الخبرة لازم تكون رقم صحيح")
        .optional()
        .or(z.literal("")),
});

const AddTechnician = ({ onClose, onAdded, technicianToEdit }) => {
    const [showPassword, setShowPassword] = useState(false);

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
                PhoneNumber: technicianToEdit.phoneNumber
                    ? technicianToEdit.phoneNumber
                    : "",
                Specialization: technicianToEdit.specialization || technicianToEdit.Specialization || "",
                Password: "",
                ExperienceYears: "",
            });
        } else {
            reset({
                UserName: "",
                Email: "",
                PhoneNumber: "",
                Specialization: "",
                Password: "",
                ExperienceYears: technicianToEdit?.experienceYears?.toString() || "",
            });
        }
    }, [technicianToEdit, reset]);

    const onSubmit = async (data) => {
        try {
            const requestBody = {
                DisplayName: data.UserName,
                UserName: data.UserName,
                Email: data.Email,
                PhoneNumber: data.PhoneNumber,
                Specialization: data.Specialization,
                ExperienceYears: Number(data.ExperienceYears) || 0
            };
            console.log("request body:", requestBody);

            if (!technicianToEdit) {
                requestBody.Password = data.Password;
                const res = await axios.post("/api/Technicians", requestBody);

                const newTech = {
                    ...res.data,
                    Specialization: data.Specialization,
                    Rating: res.data.Rating || 0,
                    IsAvailable: true
                };
                if (onAdded) onAdded(newTech);

                alert("تم إضافة الفني بنجاح!");
            } else {
                const res = await axios.put(
                    `/api/Technicians/${technicianToEdit.id}`,
                    requestBody
                );

                const updatedTech = {
                    ...technicianToEdit,
                    ...res.data,
                    Specialization: data.Specialization
                };

                if (onAdded) onAdded(updatedTech);
                alert("تم تعديل بيانات الفني بنجاح!✅");
            }
            reset();
            onClose();
        } catch (err) {
            console.error(" Full error:", err.response?.data || err.message);
            let message = "حدث خطأ أثناء العملية";
            const errData = err.response?.data;

            if (errData?.errorMessage) {
                if (errData.errorMessage.includes("Email"))
                    message = " البريد الإلكتروني مستخدم بالفعل";
                else if (errData.errorMessage.includes("UserName"))
                    message = " اسم المستخدم مستخدم بالفعل";
                else if (errData.errorMessage.includes("PhoneNumber"))
                    message = " رقم الهاتف مستخدم بالفعل";
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
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    zIndex: 1050,
                }}
            >
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        maxWidth: "700px",
                        width: "100%",
                        background: "#ffffff",
                        borderRadius: "16px",
                        maxHeight: "90vh",
                        height: "100%",
                        overflowY: "auto",
                        padding: "24px",
                    }}
                >
                    <h3
                        style={{ marginBottom: "25px", fontSize: "30px", fontWeight: 400 }}
                    >
                        {technicianToEdit ? "تعديل الفني" : "إضافة فني جديد"}
                    </h3>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                    >
                        <div>
                            <label
                                htmlFor="UserName"
                                style={{
                                    color: "#333D4D",
                                    fontWeight: "400",
                                    fontSize: "16px",
                                    marginBottom: "4px",
                                }}
                            >
                                اسم المستخدم
                            </label>
                            <input
                                id="UserName"
                                {...register("UserName")}
                                placeholder="اكتب اسم الفني"
                                className={`form-control ${errors.UserName ? "is-invalid" : ""}`}
                                disabled={isSubmitting}
                            />
                            {errors.UserName && (
                                <div className="text-danger">{errors.UserName.message}</div>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="Email"
                                style={{
                                    color: "#333D4D",
                                    fontWeight: "400",
                                    fontSize: "16px",
                                    marginBottom: "4px",
                                }}
                            >
                                البريد الإلكتروني
                            </label>
                            <input
                                id="Email"
                                {...register("Email")}
                                type="email"
                                placeholder="example@domain.com"
                                className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                                disabled={isSubmitting}
                            />
                            {errors.Email && (
                                <div className="text-danger">{errors.Email.message}</div>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="PhoneNumber"
                                style={{
                                    color: "#333D4D",
                                    fontWeight: "400",
                                    fontSize: "16px",
                                    marginBottom: "4px",
                                }}
                            >
                                رقم الهاتف
                            </label>
                            <div style={{ position: "relative" }}>
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "16px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#666",
                                        fontWeight: "500",
                                        zIndex: 1,
                                    }}
                                >
                                </span>
                                <input
                                    id="PhoneNumber"
                                    {...register("PhoneNumber")}
                                    type="text"
                                    placeholder="مثال: 01012345678"
                                    maxLength={11}
                                    className={`form-control ${errors.PhoneNumber ? "is-invalid" : ""}`}
                                    style={{ paddingRight: "16px" }}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.PhoneNumber && (
                                <small className="text-danger">{errors.PhoneNumber.message}</small>
                            )}
                        </div>

                        {!technicianToEdit && (
                            <div>
                                <label
                                    htmlFor="Password"
                                    style={{
                                        color: "#333D4D",
                                        fontWeight: "400",
                                        fontSize: "16px",
                                        marginBottom: "4px",
                                    }}
                                >
                                    كلمة المرور المؤقتة
                                </label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        id="Password"
                                        {...register("Password")}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="كلمة المرور (8 أحرف على الأقل، تحتوي على حرف كبير، رقم، ورمز)" className={`form-control ${errors.Password ? "is-invalid" : ""}`}
                                        style={{ paddingLeft: "40px" }}
                                        disabled={isSubmitting}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "10px",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            fontSize: "18px",
                                            userSelect: "none",
                                        }}
                                    >
                                        {showPassword ? "🔏" : "👀"}
                                    </span>
                                </div>
                                {errors.Password && (
                                    <div className="text-danger">{errors.Password.message}</div>
                                )}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="specialization"
                                style={{
                                    color: "#333D4D",
                                    fontWeight: "400",
                                    fontSize: "16px",
                                    marginBottom: "4px",
                                }}
                            >
                                التخصص
                            </label>
                            <select
                                id="Specialization"
                                {...register("Specialization")}
                                className={`form-control ${errors.Specialization ? "is-invalid" : ""}`}
                                disabled={isSubmitting}
                                style={{
                                    color: "#9A9A9A",
                                    appearance: "auto",
                                    WebkitAppearance: "auto",
                                    MozAppearance: "auto",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="">-- اختر التخصص من القائمة --</option>
                                <optgroup label="🛠️ الميكانيكا والقدرة">
                                    <option value="فحص">فحص</option>
                                    <option value="ميكانيكا سيارات">ميكانيكا سيارات </option>
                                    <option value="صيانة محركات وناقل الحركة">عمرة محركات وفتيس</option>
                                    <option value="صيانة فرامل وعفشة">عفشة وفرامل</option>
                                    <option value="صيانة عامة">صيانة عامة</option>
                                    <option value="تسريب الزيت">تسريب الزيت</option>
                                </optgroup>

                                <optgroup label="⚡ الكهرباء والإلكترونيات">
                                    <option value="كهرباء السيارة">كهرباء السيارة</option>
                                    <option value=" صيانة كمبيوتر وبرمجة">فحص كمبيوتر وبرمجة </option>
                                    <option value="صيانة البطاريات">أنظمة البطاريات والشحن</option>
                                    <option value="تكييف سيارات">تبريد وتكييف </option>
                                </optgroup>

                                <optgroup label="🎨 الهيكل والمظهر">
                                    <option value="دهان وسمكرة">سمكرة ودهان</option>
                                    <option value="تركيب زجاج أو إكسسوارات">زجاج وإكسسوارات</option>
                                    <option value="تنظيف وتلميع">تلميع ونظافة</option>
                                </optgroup>

                                <optgroup label="🛞 الخدمات السريعة والإطارات">
                                    <option value="صيانة إطارات وتوازن">ترصيص وضبط زوايا</option>
                                    <option value="صيانة البطاريات">فحص وتغيير البطاريات</option>
                                    <option value="زيوت وفلاتر">تغيير زيوت وسوائل</option>
                                    <option value=" زجاج وإكسسوارات">تركيب زجاج وإكسسوارات</option>
                                </optgroup>
                            </select>
                            {errors.Specialization && (
                                <div className="text-danger">
                                    {errors.Specialization.message}
                                </div>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="ExperienceYears"
                                style={{
                                    color: "#333D4D",
                                    fontWeight: "400",
                                    fontSize: "16px",
                                    marginBottom: "4px",
                                }}
                            >
                                سنوات الخبرة
                            </label>

                            <input
                                id="ExperienceYears"
                                {...register("ExperienceYears")}
                                type="number"
                                min="0"
                                placeholder="مثال: 5"
                                className={`form-control ${errors.ExperienceYears ? "is-invalid" : ""}`}
                                disabled={isSubmitting}
                            />

                            {errors.ExperienceYears && (
                                <div className="text-danger">
                                    {errors.ExperienceYears.message}
                                </div>
                            )}
                        </div>


                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "8px",
                                marginTop: "8px",
                            }}
                        >
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: "550px", height: "50px" }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "⏳ جاري التنفيذ..."
                                    : technicianToEdit
                                        ? " حفظ التعديل ؟"
                                        : "+ إضافة الفني"}
                            </button>
                            <button
                                style={{
                                    width: "100px",
                                    border: "2px solid red",
                                    color: "#ff0707",
                                    backgroundColor: "white",
                                }}
                                type="button"
                                className="btn"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

export default AddTechnician;
