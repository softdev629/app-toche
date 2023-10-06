// Cup Generator

function generateFixtures() {
    const category = document.getElementById('category').value;
    const trophyType = document.getElementById('trophyType').value;
    const prizes = document.getElementById('prizes').value;
    const arenaName = document.getElementById('arenaName').value;
    const startingDate = document.getElementById('startingDate').value;
    const cupName = document.getElementById('cupName').value;
    
    const rounds = parseInt(document.getElementById('rounds').value);
    const players = parseInt(document.getElementById('players').value);
    
    const playerNames = [];
    for (let i = 0; i < players; i++) {
      const playerName = prompt(`Enter name for Player ${i + 1}:`);
      playerNames.push(playerName || `Player ${i + 1}`);
    }
    
    const fixtureOutput = document.getElementById('fixtureOutput');
    const tournamentInfo = document.getElementById('tournamentInfo');
    fixtureOutput.innerHTML = '';
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
    
    const matchdays = generateMatchdays(players, playerNames);
    
    fixtureOutput.innerHTML += '<h2>Fixtures</h2>';
    
    for (let matchday = 0; matchday < matchdays.length; matchday++) {
      fixtureOutput.innerHTML += `<h3>Matchday ${matchday + 1}</h3>`;
      for (let match = 0; match < matchdays[matchday].length; match++) {
        fixtureOutput.innerHTML += `<p>${matchdays[matchday][match]}</p>`;
      }
    }
  }
  
  function calculateMatches(players) {
    return (players * (players - 1)) / 2;
  }
  
  function generateMatchdays(players, playerNames) {
      const matchdays = [];
      
      for (let matchday = 0; matchday < players - 1; matchday++) {
      matchdays.push([]);
      
      for (let i = 0; i < players / 2; i++) {
          const matchIndex = (matchday + i) % (players - 1);
          matchdays[matchday].push(`Match ${matchday + 1}: ${playerNames[matchIndex]} vs ${playerNames[(matchIndex + i + 1) % (players - 1)]}`);
      }
      }
      
      return matchdays;
  }

