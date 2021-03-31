import { Gallery } from "./gallery";
import { ImageDto } from "./image";

export interface Noticia {
    id: string;
    title: string;
    url: string;
    date: Date;
    body: string;
    portraitUrl?: string;
    portrait?: ImageDto;
    appUserId: string;
    galleries?: Gallery[] | undefined;
}
export class Noticia implements Noticia {
    constructor(init?: Noticia) {
        Object.assign(this, init);
    }
}
export class NoticiaFormValues {
    id?: string = undefined;
    url: string ='';
    title: string = '';
    body: string = '';
    date: Date | null = null;
    appUserId: string = '';
    constructor(noticia?: NoticiaFormValues) {
        if (noticia) {
            this.id = noticia.id;
            this.url = noticia.url;
            this.title = noticia.title;
            this.body = noticia.body;
            this.date = noticia.date;
            this.appUserId = noticia.appUserId;
        }
    }
}