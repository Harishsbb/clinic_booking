import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the auth token if available
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// doctors
export const getDoctors = (params) => API.get("/doctors", { params });
export const createDoctor = (data) => API.post("/doctors", data);
export const updateDoctor = (id, data) => API.put(`/doctors/${id}`, data);
export const deleteDoctor = (id) => API.delete(`/doctors/${id}`);

// booking
export const createBooking = (data) => API.post("/appointments", data);
export const getUserAppointments = (userId) => API.get(`/appointments?userId=${userId}`);
export const getAllAppointments = () => API.get("/appointments");
export const deleteAppointment = (id) => API.delete(`/appointments/${id}`);
export const updateAppointment = (id, data) => API.put(`/appointments/${id}`, data);

// payment
export const makePayment = (data) => API.post("/payment/order", data);
export const verifyPayment = (data) => API.post("/payment/verify", data);

// Hospitals
export const getHospitals = () => API.get('/hospitals');
export const getHospitalById = (id) => API.get(`/hospitals/${id}`);

export default API;
