import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import EventoStore from "./eventoStore";
import UserStore from "./userStore";
import NoticiaStore from './noticiaStore';

interface Store {
    eventoStore: EventoStore;
    commonStore: CommonStore;
    userStore: UserStore;
    noticiaStore: NoticiaStore;
}

export const store: Store = {
    eventoStore: new EventoStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    noticiaStore: new NoticiaStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}