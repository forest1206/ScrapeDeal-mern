import axios from 'axios';
import qs from 'query-string';
import { useSelector } from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL : 'http://localhost:8000';

const usersApi = {
    getUsers: async (user) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.get(
            `${API_URL}/api/user`,
            config,
        );
        return data;
    },
    getUserById: async (id) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `${API_URL}/api/user/${id}`,
            config,
        );
        return data;
    },
    createUser: async (user, userObj) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.post(`${API_URL}/api/user/`, userObj, config);
        return data;
    },
    updateUser: async (user, userObj) => {
        console.log('userObj', userObj);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        // eslint-disable-next-line no-underscore-dangle
        const { data } = await axios.put(`${API_URL}/api/user/${userObj.id}`, userObj, config);
        return data;
    },
    deleteUser: async (user, userId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.delete(`${API_URL}/api/user/${userId}`, config);
        return data;
    },
};

export default usersApi;
