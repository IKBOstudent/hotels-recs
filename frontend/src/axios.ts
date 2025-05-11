import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_DEV_SERVER,
    timeout: 10000,
    headers: { 'X-Custom-Header': 'foobar' },
});
