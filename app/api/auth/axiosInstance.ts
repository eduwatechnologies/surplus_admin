import axios from "axios";



const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  try {
    if (!config.headers) config.headers = {} as any;
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log(`[REQUEST] ${config.method?.toUpperCase()} ${config.url}`, config);
  } catch (error) {
    console.error("[REQUEST ERROR]", error);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `[RESPONSE] ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error.message;

    if (status === 401) {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          document.cookie = "admin_token=; Max-Age=0; path=/; SameSite=Lax";
        } catch {}
        window.location.href = "/login";
      }
    }

    console.error("[RESPONSE ERROR]", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
