import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
  getFirestore,
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { firebaseConfig } from "../config.js";

// Basic firebase process
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signupHandler = (event) => {
  event.preventDefault();

  // Get signup information from inputs
  const name = document.getElementById("name").value;
  const tshirtName = document.getElementById("tshirtName").value;
  const nationality = document.getElementById("nationality").value;
  const birthday = document.getElementById("birthday").value;
  const distance = document.getElementById("distance").value;
  const countryCode = document.getElementById("countryCode").value;
  const telephone = document.getElementById("telephone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm");
  const termsAgree = document.getElementById("terms-agree").value;

  // If password and confirm doesn't match
  if (password !== passwordConfirm.value) {
    Toastify({
      text: "Password doesn't match",
      style: { background: "#e74c3c" },
    }).showToast();
    return;
  }

  // Signup on firebase authentication system
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Add additional params to firebase store
      addDoc(collection(db, "users"), {
        name,
        tshirt_name: tshirtName,
        nationality,
        birthday,
        distance,
        country_code: countryCode,
        telephone,
        email,
        terms_check: termsAgree,
        arenas: [],
      }).then(() => {
        Toastify({
          text: "Signed up successfully",
          style: { background: "#2ecc71" },
        }).showToast();
      });
    })
    .catch((error) => {
      // Handle error
      const errorCode = error.code;
      let errMsg;
      switch (errorCode) {
        // Conflict email
        case "auth/email-already-in-use":
          errMsg = "Email already in use";
          break;
        default:
          errMsg = "Something went wrong.";
          break;
      }

      // Show error toast
      Toastify({
        text: errMsg,
        style: { background: "#e74c3c" },
      }).showToast();
    });
};

// Connect form submit event with handler function
document
  .getElementById("signup-form")
  .addEventListener("submit", signupHandler);
