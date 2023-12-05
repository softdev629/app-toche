import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  where,
  query,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { firebaseConfig } from "../config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const arenasRef = collection(db, "arenas");
const cupsRef = collection(db, "cups");
const matchesRef = collection(db, "matches");

// PLAYERS
const newMatchForm = document.querySelector(".new-match-info");

// TODO make sure there are no equal player names
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");

// MATCH SPECS
const chooseArena = document.getElementById("chooseArena");
const chooseCup = document.getElementById("chooseCup");
const chooseDate = document.getElementById("chooseDate");

// ARRAY
const p1Array = [];
const p2Array = [];

for (let i = 1; i <= 25; ++i) {
  p1Array.push(document.getElementById(`p1s${i}Points`));
  document.getElementById(`p1s${i}Points`).value = Math.floor(
    Math.random() * 11 + 15
  );
  p2Array.push(document.getElementById(`p2s${i}Points`));
  document.getElementById(`p2s${i}Points`).value = Math.floor(
    Math.random() * 11 + 15
  );
}

// SCORE CALCULATIONS
const scoreCalculations = document.querySelector(".score-calculations");

// ! FUNCTIONS BELOW

//  SONGS WON FUNCTION
// TODO add error prompt if p1Songer = p2Songer
const p1Songs = document.getElementById("p1Songs");
const p2Songs = document.getElementById("p2Songs");
let p1Songer = 0;
let p2Songer = 0;

function songCounter() {
  p1Songer = p2Songer = 0;

  for (let i = 0; i < p1Array.length; i++) {
    if (parseInt(p1Array[i].value) > parseInt(p2Array[i].value)) {
      p1Songer += 1;
    } else {
      p2Songer += 1;
    }
  }

  p1Songs.innerText = p1Songer;
  p2Songs.innerText = p2Songer;

  // TODO add error prompt if p1Songer = p2Songer
}

// TOTAL POINTS FUNCTIONS
const p1Points = document.getElementById("p1Points");
const p2Points = document.getElementById("p2Points");
let p1Pointer = 0;
let p2Pointer = 0;

// TODO make sure there are no equal point numbers
function totalPoints() {
  p1Pointer = p2Pointer;

  for (let i = 0; i < p1Array.length; i++) {
    if (parseInt(p1Array[i].value)) {
      p1Pointer += parseInt(p1Array[i].value);
    }

    document.getElementById("p1Points").value = p1Pointer;
    p1Points.innerText = p1Pointer;
  }

  for (let i = 0; i < p2Array.length; i++) {
    if (parseInt(p2Array[i].value)) {
      p2Pointer += parseInt(p2Array[i].value);
    }

    document.getElementById("p2Points").value = p2Pointer;
    p2Points.innerText = p2Pointer;
  }
}

//  AVG P/S
const p1Average = document.getElementById("p1Average");
const p2Average = document.getElementById("p2Average");
let p1Avg = 0;
let p2Avg = 0;

function averagePoints() {
  p1Avg = p1Pointer / 25;
  p2Avg = p2Pointer / 25;

  p1Average.innerText = p1Avg.toFixed(0);
  p2Average.innerText = p2Avg.toFixed(0);
}

// MATCH WINNER
// ! Not included in UX, just passed to DB
let p1Winner = "";
let p2Winner = "";

function winner() {
  if (p1Songer > p2Songer) {
    p1Winner = "Won";
    p2Winner = "Lost";
  }

  if (p1Songer < p2Songer) {
    p1Winner = "Lost";
    p2Winner = "Won";
  }
}

//  EFFICIENCY
let p1Efficient = 0;
let p2Efficient = 0;
const p1Efficiency = document.getElementById("p1Efficiency");
const p2Efficiency = document.getElementById("p2Efficiency");

function efficiency() {
  p1Efficient = (p1Pointer * 100) / 1200;
  p2Efficient = (p2Pointer * 100) / 1200;

  p1Efficiency.innerHTML = p1Efficient.toFixed(0) + "%";
  p2Efficiency.innerHTML = p2Efficient.toFixed(0) + "%";
}

//  TURBO POWER
let p1TurboPower = 0;
let p2TurboPower = 0;
const p1Turbo = document.getElementById("p1Turbo");
const p2Turbo = document.getElementById("p2Turbo");

function turbo() {
  p1TurboPower = (p1Songer * 100) / 25;
  p2TurboPower = (p2Songer * 100) / 25;

  p1Turbo.innerHTML = p1TurboPower.toFixed(0) + "%";
  p2Turbo.innerHTML = p2TurboPower.toFixed(0) + "%";
}

//  MAXIMUM P/S
let p1MaxPts = 0;
let p2MaxPts = 0;
const p1MaxPS = document.getElementById("p1MaxPS");
const p2MaxPS = document.getElementById("p2MaxPS");

function maxPoints() {
  p1MaxPts = Math.max(...p1Array.map((item) => parseInt(item.value)));

  p2MaxPts = Math.max(...p2Array.map((item) => parseInt(item.value)));

  p1MaxPS.innerText = p1MaxPts;
  p2MaxPS.innerText = p2MaxPts;
}

window.onload = async () => {
  // loading data from firebase
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("loading");
  document.body.appendChild(loadingDiv);

  // get match info data from local storage
  const matchInfoString = localStorage.getItem("match_info");
  const matchInfo = JSON.parse(matchInfoString);

  // cup select change event(update player list)
  chooseCup.addEventListener("change", async (event) => {
    // get cup data from firebase
    const cupDocRef = doc(db, "cups", event.target.value);
    const cupDocSnap = await getDoc(cupDocRef);
    const cupData = cupDocSnap.data();
    localStorage.setItem("cup_data", JSON.stringify(cupData));

    // update player1 select list
    const defaultPlayer1OptionElement = document.createElement("option");
    defaultPlayer1OptionElement.disabled = true;
    defaultPlayer1OptionElement.hidden = true;
    defaultPlayer1OptionElement.selected = true;
    defaultPlayer1OptionElement.innerHTML = "Player 1";

    player1.replaceChildren();
    player1.appendChild(defaultPlayer1OptionElement);

    for (let i = 0; i < cupData.players.length; ++i) {
      const playerOptionElement = document.createElement("option");
      playerOptionElement.value = cupData.players[i];
      playerOptionElement.innerHTML = cupData.tshirt_names[i];
      player1.appendChild(playerOptionElement);
      if (matchInfo.player1_id === cupData.players[i])
        player1.value = matchInfo.player1_id;
    }

    // update player2 select list
    const defaultPlayer2OptionElement = document.createElement("option");
    defaultPlayer2OptionElement.disabled = true;
    defaultPlayer2OptionElement.hidden = true;
    defaultPlayer2OptionElement.selected = true;
    defaultPlayer2OptionElement.innerHTML = "Player 2";

    player2.replaceChildren();
    player2.appendChild(defaultPlayer2OptionElement);

    for (let i = 0; i < cupData.players.length; ++i) {
      const playerOptionElement = document.createElement("option");
      playerOptionElement.value = cupData.players[i];
      playerOptionElement.innerHTML = cupData.tshirt_names[i];
      player2.appendChild(playerOptionElement);
      if (matchInfo.player2_id === cupData.players[i])
        player2.value = matchInfo.player2_id;
    }
  });

  // arena change event(update cup list)
  chooseArena.addEventListener("change", async (event) => {
    // arena select default option
    const defaultCupOptionElement = document.createElement("option");
    defaultCupOptionElement.disabled = true;
    defaultCupOptionElement.hidden = true;
    defaultCupOptionElement.selected = true;
    defaultCupOptionElement.innerHTML = "Select Cup";

    chooseCup.replaceChildren();
    chooseCup.appendChild(defaultCupOptionElement);

    const arenaDocRef = doc(db, "arenas", event.target.value);
    const arenaDocSnap = await getDoc(arenaDocRef);
    const arenaData = arenaDocSnap.data();
    localStorage.setItem("arena_data", JSON.stringify(arenaData));

    // get cup lists from firebase
    const cupQ = query(cupsRef, where("arena_id", "==", event.target.value));
    const cupQuerySnapshot = await getDocs(cupQ);

    cupQuerySnapshot.forEach((doc) => {
      const cupData = doc.data();
      const optionElement = document.createElement("option");
      optionElement.value = doc.id;
      optionElement.innerHTML = cupData.cup_name;
      chooseCup.append(optionElement);
      if (doc.id === matchInfo.cup_id) {
        chooseCup.value = doc.id;
        chooseCup.dispatchEvent(new Event("change"));
      }
    });
  });

  // initialize arena list
  const arenaQuerySnapshot = await getDocs(arenasRef);
  arenaQuerySnapshot.forEach((doc) => {
    const arenaData = doc.data();
    const optionElement = document.createElement("option");
    optionElement.value = doc.id;
    optionElement.innerHTML = arenaData.name;
    chooseArena.append(optionElement);
    if (doc.id === matchInfo.arena_id) {
      chooseArena.value = doc.id;
      chooseArena.dispatchEvent(new Event("change"));
    }
  });

  chooseDate.value = new Date().toISOString().substring(0, 10);

  // ! EVENT LISTENER
  newMatchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // SONGS WON
    songCounter();

    //  TOTAL POINTS
    totalPoints();

    // MATCH WINNER
    // * Not included in UX, just passed to DB
    winner();

    //  AVG P/S
    averagePoints();

    //  EFFICIENCY
    efficiency();

    //  TURBO POWER
    turbo();

    //  MAXIMUM P/S
    maxPoints();

    // TODO figure out the hide and show
    // Making the SCORE CALCULATIONS visible
    // scoreCalculations.classList.add()
    scoreCalculations.style.display = "grid";

    // TODO also hide the SEND button
  });

  document.getElementById("btn-send").addEventListener("click", async () => {
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("loading");
    document.body.appendChild(loadingDiv);

    console.log("Songs Counter:", p1Songer, p2Songer);
    console.log("Total Points: ", p1Pointer, p2Pointer);
    console.log("Match Winner: ", p1Winner, p2Winner);
    console.log("Average Points/Song: ", p1Avg, p2Avg);
    console.log("Efficiency: ", p1Efficient, "%", p2Efficient, "%");
    console.log("Turbo Power: ", p1TurboPower, "%", p2TurboPower, "%");
    console.log("Maximum Points/Song : ", p1MaxPts, p2MaxPts);

    const cupData = JSON.parse(localStorage.getItem("cup_data"));
    const arenaData = JSON.parse(localStorage.getItem("arena_data"));

    const p1_score = [],
      p2_score = [];
    for (let i = 1; i <= 25; ++i) {
      p1_score.push(p1Array[i - 1].value);
      p2_score.push(p2Array[i - 1].value);
    }
    console.log(p1_score, p2_score);

    const matchData = {
      arena_id: chooseArena.value,
      arena_name: chooseArena.options[chooseArena.selectedIndex].innerHTML,
      p1_id: player1.value,
      p1_name: player1.options[player1.selectedIndex].innerHTML,
      p2_id: player2.value,
      p2_name: player2.options[player2.selectedIndex].innerHTML,
      cup_id: chooseCup.value,
      cup_name: chooseCup.options[chooseCup.selectedIndex].innerHTML,
      date: chooseDate.value,
      category: cupData.category,
      p1_score,
      p2_score,
      s1: p1Songer,
      s2: p2Songer,
      pt1: p1Pointer,
      pt2: p2Pointer,
      w1: p1Winner,
      w2: p2Winner,
      av1: p1Avg,
      av2: p2Avg,
      e1: p1Efficient,
      e2: p2Efficient,
      tp1: p1TurboPower,
      tp2: p2TurboPower,
      max1: p1MaxPts,
      max2: p2MaxPts,
    };

    for (let i in Object.keys(cupData.matches)) {
      let j = 0;
      for (j = 0; j < cupData.matches[i].length; ++j) {
        const matchItem = cupData.matches[i][j];

        if (
          matchItem.left === player1.selectedIndex - 1 &&
          matchItem.right === player2.selectedIndex - 1
        ) {
          cupData.matches[i][j].status = "finished";
          cupData.matches[i][j].date = chooseDate.value;
          cupData.matches[i][j].s1 = p1Songer;
          cupData.matches[i][j].s2 = p2Songer;
          cupData.matches[i][j].p1 = p1Pointer;
          cupData.matches[i][j].p2 = p2Pointer;
          cupData.matches[i][j].max1 = p1MaxPts;
          cupData.matches[i][j].max2 = p2MaxPts;
          cupData.matches[i][j].e1 = p1Efficient;
          cupData.matches[i][j].e2 = p2Efficient;
          cupData.matches[i][j].tp1 = p1TurboPower;
          cupData.matches[i][j].tp2 = p2TurboPower;
          cupData.matches[i][j].av1 = p1Avg;
          cupData.matches[i][j].av2 = p2Avg;
          break;
        }
      }
      if (j < cupData.matches[i].length) break;
    }

    await updateDoc(doc(db, "cups", matchData.cup_id), {
      matches: cupData.matches,
    });

    await addDoc(matchesRef, matchData);

    let flag = false;
    for (let i in Object.keys(arenaData.ranks)) {
      if (arenaData.ranks[i].id === matchData.p1_id) {
        flag = true;
        arenaData.ranks[i].d += 1;
        arenaData.ranks[i].m =
          arenaData.ranks[i].m > matchData.max1
            ? arenaData.ranks[i].m
            : matchData.max1;
        arenaData.ranks[i].w += matchData.w1 === "Won";
        arenaData.ranks[i].e =
          (arenaData.ranks[i].e * (arenaData.ranks[i].d - 1) + matchData.e1) /
          arenaData.ranks[i].d;
        arenaData.ranks[i].tp =
          (arenaData.ranks[i].tp * (arenaData.ranks[i].d - 1) + matchData.tp1) /
          arenaData.ranks[i].d;
        arenaData.ranks[i].lp += matchData.w1 === "Won" ? 150 : 100;
        break;
      }
    }

    if (!flag) {
      const newData = {};
      newData.id = matchData.p1_id;
      newData.name = matchData.p1_name;
      newData.d = 1;
      newData.m = matchData.max1;
      newData.w = matchData.w1 === "Won" ? 1 : 0;
      newData.e = matchData.e1;
      newData.tp = matchData.tp1;
      newData.lp = matchData.w1 === "Won" ? 150 : 100;
      arenaData.ranks[Object.keys(arenaData.ranks).length] = newData;
    }

    flag = false;

    for (let i in Object.keys(arenaData.ranks)) {
      if (arenaData.ranks[i].id === matchData.p2_id) {
        flag = true;
        arenaData.ranks[i].d += 1;
        arenaData.ranks[i].m =
          arenaData.ranks[i].m > matchData.max2
            ? arenaData.ranks[i].m
            : matchData.max2;
        arenaData.ranks[i].w += matchData.w2 === "Won";
        arenaData.ranks[i].e =
          (arenaData.ranks[i].e * (arenaData.ranks[i].d - 1) + matchData.e2) /
          arenaData.ranks[i].d;
        arenaData.ranks[i].tp =
          (arenaData.ranks[i].tp * (arenaData.ranks[i].d - 1) + matchData.tp2) /
          arenaData.ranks[i].d;
        arenaData.ranks[i].lp += matchData.w2 === "Won" ? 150 : 100;
        break;
      }
    }

    if (!flag) {
      const newData = {};
      newData.id = matchData.p2_id;
      newData.name = matchData.p2_name;
      newData.d = 1;
      newData.m = matchData.max2;
      newData.w = matchData.w2 === "Won" ? 1 : 0;
      newData.e = matchData.e2;
      newData.tp = matchData.tp2;
      newData.lp = matchData.w2 === "Won" ? 150 : 100;
      arenaData.ranks[Object.keys(arenaData.ranks).length] = newData;
    }

    await updateDoc(doc(db, "arenas", matchData.arena_id), {
      ranks: arenaData.ranks,
    });
    Toastify({
      text: "Match saved successfully",
      style: { background: "#2ecc71" },
    }).showToast();

    document.body.removeChild(loadingDiv);
  });

  document.body.removeChild(loadingDiv);
};
