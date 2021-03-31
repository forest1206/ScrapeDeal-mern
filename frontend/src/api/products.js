import axios from 'axios';
import qs from 'query-string';

const API_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL : 'http://localhost:8000';

const productsApi = {
    getProducts: async (user, options = {}, filters = {}) => {
        const params = { ...options };
        Object.keys(filters).forEach((slug) => {
            params[`filter_${slug}`] = filters[slug];
        });
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.get(`${API_URL}/api/product/admin?${qs.stringify(params)}`, config);
        return data;
    },

    getProductById: async (user, productId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.get(`${API_URL}/api/product/${productId}`, config);
        return data;
    },

    createProduct: async (user, product) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await axios.post(`${API_URL}/api/product/admin`, product, config);
        return data;
    },

    updateProduct: async (product, user) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await axios.put(
            // eslint-disable-next-line no-underscore-dangle
            `${API_URL}/api/product/admin/${product._id}`,
            product,
            config,
        );
        return data;
    },

    deleteProduct: async (user, id) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await axios.delete(`${API_URL}/api/product/admin/${id}`, config);
        return data;
    },
};

export default productsApi;
