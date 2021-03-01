import axios, { AxiosResponse } from 'axios';
import { Evento } from '../models/evento';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody)
}

const Eventos = {
    list: () => requests.get<Evento[]>('/eventos'),
    details: (url: string) => requests.get<Evento>(`/eventos/${url}`),
    create: (evento: Evento) => axios.post<void>(`/eventos`, evento),
    update: (evento: Evento) => axios.put<void>(`/eventos/${evento.id}`, evento),
    delete: (id: string) => axios.delete(`/eventos/${id}`)
}

const agent = {
    Eventos
}

export default agent;