
<template >




  <button @click="logout()" id="logout" v-show="false">logout</button>

  <div class="menu-side">

    <div class="side-nav">

      <div class="logo-container">
        <img src="../assets/images/UniOfGalwayLogo.png" height="225" width="225"/>
        <h2>Campus Choice</h2>
      </div>

      <ul>
        <router-link to="/select" class="links">
        <img src="../assets/images/select.png"  class="select-icon"/><br>
        </router-link>
        <router-link to="/upload" class="links">
        <img src="../assets/images/upload.png" class="upload-icon" />
        </router-link>
        <label for="logout" class="logout-image" >

        <img src="../assets/images/LogOutV1-removebg-preview.png" class="logout-icon"/>

        </label>
      </ul>



    </div>

  </div>





  <div id="leaderboard-page">
    <div class="cool-background">
      <img src="../assets/images/crown-removebg-preview.png" class="cool-background-image"/>
    </div>
    <div class="crown">
      <img src="../assets/images/crown-removebg-preview.png" class="crown-image"/>
    </div>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br>

        <div class="leaderboard">
          <p v-html="htmlMessage"></p>
        </div>

  </div>



</template>

<script>
//imports
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc ,updateDoc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore, increment } from "firebase/firestore";
import {getAuth, signOut} from "firebase/auth";

//firebase configuration
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
const storage = getStorage(app);
const db = getFirestore(app);

export default {

  //data for html elements

  data() {
    return {
      entries: 0,
      htmlMessage: "",
      imageurl: "https://firebasestorage.googleapis.com/v0/b/campus-choice-84968.appspot.com/o/0_nedxMbwYe3CzPGga.png?alt=media&token=a29410fd-1ef3-4ac7-b3be-f726d50a1f91",
      start:  '<div class="entry-container"><div class="entry-whitebox"> <div class="place-number">',
      approvedentries: [],
      approvedentriesordered: []
    };
  },

  created() {

    this.createleaderboard()


  },


//here is where all the methods are stored
  methods: {
    async createleaderboard() {
      await this.orderentries();
      for(let i = this.approvedentries.length - 1; i >= 0; i--) {
        await this.createleaderboardentry(this.approvedentries[i].entryno, (Math.abs(i-this.approvedentries.length)))

      }
    },
    async orderentries(){
      await this.checkallapprovedentries();

      //selection sort

      const n = this.approvedentries.length;
      for (let i = 0; i < n - 1; i++) {
        // Find the index of the minimum element in the unsorted part of the array
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
          if (this.approvedentries[j].score < this.approvedentries[minIndex].score) {
            minIndex = j;
          }
        }

        // Swap the found minimum element with the first element
        if (minIndex !== i) {
          const temp = this.approvedentries[minIndex];
          this.approvedentries[minIndex] = this.approvedentries[i];
          this.approvedentries[i] = temp;
        }

      }
      console.log(this.approvedentries)
      return this.approvedentries;
    },
    logout() {
      signOut(getAuth(app)).then(() => {
// Send them back to the home page!
        this.$router.push("/login");
      });
    },
    async checkapproved(number){
      //gets current entry name using entrynumber
      const entryname = "entry"+number;
      const img1Ref = doc(db, "images", entryname);
      const img1Snapshot = await getDoc(img1Ref);
      //checks if image has been approved (approved set to true or false)
      const imgapproved = img1Snapshot.data().approved;


      //returns true or false for returnapproved()function to use
      if(imgapproved === true){
        return true;
      }else{
        return false;
      }

    },
    async checkallapprovedentries() {
      //get total number of entries
      const entryRef = doc(db, "images", "totalentries");
      const docSnapshot = await getDoc(entryRef);
      this.entries = docSnapshot.data().number;

      //for loop cycles through entries to add approved entry numbers to
      for(let i=0; i<this.entries; i++){
        if(await this.checkapproved(i+1) === true){

          const entryname = "entry"+(i+1);
          const entryRef = doc(db, "images", entryname);
          const docSnapshot = await getDoc(entryRef);
          let newscore = docSnapshot.data().score;
          let entryno = docSnapshot.data().entryno;
          this.approvedentries.push({ score: newscore, entryno: entryno });
        }
      }
      return this.approvedentries
    },
    async createleaderboardentry(entrynumber, placenumber) {

      let beggining =this.start+placenumber+'</div><img src="'

      const entryname = "entry"+entrynumber

      const img1Ref = doc(db, "images", entryname);
      const img1Snapshot = await getDoc(img1Ref);
      const imageurl = img1Snapshot.data().url;

      let start = beggining+imageurl+'alt="Image" class = "entryImage"><div><div class="score"><span class="score-text">Score: '

      const scoreRef = doc(db, "images", entryname);
      const scoreSnapshot = await getDoc(scoreRef);
      const score = scoreSnapshot.data().score;

      let middle = start+score+'</span></div><br><div class="description"> <span class="description-text">'

      const entrydescRef = doc(db, "images", entryname);
      const entrySnapshot = await getDoc(entrydescRef);
      const description = entrySnapshot.data().description;

      let end = middle+description+'</span></div></div></div></div><br><br><br><br><br><br><br><br><br><br>'

      this.htmlMessage = this.htmlMessage+end;


    }


  }
};

</script>

<style scoped>

</style>