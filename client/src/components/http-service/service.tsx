import Axios, { AxiosInstance } from "axios";
import { API_URL } from "../../global-config";

export const axios: AxiosInstance = Axios.create({
    baseURL: API_URL,
})

export default axios;