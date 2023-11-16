import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  where,
  query,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { firebaseConfig } from "../config.js";
import { LOGIN_ROUTE } from "../constant.js";
import { checkToast } from "../script.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const usersRef = collection(db, "users");
const arenasRef = collection(db, "arenas");

const newArenaHandler = (event) => {
  event.preventDefault();

  // Get arena information
  const arenaName = document.getElementById("arena-name").value;
  const city = document.getElementById("city").value;
  const country = document.getElementById("country").value;
  const address = document.getElementById("address").value;
  const managerEmail = document.getElementById("manager-email").value;
  const managerName = document.getElementById("manager-name").value;

  //   Add to firebase store
  addDoc(arenasRef, {
    name: arenaName,
    city,
    country,
    address,
    manager_email: managerEmail,
    manager_name: managerName,
  }).then(() => {
    Toastify({
      text: "Arena created successfully",
      style: { background: "#2ecc71" },
    }).showToast();
    document.getElementById("new-arena-form").reset();
  });
};

window.onload = () => {
  checkToast();

  // User information loading start
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("loading");
  document.body.appendChild(loadingDiv);

  // Check user information from local cache
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // No user, log out
      localStorage.setItem("toast", "Not logged in");
      localStorage.setItem("toast_type", "error");
      location.href = LOGIN_ROUTE;
    } else {
      // Set user email as manager email in hidden field
      document.getElementById("manager-email").value = user.email;

      // Get user information from firebase store with email
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0].data();

      // Set user name as manager name in hidden field
      document.getElementById("manager-name").value = doc.name;

      // Loading finished
      document.body.removeChild(loadingDiv);
    }
  });

  document
    .getElementById("new-arena-form")
    .addEventListener("submit", newArenaHandler);
};
