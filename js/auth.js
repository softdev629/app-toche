import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { firebaseConfig } from "./config.js";
import { LOGIN_ROUTE, UNAUTHENTICATED_ROUTE } from "./constant.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const checkAuth = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      localStorage.setItem("toast", "Not logged in");
      location.href = LOGIN_ROUTE;
    }
  });
};

export const checkToast = () => {
  const toastText = localStorage.getItem("toast");
  if (toastText && toastText !== "") {
    Toastify({
      text: toastText,
      style: { background: "#2ecc71" },
    }).showToast();
    localStorage.setItem("toast", "");
  }
};
