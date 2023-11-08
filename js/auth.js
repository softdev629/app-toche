import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { firebaseConfig } from "../config.js";
import {
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  UNAUTHENTICATED_ROUTE,
} from "./constant.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const checkAuth = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      localStorage.setItem("from", UNAUTHENTICATED_ROUTE);
      location.href = LOGIN_ROUTE;
    }
  });
};

export const checkFrom = () => {
  const from = localStorage.getItem("from");
  switch (from) {
    case LOGIN_ROUTE:
      Toastify({
        text: "Logged in successfully",
        style: { background: "#2ecc71" },
      }).showToast();
      break;
    case LOGOUT_ROUTE:
      Toastify({
        text: "Logged out successfully",
        style: { background: "#e74c3c" },
      }).showToast();
    case UNAUTHENTICATED_ROUTE:
      Toastify({
        text: "Not logged in",
        style: { background: "#e74c3c" },
      }).showToast();
  }
};
