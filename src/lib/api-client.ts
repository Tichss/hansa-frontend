import axios from 'axios';

const ApiClient = axios.create();

ApiClient.defaults.baseURL = process.env.VUE_APP_BASE_URL;

ApiClient.interceptors.response.use((response) => {
    return Promise.resolve(response?.data);
});

export default ApiClient;
