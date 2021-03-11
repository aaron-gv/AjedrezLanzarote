export interface Noticia {
    id: string;
    title: string;
    url: string;
    date: Date;
    body: string;
}
export class Noticia implements Noticia {
    constructor(init?: Noticia) {
        Object.assign(this, init);
    }
}