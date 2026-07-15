import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import { 
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


const firebaseConfig = {

  apiKey: "AIzaSyDxy3mF2Na0Cz1U5frZ6Ksfa-FCtshWh84",

  authDomain: "lisaquiz-5d94b.firebaseapp.com",

  projectId: "lisaquiz-5d94b",

  storageBucket: "lisaquiz-5d94b.firebasestorage.app",

  messagingSenderId: "891784323596",

  appId: "1:891784323596:web:1238bac2d31326de950429",

  measurementId: "G-BQ9FKVVVSD"

};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { db, collection, addDoc };