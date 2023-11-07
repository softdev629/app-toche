// !  FOR SCROLL-DOWN NAVIGATION

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
      });
  });
});


// ! THIS IS FOR WEBPACK
function component() {
  const element = document.createElement('div');

  // ! Lodash, currently included via a script, is required for this line to work

  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());


// ! THIS IS FOR FIREBASE
// this didn't work
import { initializeApp } from "/node_modules/firebase/app";
import { getAnalytics } from "/node_modules/firebase/analytics";
import { getAuth, onAuthStateChanged } from '/node_modules/firebase/auth';
import { getFirestore } from '/node_modules/firebase/firestore';


// import { initializeApp } from "firebase/app"

// const firebaseApp = initializeApp({ /* config */ });

// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5IvwxXnlUZlKkU0y5GVnM8f5aDt7-bxA",
  authDomain: "toche-f26b4.firebaseapp.com",
  projectId: "toche-f26b4",
  storageBucket: "toche-f26b4.appspot.com",
  messagingSenderId: "438822071945",
  appId: "1:438822071945:web:e8f65ace443fe371fd6058",
  measurementId: "G-QFFW2265LW"
};

// * backup option 2 code
// const firebaseApp = initializeApp( {
//   apiKey: "AIzaSyC5IvwxXnlUZlKkU0y5GVnM8f5aDt7-bxA",
//   authDomain: "toche-f26b4.firebaseapp.com",
//   projectId: "toche-f26b4",
//   storageBucket: "toche-f26b4.appspot.com",
//   messagingSenderId: "438822071945",
//   appId: "1:438822071945:web:e8f65ace443fe371fd6058",
//   measurementId: "G-QFFW2265LW"
// });



// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Detect auth state
onAuthStateChanged(auth, user => {
  if(user != null) {
    console.log('logged in!');
  } else {
    console.log('No user');
  }
});


// tabs  MOVED TO MAIN...***

// var tabButtons = document.querySelectorAll('.tabs-container .button-container button');
// var tabPanels = document.querySelectorAll(".tabs-container .tab-panel");

// function showPanel(panelIndex){
//     tabButtons.forEach(function(node) {
//         node.style.background = "";
//         node.style.color = "";
//     });
//     tabButtons[panelIndex].style.background = "#007AFF";
//     tabButtons[panelIndex].style.color = "#F6F6F4";

//     tabPanels.forEach(function(node) {
//         node.style.display = "none";
//     });
//     tabPanels[panelIndex].style.display = "block";

// };

// TODO this showPanel has an error, maybe should be # and not class

// showPanel(0);



// ! Popups MOVED TO MAIN...***

// function legendRank(){
//     const rankPopButt = document.getElementById('rank-infos');
//     const rankPopWrap = document.querySelector('.rankPop-wrapper');
//     const rankPopClose = document.querySelector('.rp-close');

//     rankPopButt.addEventListener('click', () => {
//         console.log('button clicked');
//         rankPopWrap.style.display = 'block';
//     });

//     rankPopClose.addEventListener('click', () => {
//         rankPopWrap.style.display = 'none';
//     });

//     rankPopWrap.addEventListener('click', () => {
//         rankPopWrap.style.display = 'none';
//     });
// };


// ! moved to main.js, delete later
// ! tabs

// var tabButtons = document.querySelectorAll('.tabs-container .button-container button');
// var tabPanels = document.querySelectorAll(".tabs-container .tab-panel");

// function showPanel(panelIndex){
//     tabButtons.forEach(function(node) {
//         node.style.background = "";
//         node.style.color = "";
//     });
//     tabButtons[panelIndex].style.background = "#007AFF";
//     tabButtons[panelIndex].style.color = "#F6F6F4";

//     tabPanels.forEach(function(node) {
//         node.style.display = "none";
//     });
//     tabPanels[panelIndex].style.display = "block";

// };
// TODO this showPanel has an error, maybe should be # and not class
// showPanel(0);




// ! moved to main.js, delete later
// ! Popups

// function togglePopup(){
//     document.getElementById(popup-ranking).classList.toggle("active");
// }



// function legendRank(){
//     const rankPopButt = document.getElementById('rank-infos');
//     const rankPopWrap = document.querySelector('.rankPop-wrapper');
//     const rankPopClose = document.querySelector('.rp-close');

//     rankPopButt.addEventListener('click', () => {
//         console.log('button clicked');
//         rankPopWrap.style.display = 'block';
//     });

//     rankPopClose.addEventListener('click', () => {
//         rankPopWrap.style.display = 'none';
//     });

//     rankPopWrap.addEventListener('click', () => {
//         rankPopWrap.style.display = 'none';
//     });
// };