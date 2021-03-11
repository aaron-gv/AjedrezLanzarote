import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { Noticia } from "../models/noticia";

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

    this.noticiasRegistry.set(noticia.id, noticia);
  }

  private getNoticia = (id: string) => {
    return this.noticiasRegistry.get(id);
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  
  createNoticia = async (noticia: Noticia) => {
    //const user = store.userStore.user;
    
    try {
      await agent.Noticias.create(noticia);
      const newNoticia = new Noticia(noticia);
      //newNoticia.hostUsername = user!.username;
      
      this.setNoticia(newNoticia);
      runInAction(() => {
        this.selectedNoticia = newNoticia;
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  updateNoticia = async (noticia: Noticia) => {
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

}
