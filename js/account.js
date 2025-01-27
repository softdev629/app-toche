import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { checkAuth, checkToast } from "./script.js";
import { firebaseConfig } from "./config.js";
import { LOGIN_ROUTE, LOGOUT_ROUTE } from "./constant.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function logoutHandler(event) {
  event.preventDefault();
  signOut(auth)
    .then(() => {
      location.href = LOGIN_ROUTE;
    })
    .catch((err) => console.log(err));
}

window.onload = () => {
  // Check auth
  checkAuth();

  // Check toast
  checkToast();

  // Connect events with handlers
  document
    .getElementById("link-logout")
    .addEventListener("click", logoutHandler);
};
