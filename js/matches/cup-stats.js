import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  where,
  query,
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
  doc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { firebaseConfig } from "../config.js";
import { ARENAS, CUP_STATS, LOGIN_ROUTE, NEW_MATCH } from "../constant.js";

// initialize firebase connection
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const usersRef = collection(db, "users");
const cupsRef = collection(db, "cups");

const showPanel = (id) => () => {
  for (let i = 0; i < 3; ++i) {
    const element = document.getElementsByClassName("tab-panel")[i];
    if (element.classList.contains("show")) element.classList.remove("show");
    if (i === id) element.classList.add("show");
  }
};

window.onload = async () => {
  // loading data from firebase
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("loading");
  document.body.appendChild(loadingDiv);

  const cupId = localStorage.getItem("cup_id");
  const cupDocRef = doc(db, "cups", cupId);
  const cupDoc = await getDoc(cupDocRef);
  const cupData = cupDoc.data();

  // add matches to table
  const matchTable = document.getElementById("match-table");
  for (let day in Object.keys(cupData.matches)) {
    let idx = 0;
    for (let match of cupData.matches[day]) {
      const trItem = document.createElement("tr");
      trItem.className = "pending";
      switch (match.status) {
        case "pending":
          trItem.innerHTML = `<td>
          <span>${cupData.tshirt_names[match.left]}</span>
          <br/>
          vs
          <br/>
          <span>${cupData.tshirt_names[match.right]}</span>
        </td>
        <td><button class="button" id="btn-${day}-${idx}">Start</button></td>`;
          break;
        case "finished":
          trItem.innerHTML = `<td>${cupData.arena_name}</td>
      <td>${match.info.date}</td>
      <td>${cupData.category}</td>

      <td>${cupData.tshirt_names[match.left]}</td>
      <td>${match.info.s1}</td>
      <td>${match.info.p1}</td>
      <td>${match.info.max1}</td>
      <td>${match.info.e1}%</td>

      <td>${cupData.tshirt_names[match.right]}</td>
      <td>${match.info.s2}</td>
      <td>${match.info.p2}</td>
      <td>${match.info.max2}</td>
      <td>${match.info.e2}%</td>`;
          break;
      }
      matchTable.append(trItem);
      if (match.status === "pending") {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const date = today.getDate().toString().padStart(2, "0");
        const formattedDate = year + "/" + month + "/" + date;

        document
          .getElementById(`btn-${day}-${idx}`)
          .addEventListener("click", () => {
            const matchInfo = {
              arena_id: cupData.arena_id,
              arena_name: cupData.arena_name,
              player1_id: cupData.players[match.left],
              player1_name: cupData.tshirt_names[match.left],
              player2_id: cupData.players[match.right],
              player2_name: cupData.tshirt_names[match.right],
              cup_id: cupDoc.id,
              cup_name: cupData.cup_name,
              date: formattedDate,
            };
            localStorage.setItem("match_info", JSON.stringify(matchInfo));
            location.href = NEW_MATCH;
          });
      }
      ++idx;
    }
  }

  document
    .getElementById("btn-standings")
    .addEventListener("click", showPanel(0));
  document
    .getElementById("btn-matches")
    .addEventListener("click", showPanel(1));
  document.getElementById("btn-info").addEventListener("click", showPanel(2));

  document.body.removeChild(loadingDiv);
};
