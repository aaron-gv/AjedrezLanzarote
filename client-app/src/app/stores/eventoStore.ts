import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Evento } from "../models/evento";
import { v4 as uuid } from "uuid";

export default class EventoStore {
  eventosRegistry = new Map<string, Evento>();
  selectedEvento: Evento | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;

  constructor() {
    makeAutoObservable(this);
  }

  get eventosByDate() {
    return Array.from(this.eventosRegistry.values()).sort(
      (a, b) => Date.parse(b.startDate) - Date.parse(a.startDate)
    );
  }

  loadEventos = async () => {
    try {
      const eventos = await agent.Eventos.list();
      eventos.forEach((evento) => {
        evento.startDate = evento.startDate.split("T")[0];
        evento.endDate = evento.endDate.split("T")[0];
        runInAction(() => {
            this.eventosRegistry.set(evento.id, evento);
        })
        
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  selectEvento = (id: string) => {
    this.selectedEvento = this.eventosRegistry.get(id);
  };

  cancelSelectedEvento = () => {
    this.selectedEvento = undefined;
  };

  openForm = (id?: string) => {
    id ? this.selectEvento(id) : this.cancelSelectedEvento();
    this.editMode = true;
  };

  closeForm = () => {
    this.editMode = false;
  };

  createEvento = async (evento: Evento) => {
    this.loading = true;
    evento.id = uuid();
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
        if (this.selectedEvento?.id === id) this.cancelSelectedEvento();
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
