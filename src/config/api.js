// API Configuration
// Centralized API endpoints following DRY principle

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_ENDPOINTS = {
    // Accounts Service
    ACCOUNTS: {
        BASE: '/api/accounts',
        LOGIN: '/api/accounts/login',
        REGISTER: '/api/accounts/register',
        REFRESH: '/api/accounts/refresh',
        PROFILE: '/api/accounts/profile',
        LOGOUT: '/api/accounts/logout',
    },

    // Products Service
    PRODUCTS: {
        BASE: '/api/products',
        BY_ID: (id) => `/api/products/${id}`,
        BY_NAME: (name) => `/api/products/name/${name}`,
        BY_CATEGORY: (type) => `/api/products/category/${type}`,
        BY_SELLER: (sellerId) => `/api/products/seller/${sellerId}`,
    },

    // Cart Service
    CART: {
        BASE: '/api/cart',
        ITEM: (productId) => `/api/cart/${productId}`,
    },

    // Orders Service
    ORDERS: {
        BASE: '/orders',
        BY_ID: (id) => `/orders/${id}`,
        CANCEL: (id) => `/orders/${id}/cancel`,
        RESET_CACHES: '/orders/reset-caches',
    },
};

export default API_BASE_URL;
