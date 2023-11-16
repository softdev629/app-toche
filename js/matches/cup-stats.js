const showPanel = (id) => () => {
  for (let i = 0; i < 3; ++i) {
    const element = document.getElementsByClassName("tab-panel")[i];
    if (element.classList.contains("show")) element.classList.remove("show");
    if (i === id) element.classList.add("show");
  }
};

window.onload = () => {
  document
    .getElementById("btn-standings")
    .addEventListener("click", showPanel(0));
  document
    .getElementById("btn-matches")
    .addEventListener("click", showPanel(1));
  document.getElementById("btn-info").addEventListener("click", showPanel(2));
};
