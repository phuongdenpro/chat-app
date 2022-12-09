// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTitbaB9Uh920_HCBiSrJfWQr71_Yt570",
  authDomain: "gavroche-chat-auth.firebaseapp.com",
  projectId: "gavroche-chat-auth",
  storageBucket: "gavroche-chat-auth.appspot.com",
  messagingSenderId: "190776827437",
  appId: "1:190776827437:web:cdd475007e738bb03da2a4",
  measurementId: "G-VJK7FP2M06"
};

const phoneAuth = (req,res) =>{
    var {phoneNumber} = req.body; 
    
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);