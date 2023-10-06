// tabs

document.addEventListener('DOMContentLoaded', function() {
    var tabButtons = document.querySelectorAll('.tabs-container .button-container button');
    var tabPanels = document.querySelectorAll(".tabs-container .tab-panel");


    function showPanel(panelIndex){
        tabButtons.forEach(function(node) {
            node.style.background = "";
            node.style.color = "";
        });
        tabButtons[panelIndex].style.background = "#007AFF";
        tabButtons[panelIndex].style.color = "#F6F6F4";

        tabPanels.forEach(function(node) {
            node.style.display = "none";
        });
        tabPanels[panelIndex].style.display = "block";

    };

    showPanel(0);
});


// Popups 
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.querySelectorAll('.popup');
    const openBtn = document.uerySelectorAll('.open-btn');
    const closeBtn = document.querySelectorAll('.close');

    function openPopup(index) {
        popup[index].style.display = 'block';
    }

    function closePopup(index) {
        popup(index).style.display = 'none';
    }

    openBtn.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            openPopup(index);
        });
    });

    closeBtn.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            closePopup(index);
        });
    });
});


// ! Popups Rank OLD

// function legendRank(){
//     const rankPopButt = document.getElementById('rank-infos');
//     const rankPopWrap = document.querySelector('.rankPop-wrapper');
//     const rankPopClose = document.querySelector('.rp-close');

//     rankPopButt.addEventListener('click', () => {
//         console.log('button clicked');
//         rankPopWrap.style.display = 'block';
//     });

//     rankPopClose.addEventListener('click', () => {
//         rankPopWrap.style.display = 'none';
//     });

//     rankPopWrap.addEventListener('click', () => {
//         rankPopWrap.style.display = 'none';
//     });
// };