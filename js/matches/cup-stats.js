import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { firebaseConfig } from "../config.js";
import { NEW_MATCH } from "../constant.js";

// initialize firebase connection
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  const standings = {};
  for (let day in Object.keys(cupData.matches)) {
    let idx = 0;
    for (let match of cupData.matches[day]) {
      const trItem = document.createElement("tr");
      trItem;
      console.log(match);
      switch (match.status) {
        case "pending":
          trItem.innerHTML = `<td>
          <span>${cupData.tshirt_names[match.left]}</span>
          <br/>
          vs
          <br/>
          <span>${cupData.tshirt_names[match.right]}</span>
        </td>
        <td></td>
        <td style="padding-top: 20px"><button class="button" id="btn-${day}-${idx}">Start</button></td>`;
          break;
        case "finished":
          trItem.innerHTML = `<td>${cupData.arena_name}</td>
      <td>${match.date}</td>
      <td>${cupData.category}</td>

      <td>${cupData.tshirt_names[match.left]}</td>
      <td>${match.s1}</td>
      <td>${match.p1}</td>
      <td>${match.max1}</td>
      <td>${match.e1.toFixed(2)}%</td>

      <td>${cupData.tshirt_names[match.right]}</td>
      <td>${match.s2}</td>
      <td>${match.p2}</td>
      <td>${match.max2}</td>
      <td>${match.e2.toFixed(2)}%</td>`;

          if (
            Object.keys(standings).some((key) => key === match.left.toString())
          ) {
            standings[match.left.toString()].m += 1;
            standings[match.left.toString()].w += match.s1 > match.s2 ? 1 : 0;
            standings[match.left.toString()].s += match.p1;
            standings[match.left.toString()].e =
              (standings[match.left.toString()].e *
                (standings[match.left.toString()].m - 1) +
                match.e1) /
              standings[match.left.toString()].m;
            standings[match.left.toString()].tp =
              (standings[match.left.toString()].tp *
                (standings[match.left.toString()].m - 1) +
                match.tp1) /
              standings[match.left.toString()].m;
          } else {
            standings[match.left.toString()] = {
              name: cupData.tshirt_names[match.left],
              d: cupData.distances[match.left],
              m: 1,
              w: match.s1 > match.s2 ? 1 : 0,
              s: match.p1,
              e: match.e1,
              tp: match.tp1,
            };
          }

          if (
            Object.keys(standings).some((key) => key === match.right.toString())
          ) {
            standings[match.right.toString()].m += 1;
            standings[match.right.toString()].w += match.s1 < match.s2 ? 1 : 0;
            standings[match.right.toString()].s += match.p2;
            standings[match.right.toString()].e =
              (standings[match.right.toString()].e *
                (standings[match.right.toString()].m - 1) +
                match.e2) /
              standings[match.right.toString()].m;
            standings[match.right.toString()].tp =
              (standings[match.right.toString()].tp *
                (standings[match.right.toString()].m - 1) +
                match.tp2) /
              standings[match.left.toString()].m;
          } else {
            standings[match.right.toString()] = {
              name: cupData.tshirt_names[match.right],
              d: cupData.distances[match.right],
              m: 1,
              w: match.s1 < match.s2 ? 1 : 0,
              s: match.p2,
              e: match.e2,
              tp: match.tp2,
            };
          }
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

  const ranks = [];
  for (let i of Object.keys(standings)) {
    ranks.push(standings[i]);
  }
  const sorted_ranks = ranks.sort((a, b) =>
    b.w - a.w === 0 ? b.s - a.s : b.w - a.w
  );
  console.log(sorted_ranks);

  let rank_index = 0;
  for (let player of sorted_ranks) {
    console.log(player.e);
    const trElement = document.createElement("tr");
    trElement.className = "cup-row";
    trElement.innerHTML = `<td>${++rank_index}</td>
    <td class="player-name table-highlight">${player.name}</td>
    <td class="distance">${player.d}</td>
    <td>${player.m}</td>
    <td>${player.w}</td>
    <td>${player.s}</td>
    <td>${player.e.toFixed(2)}%</td>
    <td class="table-highlight">${player.tp.toFixed(2)}%</td>`;
    document.getElementById("standing-table").append(trElement);
  }

  document.getElementById("cup-info-name").innerHTML = cupData.cup_name;
  document.getElementById("cup-info-arena").innerHTML = cupData.arena_name;
  document.getElementById("cup-info-category").innerHTML = cupData.category;
  document.getElementById("cup-info-prize").innerHTML = cupData.prizes;
  document.getElementById("cup-info-players").innerHTML =
    (cupData.players.length * (cupData.players.length - 1)) / 2;
  document.getElementById("cup-info-rounds").innerHTML = cupData.rounds;
  const split_date = cupData.starting_date.split("-");
  const start_date = new Date(
    parseInt(split_date[0]),
    parseInt(split_date[1]) - 1,
    parseInt(split_date[2])
  );
  const end_date = new Date(start_date);
  end_date.setDate(start_date.getDate() + 8);
  document.getElementById("cup-info-timeframe").innerHTML = `${
    cupData.starting_date
  }<br/>
  ${end_date.getFullYear()}-${(end_date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${end_date.getDate().toString().padStart(2, "0")}`;

  document
    .getElementById("btn-standings")
    .addEventListener("click", showPanel(0));
  document
    .getElementById("btn-matches")
    .addEventListener("click", showPanel(1));
  document.getElementById("btn-info").addEventListener("click", showPanel(2));

  document.body.removeChild(loadingDiv);
};
