// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage"
import { getFirestore, increment } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyClrNDXXKpD1BKshHIeuwb5bbLWzluGUa0",
    authDomain: "campus-choice-84968.firebaseapp.com",
    projectId: "campus-choice-84968",
    storageBucket: "campus-choice-84968.appspot.com",
    messagingSenderId: "345072721056",
    appId: "1:345072721056:web:fea889e7acf874e8dbfdc5",
    measurementId: "G-EVZKCPC03V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app)

export const countRef = db.collection('images').doc('totalentries');
countRef.update({
    number: increment(1)
})
    .then(() => {
        console.log("Count updated successfully!");
    })
    .catch((error) => {
        console.error("Error updating count:", error);
    });

export default app;