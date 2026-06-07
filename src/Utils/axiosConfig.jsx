import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://carmaintenance.runasp.net",
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

const AUTH_ENDPOINTS = [
  "Login", "Register", "refresh-token",
  "forgot-password", "reset-password", "google-login",
];

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !error.response ||
      error.response.status !== 401 ||
      AUTH_ENDPOINTS.some((ep) => originalRequest.url?.includes(ep)) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    if (!refreshToken || !accessToken) {
      console.log("🚨 LOGOUT TRIGGERED FROM: interceptor missing token");

      clearAuthData();
      window.location.href = "/login";
    }

    try {
      //  axios العادي مش axiosInstance عشان نتجنب الـ loop
      const res = await axios.post(
        `${axiosInstance.defaults.baseURL}/api/Account/refresh-token`,
        { token: accessToken, refreshToken }
      );

      const {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        tokenExpiry
      } = res.data;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("tokenExpiry", tokenExpiry);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);

    } catch (refreshError) {
      console.error("❌ Interceptor refresh failed:", refreshError.response?.status, refreshError.response?.data);
      processQueue(refreshError, null);
      clearAuthData();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

function clearAuthData() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("user");
}

export default axiosInstance;