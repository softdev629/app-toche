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
  getCountFromServer,
  updateDoc,
  arrayUnion,
  doc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

import { firebaseConfig } from "../config.js";
import { checkToast } from "../script.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const usersRef = collection(db, "users");
const arenasRef = collection(db, "arenas");

const addLabelText = (node, label, text) => {
  const labelElement = document.createElement("p");
  labelElement.className = "account-label";
  labelElement.innerHTML = label;
  node.appendChild(labelElement);

  const textElement = document.createElement("p");
  textElement.className = "account-text";
  textElement.innerHTML = text.replaceAll("\n", "<br/>");
  node.appendChild(textElement);
};

const addStat = (node, num, icon, label) => {
  const stateValue = document.createElement("p");
  stateValue.className = "account-text-stat";
  stateValue.innerHTML = num;
  node.appendChild(stateValue);

  const iconContainer = document.createElement("div");
  iconContainer.className = "account-arena-icons";

  const imgElement = document.createElement("img");
  imgElement.src = `/img/${icon}.svg`;
  imgElement.alt = "";
  imgElement.className = "account-arena-pix";
  iconContainer.appendChild(imgElement);

  const iconLabel = document.createElement("p");
  iconLabel.innerHTML = label;
  iconContainer.appendChild(iconLabel);

  node.appendChild(iconContainer);
  return stateValue;
};

window.onload = () => {
  checkToast();

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
      // get user doc from firestore
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshotUser = await getDocs(q);
      const userRef = querySnapshotUser.docs[0];

      // Get all arenas data from firestore
      const querySnapshotArena = await getDocs(arenasRef);

      querySnapshotArena.forEach(async (item) => {
        const data = item.data();

        // remove new arena button if user is already owner of one arena
        if (data.manager_email === user.email) {
          const parent = document.getElementsByClassName("header-back")[0];
          const lastChild = parent.lastElementChild;
          parent.removeChild(lastChild);
        }

        // create html elements to show data
        const arenaInfoBox = document.createElement("div");
        arenaInfoBox.className = "arena-info-box";

        const arenaTitle = document.createElement("h2");
        arenaTitle.className = "cup-info-title";
        arenaTitle.innerHTML = data.name;
        arenaInfoBox.appendChild(arenaTitle);

        // add basic arena information
        addLabelText(arenaInfoBox, "City", data.city);
        addLabelText(arenaInfoBox, "Country", data.country);
        addLabelText(arenaInfoBox, "Address", data.address);
        addLabelText(arenaInfoBox, "Manager", data.manager_name);
        addLabelText(arenaInfoBox, "Contact", data.manager_email);

        // add arena stats
        const arenaStats = document.createElement("div");
        arenaStats.className = "account-arena-stats";

        // count players in arena
        const qPlayers = query(
          usersRef,
          where("arenas", "array-contains", item.id)
        );
        const snapshotPlayers = await getCountFromServer(qPlayers);
        addStat(
          arenaStats,
          snapshotPlayers.data().count,
          "AccountOff",
          "PLAYERS"
        );

        // count cups in arena
        addStat(arenaStats, 0, "CupsOff", "CUPS");

        arenaInfoBox.appendChild(arenaStats);

        const joinHandler = async () => {
          await updateDoc(doc(db, "users", userRef.id), {
            arenas: arrayUnion(item.id),
          });
          Toastify({
            text: "Arena joined successfully",
            style: { background: "#2ecc71" },
          }).showToast();
        };

        const buttonDiv = document.createElement("div");
        buttonDiv.className = "button-div";
        const joinBtn = document.createElement("button");
        joinBtn.innerHTML = "JOIN";
        joinBtn.className = "button";
        joinBtn.addEventListener("click", joinHandler);
        buttonDiv.appendChild(joinBtn);

        arenaInfoBox.appendChild(buttonDiv);

        document
          .getElementsByClassName("content-box")[0]
          .appendChild(arenaInfoBox);
      });

      // Finish loading
      document.body.removeChild(loadingDiv);
    }
  });
};
