import router from "@/router"
import { api } from "./api";
import { store } from "@/store";

export const auth = {
    async login(user: string, password: string) {
        const res = await api.login(user, password);
        if (res !== null) {
            store.user = res;
            router.push({name:"home"});
        }
    },
    async logout() {
        const res = await api.logout();
        if (res) {
            store.user = undefined;
            router.push({name: "login"});
        }
    }
}