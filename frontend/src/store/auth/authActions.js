import { toast } from 'react-toastify';
import axios from 'axios';
import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_RESET,
    USER_LIST_FAIL,
    USER_LIST_SUCCESS,
    USER_LIST_REQUEST,
    USER_LIST_RESET,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
    USER_UPDATE_FAIL,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_REQUEST,
} from './authActionTypes';

const API_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL : 'http://localhost:8000';

export const signin = (history, user) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post(
            `${API_URL}/api/user/login`,
            user,
            config,
        );

        localStorage.setItem('user', JSON.stringify(data));

        toast.success('Login successful!');
        history.push('/');

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });
    } catch (error) {
        if (!error.response) {
            toast.warning("Can't find server!");
            return;
        }

        toast.warning(error.response.data.message);
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const signup = (history, user) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST,
        });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post(
            `${API_URL}/api/user`,
            user,
            config,
        );

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        });
        localStorage.setItem('user', JSON.stringify(data));
        toast.success('Register successful!');
        history.push('/');

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });
    } catch (error) {
        if (!error.response) {
            toast.warning("Can't find server!");
            return;
        }

        toast.warning(error.response.data.message);
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('user');
    localStorage.removeItem('state');

    dispatch({ type: USER_LOGOUT });
};

export const updateUserProfile = (userObj) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST,
        });

        const { auth: { user } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.put(`${API_URL}/api/user/profile`, userObj, config);
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data,
        });
        const state = JSON.parse(localStorage.getItem('state'));
        state.auth.user = data;
        if (userObj.password) {
            toast.success('Password has been updated');
        } else {
            toast.success('Profile has been updated');
        }
        localStorage.setItem('state', JSON.stringify(state));
        localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
        if (!error.response) {
            toast.warning("Can't find server!");
        } else {
            const message = error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
            if (message === 'Not authorized, token failed') {
                dispatch(logout());
            }
            dispatch({
                type: USER_UPDATE_PROFILE_FAIL,
                payload: message,
            });
            toast.warning(message);
        }
    }
};

// export const getUserDetails = (id) => async (dispatch, getState) => {
//     try {
//         dispatch({
//             type: USER_DETAILS_REQUEST,
//         });
//
//         const {
//             userLogin: { user },
//         } = getState();
//
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${user.token}`,
//             },
//         };
//
//         const { data } = await axios.get(`/api/user/${id}`, config);
//
//         dispatch({
//             type: USER_DETAILS_SUCCESS,
//             payload: data,
//         });
//     } catch (error) {
//         if (!error.response) {
//             toast.warning("Can't find server!");
//             return;
//         }
//         const message = error.response && error.response.data.message
//             ? error.response.data.message
//             : error.message;
//         if (message === 'Not authorized, token failed') {
//             dispatch(logout());
//         }
//         dispatch({
//             type: USER_DETAILS_FAIL,
//             payload: message,
//         });
//     }
// };
