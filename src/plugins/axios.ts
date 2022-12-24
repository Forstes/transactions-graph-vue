import axios from "axios";
import Store from "../scripts/store";
//import { requestInProcess } from "../scripts/reactivity";
//import router from "./router";

export default axios.create({});
axios.defaults.baseURL = String(import.meta.env.VITE_API_URL);

axios.defaults.headers.common['Authorization'] = "Bearer " + Store.userJwt;

axios.interceptors.request.use(function (request) {
    //requestInProcess.value = true;
    return request;
}, function (error) {
    // Do something with request error
    console.error(error.response?.data || "Couldn't perform request")
    return Promise.reject(error);
})

/* export function setAuthHeader(token: string) {
    axios.defaults.headers.common['Authorization'] = "Bearer " + token;
} */