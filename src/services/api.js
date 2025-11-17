import axios from 'axios';

const getAuthToken = () => {
    try {
        const authStorage = localStorage.getItem('auth-storage'); 
        if (!authStorage) {
            return null;
        }

        const { state } = JSON.parse(authStorage);
        return state.token || null;
    } catch (error) {
        console.error("Could not parse auth token:", error);
        return null;
    }
};

const addAuthToken = (config) => {
    const token = getAuthToken(); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};


export const accountApi = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});


export const productApi = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});
productApi.interceptors.request.use(addAuthToken);

export const cartApi = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});
cartApi.interceptors.request.use(addAuthToken);

export const orderApi = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});
orderApi.interceptors.request.use(addAuthToken);



// const addAuthToken = (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// };

// export const accountApi = axios.create({
//     baseURL: 'http://localhost:8081/api/v1/accounts',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// export const productApi = axios.create({
//     baseURL: 'http://localhost:8082/api/v1/products',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
// productApi.interceptors.request.use(addAuthToken);

// export const cartApi = axios.create({
//     baseURL: 'http://localhost:8082/api/v1/cart',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
// cartApi.interceptors.request.use(addAuthToken);

// export const orderApi = axios.create({
//     baseURL: 'http://localhost:8083/api/v1/orders',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
// orderApi.interceptors.request.use(addAuthToken);