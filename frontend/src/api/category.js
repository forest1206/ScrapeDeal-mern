import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL : 'http://localhost:8000';

const categoryApi = {
    getCategoryList: async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.get(
            `${API_URL}/api/category`,
            config,
        );

        return data;
    },

};

export default categoryApi;
