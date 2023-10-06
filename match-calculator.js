// ! CONST LIST

// PLAYERS
const newMatchForm = document.querySelector('.new-match-info');

  // TODO make sure there are no equal player names
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');

// TODO add new player name
// ** IF INPUTTING NAME
// const namePattern = /^[a-zA-Z]{3,12}$/;
// const feedback = document.querySelector('.feedback');
// const feedback2 = document.querySelector('.feedback2');


// MATCH SPECS
const chooseArena = document.getElementById('chooseArena');
const chooseCup = document.getElementById('chooseCup');
const chooseDate = document.getElementById('chooseDate');


// POINTS INPUT
const p1s1Points = document.getElementById('p1s1Points');
const p1s2Points = document.getElementById('p1s2Points');
const p1s3Points = document.getElementById('p1s3Points');
const p1s4Points = document.getElementById('p1s4Points');
const p1s5Points = document.getElementById('p1s5Points');

const p1s6Points = document.getElementById('p1s6Points');
const p1s7Points = document.getElementById('p1s7Points');
const p1s8Points = document.getElementById('p1s8Points');
const p1s9Points = document.getElementById('p1s9Points');
const p1s10Points = document.getElementById('p1s10Points');
const p1s11Points = document.getElementById('p1s11Points');
const p1s12Points = document.getElementById('p1s12Points');
const p1s13Points = document.getElementById('p1s13Points');
const p1s14Points = document.getElementById('p1s14Points');
const p1s15Points = document.getElementById('p1s15Points');
const p1s16Points = document.getElementById('p1s16Points');
const p1s17Points = document.getElementById('p1s17Points');
const p1s18Points = document.getElementById('p1s18Points');
const p1s19Points = document.getElementById('p1s19Points');
const p1s20Points = document.getElementById('p1s20Points');
const p1s21Points = document.getElementById('p1s21Points');
const p1s22Points = document.getElementById('p1s22Points');
const p1s23Points = document.getElementById('p1s23Points');
const p1s24Points = document.getElementById('p1s24Points');
const p1s25Points = document.getElementById('p1s25Points');

const p2s1Points = document.getElementById('p2s1Points');
const p2s2Points = document.getElementById('p2s2Points');
const p2s3Points = document.getElementById('p2s3Points');
const p2s4Points = document.getElementById('p2s4Points');
const p2s5Points = document.getElementById('p2s5Points');

const p2s6Points = document.getElementById('p2s6Points');
const p2s7Points = document.getElementById('p2s7Points');
const p2s8Points = document.getElementById('p2s8Points');
const p2s9Points = document.getElementById('p2s9Points');
const p2s10Points = document.getElementById('p2s10Points');
const p2s11Points = document.getElementById('p2s11Points');
const p2s12Points = document.getElementById('p2s12Points');
const p2s13Points = document.getElementById('p2s13Points');
const p2s14Points = document.getElementById('p2s14Points');
const p2s15Points = document.getElementById('p2s15Points');
const p2s16Points = document.getElementById('p2s16Points');
const p2s17Points = document.getElementById('p2s17Points');
const p2s18Points = document.getElementById('p2s18Points');
const p2s19Points = document.getElementById('p2s19Points');
const p2s20Points = document.getElementById('p2s20Points');
const p2s21Points = document.getElementById('p2s21Points');
const p2s22Points = document.getElementById('p2s22Points');
const p2s23Points = document.getElementById('p2s23Points');
const p2s24Points = document.getElementById('p2s24Points');
const p2s25Points = document.getElementById('p2s25Points');


// ARRAY
const p1Array = [p1s1Points, p1s2Points, p1s3Points, p1s4Points, p1s5Points, p1s6Points, p1s7Points, p1s8Points, p1s9Points, p1s10Points, p1s11Points, p1s12Points, p1s13Points, p1s14Points, p1s15Points, p1s16Points, p1s17Points, p1s18Points, p1s19Points, p1s20Points, p1s21Points, p1s22Points, p1s23Points, p1s24Points, p1s25Points];
const p2Array = [p2s1Points, p2s2Points, p2s3Points, p2s4Points, p2s5Points, p2s6Points, p2s7Points, p2s8Points, p2s9Points, p2s10Points, p2s11Points, p2s12Points, p2s13Points, p2s14Points, p2s15Points, p2s16Points, p2s17Points, p2s18Points, p2s19Points, p2s20Points, p2s21Points, p2s22Points, p2s23Points, p2s24Points, p2s25Points ];

// * for testing
// const p1Array = [p1s1Points, p1s2Points, p1s3Points, p1s4Points, p1s5Points];
// console.log(p1Array);
// const p2Array = [p2s1Points, p2s2Points, p2s3Points, p2s4Points, p2s5Points];


// SCORE CALCULATIONS
const scoreCalculations = document.querySelector('.score-calculations')


// ! FUNCTIONS BELOW

//  SONGS WON FUNCTION
// TODO add error prompt if p1Songer = p2Songer
const p1Songs = document.getElementById('p1Songs');
const p2Songs = document.getElementById('p2Songs');
let p1Songer = 0;
let p2Songer = 0;

function songCounter() {
    for(i = 0; i < p1Array.length; i++) {
        if(parseInt(p1Array[i].value) > parseInt(p2Array[i].value)) {
            p1Songer += 1;
        } else {
            p2Songer += 1;
        }
    }

    p1Songs.innerText = p1Songer;
    p2Songs.innerText = p2Songer;

    // TODO add error prompt if p1Songer = p2Songer
};


// TOTAL POINTS FUNCTIONS
const p1Points = document.getElementById('p1Points');
const p2Points = document.getElementById('p2Points');
let p1Pointer = 0;
let p2Pointer = 0;

// TODO make sure there are no equal point numbers
function totalPoints(){
    for(let i = 0; i < p1Array.length; i++) {
        if(parseInt(p1Array[i].value)) {
            p1Pointer += parseInt(p1Array[i].value);
        }
    
        document.getElementById('p1Points').value = p1Pointer;
        p1Points.innerText = p1Pointer; 
    };

    for(let i = 0; i < p2Array.length; i++) {
        if(parseInt(p2Array[i].value)) {
            p2Pointer += parseInt(p2Array[i].value);
        }
    
        document.getElementById('p2Points').value = p2Pointer;
        p2Points.innerText = p2Pointer; 
    };
};


//  AVG P/S
const p1Average = document.getElementById('p1Average');
const p2Average = document.getElementById('p2Average');
let p1Avg = 0;
let p2Avg = 0;

function averagePoints(){
    p1Avg = p1Pointer / 25;
    p2Avg = p2Pointer / 25;

    document.getElementById('p1Average').value = p1Avg;
    document.getElementById('p2Average').value = p2Avg;
    p1Average.innerText = p1Avg.toFixed(0);
    p2Average.innerText = p2Avg.toFixed(0);
};


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
};


//  EFFICIENCY 
let p1Efficient = 0;
let p2Efficient = 0;
const p1Efficiency = document.getElementById('p1Efficiency');
const p2Efficiency = document.getElementById('p2Efficiency');

function efficiency(){
    let p1Efficient = (p1Pointer * 100) / 1200;
    let p2Efficient = (p2Pointer * 100) / 1200;

    document.getElementById('p1Efficiency').value = p1Efficient;
    document.getElementById('p2Efficiency').value = p2Efficient;
    p1Efficiency.textContent = p1Efficient.toFixed(0) + '%';
    p2Efficiency.textContent = p2Efficient.toFixed(0) + '%';
};


//  TURBO POWER
let p1TurboPower = 0;
let p2TurboPower = 0;
const p1Turbo = document.getElementById('p1Turbo');
const p2Turbo = document.getElementById('p2Turbo');

function turbo(){
    let p1TurboPower = (p1Songer * 100) / 25;
    let p2TurboPower = (p2Songer * 100) / 25;

    document.getElementById('p1Turbo').value = p1TurboPower;
    document.getElementById('p2Turbo').value = p2TurboPower;
    p1Turbo.textContent = p1TurboPower.toFixed(0) + '%';
    p2Turbo.textContent = p2TurboPower.toFixed(0) + '%';
};


//  MAXIMUM P/S
let p1MaxPts = 0;
let p2MaxPts = 0;
const p1MaxPS = document.getElementById('p1MaxPS');
const p2MaxPS = document.getElementById('p2MaxPS');

function maxPoints(){
    let p1MaxPts = Math.max( parseInt(p1Array[0].value), parseInt(p1Array[1].value), parseInt(p1Array[2].value), parseInt(p1Array[3].value), parseInt(p1Array[4].value), parseInt(p1Array[5].value), parseInt(p1Array[6].value),parseInt(p1Array[7].value), parseInt(p1Array[8].value),parseInt(p1Array[9].value), parseInt(p1Array[10].value), parseInt(p1Array[11].value), parseInt(p1Array[12].value),parseInt(p1Array[13].value), parseInt(p1Array[14].value), parseInt(p1Array[15].value), parseInt(p1Array[16].value),parseInt(p1Array[17].value),parseInt(p1Array[18].value), parseInt(p1Array[19].value), parseInt(p1Array[20].value), parseInt(p1Array[21].value), parseInt(p1Array[22].value), parseInt(p1Array[23].value), parseInt(p1Array[24].value) );

    let p2MaxPts = Math.max( parseInt(p2Array[0].value), parseInt(p2Array[1].value), parseInt(p2Array[2].value), parseInt(p2Array[3].value), parseInt(p2Array[4].value), parseInt(p2Array[5].value), parseInt(p2Array[6].value),parseInt(p2Array[7].value), parseInt(p2Array[8].value),parseInt(p2Array[9].value), parseInt(p2Array[10].value), parseInt(p2Array[11].value), parseInt(p2Array[12].value),parseInt(p2Array[13].value), parseInt(p2Array[14].value), parseInt(p2Array[15].value), parseInt(p2Array[16].value),parseInt(p2Array[17].value),parseInt(p2Array[18].value), parseInt(p2Array[19].value), parseInt(p2Array[20].value), parseInt(p2Array[21].value), parseInt(p2Array[22].value), parseInt(p2Array[23].value), parseInt(p2Array[24].value) );

    console.log('array max', p1MaxPts, 'and', p2MaxPts);

    // let p1MaxPts = Math.max(...p1Array);
    // let p2MaxPts = Math.max(...p2Array);
    // console.log('array max', p1MaxPts, p2MaxPts);

    document.getElementById('p1MaxPS').value = p1MaxPts;
    document.getElementById('p2MaxPS').value = p2MaxPts;
    p1MaxPS.innerText = p1MaxPts;
    p2MaxPS.innerText = p2MaxPts;
};


// ! EVENT LISTENER
newMatchForm.addEventListener('submit', e => {
    e.preventDefault();

    // ** IF INPUTTING NAME:
    // if(namePattern.test(player1)) {
    //     feedback.textContent = 'OK';
    // } else {
    //     feedback.textContent = 'Invalid name';
    // }
        // if(namePattern.test(player2)) {
    //     feedback2.textContent = 'OK';
    // } else {
    //     feedback2.textContent = 'Invalid name';
    // }

    console.log(newMatchForm.player1.value, newMatchForm.player2.value, newMatchForm.chooseArena.value, newMatchForm.chooseCup.value, newMatchForm.chooseDate.value);

    // SONGS WON  
    songCounter();
    console.log("Songs Counter:", p1Songer, p2Songer);

    //  TOTAL POINTS
    totalPoints();
    console.log('Total Points: ', p1Pointer, p2Pointer);

    // MATCH WINNER
    // * Not included in UX, just passed to DB
    winner();
    console.log('Match Winner: ', p1Winner, p2Winner);

    //  AVG P/S
    averagePoints();
    console.log('Average Points/Song: ', p1Avg, p2Avg);

    //  EFFICIENCY 
    efficiency();
    console.log('Efficiency: ', p1Efficient,'%', p2Efficient,'%');

    //  TURBO POWER
    turbo();
    console.log("Turbo Power: ", p1TurboPower,'%', p2TurboPower,'%');

    //  MAXIMUM P/S
    maxPoints();
    console.log("Maximum Points/Song : ", p1MaxPts, p2MaxPts);

    // TODO figure out the hide and show
    // Making the SCORE CALCULATIONS visible
    // scoreCalculations.classList.add()
    scoreCalculations.style.display = 'grid';

    // TODO also hide the SEND button 
});
