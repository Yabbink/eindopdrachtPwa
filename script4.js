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
const gebeurtenissen = document.querySelector('.gebeurtenissen')
const opstellingen = document.querySelector('.opstelling')
const bank = document.querySelector('.bank')
const trainer = document.querySelector('.trainer')
const wedstrijdInfo = document.querySelector('.info')
const gebeurtenis = document.querySelector('.gebeurtenis')
const homeEvent = document.querySelector('.gebeurtenis .home-event')
const awayEvent = document.querySelector('.gebeurtenis .away-event')
const matchEvent = document.querySelector('.matchEvent')
const matchEventHome = document.querySelector('.matchEvent .home-event')
const matchEventAway = document.querySelector('.matchEvent .away-event')
const eventIcons = document.querySelector('.eventIcons')
const homeIcons = document.querySelector('.homeIcons')
const awayIcons = document.querySelector('.awayIcons')
const lineUp = document.querySelector('.line-up')
const lineUpHome = document.querySelector('.line-up .home-line-up')
const lineUpAway = document.querySelector('.line-up .away-line-up')
const bench = document.querySelector('.bench')
const benchHome = document.querySelector('.bench .home-bench')
const benchAway = document.querySelector('.bench .away-bench')
const coach = document.querySelector('.coach')
const coachHome = document.querySelector('.coach .home-coach')
const coachAway = document.querySelector('.coach .away-coach')
const competitieP = document.querySelector('.competitieInfo p:nth-child(2)')
const stadionP = document.querySelector('.stadionInfo p:nth-child(2)')
const abitrageP = document.querySelector('.abitrageInfo p:nth-child(2)')

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

    if(fixture.events == null && fixture.lineups == null){
       gebeurtenis.style.display = "none"
       lineUp.style.display = "none"
       bench.style.display = "none"
       coach.style.display = "none"
    }

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
    const timeSort = events.sort((a, b) => {
        if (a.time.elapsed === b.time.elapsed) {
            return (a.time.extra || 0) - (b.time.extra || 0);
        }
        return a.time.elapsed - b.time.elapsed;
    });
    console.log("hallo")
    timeSort.forEach(function(event){
      console.log(event)
      gebeurtenissen.textContent = "Gebeurtenissen"
      const eventDiv2 = document.createElement('div')
      eventDiv2.classList.add('event')
      const timeEvent = document.createElement('p')
      timeEvent.classList.add('time')
      if(event.time.extra != null)
      {
        timeEvent.textContent = event.time.elapsed + " + " + event.time.extra + "'"
      }
      else
      {
        timeEvent.textContent = event.time.elapsed + "'"
      }
      const playerDiv = document.createElement('div')
      playerDiv.classList.add('playerDiv')
      const playerEvent = document.createElement('p')
      playerEvent.classList.add('player')

      if(event.type.includes('subst')){
        playerEvent.textContent += "uit: " + event.player.name
      }
      else{
        playerEvent.textContent += event.player.name + ""
      }

      const icon = document.createElement('img');
      icon.classList.add('material-symbols-outlined');
      const playerIn = document.createElement('p')
      playerIn.classList.add('playerIn')
      if(event.type.includes('Goal'))
      {
        icon.src = "../eindopdrachtPwa/images/football-icon.svg";
        icon.alt = "football"
        playerIn.style.display = "none"
      }
      if(event.detail.includes('Yellow'))
      {
        icon.src = "../eindopdrachtPwa/images/yellow-icon.svg";
        icon.alt = "yellow-card"
        playerIn.style.display = "none"
      }
      if(event.detail.includes('Red'))
      {
        icon.src = "../eindopdrachtPwa/images/red-icon.svg";
        icon.alt = "red-card"
        playerIn.style.display = "none"
      }
      if(event.type.includes('subst'))
      {
        icon.src = "../eindopdrachtPwa/images/sub-icon.svg";
        icon.alt = "sub"
        playerIn.textContent += "in: " + event.assist.name
      }
      playerDiv.appendChild(playerEvent)
      playerDiv.appendChild(playerIn)
      eventDiv2.appendChild(timeEvent)
      eventDiv2.appendChild(playerDiv)
      eventDiv2.appendChild(icon)
      if(event.team.name.includes(fixture.teams.home.name))
      {
        matchEventHome.appendChild(eventDiv2)
      }
      else
      {
        matchEventAway.appendChild(eventDiv2)
      }
    })
    
    console.log("hallo")
    console.log(fixture.lineups)
    const lineups = fixture.lineups
    lineups.forEach(function(lineup){
        console.log("hallo")
        console.log(lineup)
        const startXi = lineup.startXI
        startXi.forEach(function(player){
          console.log(player)
          opstellingen.textContent = "Opstellingen"
          const playerDiv = document.createElement('div')
          const number = document.createElement('p')
          number.textContent = player.player.number
          const playerName = document.createElement('p')
          playerName.textContent = player.player.name
          playerDiv.appendChild(number)
          playerDiv.appendChild(playerName)
          if(lineup.team.name.includes(fixture.teams.home.name))
          {
            lineUpHome.appendChild(playerDiv)
          }
          else
          {
            lineUpAway.appendChild(playerDiv)
          }
        })

        const bench = lineup.substitutes
        bench.forEach(function(player){
          console.log(player)
          bank.textContent = "Bank"
          const playerDiv = document.createElement('div')
          const number = document.createElement('p')
          number.textContent = player.player.number
          const playerName = document.createElement('p')
          playerName.textContent = player.player.name
          playerDiv.appendChild(number)
          playerDiv.appendChild(playerName)
          if(lineup.team.name.includes(fixture.teams.home.name))
          {
            benchHome.appendChild(playerDiv)
          }
          else
          {
            benchAway.appendChild(playerDiv)
          }
        })

        trainer.textContent = "Coach"
        const coachName = document.createElement('p')
        coachName.textContent = lineup.coach.name

        if(lineup.team.name.includes(fixture.teams.home.name))
        {
          coachHome.appendChild(coachName)
        }
        else
        {
          coachAway.appendChild(coachName)
        }
    })

    wedstrijdInfo.textContent = "Wedstrijdinfo"
    competitieP.textContent = fixture.league.name
    stadionP.textContent = fixture.fixture.venue.name
    abitrageP.textContent = fixture.fixture.referee
  });
}