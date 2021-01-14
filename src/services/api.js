import axios from 'axios';

const api = axios.create({
    baseURL: 'http://dataservice.accuweather.com'
});

export default api;