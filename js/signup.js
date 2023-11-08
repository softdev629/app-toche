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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signupHandler = (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const tshirtName = document.getElementById("tshirtName").value;
  const nationality = document.getElementById("nationality").value;
  const birthday = document.getElementById("birthday").value;
  const sliderDistance = document.getElementById("sliderDistance").value;
  const countryCode = document.getElementById("countryCode").value;
  const telephone = document.getElementById("telephone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm");
  const termsAgree = document.getElementById("terms-agree").value;
  if (password !== passwordConfirm.value) {
    Toastify({
      text: "Password doesn't match",
      style: { background: "#e74c3c" },
    }).showToast();
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      addDoc(collection(db, "users"), {
        name,
        tshirtName,
        nationality,
        birthday,
        sliderDistance,
        countryCode,
        telephone,
        email,
        termsAgree,
      }).then(() => {
        Toastify({
          text: "Signed up successfully",
          style: { background: "#2ecc71" },
        }).showToast();
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      let errMsg;
      switch (errorCode) {
        case "auth/email-already-in-use":
          errMsg = "Email already in use";
          break;
        default:
          errMsg = "Something went wrong.";
          break;
      }
      Toastify({
        text: errMsg,
        style: { background: "#e74c3c" },
      }).showToast();
    });
};

document
  .getElementById("signup-form")
  .addEventListener("submit", signupHandler);
