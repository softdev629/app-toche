import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { firebaseConfig } from "../config.js";
import { ACCOUNT_ROUTE } from "../constant.js";
import { checkToast } from "../auth.js";

// Basic firebase process
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginHandler = (event) => {
  event.preventDefault();
  // Get email and password from inputs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Login request processing start
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("loading");
  document.body.appendChild(loadingDiv);

  // Firebase authentication
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Login success
      localStorage.setItem("toast", "Login Successfully");
      location.href = ACCOUNT_ROUTE;

      // Login request processing finished
      document.body.removeChild(loadingDiv);
    })
    .catch((error) => {
      // Handle error
      const errorCode = error.code;
      let errMsg = "";

      console.log(errorCode);
      switch (errorCode) {
        // Invalid credentials
        case "auth/invalid-login-credentials":
          errMsg = "Invalid email or password";
          break;
        // Anything else
        default:
          errMsg = "Something went wrong";
          break;
      }

      // Show error toat
      Toastify({ text: errMsg, style: { background: "#e74c3c" } }).showToast();
    });
};

window.onload = () => {
  // Check toast status
  checkToast();

  // Connect events with elements
  document
    .getElementById("login-form")
    .addEventListener("submit", loginHandler);
};
