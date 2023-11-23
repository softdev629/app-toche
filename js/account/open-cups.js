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

import { firebaseConfig } from "../config.js";
import { NEW_ARENA } from "../constant.js";

// initialize firebase connection
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const usersRef = collection(db, "users");
const cupsRef = collection(db, "cups");
const arenasRef = collection(db, "arenas");

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

      const arenaQ = query(arenasRef, where("manager_email", "==", user.email));
      const arenaQuerySnapshot = await getDocs(arenaQ);
      if (arenaQuerySnapshot.docs.length === 0) {
        localStorage.setItem("toast", "No arena, create arena first.");
        localStorage.setItem("toast_type", "error");
        location.href = NEW_ARENA;
        return;
      }
      const arenaDoc = arenaQuerySnapshot.docs[0];

      // filter joined arena cups
      const cupsQ = query(
        cupsRef,
        where("arena_id", "==", arenaDoc.id),
        where("status", "==", "upcoming")
      );
      const cupsQuerySnapshot = await getDocs(cupsQ);

      // add cups to sections
      const upcomingSection = document.querySelector("section");
      cupsQuerySnapshot.forEach((cupDoc) => {
        const cupData = cupDoc.data();
        const schedule = generateMatchdays(cupData.players.length);
        console.log(schedule);

        const upcomingBox = document.createElement("div");
        upcomingBox.className = "upcoming-box";
        upcomingBox.innerHTML = `<p class="banner-title">${cupData.cup_name}</p>
              <div class="banner-left">
                <img src="/img/${cupData.banner}" alt="" class="banner-pix" />
                <p class="banner-join" id="btn-close-${doc.id}">CLOSE</p>
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

        const onClose = async () => {
          await updateDoc(doc(db, "cups", cupDoc.id), {
            status: "ongoing",
            matches: schedule,
          });
          Toastify({
            text: "Cup's been ongoing successfully",
            style: { background: "#2ecc71" },
          }).showToast();
        };

        document
          .getElementById(`btn-close-${doc.id}`)
          .addEventListener("click", onClose);
      });
    }
    // Loading finished
    document.body.removeChild(loadingDiv);
  });
};

export function generateMatchdays(players) {
  const matchdays = {};

  switch (players % 2) {
    // if number of players is even
    case 0:
      // center loop is center axios
      for (let center = 0; center < players - 1; ++center) {
        matchdays[`${center}`] = [];
        // first make a plan about without one player (players - 1 : odd)
        // half loop is delta from axios
        for (let half = 1; half <= (players - 2) / 2; ++half) {
          // get two elements which is same distance away from center axios(delta half away)
          matchdays[`${center}`].push({
            left:
              center + half >= players - 1
                ? center + half - players + 1
                : center + half,
            right:
              center - half < 0 ? center - half + players - 1 : center - half,
            status: "pending",
          });
        }
        // add player which isn't included in the match with last player
        matchdays[`${center}`].push({
          left: center,
          right: players - 1,
          status: "pending",
        });
      }
      break;
    // if number of players is odd
    case 1:
      // center loop is center axios
      for (let center = 0; center < players; ++center) {
        matchdays[`${center}`] = [];
        // half loop is delta from axios
        for (let half = 1; half <= (players - 1) / 2; ++half)
          // get two elements which is same distance away from center axios(delta half away)
          matchdays[`${center}`].push({
            left:
              center + half >= players
                ? center + half - players
                : center + half,
            right: center - half < 0 ? center - half + players : center - half,
            status: "pending",
          });
      }
      break;
  }

  return matchdays;
}
