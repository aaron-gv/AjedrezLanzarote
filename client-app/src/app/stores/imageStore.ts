import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { ImageDto } from "../models/image";

export default class ImageStore {
  imagesRegistry = new Map<string, ImageDto>();
  selectedImage: ImageDto | undefined = undefined;
  editMode = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  getImage = async (imageId: string) => {
      this.loading = true;
      try {
        await agent.Images.get(imageId);
        runInAction(() => {
            this.loading = false;
          })
      } catch (error) {
          console.log(error);
          runInAction(() => {
            this.loading = false;
          })
          
      }
  }
}
