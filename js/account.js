import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { checkAuth, checkFrom } from "./auth.js";
import { firebaseConfig } from "../config.js";
import { LOGIN_ROUTE, LOGOUT_ROUTE } from "./constant.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function logoutHandler(event) {
  event.preventDefault();
  signOut(auth)
    .then(() => {
      localStorage.setItem("from", LOGOUT_ROUTE);
      location.href = LOGIN_ROUTE;
    })
    .catch((err) => console.log(err));
}

window.onload = () => {
  checkAuth();
  checkFrom();
  document
    .getElementById("link-logout")
    .addEventListener("click", logoutHandler);
};
