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

// firebase connection basic actions
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const arenasRef = collection(db, "arenas");
const cupsRef = collection(db, "cups");

// Cup Generator

function generateFixtures(event) {
  event.preventDefault();

  // get cup inputs
  const category = document.getElementById("category").value;
  const trophyType = document.getElementById("trophyType").value;
  const prizes = document.getElementById("prizes").value;
  const arenaID = document.getElementById("arena-id").value;
  const arenaName = document.getElementById("arena-name").innerHTML;
  const startingDate = document.getElementById("startingDate").value;
  const cupName = document.getElementById("cupName").value;
  const rounds = parseInt(document.getElementById("rounds").value);
  const players = parseInt(document.getElementById("players").value);

  // get player t-shirt names
  const playerNames = [];
  for (let i = 0; i < players; i++) {
    const playerName = prompt(`Enter T-Shirt Name for Player ${i + 1}:`);
    playerNames.push(playerName || `Player ${i + 1}`);
  }

  // print all information
  const fixtureOutput = document.getElementById("fixtureOutput");
  const tournamentInfo = document.getElementById("tournamentInfo");
  fixtureOutput.innerHTML = "";
  tournamentInfo.innerHTML = `
      <h2>Tournament Information</h2>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Trophy:</strong> ${trophyType}</p>
      <p><strong>Prizes:</strong> ${prizes}</p>
      <p><strong>Arena Name:</strong> ${arenaName}</p>
      <p><strong>Starting Date:</strong> ${startingDate}</p>
      <p><strong>Cup Name:</strong> ${cupName}</p>
      <p><strong>Number of Matches:</strong> ${calculateMatches(players)}</p>
    `;

  // plan all matches for all players in cup
  const matchdays = generateMatchdays(players, playerNames);

  fixtureOutput.innerHTML += "<h2>Fixtures</h2>";

  // print match plan
  for (let matchday = 0; matchday < matchdays.length; matchday++) {
    fixtureOutput.innerHTML += `<h3>Matchday ${matchday + 1}</h3>`;
    for (let match = 0; match < matchdays[`${matchday}`].length; match++) {
      fixtureOutput.innerHTML += `<p>Match ${match + 1}: ${
        playerNames[matchdays[`${matchday}`][match].left]
      } vs ${playerNames[matchdays[`${matchday}`][match].right]}</p>`;
    }
  }

  console.log(matchdays);

  // save cup info and match plan in firestore(cup collection)
  addDoc(cupsRef, {
    category,
    trophy_type: trophyType,
    prizes,
    arena_id: arenaID,
    arena_name: arenaName,
    starting_date: startingDate,
    rounds,
    cup_name: cupName,
    players,
    player_names: playerNames,
    match: matchdays,
  }).then(() =>
    Toastify({
      text: "Cup generated successfully",
      style: { background: "#2ecc71" },
    }).showToast()
  );
}

// number of total matches
export function calculateMatches(players) {
  return (players * (players - 1)) / 2;
}

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
          });
        }
        // add player which isn't included in the match with last player
        matchdays[`${center}`].push({ left: center, right: players - 1 });
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
          });
      }
      break;
  }

  return matchdays;
}

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
      localStorage.setItem("toast_type", "error");
      location.href = LOGIN_ROUTE;
    } else {
      console.log(user.email);
      // Get user information from firebase store with email
      const q = query(arenasRef, where("manager_email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) {
        localStorage.setItem("toast", "No arena, create arena first.");
        localStorage.setItem("toast_type", "error");
        location.href = "/matches/new-arena.html";
        return;
      }
      document.getElementById("arena-id").value = querySnapshot.docs[0].id;
      const doc = querySnapshot.docs[0].data();
      document.getElementById("arena-name").innerHTML = doc.name;

      // Loading finished
      document.body.removeChild(loadingDiv);
    }
  });

  // connect events
  document
    .getElementById("cup-form")
    .addEventListener("submit", generateFixtures);
};
