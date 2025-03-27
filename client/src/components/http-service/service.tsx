import Axios, { AxiosInstance } from "axios";
import { API_URL } from "../../global-config";
// const API_URL = process.env.REACT_APP_API_URL
// const API_URL = `http://localhost:3000`;

export const axios: AxiosInstance = Axios.create({
    baseURL: API_URL,
})

// console.log("API_URL",API_URL)
axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
},(error)=>{
    return Promise.reject(error);
});

axios.interceptors.response.use((response)=>{
    return response
},(error)=>{
    if(error.response){
        if(error.response.status === 401 || error.response.status === 403){
            localStorage.removeItem('token');
            localStorage.clear();
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export default axios;