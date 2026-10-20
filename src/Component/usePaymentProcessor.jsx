import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "../Utils/axiosConfig";

/**
 * Hook قابل لإعادة الاستخدام لإدارة عملية الدفع (نقدي أو بطاقة).
 * يصلح لأي نوع عملية: حجز، اشتراك، أو أي payment flow تاني —
 * المطلوب بس تمرير referenceId (bookingId أو subscriptionId ... إلخ).
 *
 * الاستخدام:
 * const { loading, iFrameUrl, processPayment, closePaymentModal } = usePaymentProcessor({
 *     onCashSuccess: (id) => { ... },
 *     onCardReady: (url, id) => { ... }, // اختياري
 * });
 *
 * await processPayment({ referenceId: bookingId, paymentMethod: "Cash" | "Card" });
 */
export default function usePaymentProcessor({
    initiateEndpoint = "/api/Payments/initiate",
    referenceKey = "bookingId", // اسم المفتاح المتوقع في الـ backend (بعض الـ APIs ممكن تسميه subscriptionId مثلاً)
    onCashSuccess,
    onCardReady,
    onError,
} = {}) {
    const [loading, setLoading] = useState(false);
    const [iFrameUrl, setIFrameUrl] = useState(null);

    const processPayment = useCallback(
        async ({ referenceId, paymentMethod, extraPayload = {} }) => {
            if (!referenceId) {
                toast.error("لم يتم تحديد العملية المطلوب دفعها");
                return;
            }

            const isCard = paymentMethod === "Card";
            let toastId;

            try {
                setLoading(true);
                toastId = toast.loading(
                    isCard ? "جاري تجهيز الدفع..." : "جاري تسجيل الحجز..."
                );

                // مهم: بنبعت الـ request للباك اند في الحالتين (كاش وكارد)
                // عشان السيرفر يسجل paymentMethod و يحدّث paymentStatus بشكل صحيح
                const res = await axios.post(initiateEndpoint, {
                    [referenceKey]: Number(referenceId),
                    paymentMethod: isCard ? "CreditCard" : "Cash",
                    ...extraPayload,
                });

                toast.dismiss(toastId);

                const url = res.data?.iFrameUrl;

                if (isCard && url) {
                    // الكارد: فيه iFrameUrl لازم نفتحه
                    toast.success("تم تجهيز صفحة الدفع");
                    setIFrameUrl(url);
                    onCardReady?.(url, referenceId);
                } else {
                    // الكاش: السيرفر سجل الحجز وحدّث الحالة، مفيش iframe مطلوب
                    onCashSuccess?.(referenceId);
                }
            } catch (err) {
                if (toastId) toast.dismiss(toastId);
                const message =
                    err.response?.data?.errorMessage || "حدث خطأ أثناء تجهيز الدفع";
                toast.error(message);
                onError?.(err);
            } finally {
                setLoading(false);
            }
        },
        [initiateEndpoint, referenceKey, onCashSuccess, onCardReady, onError]
    );

    const closePaymentModal = useCallback(() => {
        setIFrameUrl(null);
    }, []);

    return {
        loading,
        iFrameUrl,
        processPayment,
        closePaymentModal,
    };
}