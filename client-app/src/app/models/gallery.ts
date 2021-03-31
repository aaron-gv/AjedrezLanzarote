import { ImageDto } from "./image";

export interface Gallery {
    id: string,
    images: ImageDto[],
    title: string,
    public: boolean,
    eventoId?: string,
    noticiaId?:string,
    order: number,
}

export class GalleryFormValues {
    eventoId: string = '';
    id :string = '';
    title: string = '';
    images: ImageDto[] = [];
    
    constructor(gallery?: GalleryFormValues) {
        if (gallery) {
            this.id = gallery.id;
            this.title = gallery.title;
            this.eventoId = gallery?.eventoId;
            this.images = gallery.images;
        }
    }
}