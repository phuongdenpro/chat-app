import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";


// const firebaseConfig = {
//     apiKey: "AIzaSyDTitbaB9Uh920_HCBiSrJfWQr71_Yt570",
//     authDomain: "gavroche-chat-auth.firebaseapp.com",
//     projectId: "gavroche-chat-auth",
//     storageBucket: "gavroche-chat-auth.appspot.com",
//     messagingSenderId: "190776827437",
//     appId: "1:190776827437:web:cdd475007e738bb03da2a4",
//     measurementId: "G-VJK7FP2M06"

// };
const firebaseConfig = {
    apiKey: "AIzaSyCEAk6gOiJ_iVzKP0M7ZR5YFHphxh_CXVA",
    authDomain: "phone-f9757.firebaseapp.com",
    projectId: "phone-f9757",
    storageBucket: "phone-f9757.appspot.com",
    messagingSenderId: "772206497685",
    appId: "1:772206497685:web:915e0507257818ace3309c",
    measurementId: "G-SYLFFN105Q"
  };

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);