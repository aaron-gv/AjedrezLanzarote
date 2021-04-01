import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { Gallery } from "../models/gallery";
import { ImageDto } from "../models/image";
import { Noticia, NoticiaFormValues } from "../models/noticia";
import { store } from "./store";

export default class NoticiaStore {
  noticiasRegistry = new Map<string, Noticia>();
  selectedNoticia: Noticia | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get noticiasByDate() {
    return Array.from(this.noticiasRegistry.values()).sort(
      (a, b) => b.date!.getTime() - a.date!.getTime()
    );
  }

  get groupedNoticias() {
    return Object.entries(
      this.noticiasByDate.reduce((noticias, noticia) => {
        const date = format(noticia.date!,'dd MMM yyyy');
        noticias[date] = noticias[date] ? [...noticias[date], noticia] : [noticia];
        return noticias;
      }, {} as {[key: string]: Noticia[]})
    )
  }

  

  loadNoticias = async () => {
    this.loadingInitial = true;
    try {
      const noticias = await agent.Noticias.list();
      noticias.forEach((noticia) => {
        this.setNoticia(noticia);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  private getNoticiaByUrl(url: string) {
    let noticia = undefined;
    Array.from(this.noticiasRegistry.entries()).forEach(e => {
      if (e[1].url === url) {
        noticia = e[1];
      }
    });
    return noticia;
  }
  loadNoticiaByUrl = async (url: string) => {

    let noticia = this.getNoticiaByUrl(url);
    if (noticia) {
      this.selectedNoticia = noticia;
      return noticia;
    } else {
      this.loadingInitial = true;
      try {
        let noticia = await agent.Noticias.details(url);
        this.setNoticia(noticia);
        runInAction(() => {
          this.selectedNoticia = noticia;
          this.loadingInitial = false;
        })
        return noticia;
      } catch (error) {
        console.log(error);
        runInAction(() => {
          this.loadingInitial = false;
        })
      }
    }
  }

  private setNoticia = (noticia: Noticia) => {
    
    noticia.date = new Date(noticia.date!);

    
    if (noticia.galleries) {
      noticia.galleries = noticia.galleries.sort((a, b) => (a.order > b.order) ? 1 : -1);

      noticia.galleries.forEach(gallery => {
        
        if (gallery.images.length > 0)
        {
          gallery.images = gallery.images.sort((a, b) => (a.order > b.order) ? 1 : -1);
        }
        
      })
    }
    this.noticiasRegistry.set(noticia.id, noticia);
  }

  private getNoticia = (id: string) => {
    return this.noticiasRegistry.get(id);
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  
  createNoticia = async (noticia: NoticiaFormValues) => {
    //const user = store.userStore.user;
    
    const userStore = store.userStore;
    noticia.appUserId = userStore.getUuid();
    if (noticia.appUserId!.length < 5)
    {
      return null;
    }
    
    try {
      await agent.Noticias.create(noticia as NoticiaFormValues);
      const newNoticia = new Noticia(noticia as Noticia);
      this.setNoticia(newNoticia);
      runInAction(() => {
        this.selectedNoticia = newNoticia;
      });
    } catch (error) {
      throw error;
    }
  };

  updateNoticia = async (noticia: NoticiaFormValues) => {
    const userStore = store.userStore;
    noticia.appUserId = userStore.getUuid();
    try {
      await agent.Noticias.update(noticia);
      runInAction(() => {
        if (noticia.id) {
          let updatedNoticia = {...this.getNoticia(noticia.id), ...noticia}
          this.noticiasRegistry.set(noticia.id, updatedNoticia as Noticia)
          this.selectedNoticia = updatedNoticia as Noticia;
        }
      });
    } catch (error) {
      throw error;
    }
  };

  deleteNoticia = async (id: string) => {
    this.loading = true;
    try {
      await agent.Noticias.delete(id);
      runInAction(() => {
        this.noticiasRegistry.delete(id);
        this.loading = false;
        
      });
      history.push("/noticias");
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
  
  private reOrderImages = (gallery: Gallery) => {
    if (gallery.images.length > 0) {
      gallery.images = gallery.images.sort((a, b) => (a.order > b.order) ? 1 : -1);
      let count = 0;
      gallery.images.forEach(image => {
        image.order = count;
        count++;
      })
    }
  }
  private reOrderGalleries = (noticia: Noticia) => {
    if (noticia.galleries && noticia.galleries.length > 0) {
      noticia.galleries = noticia.galleries.sort((a, b) => (a.order > b.order) ? 1 : -1);
      let count = 0;
      noticia.galleries.forEach(gallery => {
        gallery.order = count;
        count++;
      })
    }
  }
  createGallery = async (formData: FormData, galleryTitle: string, noticiaId: string) => {
    this.loading = true;
    var noticia = this.selectedNoticia;
    if (noticia === undefined) return null;
      try {
        var newGalId = await agent.Galleries.create(formData);
        
        runInAction(async () => {
          let newGallery = await agent.Galleries.get(newGalId);
          
            runInAction(() => {
              newGallery.noticiaId = noticiaId;
              newGallery.title = galleryTitle;
              

              if (noticia!.galleries && noticia!.galleries.length > 0) {
                newGallery.order = noticia!.galleries.length;
                noticia!.galleries.push(newGallery);
              } else {
                newGallery.order = 0;
                noticia!.galleries = [newGallery];
              }
              this.reOrderImages(noticia!.galleries.find(x => x.id === newGallery.id)!);
              this.noticiasRegistry.set(noticia!.id, noticia as Noticia);
              this.selectedNoticia = noticia;
              this.loading = false;
            });
        })
      } catch (error) {
        console.log(error);
        runInAction(() => {
          this.loading = false;
        });
      }
  }
  

  addToGallery = async (formData: FormData, galleryId: string) => {
    
    this.loading = true;
    var noticia = this.selectedNoticia;
    if (noticia === undefined) return false;
    try { 
      await agent.Galleries.addImages(formData,galleryId); //change to update
      runInAction(async () => {
        let newGallery = await agent.Galleries.get(galleryId);
          runInAction(() => {
            noticia!.galleries!.find(x => x.id === newGallery.id)!.images = newGallery.images;
            this.reOrderImages(noticia!.galleries!.find(x => x.id === newGallery.id)!);
            this.noticiasRegistry.set(noticia!.id, noticia as Noticia);
            this.selectedNoticia = noticia;
            this.loading = false;
          });
      })
    } catch(error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  renameGallery = async (noticiaId: string, galleryId: string, title: string) => {
    if (!noticiaId || !galleryId || !title)
      throw new Error("Alguno de los parámetros es incorrecto.");
    this.loading = true;
    var myForm = new FormData();
    myForm.append("title", title);
    myForm.append("entityType", "Noticia");
    try {
      await agent.Galleries.renameGallery(galleryId,noticiaId,myForm);
      runInAction(() => {
        this.loading = false;
        let noticia = this.selectedNoticia;
          noticia?.galleries?.forEach( gallery => {
              if (gallery.id === galleryId) { 
                gallery.title = title;
              }});
        this.noticiasRegistry.set(noticia!.id, noticia as Noticia);
        this.selectedNoticia = noticia;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  renameImage = async (galleryId:string, imageId: string, title: string) => {
    this.loading = true;
    var myForm = new FormData();
    myForm.append("title", title);
    myForm.append("entityType", "Noticia");
    
    try {
      
      await agent.Galleries.renameImage(galleryId,imageId,myForm);
      runInAction(async () => {
            let noticia = this.selectedNoticia;
            noticia?.galleries?.forEach( gallery => {
              if (gallery.id === galleryId) { 
                gallery.images.forEach(image => {
                  if (image.id === imageId)
                    image.title = title;
                })
              }
            });
            this.noticiasRegistry.set(noticia!.id, noticia as Noticia);
            this.selectedNoticia = noticia;
            this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  deleteImage = async (noticia:Noticia, imageId: string, galleryId: string) => {
    this.loading = true;
    var myForm = new FormData();
    myForm.append("entityType", "Noticia");
    try {
      await agent.Galleries.deleteImage(imageId, galleryId, myForm);
      
      runInAction(() => {
        if (imageId === noticia.portrait?.id) {
          noticia.portrait = undefined;
          noticia.portraitUrl = undefined;
        }
        var newImageList = noticia.galleries?.find(x => x.id === galleryId)?.images.filter(x => x.id !== imageId);
        if (newImageList!==undefined && newImageList?.length > 0)
        {
          noticia.galleries!.find(x => x.id === galleryId)!.images = newImageList;
          this.reOrderImages(noticia.galleries!.find(x => x.id === galleryId)!);
        } else {
          let newGalleries = noticia.galleries!.filter(x => x.id !== galleryId);
          noticia.galleries = newGalleries.length > 0 ? newGalleries : [];
        }
        this.noticiasRegistry.set(noticia.id, noticia as Noticia);
        this.selectedNoticia = noticia;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => { 
        this.loading = false;
      });
    }
  }

  deleteGallery = async (noticia:Noticia, galleryId: string) => {
    this.loading = true;
    var myForm = new FormData();
    myForm.append("entityType", "Noticia");
    try {
      await agent.Galleries.delete(galleryId, noticia.id, myForm);
      
      runInAction(() => {
        let targetGallery = noticia.galleries!.find(x => x.id === galleryId);
        targetGallery?.images.forEach(image => {
          if (image.id === noticia.portrait?.id)
          {
            noticia.portrait = undefined;
            noticia.portraitUrl = undefined;
          }
        });
        let newGalleries = noticia.galleries!.filter(x => x.id !== galleryId);
        noticia.galleries = newGalleries.length > 0 ? newGalleries : [];
        this.reOrderGalleries(noticia);
        this.noticiasRegistry.set(noticia.id, noticia as Noticia);
        this.selectedNoticia = noticia;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => { 
        this.loading = false;
      });
    }
  }

  changeImageOrder = async (noticia: Noticia, galleryId: string, imageId: string, order: number, gallery: Gallery) => {
    this.loading = true;
    if (order < 0) order =0;
    try {
      await agent.Galleries.changeImageOrder(imageId,gallery.id,order);
      runInAction(() => {
        let originalImage = gallery.images.find(y => y.id === imageId);
        let toReplace = gallery.images.find(y => y.order === order);
        let originalOrder = originalImage!.order;
        let moveTo = null;
        let moveFrom = null;
        gallery.images.forEach((image, key) => {
          if (image.id === toReplace?.id) {
            moveTo = key;
          }
          if (image.id === imageId)
          {
            moveFrom = key;
          }
        });
        if (moveTo != null) {
          originalImage!.order = order;
          gallery.images[moveTo] = originalImage!;
        }
        if (moveFrom != null && toReplace) {
          toReplace!.order = originalOrder;
          gallery.images[moveFrom] = toReplace!;
        }
        this.loading = false;
      });
    } catch(error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
        
        
        });
    }
  }

  setMainImage = async (image:ImageDto,noticiaId:string, imageId: string, source: string) => {
    this.loading = true;
    var myForm = new FormData();
    myForm.append("entityType", "Noticia");
    try {
      await agent.Galleries.setMainImage(noticiaId, imageId, myForm);
      
      runInAction(() => {
        let noticia = this.noticiasRegistry.get(noticiaId);
        if (noticia !== undefined) {
          noticia.portraitUrl = source;
          noticia.portrait = image;
          this.noticiasRegistry.set(noticia.id, noticia);
        }
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => { 
        this.loading = false;
      });
    }
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

changeGalleryVisibility = async (noticiaId: string, galleryId: string, gallery: Gallery) => {
  this.loading = true;
  var myForm = new FormData();
  myForm.append("entityType", "Noticia");
  try {
    await agent.Galleries.changeGalleryVisibility(noticiaId,galleryId, myForm);
    runInAction(() => {
        gallery.public = !gallery.public;
        this.loading = false;
      })
  } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
      
  }
}
promoteGallery = async (gallery:Gallery,  noticia: Noticia) => {
  this.loading = true;
  var order = gallery.order-1;
  var myForm = new FormData();
  myForm.append("entityType", "Noticia");
  try {
    await agent.Galleries.promoteGallery(noticia.id,gallery.id, myForm);
    runInAction(() => {
        if (noticia.galleries === undefined) return null;
        var prevGallery = noticia.galleries.find(x => x.order === order);
        if (prevGallery === undefined) return null;
          prevGallery.order = prevGallery.order+1;
         
          noticia.galleries.find(x => x.id===gallery.id)!.order--;
        
          noticia.galleries?.sort((a, b) => (a.order > b.order) ? 1 : -1);
        this.noticiasRegistry.set(noticia.id,noticia);
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
