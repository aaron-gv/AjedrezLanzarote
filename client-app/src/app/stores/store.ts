import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import EventoStore from "./eventoStore";
import UserStore from "./userStore";

interface Store {
    eventoStore: EventoStore;
    commonStore: CommonStore;
    userStore: UserStore;
}

export const store: Store = {
    eventoStore: new EventoStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}