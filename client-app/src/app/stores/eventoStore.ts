import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { Evento, EventoFormValues } from "../models/evento";
import { Gallery } from "../models/gallery";
import { ImageDto } from "../models/image";
import { Profile } from "../models/profile";
import { store } from "./store";

export default class EventoStore {
  eventosRegistry = new Map<string, Evento>();
  selectedEvento: Evento | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get eventosByDate() {
    return Array.from(this.eventosRegistry.values()).sort(
      (a, b) => b.startDate!.getTime() - a.startDate!.getTime()
    );
  }

  get groupedEventos() {
    return Object.entries(
      this.eventosByDate.reduce((eventos, evento) => {
        const startDate = format(evento.startDate!,'dd MMM yyyy');
        eventos[startDate] = eventos[startDate] ? [...eventos[startDate], evento] : [evento];
        return eventos;
      }, {} as {[key: string]: Evento[]})
    )
  }
  loadEventos = async () => {
    this.loadingInitial = true;
    try {
      const eventos = await agent.Eventos.list();
      eventos.forEach((evento) => {
        this.setEvento(evento);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  private getEventoByUrl(url: string) {
    let evento = undefined;
    Array.from(this.eventosRegistry.entries()).forEach(e => {
      if (e[1].url === url) {
        evento = e[1];
      }
    });
    return evento;
  }
  loadEventoByUrl = async (url: string) => {

    let evento = this.getEventoByUrl(url);
    if (evento) {
      this.selectedEvento = evento;
      return evento;
    } else {
      this.loadingInitial = true;
      try {
        let evento = await agent.Eventos.details(url);
        this.setEvento(evento);
        runInAction(() => {
          this.selectedEvento = evento;
          this.loadingInitial = false;
        })
        return evento;
      } catch (error) {
        console.log(error);
        runInAction(() => {
          this.loadingInitial = false;
        })
      }
    }
  }

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
  private reOrderGalleries = (evento: Evento) => {
    if (evento.galleries && evento.galleries.length > 0) {
      evento.galleries = evento.galleries.sort((a, b) => (a.order > b.order) ? 1 : -1);
      let count = 0;
      evento.galleries.forEach(gallery => {
        gallery.order = count;
        count++;
      })
    }
  }

  private setEvento = (evento: Evento) => {
    const user = store.userStore.user;
    if (user) {
      evento.isGoing = evento.asistentes!.some(
        a => a.username === user.username
      );
      evento.isHost = evento.hostUsername === user.username;
      evento.host = evento.asistentes?.find(x => x.username === evento.hostUsername);
    }
    evento.startDate = new Date(evento.startDate!);
    evento.endDate = new Date(evento.endDate!);

    if (evento.galleries) {
      evento.galleries = evento.galleries.sort((a, b) => (a.order > b.order) ? 1 : -1);

      evento.galleries.forEach(gallery => {
        
        if (gallery.images.length > 0)
        {
          gallery.images = gallery.images.sort((a, b) => (a.order > b.order) ? 1 : -1);
        }
        
      })
    }

    this.eventosRegistry.set(evento.id, evento);
  }

  private getEvento = (id: string) => {
    return this.eventosRegistry.get(id);
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  
  createEvento = async (evento: EventoFormValues) => {
    
    
    const userStore = store.userStore;
    evento.appUserId = userStore.getUuid();
    if (evento.appUserId!.length < 5)
    {
      return null;
    }
    const asistente = new Profile(userStore.user!);
    try {
      await agent.Eventos.create(evento as EventoFormValues);
      const newEvento = new Evento(evento as EventoFormValues);
      newEvento.hostUsername = userStore.user!.username;
      newEvento.asistentes = [asistente];
      this.setEvento(newEvento);
      runInAction(() => {
        this.selectedEvento = newEvento;
      });
    } catch (error) {
      throw error;
    }
  };

  updateEvento = async (evento: EventoFormValues) => {
    try {
      await agent.Eventos.update(evento);
      runInAction(() => {
        if (evento.id) {
          let updatedEvento = {...this.getEvento(evento.id), ...evento}
          this.eventosRegistry.set(evento.id, updatedEvento as Evento)
          this.selectedEvento = updatedEvento as Evento;
        }
      });
    } catch (error) {
      throw error;
    }
  };

  deleteEvento = async (id: string) => {
    this.loading = true;
    try {
      await agent.Eventos.delete(id);
      runInAction(() => {
        this.eventosRegistry.delete(id);
        this.selectedEvento=undefined;
        this.loading = false;
      });
      history.push("/eventos");
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAsistencia = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Eventos.asistir(this.selectedEvento!.url);
      runInAction(() => {
        if (this.selectedEvento?.isGoing) {
          this.selectedEvento.asistentes = 
            this.selectedEvento.asistentes?.filter(a => a.username!== user?.username);
          this.selectedEvento.isGoing = false;
        } else {
          const asistente = new Profile(user!);
          this.selectedEvento?.asistentes?.push(asistente);
          this.selectedEvento!.isGoing = true;
        }
        this.eventosRegistry.set(this.selectedEvento?.id!, this.selectedEvento!);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.loading=false);
    }
  }

  cancelEventoToggle = async () => {
    this.loading = true;
    try {
      await agent.Eventos.cancelar(this.selectedEvento!.url);
      runInAction(() => {
        this.selectedEvento!.isCancelled = !this.selectedEvento?.isCancelled;
        this.eventosRegistry.set(this.selectedEvento!.id, this.selectedEvento!);
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      })
      
    }
  }
  createGallery = async (formData: FormData, galleryTitle: string, eventoId: string) => {
    this.loading = true;
    var evento = this.selectedEvento;
    if (evento === undefined) return null;
      try {
        var newGalId = await agent.Galleries.create(formData);
        
        runInAction(async () => {
          let newGallery = await agent.Galleries.get(newGalId);
          
            runInAction(() => {
              newGallery.eventoId = eventoId;
              newGallery.title = galleryTitle;
              

              if (evento!.galleries && evento!.galleries.length > 0) {
                newGallery.order = evento!.galleries.length;
                evento!.galleries.push(newGallery);
              } else {
                newGallery.order = 0;
                evento!.galleries = [newGallery];
              }
              this.reOrderImages(evento!.galleries.find(x => x.id === newGallery.id)!);
              this.eventosRegistry.set(evento!.id, evento as Evento);
              this.selectedEvento = evento;
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
    var evento = this.selectedEvento;
    if (evento === undefined) return false;
    try { 
      await agent.Galleries.addImages(formData,galleryId); //change to update
      runInAction(async () => {
        let newGallery = await agent.Galleries.get(galleryId);
          runInAction(() => {
            evento!.galleries!.find(x => x.id === newGallery.id)!.images = newGallery.images;
            this.reOrderImages(evento!.galleries!.find(x => x.id === newGallery.id)!);
            this.eventosRegistry.set(evento!.id, evento as Evento);
            this.selectedEvento = evento;
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

  renameGallery = async (eventoId: string, galleryId: string, title: string) => {
    if (!eventoId || !galleryId || !title)
      throw new Error("Alguno de los parámetros es incorrecto.");
    this.loading = true;
    var myForm = new FormData();
    myForm.append("title", title);
    myForm.append("entityType", "Evento");
    try {
      await agent.Galleries.renameGallery(galleryId,eventoId,myForm);
      runInAction(() => {
        this.loading = false;
        let evento = this.selectedEvento;
            evento?.galleries?.forEach( gallery => {
              if (gallery.id === galleryId) { 
                gallery.title = title;
              }});
        this.eventosRegistry.set(evento!.id, evento as Evento);
        this.selectedEvento = evento;
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
    myForm.append("entityType", "Evento");
    
    try {
      
      await agent.Galleries.renameImage(galleryId,imageId,myForm);
      runInAction(async () => {
            let evento = this.selectedEvento;
            evento?.galleries?.forEach( gallery => {
              if (gallery.id === galleryId) { 
                gallery.images.forEach(image => {
                  if (image.id === imageId)
                    image.title = title;
                })
              }
            });
            this.eventosRegistry.set(evento!.id, evento as Evento);
            this.selectedEvento = evento;
            this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  deleteImage = async (evento:Evento, imageId: string, galleryId: string) => {
    this.loading = true;
    var myForm = new FormData();
    myForm.append("entityType", "Evento");
    try {
      await agent.Galleries.deleteImage(imageId, galleryId, myForm);
      
      runInAction(() => {
        
        if (imageId === evento.portrait?.id) {
          evento.portrait = undefined;
          evento.portraitUrl = undefined;
        }
        var newImageList = evento.galleries?.find(x => x.id === galleryId)?.images.filter(x => x.id !== imageId);
        
        if (newImageList!==undefined && newImageList?.length > 0)
        {
          evento.galleries!.find(x => x.id === galleryId)!.images = newImageList;
          this.reOrderImages(evento.galleries!.find(x => x.id === galleryId)!);
        } else {
          let newGalleries = evento.galleries!.filter(x => x.id !== galleryId);
          evento.galleries = newGalleries.length > 0 ? newGalleries : [];
        }
        this.eventosRegistry.set(evento.id, evento as Evento);
        this.selectedEvento = evento;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => { 
        this.loading = false;
      });
    }
  }

  deleteGallery = async (evento:Evento, galleryId: string) => {
    this.loading = true;
    var myForm = new FormData();
    myForm.append("entityType", "Evento");
    try {
      await agent.Galleries.delete(galleryId, evento.id, myForm);
      
      runInAction(() => {
        let targetGallery = evento.galleries!.find(x => x.id === galleryId);
        
        let newGalleries = evento.galleries!.filter(x => x.id !== galleryId);
        evento.galleries = newGalleries.length > 0 ? newGalleries : [];
        
          targetGallery?.images.forEach(image => {
            if (image.id === evento.portrait?.id)
            {
              evento.portrait = undefined;
              evento.portraitUrl = undefined;
            }
          });
        
        this.reOrderGalleries(evento);
        this.eventosRegistry.set(evento.id, evento as Evento);
        this.selectedEvento = evento;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => { 
        this.loading = false;
      });
    }
  }

  changeImageOrder = async (evento: Evento, galleryId: string, imageId: string, order: number, gallery: Gallery) => {
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
        evento.galleries = evento.galleries!.filter(x => x.id !== gallery.id);
        this.reOrderImages(gallery);
        evento.galleries.push(gallery);
        this.reOrderGalleries(evento);
        this.selectedEvento = evento;
        this.eventosRegistry.set(evento.id, evento);
        this.loading = false;
      });
    } catch(error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
        
        
        });
    }
  }

  setMainImage = async (image:ImageDto,eventoId:string, imageId: string, source: string) => {
    this.loading = true;
    var myForm = new FormData();
    myForm.append("entityType", "Evento");
    try {
      await agent.Galleries.setMainImage(eventoId, imageId, myForm);
      
      runInAction(() => {
        let evento = this.eventosRegistry.get(eventoId);
        
        if (evento !== undefined) {
          evento.portraitUrl = source;
          evento.portrait = image;
          this.selectedEvento = evento;
          this.eventosRegistry.set(evento.id, evento);
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

changeGalleryVisibility = async (eventoId: string, galleryId: string, gallery: Gallery) => {
  this.loading = true;
  var myForm = new FormData();
  myForm.append("entityType", "Evento");
  try {
    await agent.Galleries.changeGalleryVisibility(eventoId,galleryId, myForm);
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
promoteGallery = async (gallery:Gallery,  evento: Evento) => {
  this.loading = true;
  var order = gallery.order-1;
  var myForm = new FormData();
  myForm.append("entityType", "Evento");
  try {
    await agent.Galleries.promoteGallery(evento.id,gallery.id, myForm);
    runInAction(() => {
        if (evento.galleries === undefined) return null;
        var prevGallery = evento.galleries.find(x => x.order === order);
        if (prevGallery === undefined) return null;
          prevGallery.order = prevGallery.order+1;
         
          evento.galleries.find(x => x.id===gallery.id)!.order--;
        
        evento.galleries?.sort((a, b) => (a.order > b.order) ? 1 : -1);
        this.eventosRegistry.set(evento.id,evento);
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

