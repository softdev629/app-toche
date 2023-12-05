import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  query,
  collection,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { firebaseConfig } from "./config.js";

// initialize firebase connection
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const matchesRef = collection(db, "matches");

window.onload = async () => {
  // loading data from firebase
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("loading");
  document.body.appendChild(loadingDiv);

  const q = query(matchesRef);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const trElement = document.createElement("tr");
    trElement.innerHTML = `<td id="arena">${data.arena_name}</td>
    <td id="date">${data.date}</td>
    <td id="category">${data.category}</td>

    <td id="player1">${data.p1_name}</td>
    <td id="p1Songs">${data.s1}</td>
    <td id="p1Points">${data.pt1}</td>
    <td id="p1MaxPS">${data.max1}</td>
    <td id="p1Efficiency">${data.e1.toFixed(2)}%</td>

    <td id="player2">${data.p2_name}</td>
    <td id="p2Songs">${data.s2}</td>
    <td id="p2Points">${data.pt2}</td>
    <td id="p2MaxPS">${data.max2}</td>
    <td id="p2Efficiency">${data.e2.toFixed(2)}%</td>`;

    document.getElementById("statics-table").appendChild(trElement);
  });

  document.body.removeChild(loadingDiv);
};
