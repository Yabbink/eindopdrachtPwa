const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

const backIcon = document.querySelector('.mdc-top-app-bar__back-icon')

backIcon.addEventListener('click', () => {
    window.location.href = `index.html`
})

const title = document.querySelector('.mdc-top-app-bar__title')
const hamburgerItem = document.querySelectorAll('.mdc-list-item')
const home = document.querySelector('.mdc-list-item:nth-child(2)')
const body = document.querySelector('body')
const wedstrijdDiv = document.querySelector('.wedstrijd')
const homeTeam = document.querySelector('.homeTeam')
const homeTeamImg = document.querySelector('.homeTeam img')
const homeTeamP = document.querySelector('.homeTeam p')
const scoreHome = document.querySelector('.scoreHome')
const scoreAway = document.querySelector('.scoreAway')
const awayTeam = document.querySelector('.awayTeam')
const awayTeamImg = document.querySelector('.awayTeam img')
const awayTeamP = document.querySelector('.awayTeam p')
const homeEvent = document.querySelector('.home-event')
const awayEvent = document.querySelector('.away-event')

const urlParams = new URLSearchParams(window.location.search);
const fixtureId = urlParams.get('id');

console.log(fixtureId)

function wedstrijd(){
    fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${fixtureId}`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '862ebac7f9msh969c479e23695a1p15ea43jsn5ad4cf9b18cd',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    })
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
        return response.json();
    })
    .then(data => {
        const match = data.response;
        console.log(match)
        toonWedstrijd(match)
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}
wedstrijd()

function toonWedstrijd(match){
   match.forEach(function(fixture) {
    homeTeamImg.src = fixture.teams.home.logo
    homeTeamImg.alt = `${fixture.teams.home.name} logo`
    homeTeamP.textContent = fixture.teams.home.name
    scoreHome.textContent = fixture.goals.home
    scoreAway.textContent = fixture.goals.away
    awayTeamImg.src = fixture.teams.away.logo
    awayTeamImg.alt = `${fixture.teams.away.name} logo`
    awayTeamP.textContent = fixture.teams.away.name
    const events = fixture.events
    events.forEach(function(event){
      console.log(event)
      const eventDiv = document.createElement('div')
      eventDiv.classList.add('event')
      const time = document.createElement('p')
      time.classList.add('time')
      if(event.time.extra != null)
      {
        time.textContent = event.time.elapsed + " + " + event.time.extra + "'"
      }
      else
      {
        time.textContent = event.time.elapsed + "'"
      }
      const player = document.createElement('p')
      player.classList.add('player')
      player.textContent = event.player.name
      eventDiv.appendChild(time)
      eventDiv.appendChild(player)
      if(event.type.includes('Goal'))
      {
        if(event.team.name.includes(fixture.teams.home.name))
        {
            homeEvent.appendChild(eventDiv)
        }
        else
        {
            awayEvent.appendChild(eventDiv)
        }
      }
      
    })
   });
}