import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Gallery } from "../models/gallery";
 
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
    loadGalleries = async () => {
      this.loadingInitial = true;
      try {
        const galleries = await agent.Galleries.list();
        galleries.forEach((gallery) => {
          this.setGallery(gallery);
        });
        this.setLoadingInitial(false);
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    };
    createGallery = async (formData: FormData) => {
      this.loadingInitial = true;
      try {
        await agent.Galleries.create2(formData);
        runInAction(() => {
          this.loadingInitial = false;
        });
      } catch (error) {
        console.log(error);
        runInAction(() => {
          this.loadingInitial = false;
        });
      }
    }
    private setGallery = (gallery: Gallery) => {
        if (gallery.images.length > 0)
        {
          gallery.images = gallery.images.sort((a, b) => (a.order > b.order) ? 1 : -1);
        }
        this.galleriesRegistry.set(gallery.id, gallery);
      }
}