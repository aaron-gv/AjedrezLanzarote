import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Patrocinador } from "../models/patrocinador";

export default class PatrocinadorStore {
    patrocinadoresRegistry = new Map<string, Patrocinador>();
    selectedEvento: Patrocinador | undefined = undefined;
    loading = false;
    loadingInitial = false;
    groupLength = 5;
    groups :number = 0;
    groupList  = new Map<number, Patrocinador[]>();

    constructor() {
      makeAutoObservable(this);
    }

    list = async () => {
        this.loadingInitial=true;
        
        try {
            let patrocinadores = await agent.Patrocinadores.list();
            
            runInAction(() => {
                patrocinadores.forEach(patrocinador => {
                    this.setPatrocinador(patrocinador);
                });
                this.groups =  Math.ceil(patrocinadores.length/this.groupLength);
                for (var i = 0 ; i < this.groups; i++ ) {
                    this.groupList.set(i,patrocinadores.slice(i*5, i*5+5));
                }
                this.loadingInitial = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            })
        }
    }
    private setPatrocinador = (patrocinador: Patrocinador) => {
        this.patrocinadoresRegistry.set(patrocinador.id, patrocinador);
    }
    get patrocinadores() {
        return Array.from(this.patrocinadoresRegistry.values());
    }
    grouped = (n: number) => {
        if (this.groupList.get(n)!==undefined)
            return Array.from(this.groupList.get(n)!.values());
        else return null;
    }
}