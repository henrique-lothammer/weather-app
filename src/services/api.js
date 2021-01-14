import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dataservice.accuweather.com'
});

export default api;