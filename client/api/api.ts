import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000/api",
});

// Add an interceptor to attach the token to every request
api.interceptors.request.use((config) => {
    const raw = localStorage.getItem("mega-practicum-auth-token");
    if (raw) {
        const session = JSON.parse(raw);
        const token = session?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
    (response) => response, // pass through successful responses
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("User Logged Out");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);
