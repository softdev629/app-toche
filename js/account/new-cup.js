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
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

import { firebaseConfig } from "../config.js";
import { NEW_ARENA } from "../constant.js";

// firebase connection basic actions
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const arenasRef = collection(db, "arenas");
const cupsRef = collection(db, "cups");

// Cup Generator

function generateFixtures(event) {
  event.preventDefault();

  // // Create the file metadata
  // /** @type {image} */
  // const metadata = {
  //   contentType: "image/jpeg",
  // };

  // // Upload file and metadata to the object 'images/mountains.jpg'
  // const timestamp = new Date().getTime(); // Get current timestamp
  // const randomString = Math.random().toString(36).substring(2); // Generate random string

  // const fileName = `img_${timestamp}_${randomString}`; // Combine timestamp and random string
  const file = document.getElementById("banner").files[0];
  // const storageRef = ref(
  //   storage,
  //   "images/" + `${fileName}.${file.name.split(".")[1]}`
  // );
  // const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // // Listen for state changes, errors, and completion of the upload.
  // uploadTask.on(
  //   "state_changed",
  //   (snapshot) => {
  //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     console.log("Upload is " + progress + "% done");
  //     switch (snapshot.state) {
  //       case "paused":
  //         console.log("Upload is paused");
  //         break;
  //       case "running":
  //         console.log("Upload is running");
  //         break;
  //     }
  //   },
  //   (error) => {
  //     // A full list of error codes is available at
  //     // https://firebase.google.com/docs/storage/web/handle-errors
  //     switch (error.code) {
  //       case "storage/unauthorized":
  //         // User doesn't have permission to access the object
  //         break;
  //       case "storage/canceled":
  //         // User canceled the upload
  //         break;

  //       // ...

  //       case "storage/unknown":
  //         // Unknown error occurred, inspect error.serverResponse
  //         break;
  //     }
  //   },
  //   () => {
  //     // Upload completed successfully, now we can get the download URL
  //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //       console.log("File available at", downloadURL);
  //     });
  //   }
  // );

  // get cup inputs
  const category = document.getElementById("category").value;
  const trophyType = document.getElementById("trophyType").value;
  const prizes = document.getElementById("prizes").value;
  const arenaID = document.getElementById("arena-id").value;
  const arenaName = document.getElementById("arena-name").innerHTML;
  const startingDate = document.getElementById("startingDate").value;
  const cupName = document.getElementById("cupName").value;
  const rounds = parseInt(document.getElementById("rounds").value);

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
    banner: file.name,
    status: "upcoming",
    players: [],
    type: "special",
    tshirt_names: [],
    distances: [],
  }).then(() => {
    Toastify({
      text: "Cup generated successfully",
      style: { background: "#2ecc71" },
    }).showToast();
    document.getElementById("cup-form").reset();
    document.getElementById("preview").src = "";
  });
}

const onFileChange = (event) => {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    console.log(file);
    document.querySelector('label[for="banner"] span').innerHTML = file.name;
    document.getElementById("preview").src = URL.createObjectURL(file);
  }
};

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
      // get arena information from firebase store with email
      const q = query(arenasRef, where("manager_email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) {
        localStorage.setItem("toast", "No arena, create arena first.");
        localStorage.setItem("toast_type", "error");
        location.href = NEW_ARENA;
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
  document.getElementById("banner").addEventListener("change", onFileChange);
};
