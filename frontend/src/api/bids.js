import axios from 'axios';
import qs from 'query-string';

const API_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL : 'http://localhost:8000';

const bidsApi = {
    getProductBids: async (product) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `${API_URL}/api/bid/product/${product}`,
            config,
        );
        return data;
    },
    getUserBids: async (user) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.get(
            `${API_URL}/api/bid/user/${user}`,
            config,
        );
        return data;
    },
    getBidById: async (id) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `${API_URL}/api/bid/${id}`,
            config,
        );
        return data;
    },
    createBid: async (user, bid) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/bid/`, bid, config);
        return data;
    },
    updateBid: async (user, bid) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        // eslint-disable-next-line no-underscore-dangle
        const { data } = await axios.put(`${API_URL}/api/bid/${bid._id}`,
            {
                amount: bid.amount,
                description: bid.description,
            },
            config);
        return data;
    },
    awardBid: async (user, bidId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/bid/award/${bidId}`, { bidId }, config);
        return data;
    },
    cancelAward: async (user, bidId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/bid/cancel/${bidId}`, { bidId }, config);
        return data;
    },
};

export default bidsApi;
