import axios from 'axios';

const addAuthToken = (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

export const accountApi = axios.create({
    baseURL: '/api/v1/accounts',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productApi = axios.create({
    baseURL: '/api/v1/products',
    headers: {
        'Content-Type': 'application/json',
    },
});
productApi.interceptors.request.use(addAuthToken);


export const cartApi = axios.create({
    baseURL: '/api/v1/cart',
    headers: {
        'Content-Type': 'application/json',
    },
});
cartApi.interceptors.request.use(addAuthToken);


export const orderApi = axios.create({
    baseURL: '/api/v1/orders',
    headers: {
        'Content-Type': 'application/json',
    },
});
orderApi.interceptors.request.use(addAuthToken);