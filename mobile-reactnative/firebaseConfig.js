import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDTitbaB9Uh920_HCBiSrJfWQr71_Yt570",
    authDomain: "gavroche-chat-auth.firebaseapp.com",
    projectId: "gavroche-chat-auth",
    storageBucket: "gavroche-chat-auth.appspot.com",
    messagingSenderId: "190776827437",
    appId: "1:190776827437:web:cdd475007e738bb03da2a4",
    measurementId: "G-VJK7FP2M06"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
