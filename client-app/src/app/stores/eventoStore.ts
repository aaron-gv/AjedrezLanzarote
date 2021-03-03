import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Evento } from "../models/evento";

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

  private setEvento = (evento: Evento) => {
    evento.startDate = new Date(evento.startDate!);
    evento.endDate = new Date(evento.endDate!);
    this.eventosRegistry.set(evento.id, evento);
  }

  private getEvento = (id: string) => {
    return this.eventosRegistry.get(id);
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  
  createEvento = async (evento: Evento) => {
    this.loading = true;
    try {
      await agent.Eventos.create(evento);
      runInAction(() => {
        this.eventosRegistry.set(evento.id, evento);
        this.selectedEvento = evento;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateEvento = async (evento: Evento) => {
    this.loading = true;
    try {
      await agent.Eventos.update(evento);
      runInAction(() => {
        this.eventosRegistry.set(evento.id, evento);
        this.selectedEvento = evento;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
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
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
