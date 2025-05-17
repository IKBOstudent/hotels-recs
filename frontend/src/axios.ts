import axios from 'axios';
import { auth } from '~/firebaseConfig';

const axiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_DEV_SERVER,
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await auth.currentUser?.getIdToken(true);

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default axiosInstance;
