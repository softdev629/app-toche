import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { firebaseConfig } from "../config.js";
import { ACCOUNT_ROUTE, LOGIN_ROUTE } from "./constant.js";
import { checkFrom } from "./auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginHandler = (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      localStorage.setItem("from", LOGIN_ROUTE);
      location.href = ACCOUNT_ROUTE;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      let errMsg = "";
      console.log(errorCode);
      switch (errorCode) {
        case "auth/invalid-login-credentials":
          errMsg = "Invalid email or password";
          break;
        default:
          errMsg = "Something went wrong";
          break;
      }
      Toastify({ text: errMsg, style: { background: "#e74c3c" } }).showToast();
    });
};

window.onload = () => {
  checkFrom();
  document
    .getElementById("login-form")
    .addEventListener("submit", loginHandler);
};
