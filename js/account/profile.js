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
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { firebaseConfig } from "../config.js";
import { LOGIN_ROUTE } from "../constant.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const users = collection(db, "users");
const auth = getAuth(app);

window.onload = () => {
  // User information loading start
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("loading");
  document.body.appendChild(loadingDiv);

  // Check user authentication info from local cache
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // No user, log out
      localStorage.setItem("toast", "Not logged in");
      location.href = LOGIN_ROUTE;
    } else {
      // Get user information from firebase store with email
      const q = query(users, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0].data();

      // Show user information on view
      document.getElementById("tshirt-name").innerHTML = doc.tshirtName;
      document.getElementById("name").innerHTML = doc.name;
      document.getElementById("mobile").innerHTML = doc.telephone;
      document.getElementById("email").innerHTML = doc.email;

      document.getElementById("birthdate").innerHTML = doc.birthday;
      document.getElementById("distance").innerHTML = doc.distance;

      // Loading finished
      document.body.removeChild(loadingDiv);
    }
  });
};
