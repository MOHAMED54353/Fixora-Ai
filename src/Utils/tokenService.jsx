import axios from "axios";

let refreshTimeout;

export async function scheduleTokenRefresh() {
    const expiry = localStorage.getItem("tokenExpiry");
    if (!expiry) return;

    const expiryTime = new Date(expiry).getTime();
    const now = Date.now();
    // دلوقتي - بيعمل refresh قبل الانتهاء بـ 5 دقايق
    const delay = expiryTime - now - 5 * 60 * 1000;

    if (refreshTimeout) clearTimeout(refreshTimeout);

    // 🔍 دي السطور اللي هتقولك السبب - شيلها بعد ما تحل المشكلة
    console.log("RAW tokenExpiry:", expiry);
    console.log("Parsed expiry:", new Date(expiry).toLocaleString());
    console.log("Delay in minutes:", Math.round(delay / 1000 / 60));

    if (delay <= 0) {
        // لو الـ token انتهى فعلاً مش بس قرب ينتهي
        if (expiryTime < now) {
            console.log("⚠️ Token already expired, trying refresh...");
        }
        await doRefresh();
        return;
    }

    console.log(`🔄 Token refresh scheduled in ${Math.round(delay / 1000 / 60)} minutes`);
    refreshTimeout = setTimeout(async () => {
        await doRefresh();
    }, delay);
}

async function doRefresh() {
    console.log("🔄 doRefresh started...");
    try {
        const token = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!token || !refreshToken) {
            console.log("❌ No tokens found, logging out");
            logout();
            return;
        }

        const res = await axios.post(
            "http://carmaintenancefixora.runasp.net/api/Account/refresh-token",
            { token, refreshToken }
        );

        console.log("✅ Refresh success");

        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("tokenExpiry", res.data.tokenExpiry);

        scheduleTokenRefresh();

    } catch (err) {
        const status = err.response?.status;
        console.error("❌ Refresh failed - status:", status);

        if (status === 401 || status === 400) {
            // السيرفر رفض الـ token → يعني انتهت صلاحيته فعلاً
            console.log("🚨 Refresh token invalid → logout");
            logout();
        } else {
            // مشكلة network أو server مؤقتة → متعملش logout، جرب بعد 30 ثانية
            console.warn("⚠️ Network/server error, retrying in 30s...");
            setTimeout(doRefresh, 5 * 60 * 1000);
        }
    }
}

function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
    window.location.href = "/login";
}