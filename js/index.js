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
  or,
  getDoc,
  doc,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { firebaseConfig } from "./config.js";
import { LOGIN_ROUTE } from "./constant.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersRef = collection(db, "users");
const matchesRef = collection(db, "matches");
const auth = getAuth(app);

window.onload = () => {
  // User information loading start
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("loading");
  document.body.appendChild(loadingDiv);

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // No user, log out
      localStorage.setItem("toast", "Not logged in");
      localStorage.setItem("toast_type", "error");
      location.href = LOGIN_ROUTE;
    } else {
      // Get user information from firebase store with email
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      document.getElementById("user-ID").innerHTML = userData.name;
      document.getElementById("distance").innerHTML = userData.distance;

      let arenaList = "";
      for (let i of userData.arenas) {
        const arenaDoc = await getDoc(doc(db, "arenas", i));
        const arenaData = arenaDoc.data();
        if (arenaList !== "") arenaList += `, ${arenaData.name}`;
        else arenaList += arenaData.name;
      }
      document.getElementById("arenas").innerHTML = arenaList;
      console.log(userDoc.id);
      const matchesQ = query(
        matchesRef,
        or(where("p1_id", "==", userDoc.id), where("p2_id", "==", userDoc.id))
      );
      const matchQuerySnapshot = await getDocs(matchesQ);
      const matchQueryLength = matchQuerySnapshot.docs.length;

      let efficiency_sum = 0,
        turboPower = 0,
        averagePT = 0,
        maxPT = 0,
        averageSong = 0,
        maxSong = 0,
        yearPlayed = 0,
        yearWon = 0,
        yearTP = 0,
        allPlayed = 0,
        allWon = 0,
        allTP = 0;
      for (let i = 0; i < matchQueryLength; ++i) {
        const matchData = matchQuerySnapshot.docs[i].data();
        if (matchData.p1_id === userDoc.id) {
          efficiency_sum += matchData.e1;
          turboPower += matchData.tp1;
          averagePT += matchData.pt1;
          maxPT = maxPT > matchData.pt1 ? maxPT : matchData.pt1;
          averageSong += matchData.av1;
          maxSong = maxSong > matchData.max1 ? maxSong : matchData.max1;
          allPlayed += 1;
          allWon += matchData.s1 > matchData.s2 ? 1 : 0;
          allTP += matchData.tp1;
          if (
            matchData.date.split("-")[0] === new Date().getFullYear().toString()
          ) {
            yearPlayed += 1;
            yearWon += matchData.s1 > matchData.s2 ? 1 : 0;
            yearTP += matchData.tp1;
          }
        }
        if (matchData.p2_id === userDoc.id) {
          efficiency_sum += matchData.e2;
          turboPower += matchData.tp2;
          averagePT += matchData.pt2;
          maxPT = maxPT > matchData.pt2 ? maxPT : matchData.pt2;
          averageSong += matchData.av2;
          maxSong = maxSong > matchData.max2 ? maxSong : matchData.max2;
          allPlayed += 1;
          allWon += matchData.s1 < matchData.s2 ? 1 : 0;
          allTP += matchData.tp2;
          if (
            matchData.date.split("-")[0] === new Date().getFullYear().toString()
          ) {
            yearPlayed += 1;
            yearWon += matchData.s1 < matchData.s2 ? 1 : 0;
            yearTP += matchData.tp2;
          }
        }
      }

      const latestMatchesQ = query(
        matchesRef,
        or(where("p1_id", "==", userDoc.id), where("p2_id", "==", userDoc.id)),
        orderBy("date"),
        limit(10)
      );
      const latestMatchQuerySnapshot = await getDocs(latestMatchesQ);
      console.log(latestMatchQuerySnapshot.docs.length);

      const graphData = [];
      for (let i = 0; i < latestMatchQuerySnapshot.docs.length; ++i) {
        const matchData = latestMatchQuerySnapshot.docs[i].data();
        if (matchData.p1_id === userDoc.id) {
          graphData.push({
            date: matchData.date,
            value: matchData.e1.toFixed(0),
          });
        }
        if (matchData.p2_id === userDoc.id) {
          graphData.push({
            date: matchData.date,
            value: matchData.e2.toFixed(0),
          });
        }
      }

      document.getElementById("myEfficiency").innerHTML = `${(
        efficiency_sum / matchQueryLength
      ).toFixed(0)}%`;
      document.getElementById("myTurbo").innerHTML = `${(
        turboPower / matchQueryLength
      ).toFixed(0)}%`;
      document.getElementById("avg-pt").innerHTML = (
        averagePT / matchQueryLength
      ).toFixed(0);
      document.getElementById("max-pt").innerHTML = maxPT;
      document.getElementById("avg-song").innerHTML = (
        averageSong / matchQueryLength
      ).toFixed(0);
      document.getElementById("max-song").innerHTML = maxSong;

      document.getElementById(
        "playtime-year"
      ).innerHTML = `Playtime ${new Date().getFullYear()}`;

      document.getElementById("year-played").innerHTML = yearPlayed;
      document.getElementById("year-won").innerHTML = yearWon;
      document.getElementById("year-tp").innerHTML = `${(
        yearTP / yearPlayed
      ).toFixed(0)}%`;
      document.getElementById("all-played").innerHTML = allPlayed;
      document.getElementById("all-won").innerHTML = allWon;
      document.getElementById("all-tp").innerHTML = `${(
        allTP / allPlayed
      ).toFixed(0)}%`;

      // Set up the SVG canvas dimensions
      //   **** width is hardcoded to 300, couldn't get it to work well
      var margin = { top: 40, right: 30, bottom: 20, left: 30 };
      var width = 300 - margin.left - margin.right;
      var height = 250 - margin.top - margin.bottom;

      // Parse the date data
      var parseDate = d3.timeParse("%Y-%m-%d");

      // Format the data
      graphData.forEach(function (d) {
        d.date = parseDate(d.date);
      });

      // Create scales for the data
      var xScale = d3
        .scaleTime()
        .domain(
          d3.extent(graphData, function (d) {
            return d.date;
          })
        )
        .range([0, width]);
      var yScale = d3
        .scaleLinear()
        .domain([
          d3.min(graphData, function (d) {
            return d.value;
          }),
          d3.max(graphData, function (d) {
            return d.value;
          }),
        ])
        .range([height, 0]);

      //   var yScale = d3.scaleLinear().domain([0, d3.max(data, function(d) { return d.value; })]).range([height, 0]);

      // Create the line generator without curve interpolation
      var line = d3
        .line()
        .x(function (d) {
          return xScale(d.date);
        })
        .y(function (d) {
          return yScale(d.value);
        });

      // Create the SVG element
      var svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Draw the line without the area underneath
      svg
        .append("path")
        .datum(graphData)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 2);

      // Add X axis with custom ticks
      var xAxis = d3
        .axisBottom(xScale)
        .tickValues([graphData[0].date, graphData[graphData.length - 1].date])
        .tickFormat(d3.timeFormat("%Y-%m-%d"));

      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // Add Y axis only
      svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

      // FONT
      svg.selectAll(".x-axis text").attr("class", "graph-text");

      svg.selectAll(".y-axis text").attr("class", "graph-text");

      const qCups = query(
        collection(db, "cups"),
        where("players", "array-contains", userDoc.id)
      );
      const snapshotCups = await getDocs(qCups);
      snapshotCups.forEach((cupDoc) => {
        const cupData = cupDoc.data();

        const standings = {};
        for (let day in Object.keys(cupData.matches)) {
          for (let match of cupData.matches[day]) {
            if (
              Object.keys(standings).some(
                (key) => key === match.left.toString()
              )
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
                id: cupData.players[match.left],
                d: cupData.distances[match.left],
                m: 1,
                w: match.s1 > match.s2 ? 1 : 0,
                s: match.p1,
                e: match.e1,
                tp: match.tp1,
              };
            }

            if (
              Object.keys(standings).some(
                (key) => key === match.right.toString()
              )
            ) {
              standings[match.right.toString()].m += 1;
              standings[match.right.toString()].w +=
                match.s1 < match.s2 ? 1 : 0;
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
                id: cupData.players[match.right],
                d: cupData.distances[match.right],
                m: 1,
                w: match.s1 < match.s2 ? 1 : 0,
                s: match.p2,
                e: match.e2,
                tp: match.tp2,
              };
            }
          }
        }

        const ranks = [];
        let rank_val;
        for (let i of Object.keys(standings)) {
          ranks.push(standings[i]);
        }
        const sorted_ranks = ranks.sort((a, b) =>
          b.w - a.w === 0 ? b.s - a.s : b.w - a.w
        );

        for (let i in sorted_ranks) {
          if (sorted_ranks[i].id === userDoc.id) rank_val = parseInt(i) + 1;
        }

        const statsRankingBox = document.createElement("div");
        statsRankingBox.className = "stats-ranking-box";
        statsRankingBox.innerHTML = `<h2 class="stats-orange-text stats-ranking-text">${cupData.cup_name}</h2>
  <p class="stat-rank-label">Standing in cup:</p>
  <span class="playtime-figure">${rank_val}</span>
  <p class="stat-rank-label">Players:</p>
  <span class="playtime-figure">${cupData.players.length}</span>
  <p class="stat-rank-label">Category:</p>
  <span class="playtime-figure">${cupData.category}</span>
  <!-- TODO add actual cup page -->
  <a href="/matches/cup-stats.html" class="account-action">SEE CUP STANDINGS</a>`;
        document.getElementById("cup-section").appendChild(statsRankingBox);
      });

      document.body.removeChild(loadingDiv);
    }
  });
};
