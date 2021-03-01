import { createContext, useContext } from "react";
import EventoStore from "./eventoStore";

interface Store {
    eventoStore: EventoStore
}

export const store: Store = {
    eventoStore: new EventoStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}