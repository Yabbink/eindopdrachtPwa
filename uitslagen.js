// Selecteer het element voor de top app bar en initialiseer MDCTopAppBar
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

// Event listener voor terugknop om terug te gaan naar index.html
const backIcon = document.querySelector('.mdc-top-app-bar__back-icon');
backIcon.addEventListener('click', () => {
    window.location.href = `index.html`;
});

// Elementen selecteren voor verschillende secties van de wedstrijd pagina
const title = document.querySelector('.mdc-top-app-bar__title');
const hamburgerItem = document.querySelectorAll('.mdc-list-item');
const home = document.querySelector('.mdc-list-item:nth-child(2)');
const body = document.querySelector('body');
const wedstrijdDiv = document.querySelector('.wedstrijd');
const homeTeam = document.querySelector('.homeTeam');
const homeTeamImg = document.querySelector('.homeTeam img');
const homeTeamP = document.querySelector('.homeTeam p');
const scoreHome = document.querySelector('.scoreHome');
const scoreAway = document.querySelector('.scoreAway');
const awayTeam = document.querySelector('.awayTeam');
const awayTeamImg = document.querySelector('.awayTeam img');
const awayTeamP = document.querySelector('.awayTeam p');
const gebeurtenissen = document.querySelector('.gebeurtenissen');
const opstellingen = document.querySelector('.opstelling');
const bank = document.querySelector('.bank');
const trainer = document.querySelector('.trainer');
const wedstrijdInfo = document.querySelector('.info');
const gebeurtenis = document.querySelector('.gebeurtenis');
const homeEvent = document.querySelector('.gebeurtenis .home-event');
const awayEvent = document.querySelector('.gebeurtenis .away-event');
const matchEvent = document.querySelector('.matchEvent');
const matchEventHome = document.querySelector('.matchEvent .home-event');
const matchEventAway = document.querySelector('.matchEvent .away-event');
const eventIcons = document.querySelector('.eventIcons');
const homeIcons = document.querySelector('.homeIcons');
const awayIcons = document.querySelector('.awayIcons');
const lineUp = document.querySelector('.line-up');
const lineUpHome = document.querySelector('.line-up .home-line-up');
const lineUpAway = document.querySelector('.line-up .away-line-up');
const bench = document.querySelector('.bench');
const benchHome = document.querySelector('.bench .home-bench');
const benchAway = document.querySelector('.bench .away-bench');
const coach = document.querySelector('.coach');
const coachHome = document.querySelector('.coach .home-coach');
const coachAway = document.querySelector('.coach .away-coach');
const competitieLink = document.querySelector('.competitieInfo a');
const competitieP = document.querySelector('.competitieInfo a p');
const stadionP = document.querySelector('.stadionInfo p:nth-child(2)');
const abitrageP = document.querySelector('.abitrageInfo p:nth-child(2)');

// URL parameters ophalen, specifiek de fixtureId
const urlParams = new URLSearchParams(window.location.search);
const fixtureId = urlParams.get('id');

// FixtureId loggen naar de console
console.log(fixtureId);

// Functie om wedstrijdgegevens op te halen
function wedstrijd() {
  // API-aanroep om gegevens op te halen voor de wedstrijd met het opgehaalde fixtureId
  fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${fixtureId}`, {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': '862ebac7f9msh969c479e23695a1p15ea43jsn5ad4cf9b18cd',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
  })
  .then(response => {
      // Controleer of de respons succesvol is
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      // Haal de wedstrijdgegevens uit de respons
      const match = data.response;
      console.log(match);
      toonWedstrijd(match); // Toon de wedstrijdgegevens op de pagina
  })
  .catch(error => {
      // Log een foutmelding naar de console als de fetch-operatie mislukt
      console.error('There has been a problem with your fetch operation:', error);
  });
}

// Roep de wedstrijdfunctie aan om de gegevens op te halen
wedstrijd();

// Functie om wedstrijdgegevens weer te geven op basis van de ontvangen matchgegevens
function toonWedstrijd(match) {
  match.forEach(function(fixture) {
      // Opmaak van de thuisteamgegevens
      homeTeamImg.src = fixture.teams.home.logo;
      homeTeamImg.alt = `${fixture.teams.home.name} logo`;
      homeTeamP.textContent = fixture.teams.home.name;
      scoreHome.textContent = fixture.goals.home;

      // Opmaak van de uitteamgegevens
      awayTeamImg.src = fixture.teams.away.logo;
      awayTeamImg.alt = `${fixture.teams.away.name} logo`;
      awayTeamP.textContent = fixture.teams.away.name;
      scoreAway.textContent = fixture.goals.away;

      // Controleren op gebeurtenissen en opstellingen
      if (fixture.events.length === 0 && fixture.lineups.length === 0) {
          gebeurtenissen.style.display = "none";
          matchEvent.style.display = "none";
          opstellingen.style.display = "none";
          lineUp.style.display = "none";
          bank.style.display = "none";
          trainer.style.display = "none";
          trainer.style.margin.top = "0px";
          coach.style.display = "none";
      } else if (fixture.events.length === 0) {
          gebeurtenissen.style.display = "none";
          matchEvent.style.display = "none";
      } else if (fixture.lineups.length === 0) {
          opstellingen.style.display = "none";
          lineUp.style.display = "none";
          bank.style.display = "none";
          trainer.style.display = "none";
          coach.style.display = "none";
      }

      // Verwerken van gebeurtenissen
      const events = fixture.events;
      events.forEach(function(event) {
          console.log(event);
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          const time = document.createElement('p');
          time.classList.add('time');
          if (event.time.extra !== null) {
              time.textContent = `${event.time.elapsed} + ${event.time.extra}'`;
          } else {
              time.textContent = `${event.time.elapsed}'`;
          }
          const player = document.createElement('p');
          player.classList.add('player');
          if (event.detail.includes('Own Goal')){
            player.textContent = `${event.player.name} (e.d.)`;
          } else {
            player.textContent = event.player.name;
          }
          eventDiv.appendChild(time);
          eventDiv.appendChild(player);

          // Toevoegen van gebeurtenis aan het juiste teamsectie
          if (event.type.includes('Goal')) {
              if (event.team.name.includes(fixture.teams.home.name)) {
                  homeEvent.appendChild(eventDiv);
              } else {
                  awayEvent.appendChild(eventDiv);
              }
          }
      });

      // Sorteren van gebeurtenissen op tijd
      const timeSort = events.sort((a, b) => {
          if (a.time.elapsed === b.time.elapsed) {
              return (a.time.extra || 0) - (b.time.extra || 0);
          }
          return a.time.elapsed - b.time.elapsed;
      });

      console.log("hallo");

      // loop door de lijst met gebeurtennisen heen
      timeSort.forEach(function(event) {
          console.log(event);
          gebeurtenissen.textContent = "Gebeurtenissen";
          
          // Creëer een nieuw div-element voor elke gebeurtenis
          const eventDiv2 = document.createElement('div');
          eventDiv2.classList.add('event');
          
          // Maak een paragraaf-element aan voor de tijd van de gebeurtenis
          const timeEvent = document.createElement('p');
          timeEvent.classList.add('time');
          if (event.time.extra !== null) {
              timeEvent.textContent = `${event.time.elapsed} + ${event.time.extra}'`;
          } else {
              timeEvent.textContent = `${event.time.elapsed}'`;
          }
          
          // Maak een div-element aan voor de speler van de gebeurtenis
          const playerDiv = document.createElement('div');
          playerDiv.classList.add('playerDiv');
          
          // Maak een paragraaf-element aan voor de naam van de speler
          const playerEvent = document.createElement('p');
          playerEvent.classList.add('player');

          // Opmaak van de spelernaam afhankelijk van het type gebeurtenis
          if (event.type.includes('subst')) {
              playerEvent.textContent += `uit: ${event.player.name}`;
          } else {
              playerEvent.textContent += `${event.player.name} `;
          } 
          
          if (event.detail.includes('Own Goal')) {
              playerEvent.textContent = `${event.player.name} (eigen doelpunt)`;
          }

          // Toevoegen van iconen voor verschillende gebeurtenistypen
          const icon = document.createElement('img');
          icon.classList.add('material-symbols-outlined');
          const playerIn = document.createElement('p');
          playerIn.classList.add('playerIn');
          if (event.type.includes('Goal')) {
              icon.src = "images/football-icon.svg";
              icon.alt = "football";
              playerIn.style.display = "none";
              if (event.detail.includes('Own Goal')){
                console.log("er is een eigen doelpunt gescoord")
                icon.classList.add('eigen-goal')
              }
          }
          if (event.detail.includes('Yellow')) {
              icon.src = "images/yellow-icon.svg";
              icon.alt = "yellow-card";
              playerIn.style.display = "none";
          }
          if (event.detail.includes('Red')) {
              icon.src = "images/red-icon.svg";
              icon.alt = "red-card";
              playerIn.style.display = "none";
          }
          if (event.type.includes('subst')) {
              icon.src = "images/sub-icon.svg";
              icon.alt = "sub";
              playerIn.textContent += `in: ${event.assist.name}`;
          }
          playerDiv.appendChild(playerEvent);
          playerDiv.appendChild(playerIn);
          eventDiv2.appendChild(timeEvent);
          eventDiv2.appendChild(playerDiv);
          eventDiv2.appendChild(icon);

          // Toevoegen van gebeurtenis aan het de teamsectie
          if (event.team.name.includes(fixture.teams.home.name)) {
              matchEventHome.appendChild(eventDiv2);
          } else {
              matchEventAway.appendChild(eventDiv2);
          }
      });

      console.log("hallo");
      console.log(fixture.lineups);

      // Verwerken van de opstellingen in de wedstrijd lijst
      const lineups = fixture.lineups;
      lineups.forEach(function(lineup) {
          console.log("hallo");
          console.log(lineup);
          const startXi = lineup.startXI;
          startXi.forEach(function(player) {
              console.log(player);
              opstellingen.textContent = "Opstellingen";
              const playerDiv = document.createElement('div');
              const number = document.createElement('p');
              number.textContent = player.player.number;
              const playerName = document.createElement('p');
              playerName.textContent = player.player.name;
              playerDiv.appendChild(number);
              playerDiv.appendChild(playerName);

              // Toevoegen van speler aan de juiste teamsectie
              if (lineup.team.name.includes(fixture.teams.home.name)) {
                  lineUpHome.appendChild(playerDiv);
              } else {
                  lineUpAway.appendChild(playerDiv);
              }
          });

          // Verwerken van de bankspelers in de opstellingen lijst
          const bench = lineup.substitutes;
          bench.forEach(function(player) {
              console.log(player);
              bank.textContent = "Bank";
              const playerDiv = document.createElement('div');
              const number = document.createElement('p');
              number.textContent = player.player.number;
              const playerName = document.createElement('p');
              playerName.textContent = player.player.name;
              playerDiv.appendChild(number);
              playerDiv.appendChild(playerName);

              // Toevoegen van speler aan de juiste teamsectie
              if (lineup.team.name.includes(fixture.teams.home.name)) {
                  benchHome.appendChild(playerDiv);
              } else {
                  benchAway.appendChild(playerDiv);
              }
          });

          // Verwerken van de coach
          trainer.textContent = "Coach";
          const coachName = document.createElement('p');
          coachName.textContent = lineup.coach.name;

          // Toevoegen van coach aan de juiste teamsectie
          if (lineup.team.name.includes(fixture.teams.home.name)) {
              coachHome.appendChild(coachName);
          } else {
              coachAway.appendChild(coachName);
          }
      });

      // Opmaak van competitie-informatie onderaan de pagina
      let leagueId = fixture.league.id;
      let leagueName = fixture.league.name;
      let logo = fixture.league.logo;
      const season = fixture.league.season;
      console.log(season);

      wedstrijdInfo.textContent = "Wedstrijdinfo";
      competitieLink.href = `league.html?id=${leagueId}&alt=${encodeURIComponent(leagueName)}&src=${encodeURIComponent(logo)}&season=${encodeURIComponent(season)}`;
      competitieP.textContent = leagueName;
      stadionP.textContent = fixture.fixture.venue.name;
      abitrageP.textContent = fixture.fixture.referee;
  });
}
