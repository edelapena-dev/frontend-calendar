import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const { VITE_API_URL }  = getEnvVariables();

const calendarApi = axios.create({
    baseURL: VITE_API_URL
});

//TODO configurar interceptores a la hora de hacer un request que es de axios
//* antes o despues de ejecutar el api
//!Esto es para que todas mis peticiones vayan con el token que se genero en el login
calendarApi.interceptors.request.use( config => {
    config.headers = {
        ...config.headers,
        'x-token' : localStorage.getItem('token')
    }
    return config;
});

export default calendarApi;