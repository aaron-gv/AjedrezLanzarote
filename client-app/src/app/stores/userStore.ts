import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    private  parseJwt = (token : string) => {
        if (!token) { return; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    getUuid = () => {
        var token = localStorage.getItem('jwt') || 'Bearer';
        //token = token.replace('Bearer','');
        if (token.length > 10)
        {
            var result = this.parseJwt(token);
            return result['nameid'];
        }
        return '';
    }

    get isLoggedIn() {
        console.log(!!this.user);
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.data.token);
            runInAction(() =>  this.user = user.data);
            history.push('/info');
            window.location.reload();
        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;
        history.push('/');
        window.location.reload();
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => {
                if (typeof user === "string" && user === "Session expired") {
                    this.user = null;
                    window.localStorage.removeItem('jwt');
                }
                else
                    this.user = user;
            });
        } catch (error) {
            console.log(error);
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.data.token);
            runInAction(() => this.user = user.data);
            history.push('/info');
        } catch (error) {
            throw error;
        }
    }
}