import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Evento, EventoFormValues } from '../models/evento';
import {Gallery} from '../models/gallery';
import { Noticia } from '../models/noticia';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';


axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
})

axios.interceptors.response.use(async response => {

        await sleep(300);
        return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response!;
    
    switch (status) {
        case 400:
            if (typeof data === 'string') {
                toast.error(data);
                throw data;
            }
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                history.push('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];

                for (const key in data.errors) {
                    if (data.errors[key])
                    {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            }
            break;
        case 401:
            toast.error("No autorizado");
            break;
        case 404:
            history.push('/not-found')
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error);
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
    create: (evento: EventoFormValues) => axios.post<void>(`/eventos`, evento).then(responseBody),
    update: (evento: EventoFormValues) => axios.put<void>(`/eventos/${evento.id}`, evento).then(responseBody),
    delete: (id: string) => axios.delete(`/eventos/${id}`).then(responseBody),
    asistir: (url: string) => axios.post<void>(`/eventos/${url}/asistir`).then(responseBody),
    cancelar: (url: string) => axios.post<void>(`/eventos/${url}/cancelar`).then(responseBody)
}
const Noticias = {
    list: () => requests.get<Noticia[]>('/noticias'),
    details: (url: string) => requests.get<Noticia>(`/noticias/${url}`),
    create: (noticia: Noticia) => axios.post<void>(`/noticias`, noticia).then(responseBody),
    update: (noticia: Noticia) => axios.put<void>(`/noticias/${noticia.id}`, noticia).then(responseBody),
    delete: (id: string) => axios.delete(`/eventos/${id}`)
}
const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => axios.post<User>('/account/login', user),
    register: (user: UserFormValues) => axios.post<User>('/account/register', user)
} 
const Images = {
    deleteEventoGallery: (id: string, eventoId: string) => axios.delete(`/galleryevento/gallerydel/${id}/${eventoId}`).then(responseBody),
    createEventGallery: (images: FormData, id: string, galleryId: string) => axios.post<void>(`/Images/${id}/${galleryId}`, images).then(responseBody)
}
const Galleries = {
    get: (id: string) => requests.get<Gallery>(`/galleryevento/${id}`),
    deleteImage: (imageId: string, galleryId:string) => axios.delete<void>(`/galleryevento/imagedel/${imageId}/${galleryId}`).then(responseBody)
}
const agent = {
    Eventos,
    Account,
    Noticias,
    Images,
    Galleries
}

export default agent;