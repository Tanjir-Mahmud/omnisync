// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAl0sqy2mVZ0zltetkx6z1PBFJ8yw-geEs",
    authDomain: "omnisync-pro.firebaseapp.com",
    projectId: "omnisync-pro",
    storageBucket: "omnisync-pro.firebasestorage.app",
    messagingSenderId: "291139403326",
    appId: "1:291139403326:web:ef6687927462bddd0fdb6f",
    measurementId: "G-ZMFXCP7GQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
