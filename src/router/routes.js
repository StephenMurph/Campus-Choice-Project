import {initializeApp} from "firebase/app";

function loadPage (component) {
// '@' is aliased to src/components
    return () => import(/* webpackChunkName: "[request]" */
    `@/pages/${component}.vue`)}
export default [
    { path: '/home', component: loadPage('Home') },
    { path: '/', component: loadPage('Login') },
    { path: '/select', component: loadPage('Selection Page'),beforeEnter: isAuth },
    { path: '/upload', component: loadPage('Submission Page'),beforeEnter: isAuth },
    {path: '/registration', component: loadPage('Registration') },
    { path: '/leaderboard', component: loadPage('Leaderboard'),beforeEnter: isAuth },
    { path: '/login', component: loadPage('Login')}
]

import { getAuth, onAuthStateChanged } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyClrNDXXKpD1BKshHIeuwb5bbLWzluGUa0",
    authDomain: "campus-choice-84968.firebaseapp.com",
    projectId: "campus-choice-84968",
    storageBucket: "campus-choice-84968.appspot.com",
    messagingSenderId: "345072721056",
    appId: "1:345072721056:web:fea889e7acf874e8dbfdc5",
    measurementId: "G-EVZKCPC03V"
};

const app = initializeApp(firebaseConfig);

//function to check if user is logged in
function isAuth(to, from, next) {
    console.log("Checking auth");
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user);
// User is signed in so continue to desired page
            return next();
// ...
        } else {
// User is signed out
// Send them back to the login page
            return next({path: '/login'});
        }
    });
}
