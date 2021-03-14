import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Gallery } from "../models/gallery";
import { store } from "./store";
 
export default class GalleryStore {
    galleriesRegistry = new Map<string, Gallery>();
    loading = false;
    loadingInitial = false;
    constructor() {
        makeAutoObservable(this);
      }
      setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
      };
      /*
    loadEventGalleries = async (evento: string) => {
        this.loadingInitial = true;
        try {
        const galleries = await agent.Images.getEventGalleries(evento);
        console.log(galleries);
        galleries.forEach((gallery) => {
            this.setGallery(gallery);
        });
        this.setLoadingInitial(false);
        } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
        }
    }
    */
    private setGallery = (gallery: Gallery) => {
        const user = store.userStore.user;
        if (user) {
            /* Do something depending on the user */
          
        }
        
        this.galleriesRegistry.set(gallery.id, gallery);
      }
}