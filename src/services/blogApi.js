import axios from 'axios';

// Blog API Base URL
const BLOG_API_URL = 'http://localhost:8084';

// Create axios instance for blog API
export const blogApi = axios.create({
    baseURL: BLOG_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Blog API endpoints
export const blogApiEndpoints = {
    // Get published blogs with pagination
    getBlogs: (page = 0, size = 3, keyword = '', categoryId = null) => {
        let url = `/blogs?page=${page}&size=${size}&keyword=${keyword}`;
        if (categoryId) {
            url += `&categoryId=${categoryId}`;
        }
        return blogApi.get(url);
    },

    // Get blog by slug
    getBlogBySlug: (slug) => blogApi.get(`/blogs/${slug}`),

    // Get categories
    getCategories: () => blogApi.get('/categories'),

    // Get tags
    getTags: () => blogApi.get('/tags'),
};

export default blogApi;
