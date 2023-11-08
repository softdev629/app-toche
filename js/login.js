import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { firebaseConfig } from "../config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginHandler = (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(userCredential);
      Toastify({
        text: "Log in successfully",
        style: { background: "#2ecc71" },
      }).showToast();
      localStorage.setItem("logged_in", "true");
      location.href = "/account.html";
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

document.getElementById("login-form").addEventListener("submit", loginHandler);
