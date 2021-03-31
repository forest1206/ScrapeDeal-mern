/* eslint-disable arrow-body-style */
// eslint-disable-next-line no-unused-vars
import qs from 'query-string';
import { getCategories, getCategoryBySlug } from '../fake-server/endpoints/categories';
import { API_URL } from './config';

const shopApi = {
    getCategories: (options = {}) => {
        return fetch(`${API_URL}/api/category?${qs.stringify(options)}`)
            .then((response) => response.json());
    },
    getFilterList: () => {
        return fetch(`${API_URL}/api/product/filters`)
            .then((response) => response.json());
    },
    getProductBySlug: (slug) => {
        return fetch(`${API_URL}/api/product/${slug}`)
            .then((response) => response.json());
    },
    getProductsList: (options = {}, filters = {}, user) => {
        const params = { ...options };
        Object.keys(filters).forEach((slug) => {
            params[`filter_${slug}`] = filters[slug];
        });
        let config = { method: 'GET' };
        if (user?.token) {
            config = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
        }

        return fetch(`${API_URL}/api/product?${qs.stringify(params)}`,
            config)
            .then((response) => response.json());
    },
    getAdminProducts: (user) => {
        return fetch(`${API_URL}/api/product/admin`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((response) => response.json());
    },
    getLatestProducts: () => {
        return fetch(`${API_URL}/api/product/latest`)
            .then((response) => response.json());
    },
    getSuggestions: (query, options = {}) => {
        return fetch(`${API_URL}/api/product/suggestions?${qs.stringify({ ...options, query })}`)
            .then((response) => response.json());
    },
};

export default shopApi;
