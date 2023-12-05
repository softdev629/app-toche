import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  getDocs,
  collection,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { firebaseConfig } from "./config.js";

// initialize firebase connection
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const arenasRef = collection(db, "arenas");

window.onload = async () => {
  document
    .getElementById("chooseRanking")
    .addEventListener("change", async (event) => {
      document.getElementById("ranks-table").replaceChildren([]);
      const cacheDoc = await getDoc(doc(db, "arenas", event.target.value));
      const cacheData = cacheDoc.data();

      const rankArray = [];
      for (let i in Object.keys(cacheData.ranks)) {
        rankArray.push(cacheData.ranks[i]);
      }
      const sortRank = rankArray.sort((a, b) =>
        b.lp === a.lp ? b.e - a.e : b.lp - a.lp
      );
      for (let i in sortRank) {
        const trElement = document.createElement("tr");
        trElement.className = "ranking-row";
        trElement.innerHTML = `<td id="rank-position">${parseInt(i) + 1}</td>
        <td id="player" class="player-name table-highlight">${
          sortRank[i].name
        }</td>
        <td id="distance" class="distance">${sortRank[i].d}</td>
        <td id="matches-played">${sortRank[i].m}</td>
        <td id="matches-won">${sortRank[i].w}</td>
        <td id="efficiency">${sortRank[i].e.toFixed(0)}%</td>
        <td id="turbo-power">${sortRank[i].e.toFixed(0)}%</td>
        <td id="league-points" class="table-highlight">${sortRank[i].lp}</td>`;
        document.getElementById("ranks-table").appendChild(trElement);
      }
    });

  // initialize arena list
  const arenaQuerySnapshot = await getDocs(arenasRef);
  arenaQuerySnapshot.forEach((doc) => {
    const arenaData = doc.data();
    const optionElement = document.createElement("option");
    optionElement.value = doc.id;
    optionElement.innerHTML = arenaData.name;
    document.getElementById("chooseRanking").append(optionElement);
  });
};
