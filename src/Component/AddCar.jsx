import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../Utils/axiosConfig.jsx";
import { useState } from "react";
import { ToastContainer } from "react-toastify";


const carSchema = z.object({
  brand: z.string().min(1, { message: "اختر ماركة السيارة" }),
  model: z.string().min(1, { message: "اختر الموديل" }),
  year: z
    .string()
    .min(1, { message: "اختر سنة الصنع" })
    .refine(
      (val) => {
        const year = parseInt(val);
        const currentYear = new Date().getFullYear();
        return year >= 1990 && year <= currentYear;
      },
      { message: "السنة يجب أن تكون بين 1990 والسنة الحالية" }
    ),
  plate: z
    .string()
    .min(1, { message: "رقم اللوحة مطلوب" })
    .refine((val) => val.replace(/\s+/g, "").length >= 3 && val.replace(/\s+/g, "").length <= 8, {
      message: "رقم اللوحة يجب أن يحتوي على 3 أحرف و 3:4 أرقام",
    })
    .refine((val) => !/[a-zA-Z]/.test(val), {
      message: "استخدم الأحرف العربية فقط",
    })
    .refine(
      (val) => {
        const clean = val.replace(/\s+/g, "");
        return /^[\u0621-\u064A]{3}\d{1,4}$/.test(clean);
      },
      { message: "الصيغة الصحيحة: 3 أحرف عربية + أرقام (مثال: ا ب ج 1368)" }
    ),
});

const AddCar = ({ show, onClose, onCarAdded }) => {
  const [selectedBrand, setSelectedBrand] = useState("");

  const currentYear = new Date().getFullYear();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(carSchema),
    mode: "onChange",
    defaultValues: {
      brand: "",
      model: "",
      year: "",
      plate: "",
    },
  });

  const handlePlateChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\s+/g, "");
    value = value.replace(/[^\u0621-\u064A0-9]/g, "");
    const formatted = value.split("").join(" ");
    setValue("plate", formatted, { shouldValidate: true });
  };

  if (!show) return null;

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      const requestBody = {
        Brand: data.brand,
        Model: data.model,
        Year: parseInt(data.year),
        PlateNumber: data.plate,
      };

      const res = await axios.post(
        "/api/Vehicles",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(" تم إضافة السيارة بنجاح", {
        position: "top-center",
        autoClose: 2000,
      });

      if (onCarAdded) onCarAdded(res.data);

      reset();
      onClose();
    } catch (error) {
      console.error(" Error:", error.response || error);

      const apiMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "فشل الإضافة";

      toast.error(`❌ ${apiMessage}`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const years = [];
  for (let year = currentYear; year >= 1990; year--) years.push(year);

  const handleClose = () => {
    reset();
    onClose();
  };

  const carBrands = {
    Hyundai: ["Elantra", "Accent", "Verna", "Tucson", "Kona", "Santa Fe"],
    Toyota: ["Corolla", "Yaris", "Camry", "Hilux", "RAV4"],
    Nissan: ["Sunny", "Sentra", "Qashqai", "Juke", "X-Trail", "Altima"],
    Skoda: ["Octavia", "Superb", "Kodiaq", "felshia"],
    Kia: ["Cerato", "Sportage", "Picanto", "Seltos", "Rio", "sul"],
    BYD: ["F3", "L3", "Atto3"],
    Chery: ["Tiggo2", "Tiggo3", "Arrizo5"],
    Geely: ["Emgrand7", "GX3Pro", "Coolray"],
    MG: ["MG5", "ZS", "RX5", "Hector"],
    Volkswagen: ["Jetta", "Passat", "Tiguan", "Polo", "Golf"],
    Opel: ["Astra", "Corsa", "Mokka"],
    Renault: ["Logan", "Sandero", "Duster", "Koleos"],
    Fiat: ["Tipo", "Punto", "500", "28"],
    Peugeot: ["301", "508", "3008", "2008", "5008"],
    Chevrolet: ["Captiva", "Aveo", "Spark"],
  };


  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="bg-white"
        style={{
          width: "1000px",
          maxWidth: "95%",
          borderRadius: "16px",
          padding: "40px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h4
          className="text-center mb-2"
          style={{ color: "#333D4D", fontSize: "36px", fontWeight: "400" }}
        >
          إضافة سيارة جديدة
        </h4>
        <p
          className="text-center mb-4"
          style={{ fontSize: "20px", fontWeight: "400", color: "#666" }}
        >
          أضف معلومات سيارتك لتتمكن من حجز الخدمات
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* BRAND */}
          <div className="mb-3">
            <label className="form-label" style={{ color: "#333D4D" }}>
              ماركة السيارة
            </label>
            <select
              {...register("brand")}
              className={`form-select pe-2 ${errors.brand ? "is-invalid" : ""}`}
              style={{
                backgroundColor: "#F6F7FB",
                backgroundPosition: "left 1rem center",
                color: "#A9A9A9",
                height: "44px",
              }}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setValue("brand", e.target.value);
                setValue("model", "");
              }}
            >
              <option value="">اختر الماركة</option>
              {Object.keys(carBrands).map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            {errors.brand && (
              <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                {errors.brand.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: "#333D4D" }}>
              الموديل
            </label>
            <select
              {...register("model")}
              className={`form-select pe-2 ${errors.model ? "is-invalid" : ""}`}
              style={{
                backgroundColor: "#F6F7FB",
                backgroundPosition: "left 1rem center",
                color: "#A9A9A9",
                height: "44px",
              }}
              disabled={!selectedBrand}
            >
              <option value="">اختر الموديل</option>
              {selectedBrand &&
                carBrands[selectedBrand].map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
            </select>
            {errors.model && (
              <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                {errors.model.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: "#333D4D" }}>
              سنة الصنع
            </label>
            <select
              {...register("year")}
              className={`form-select pe-2 ${errors.year ? "is-invalid" : ""}`}
              style={{
                backgroundColor: "#F6F7FB",
                backgroundPosition: "left 1rem center",
                color: "#A9A9A9",
                height: "44px",
              }}
            >
              <option value="">اختر السنة</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.year && (
              <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                {errors.year.message}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ color: "#333D4D" }}>
              رقم اللوحة
            </label>
            <input
              type="text"
              {...register("plate")}
              onChange={handlePlateChange}
              className={`form-control ps-2 ${errors.plate ? "is-invalid" : ""}`}
              placeholder="مثال: أ ب ج 1234"
              maxLength="13"
              style={{
                backgroundColor: "#F6F7FB",
                height: "44px",
              }}
            />
            {errors.plate && (
              <div className="text-danger mt-1 " style={{ fontSize: "12px" }}>
                {errors.plate.message}
              </div>
            )}
            {!errors.plate && (
              <div className="text-success mt-1" style={{ fontSize: "12px" }}>
                صيغة صحيحة: 3 أحرف عربية + 4:3 أرقام
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between gap-2">
            <button
              type="button"
              className="btn btn-outline-danger px-4"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn btn-primary px-5"
              disabled={isSubmitting}
              style={{
                backgroundColor: "#2A5CAF",
                borderColor: "#2A5CAF",
              }}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  جارٍ الإضافة...
                </>
              ) : (
                "إضافة السيارة"
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AddCar;
