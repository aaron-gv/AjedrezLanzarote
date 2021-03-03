import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import EventoStore from "./eventoStore";

interface Store {
    eventoStore: EventoStore;
    commonStore: CommonStore;
}

export const store: Store = {
    eventoStore: new EventoStore(),
    commonStore: new CommonStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}