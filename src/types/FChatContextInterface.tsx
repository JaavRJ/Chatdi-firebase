import { FirebaseApp } from "firebase/app";
import { userDataInterface } from "./userDataInterface";

export interface FChatContextInterface {
    userData: userDataInterface | null,
    loadingUser: Boolean,
    errorUser: Object | null,
    loginWithGoogle: Function,
    loginWithFacebook: Function,
    logout: Function,
}