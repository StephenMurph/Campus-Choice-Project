<template class = "page">

  <button @click="logout()" id="logout" v-show="false">logout</button>

  <div class="menu-side">

    <div class="side-nav">

      <div class="logo-container">
        <img src="../assets/images/UniOfGalwayLogo.png" height="225" width="225"/>
        <h2>Campus Choice</h2>
      </div>

      <ul>
        <router-link to="/upload" class="links">
          <img src="../assets/images/upload.png" class="upload-icon-main" />
        </router-link>

        <router-link to="/leaderboard" class="links">
          <img src="../assets/images/podium.png" class="leaderboard-icon" />
        </router-link>
        <label for="logout" class="logout-image" >

          <img src="../assets/images/LogOutV1-removebg-preview.png" class="logout-icon"/>

        </label>
      </ul>



    </div>

  </div>




  <div id="page">

    <div class="choose-pleas">
      Please pick your favourite
    </div>

    <div class="select-container1">

      <div class="select-white-box1">


    <a @click="changeimages1()">
      <img :src="image1Src" alt="" class="first">
      <div id="description-box1" class="first-description">

      </div>
    </a>


      </div>

    </div>


    <div class="select-container2">

      <div class="select-white-box2">

    <a @click="changeimages2()">
      <img :src="image2Src" alt="" class="second">
      <div id="description-box2" class="second-description">

      </div>
    </a>


      </div>
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

//export default contains all data and functions/methods
export default {
  data() {
    return {
      //variable for left and right images url set to buffering placeholder image by default
      image1Src: "https://i.stack.imgur.com/hu3Fv.png", // Default image URL
      image2Src: "https://i.stack.imgur.com/hu3Fv.png",// Default image URL
      //variables used to check images entry number in firestore database
      image1number: 0,
      image2number: 0,
      option1: "",
      option2: ""
    };
  },
  //images are loaded randomly when page laods
  created() {

    this.loadimages();

  },

  methods: {
    //function generates unique number so that the two images cannot be the same
    generateUniqueRandomNumber(max, excludedNumber) {
      let randomNumber;
      do {
        randomNumber = Math.floor(Math.random() * max) + 1;
      } while (randomNumber === excludedNumber);
      return randomNumber;
    },
    logout() {
      signOut(getAuth(app)).then(() => {
// Send them back to the home page!
        this.$router.push("/login");
      });
    },
    //function checks two numbers arent the same
    nextUniqueNumber(number,excludedNumber, max) {
      do{
        number = (number % max) + 1;
      }while (number === excludedNumber);
      return number;
    },
    //function checks if image has been approved in firestore database
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
    //return approved allows image to be displayed if it is found to be an approved image
    async returnapproved1(number, max){
      // entry number in firestore database
      do{//if entry is not approved it selects next entry untill one is found
        number = (number % max) + 1;
        //coninuously checks if entry is approved
      }while(await this.checkapproved(number) === false)
      //returns approved entry number
      return number;
    },
    //return approved2 allows image to be displayed if it is found to be an approved image
    //and wont return the same immage as the first approved image to keep images unique
    async returnapproved2(number, max, approved1){
      do{
        //if entry is not approved cycles to next entry untill one is
        number = this.nextUniqueNumber(number, approved1, max)
        //continuously checks if number is approved and that the current number is not equal to other image entryno
      }while(await this.checkapproved(number) === false )
      //returns unique approved number
      return number;
    },
    //changeimage1() is called when left image is clicked it updates the score of image selected and selects new random images from database
    async changeimages1() {

      //total entries retrieved from "totalentries" document in images collection in firestore database
      const entryRef = doc(db, "images", "totalentries");
      const docSnapshot = await getDoc(entryRef);
      const entries = docSnapshot.data().number;

      //current entryname is obtained using entrynumber
      let currententryname = "entry" + this.image1number;

      //gets reference to current image
      const currentimgRef = doc(db, "images", currententryname);

      //updates score of current image
      await updateDoc(currentimgRef, { score: increment(1) });

      //selects two unique numbers at random
      let number1 = Math.floor(Math.random() * entries) + 1;
      let number2 = this.generateUniqueRandomNumber(entries, number1)


      //checks if both those images are approved and ensure they are not the same
      number1 = await this.returnapproved1(number1, entries);
      number2 = await this.returnapproved2(number2, entries, number1)

      //gets new entrynames from their entrynumber
      let entryname1 = "entry" + number1;
      let entryname2 = "entry" + number2;

      //gets the new selected image on the lefts url from database
      const img1Ref = doc(db, "images", entryname1);
      const img1Snapshot = await getDoc(img1Ref);
      const img1url = img1Snapshot.data().url;

      //gets the new selected image on the lefts description from database
      const desc1Ref = doc(db, "images", entryname1);
      const desc1Snapshot = await getDoc(desc1Ref);
      this.option1 = desc1Snapshot.data().description;

      const div1 = document.getElementById("description-box1")


      //gets the new selected image on the rights description from database
      const desc2Ref = doc(db, "images", entryname2);
      const desc2Snapshot = await getDoc(desc2Ref);
      this.option2 = desc2Snapshot.data().description;

      const div2 = document.getElementById("description-box2")
      div2.innerHTML = this.option2

      //gets the new selected image on the rights url from database
      const img2Ref = doc(db, "images", entryname2);
      const img2Snapshot = await getDoc(img2Ref);
      const img2url = img2Snapshot.data().url;

      //changes both image url and entrynumbers to update images
      this.image1Src = img1url;
      this.image2Src = img2url;
      this.image1number = number1;
      this.image2number = number2;
      div1.innerHTML = this.option1
      div2.innerHTML = this.option2
    },
    //load images changes both images to new random ones without updating score
    async loadimages() {

      //total entries retrieved from "totalentries" document in images collection in firestore database
      const entryRef = doc(db, "images", "totalentries");
      const docSnapshot = await getDoc(entryRef);
      const entries = docSnapshot.data().number;

      //selects two unique numbers at random
      let number1 = Math.floor(Math.random() * entries) + 1;
      let number2 = this.generateUniqueRandomNumber(entries, number1)


      //checks if both those images are approved and ensure they are not the same
      number1 = await this.returnapproved1(number1, entries);
      number2 = await this.returnapproved2(number2, entries, number1)

      //gets new entrynames from their entrynumber
      let entryname1 = "entry" + number1;
      let entryname2 = "entry" + number2;

      //gets the new selected image on the lefts url from database
      const img1Ref = doc(db, "images", entryname1);
      const img1Snapshot = await getDoc(img1Ref);
      const img1url = img1Snapshot.data().url;

      //gets the new selected image on the lefts description from database
      const desc1Ref = doc(db, "images", entryname1);
      const desc1Snapshot = await getDoc(desc1Ref);
      this.option1 = desc1Snapshot.data().description;

      const div1 = document.getElementById("description-box1")


      //gets the new selected image on the rights description from database
      const desc2Ref = doc(db, "images", entryname2);
      const desc2Snapshot = await getDoc(desc2Ref);
      this.option2 = desc2Snapshot.data().description;

      const div2 = document.getElementById("description-box2")




      //gets the new selected image on the rights url from database
      const img2Ref = doc(db, "images", entryname2);
      const img2Snapshot = await getDoc(img2Ref);
      const img2url = img2Snapshot.data().url;

      //changes both image url and entrynumbers to update images
      this.image1Src = img1url;
      this.image2Src = img2url;
      this.image1number = number1;
      this.image2number = number2
      div1.innerHTML = this.option1
      div2.innerHTML = this.option2

    },
    //changeimage2() is called when right image is clicked it updates the score of image selected and selects new random images from database
    async changeimages2() {

      //total entries retrieved from "totalentries" document in images collection in firestore database
      const entryRef = doc(db, "images", "totalentries");
      const docSnapshot = await getDoc(entryRef);
      const entries = docSnapshot.data().number;

      //current entryname is obtained using entrynumber
      let currententryname = "entry" + this.image2number;

      //gets reference to current image
      const currentimgRef = doc(db, "images", currententryname);

      //updates score of current image
      await updateDoc(currentimgRef, { score: increment(1) });

      //selects two unique numbers at random
      let number1 = Math.floor(Math.random() * entries) + 1;
      let number2 = this.generateUniqueRandomNumber(entries, number1)

      //checks if both those images are approved and ensure they are not the same
      number1 = await this.returnapproved1(number1, entries);
      number2 = await this.returnapproved2(number2, entries, number1)

      //gets new entrynames from their entrynumber
      let entryname1 = "entry" + number1;
      let entryname2 = "entry" + number2;


      //gets the new selected image on the lefts url from database
      const img1Ref = doc(db, "images", entryname1);
      const img1Snapshot = await getDoc(img1Ref);
      const img1url = img1Snapshot.data().url;

      //gets the new selected image on the lefts description from database
      const desc1Ref = doc(db, "images", entryname1);
      const desc1Snapshot = await getDoc(desc1Ref);
      this.option1 = desc1Snapshot.data().description;

      const div1 = document.getElementById("description-box1")

      //gets the new selected image on the rights description from database
      const desc2Ref = doc(db, "images", entryname2);
      const desc2Snapshot = await getDoc(desc2Ref);
      this.option2 = desc2Snapshot.data().description;

      const div2 = document.getElementById("description-box2")


      //gets the new selected image on the rights url from database
      const img2Ref = doc(db, "images", entryname2);
      const img2Snapshot = await getDoc(img2Ref);
      const img2url = img2Snapshot.data().url;

      //changes both image url and entrynumbers to update imagesc
      this.image1Src = img1url;
      this.image2Src = img2url;
      this.image1number = number1;
      this.image2number = number2;
      div1.innerHTML = this.option1
      div2.innerHTML = this.option2
    }
  }
};

</script>

<style scoped>

button {
  position: fixed;
  top: 0;
  left: 0;
}

body {
  background-size: cover;
  background-repeat: no-repeat;
}

</style>