<template>

  <div id="page">
    <div class="title-box">Campus Choice</div>
    <div class="logo-container-login">
      <img src="../assets/images/UniOfGalwayLogo.png" height="225" width="225" style="border-radius: 15px; box-shadow: 8px 8px 8px black;"/>
    </div>

  <div class="container">
    <div class="login-whitebox">
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input type="email" v-model="email" class="form-control" id="exampleInputEmail1"
             aria-describedby="emailHelp" placeholder="Enter email">
      <small id="emailHelp" class="form-text text-muted">We'll never share your email with
        anyone else.</small></div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input type="password" v-model="password" class="form-control"
             id="exampleInputPassword1" placeholder="Password">
    </div>
    <button @click="register" class="btn btn-primary">Create Account</button>
    <br> <router-link to="/login">Sign In</router-link>
    </div>
  </div>
  </div>
</template>
<script>


import {initializeApp} from "firebase/app";

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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
export default {
  name: "Registration",
  data(){
    return {
      email: "",
      password:""
    }
  },
  methods : {
    register(){
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, this.email, this.password)
          .then((userCredential) => {
// Signed in
            const user = userCredential.user;
            console.log(user)
            this.$router.push({path: '/select'})
// ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
// ..
          });
    }
  }
}
</script>



<style scoped>

</style>