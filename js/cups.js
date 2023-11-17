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
  updateDoc,
  arrayUnion,
  doc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { firebaseConfig } from "./config.js";
import { CUP_STATS, LOGIN_ROUTE } from "./constant.js";

// initialize firebase connection
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const usersRef = collection(db, "users");
const cupsRef = collection(db, "cups");

window.onload = () => {
  // loading data from firebase
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("loading");
  document.body.appendChild(loadingDiv);

  // check user authentication info from local cache
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // no user, log out
      localStorage.setItem("toast", "Not logged in");
      localStorage.setItem("toast_type", "error");
      location.href = LOGIN_ROUTE;
    } else {
      // get user information from firebase store with email
      const userQ = query(usersRef, where("email", "==", user.email));
      const userQuerySnapshot = await getDocs(userQ);
      const userDoc = userQuerySnapshot.docs[0].data();

      // filter joined arena cups
      const cupsQ = query(cupsRef, where("arena_id", "in", userDoc.arenas));
      const cupsQuerySnapshot = await getDocs(cupsQ);

      // add cups to sections
      const upcomingSection = document.querySelector("section");
      const otherSection = document.querySelectorAll("section")[1];
      cupsQuerySnapshot.forEach((cupDoc) => {
        const cupData = cupDoc.data();
        switch (cupData.status) {
          case "upcoming":
            const upcomingBox = document.createElement("div");
            upcomingBox.className = "upcoming-box";
            upcomingBox.innerHTML = `<p class="banner-title">${cupData.cup_name}</p>
            <div class="banner-left">
              <img src="/img/${cupData.banner}" alt="" class="banner-pix" />
              <p class="banner-join" id="btn-join-${doc.id}">JOIN</p>
            </div>
  
            <div class="banner-right">
              <img src="/img/icon-arena.svg" alt="" class="banner-icon" />
              <p>${cupData.arena_name}</p>
              <img src="/img/icon-category.svg" alt="" class="banner-icon" />
              <p class="banner-text">${cupData.category}</p>
              <img src="/img/icon-players.svg" alt="" class="banner-icon" />
              <p class="banner-text">${cupData.players.length}</p>
              <img src="/img/cup-titles.svg" alt="" class="banner-icon" />
              <p class="banner-text">${cupData.trophy_type}</p>
              <img src="/img/icon-calendar.svg" alt="" class="banner-icon" />
              <p class="banner-text">${cupData.starting_date}</p>
            </div>`;
            upcomingSection.appendChild(upcomingBox);

            const onJoin = async () => {
              await updateDoc(doc(db, "cups", cupDoc.id), {
                players: arrayUnion(userQuerySnapshot.docs[0].id),
              });
              Toastify({
                text: "Cup joined successfully",
                style: { background: "#2ecc71" },
              }).showToast();
            };

            document
              .getElementById(`btn-join-${doc.id}`)
              .addEventListener("click", onJoin);
            break;
          default:
            const cupAnchor = document.createElement("a");
            cupAnchor.href = "#";
            cupAnchor.addEventListener("click", (event) => {
              event.preventDefault();
              localStorage.setItem("cup_id", cupDoc.id);
              location.href = CUP_STATS;
            });
            cupAnchor.innerHTML = `
            <div class="upcoming-box box-white">
              <p class="banner-title">${cupData.cup_name}</p>
  
              <div class="banner-left">
                <img src="/img/${cupData.banner}" alt="" class="banner-pix" />
                <p class="cup-cell-on">${cupData.status.toUppercase()}</p>
              </div>
  
              <div class="banner-right">
                <img src="/img/icon-arena.svg" alt="" class="banner-icon" />
                <p>${cupData.arena_name}</p>
                <img src="/img/icon-category.svg" alt="" class="banner-icon" />
                <p class="banner-text">${cupData.category}</p>
                <img src="/img/icon-calendar.svg" alt="" class="banner-icon" />
                <p class="banner-text">${cupData.starting_date}</p>
  
                <img src="/img/cup-titles.svg" alt="" class="banner-icon" />
                <p class="banner-text">${cupData.trophy_type}</p>
                <img src="/img/icon-players.svg" alt="" class="banner-icon" />
                <p class="banner-text">${cupData.players.length}</p>
              </div>
            </div>
          `;
            otherSection.appendChild(cupAnchor);
            break;
        }
      });
    }
    // Loading finished
    document.body.removeChild(loadingDiv);
  });
};
