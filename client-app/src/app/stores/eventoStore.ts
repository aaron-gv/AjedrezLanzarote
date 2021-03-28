import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { Evento, EventoFormValues } from "../models/evento";
import { Gallery } from "../models/gallery";
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
        console.log(evento);
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

  createGallery = async (myData: any[], evento: Evento, galleryId: string, galleryTitle: string) => {
    
    if (!evento || !galleryId || !myData)
      throw new Error("Alguno de los parámetros es incorrecto.");
    this.loading = true;
    var myForm = new FormData();
    myData.map((data) => 
      myForm.append("Images", data)
    );
    
    myForm.append("collectionTitle", galleryTitle); 
    
    try { 
      await agent.Images.createEventGallery(myForm,evento.id,galleryId);
      
      runInAction(async () => {
        let newGallery = await agent.Galleries.get(galleryId);
        
          runInAction(() => {
            
            if (evento.galleries)
            evento.galleries.push(newGallery);
          else 
            evento.galleries = [newGallery];
            this.reOrderImages(evento.galleries.find(x => x.id === newGallery.id)!);
            this.eventosRegistry.set(evento.id, evento as Evento);
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

  addToGallery = async (myData: any[], evento: Evento, galleryId: string) => {
    
    if (!evento || !galleryId || !myData)
      throw new Error("Alguno de los parámetros es incorrecto.");
    this.loading = true;
    var myForm = new FormData();
    myData.map((data) => 
      myForm.append("Images", data)
    );
    try { 
      await agent.Galleries.addImages(myForm,galleryId); //change to update
      runInAction(async () => {
        let newGallery = await agent.Galleries.get(galleryId);
          runInAction(() => {
            evento.galleries!.find(x => x.id === newGallery.id)!.images = newGallery.images;
            this.reOrderImages(evento.galleries!.find(x => x.id === newGallery.id)!);
            this.eventosRegistry.set(evento.id, evento as Evento);
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
    try {
      await agent.Eventos.renameGallery(galleryId,eventoId,myForm);
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
    
    try {
      
      await agent.Eventos.renameImage(imageId,myForm);
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

    try {
      await agent.Galleries.deleteImage(imageId, galleryId);
      
      runInAction(() => {
        console.log(evento.galleries?.find(x => x.id === galleryId)?.images);
        var newImageList = evento.galleries?.find(x => x.id === galleryId)?.images.filter(x => x.id !== imageId);
        console.log(newImageList);
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

    try {
      await agent.Images.deleteEventoGallery(galleryId, evento.id);
      
      runInAction(() => {
        let newGalleries = evento.galleries!.filter(x => x.id !== galleryId);
        evento.galleries = newGalleries.length > 0 ? newGalleries : [];
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
        this.loading = false;
      });
    } catch(error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
        
        
        });
    }
  }
}

