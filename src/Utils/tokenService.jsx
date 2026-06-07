import axios from "axios";

let refreshTimeout;

export async function scheduleTokenRefresh() {
    const expiry = localStorage.getItem("tokenExpiry");
    if (!expiry) return;

    // ✅ parse صح — الـ API بيبعت UTC دايمًا
    const expiryTime = new Date(expiry).getTime();
    const now = Date.now();

    // قبل الانتهاء بدقيقة
    const delay = expiryTime - now - 60 * 1000;

    if (refreshTimeout) clearTimeout(refreshTimeout);

    // ✅ لو الـ token قرب ينتهي أو انتهى فعلاً → refresh فوري
    if (delay <= 0) {
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

        console.log("tokens exist:", !!token, !!refreshToken);

        if (!token || !refreshToken) {
            console.log("❌ No tokens found, logging out");
            logout();
            return;
        }

        const res = await axios.post(
            "https://carmaintenance.runasp.net/api/Account/refresh-token",
            { token, refreshToken }
        );

        console.log("✅ Refresh response:", res.data);

        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("tokenExpiry", res.data.tokenExpiry);

        scheduleTokenRefresh();

    } catch (err) {
        console.error("❌ Token refresh failed:", err.response?.status, err.response?.data, err.message);
        logout();
    }
}
function logout() {
    console.log("🚨 LOGOUT TRIGGERED FROM: logout function");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
    window.location.href = "/login";
}