import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Evento, EventoFormValues } from '../models/evento';
import {Gallery} from '../models/gallery';
import { ImageDto } from '../models/image';
import { Noticia, NoticiaFormValues } from '../models/noticia';
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
    //const {config, status} = response;
        
        await sleep(300);   
        //if (response.status === 200)
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
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody)
}

const Eventos = {
    list: () => requests.get<Evento[]>('/eventos'),
    details: (url: string) => requests.get<Evento>(`/eventos/${url}`),
    create: (evento: EventoFormValues) => requests.post<void>(`/eventos`, evento),
    update: (evento: EventoFormValues) => requests.put<void>(`/eventos/${evento.id}`, evento),
    delete: (id: string) => requests.del(`/eventos/${id}`),
    asistir: (url: string) => requests.post<void>(`/eventos/${url}/asistir`, {}),
    cancelar: (url: string) => requests.post<void>(`/eventos/${url}/cancelar`, {}),
    
}
const Noticias = {
    list: () => requests.get<Noticia[]>('/noticias'),
    details: (url: string) => requests.get<Noticia>(`/noticias/${url}`),
    create: (noticia: NoticiaFormValues) => requests.post<void>(`/noticias`, noticia),
    update: (noticia: NoticiaFormValues) => requests.put<void>(`/noticias/${noticia.id}`, noticia),
    delete: (id: string) => requests.del(`/noticias/${id}`)
}
const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => axios.post<User>('/account/login', user),
    register: (user: UserFormValues) => axios.post<User>('/account/register', user)
}
const Images = { 
    
    get: (id: string) => requests.get<ImageDto>(`/images/${id}`)
}
const Galleries = {
    get: (id: string) => requests.get<Gallery>(`/gallery/${id}`),
    create: (formData: FormData) => requests.post<string>(`/gallery/create/`, formData),
    delete: (galleryId: string, entityId: string, data: FormData) => requests.put(`/gallery/gallerydel/${galleryId}/${entityId}`, data),
    deleteImage: (imageId: string, galleryId:string, data: FormData) => requests.put<void>(`/gallery/imagedel/${imageId}/${galleryId}`, data),
    addImages: (formData: FormData, galleryId: string) => requests.put<void>(`/gallery/addimages/${galleryId}`, formData),
    changeImageOrder: (imageId: string, galleryId:string, order: number) => {requests.put<void>(`/gallery/imageposition/${imageId}/${galleryId}/${order}`, {})},
    renameGallery: (idGallery: string, idEvento: string, data: FormData) => requests.put<void>(`/gallery/rename/${idEvento}/${idGallery}`, data),
    renameImage: (idGallery: string, idImage: string, data: FormData) => requests.put<void>(`/gallery/imagerename/${idGallery}/${idImage}`, data),
    setMainImage: (entityId: string, imageId: string, data: FormData) => requests.put<void>(`/gallery/setmainimage/${entityId}/${imageId}`, data),
    changeGalleryVisibility: (eventoId: string, galleryId: string, data: FormData) => requests.put<void>(`/gallery/changegalleryvisibility/${eventoId}/${galleryId}`, data),
    promoteGallery: (eventoId: string, galleryId: string, data: FormData) => requests.put<void>(`/gallery/promotegallery/${eventoId}/${galleryId}`, data),
    list: () => requests.get<Gallery[]>('/gallery/list')
}
const agent = {
    Eventos,
    Account,
    Noticias,
    Images,
    Galleries
}

export default agent;