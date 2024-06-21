const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

const backIcon = document.querySelector('.mdc-top-app-bar__back-icon')

backIcon.addEventListener('click', () => {
    window.location.href = `standen.html`;
})

const tabBarElement = document.querySelector('.mdc-tab-bar')
const tabBar = new MDCTabBar(tabBarElement);

const image = document.querySelector('.mdc-top-app-bar__image')
const title = document.querySelector('.mdc-top-app-bar__title')
const item = document.querySelectorAll('.mdc-tab')
const item2 = document.querySelectorAll('.mdc-tab-indicator')
const hamburgerItem = document.querySelectorAll('.mdc-list-item')
const home = document.querySelector('.mdc-list-item:nth-child(2)')
const body = document.querySelector('body')
const main = document.querySelector('.main')
const stand = document.querySelector('.stand')
const mdcItem = document.querySelectorAll('.mdc-item')
const stats = document.querySelector('.statistieken')
const tableItem = document.querySelectorAll('.table-item')
const tableItemTbody = document.querySelector('.table-item tbody')
const statDiv = document.querySelectorAll('.stats')
const goalsDiv = document.querySelector('.goals')
const assistDiv = document.querySelector('.assists')
const yellowDiv = document.querySelector('.yellow')
const redDiv = document.querySelector('.red')
const goalsH2 = document.querySelector('.goals h2')
const tableTopScorers = document.querySelector('.goals-table')
const tbodyTopScorers = document.querySelector('.goals-table tbody')
const assistH2 = document.querySelector('.assists h2')
const tableTopAssisters = document.querySelector('.assists-table')
const tbodyTopAssisters = document.querySelector('.assists-table tbody')
const yellowH2 = document.querySelector('.yellow h2')
const tableTopYellow = document.querySelector('.yellow-table')
const tbodyTopYellow = document.querySelector('.yellow-table tbody')
const redH2 = document.querySelector('.red h2')
const tableTopRed = document.querySelector('.red-table')
const tbodyTopRed = document.querySelector('.red-table tbody')
const fixtures = document.querySelector('.uitslagen')
const tableMatch = document.querySelector('.match-table')
const tbodyMatch = document.querySelector('.match-table tbody')
const speelrondeSelect = document.querySelector('.speelronde')

function setActiveLink() {
    const currentPage = title.textContent.trim();
    console.log(currentPage)
    hamburgerItem.forEach(function(button) {
        if (button.textContent.trim() === currentPage) {
            button.classList.add('mdc-list-item--activated');
        } else {
            button.classList.remove('mdc-list-item--activated');
        }
    });
}

setActiveLink()

hamburgerItem.forEach(function(button) {
    button.addEventListener('click', setActiveLink);
});

item.forEach(function(button){
    button.addEventListener('click', () => {
        const text = button.querySelector('.mdc-tab__text-label').textContent
        mdcItem.forEach(function(element){
            element.classList.add('hidden')
            if(element.classList.contains(text.toLowerCase())) {
               element.classList.remove('hidden');
            }
        })
    })
})

const urlParams = new URLSearchParams(window.location.search);
const leagueId = urlParams.get('id');
const src = urlParams.get('src')
console.log(src)
const altTekst = urlParams.get('alt');
image.src = decodeURIComponent(src)
title.textContent = decodeURIComponent(altTekst)
let season = urlParams.get('season')
console.log(season)

mdcItem.forEach(function(element){
    let hasSameClass = false;
    if (element.classList.contains('stand')) {
        hasSameClass = true;
        fetchLeagueStandings(leagueId);
    }
    if (hasSameClass == false) {
        element.classList.add('hidden')
    }
    if (element.classList.contains('statistieken')) {
        statDiv.forEach(function(statDiv) {
            let tables = ['goals', 'assists', 'yellow', 'red']
            tables.forEach(function(statType) {
                if (statDiv.classList.contains(statType)) {
                    fetchTopStandings(leagueId, statType);
                }
            });
        });
    } 
    if(element.classList.contains('uitslagen')){
        fetchLeagueMatches(leagueId)
    }
})

title.addEventListener('click', () => {
    item.forEach(function(element){
        element.classList.remove('mdc-tab--active')
    })
    item2.forEach(function(element){
        element.classList.remove('mdc-tab-indicator--active')
    })
    mdcItem.forEach(function(element){
        let hasSameClass = false;
        if (element.classList.contains('stand')) {
            hasSameClass = true;
        }
        if (hasSameClass == true) {
            element.classList.remove('hidden')
        }
    })
})


function fetchLeagueStandings(leagueId) {
    fetch(`https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=${season}`, {
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
        const standings = data.response[0].league.standings;
        displayLeagueStandings(standings)
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function displayLeagueStandings(standings) {

    console.log("test")
    console.log(standings)

    if(standings.length > 1 && standings.length < 6){
      const selectGroup = document.createElement('select')
      selectGroup.classList.add('groep')

      standings.forEach(function(group){
        const option = document.createElement('option')
        group.forEach(function(team){
            const groepNaam = team.group
            option.textContent = groepNaam
            const naam = groepNaam.replace(/ /g, '-').replace(/:/g, '-');
            option.value = naam
        })
        selectGroup.appendChild(option)
      })

      stand.appendChild(selectGroup)
      
      standings.forEach(function(group){
        const standingGroupDiv = document.createElement('div')
        standingGroupDiv.classList.add('standing-group')
        const groupName = document.createElement('h2');
        group.forEach(function(team){
            const groepNaam = team.group
            groupName.textContent = groepNaam;
            const naam = groepNaam.replace(/ /g, '-').replace(/:/g, '-');
            standingGroupDiv.classList.add(naam)
        })
        standingGroupDiv.appendChild(groupName)
        leagueStandings(group, standingGroupDiv)
        })


        if (selectGroup.options.length > 1) {
            const lastOption = selectGroup.options[selectGroup.options.length - 1];
            lastOption.selected = true;
            const selectedOption = lastOption.value;

            const standingGroup = document.querySelectorAll('.standing-group')
            standingGroup.forEach(function(element) {
                element.classList.add('hidden');
            });

            if (selectedOption) {
                const groupClass = document.querySelectorAll(`.${selectedOption}`)
                groupClass.forEach(function(element) {
                    element.classList.remove('hidden');
                });
            }
        }

        selectGroup.addEventListener('change', function() {
            const selectedOption = this.value;
            const standingGroup = document.querySelectorAll('.standing-group')
            standingGroup.forEach(function(element) {
                element.classList.add('hidden');
            });
            if (selectedOption) {
                const groupClass = document.querySelectorAll(`.${selectedOption}`)
                groupClass.forEach(function(element) {
                    element.classList.remove('hidden');
                });
            }
        });
    } else {
        standings.forEach(function(group) {
            const standingGroupDiv = document.createElement('div')
            standingGroupDiv.classList.add('standing-group')

            if(standings.length > 1){
                const groupName = document.createElement('h2');
    
                group.forEach(function(team){
                    groupName.textContent = team.group;
                })
        
                standingGroupDiv.appendChild(groupName)
            }
            
            leagueStandings(group, standingGroupDiv)
        });
    }
}

function leagueStandings(group, div){
    const tableLeague = document.createElement('table')
    tableLeague.classList.add('standings-table')
    const theadLeague = document.createElement('thead')
    const headerRowLeague = document.createElement('tr')
    const tbodyLeague = document.createElement('tbody')

    const headers = ['#', 'Team', 'P', 'DS', 'PTN'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRowLeague.appendChild(th);
    });
    theadLeague.appendChild(headerRowLeague);
    
    group.forEach(function(team){
        const row = document.createElement('tr');
        const rankCell = document.createElement('td');
        rankCell.textContent = team.rank;
        const teamCell = document.createElement('td');
        const teamDiv = document.createElement('div');
        teamDiv.classList.add('team-info');
        const teamLogo = document.createElement('img');
        teamLogo.src = team.team.logo;
        teamLogo.alt = team.team.name;
        teamLogo.classList.add('team-logo');
        const teamName = document.createElement('p');
        teamName.textContent = team.team.name;
        teamDiv.appendChild(teamLogo);
        teamDiv.appendChild(teamName);
        teamCell.appendChild(teamDiv);
        const matchesCell = document.createElement('td');
        matchesCell.textContent = team.all.played;
        const goalDiffenceCell = document.createElement('td') 
        goalDiffenceCell.textContent = team.goalsDiff
        const pointsCell = document.createElement('td')
        pointsCell.textContent = team.points
            
        row.appendChild(rankCell);
        row.appendChild(teamCell);
        row.appendChild(matchesCell);
        row.appendChild(goalDiffenceCell)
        row.appendChild(pointsCell)
        tbodyLeague.appendChild(row);
    })
    tableLeague.appendChild(theadLeague);
    tableLeague.appendChild(tbodyLeague)
    div.appendChild(tableLeague)
    stand.appendChild(div)
}

function fetchTopStandings(leagueId, type) {
    let endpoint;
    if (type == 'goals') {
        endpoint = 'topscorers';
    } else if (type == 'assists') {
        endpoint = 'topassists';
    } else if (type == 'yellow') {
        endpoint = 'topyellowcards';
    } else if (type == 'red') {
        endpoint = 'topredcards';
    } else {
        throw new Error('Invalid type');
    }

    fetch(`https://api-football-v1.p.rapidapi.com/v3/players/${endpoint}?league=${leagueId}&season=${season}`, {
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
        const result = data.response;
        console.log(result);
        displayTopStandings(result, type);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function displayTopStandings(standings, type) {
    const top5 = standings.slice(0, 5);
    top5.forEach(function(player, index) {
        const row = document.createElement('tr');
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        const playerCell = document.createElement('td');
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player-info');
        const teamLogo = document.createElement('img');
        teamLogo.src = player.statistics[0].team.logo;
        teamLogo.alt = player.statistics[0].team.name;
        teamLogo.classList.add('team-logo');
        const playerName = document.createElement('p');
        playerName.textContent = player.player.name;
        playerDiv.appendChild(teamLogo);
        playerDiv.appendChild(playerName);
        playerCell.appendChild(playerDiv);
        const statCell = document.createElement('td');
        
        if (type == 'goals') {
            statCell.textContent = player.statistics[0].goals.total
        } else if (type == 'assists') {
            statCell.textContent = player.statistics[0].goals.assists;
        } else if (type == 'yellow') {
            statCell.textContent = player.statistics[0].cards.yellow;
        } else if (type == 'red') {
            statCell.textContent = player.statistics[0].cards.yellowred + player.statistics[0].cards.red;
        } else {
            throw new Error('Invalid type');
        }

        row.appendChild(rankCell);
        row.appendChild(playerCell);
        row.appendChild(statCell);

        if (type == 'goals') {
            tbodyTopScorers.appendChild(row);
        } else if (type == 'assists') {
            tbodyTopAssisters.appendChild(row);
        } else if (type == 'yellow') {
            tbodyTopYellow.appendChild(row);
        } else if (type == 'red') {
            tbodyTopRed.appendChild(row);
        } else {
            throw new Error('Invalid type');
        }
    });

    if (type == 'goals') {
        tableTopScorers.appendChild(tbodyTopScorers);
        goalsDiv.appendChild(tableTopScorers);
        stats.appendChild(goalsDiv)
    } else if (type == 'assists') {
        tableTopAssisters.appendChild(tbodyTopAssisters);
        assistDiv.appendChild(tableTopAssisters);
        stats.appendChild(assistDiv)
    } else if (type.includes('yellow')) {
        tableTopYellow.appendChild(tbodyTopYellow);
        yellowDiv.appendChild(tableTopYellow);
        stats.appendChild(yellowDiv)
    } else if (type.includes('red')) {
        tableTopRed.appendChild(tbodyTopRed);
        redDiv.appendChild(tableTopRed);
        stats.appendChild(redDiv)
    } else {
        throw new Error('Invalid type');
    }
    
}

function fetchLeagueMatches(leagueId) {
    fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=${season}`, {
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
        const result = data.response;
        console.log(result);
        displayLeagueMatches(result);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function displayLeagueMatches(matches) {
    const fixturesByRound = {};

    matches.forEach(function(fixture){
        const round = fixture.league.round;
        const fixtureDate = new Date(fixture.fixture.date).toLocaleDateString();

        if (!fixturesByRound[round]) {
            fixturesByRound[round] = {};
        }

        if (!fixturesByRound[round][fixtureDate]) {
            fixturesByRound[round][fixtureDate] = [];
        }

        fixturesByRound[round][fixtureDate].push(fixture);
    });

    for (const round in fixturesByRound) {
        const sanitizedRound = round.replace(/ /g, '-');
        const newOption = document.createElement('option');
        newOption.text = round;
        newOption.value = sanitizedRound;
        speelrondeSelect.add(newOption);

        const fixtureGroupDiv = document.createElement('div');
        fixtureGroupDiv.classList.add('fixture-group', 'hidden', sanitizedRound);

        const roundH2 = document.createElement('h2');
        roundH2.textContent = round;
        fixtureGroupDiv.appendChild(roundH2);

        for (const date in fixturesByRound[round]) {
            const dateP = document.createElement('p');
            dateP.classList.add('date');
            dateP.textContent = date;
            fixtureGroupDiv.appendChild(dateP);

            fixturesByRound[round][date].forEach(match => {
                const row = document.createElement('tr');

                const stateCell = document.createElement('td');
                stateCell.classList.add('state');
                stateCell.textContent = match.fixture.status.short;

                const teamsCell = document.createElement('td');
                const teamsDiv = document.createElement('div');
                teamsDiv.classList.add('teams-info');
                const team1Div = document.createElement('div');
                team1Div.classList.add('team-info');
                const team1Logo = document.createElement('img');
                team1Logo.src = match.teams.home.logo;
                team1Logo.alt = `${match.teams.home.name} logo`;
                team1Logo.classList.add('team-logo');
                const team1Name = document.createElement('p');
                team1Name.textContent = match.teams.home.name;

                const team2Div = document.createElement('div');
                team2Div.classList.add('team-info');
                const team2Logo = document.createElement('img');
                team2Logo.src = match.teams.away.logo;
                team2Logo.alt = `${match.teams.away.name} logo`;
                team2Logo.classList.add('team-logo');
                const team2Name = document.createElement('p');
                team2Name.textContent = match.teams.away.name;

                team1Div.appendChild(team1Logo);
                team1Div.appendChild(team1Name);
                teamsDiv.appendChild(team1Div);
                team2Div.appendChild(team2Logo);
                team2Div.appendChild(team2Name);
                teamsDiv.appendChild(team2Div);
                teamsCell.appendChild(teamsDiv);

                const scoreCell = document.createElement('td');
                const scoreDiv = document.createElement('div');
                scoreDiv.classList.add('scores');
                const team1Score = document.createElement('p');
                team1Score.textContent = match.goals.home;
                const team2Score = document.createElement('p');
                team2Score.textContent = match.goals.away;
                scoreDiv.appendChild(team1Score);
                scoreDiv.appendChild(team2Score);
                scoreCell.appendChild(scoreDiv);

                const fixtureId = match.fixture.id;

                row.appendChild(stateCell);
                row.appendChild(teamsCell);
                row.appendChild(scoreCell);
                fixtureGroupDiv.appendChild(row);
                tbodyMatch.appendChild(fixtureGroupDiv);

                row.addEventListener('click', function(){
                    window.location.href = `uitslagen.html?id=${fixtureId}`;
                });
            });
        }

        tableMatch.appendChild(tbodyMatch);
    }
    
    if (speelrondeSelect.options.length > 1) {
        const lastOption = speelrondeSelect.options[speelrondeSelect.options.length - 1];
        lastOption.selected = true;
        const selectedOption = lastOption.value;
    
        const fixtureGroup = document.querySelectorAll('.fixture-group')
        fixtureGroup.forEach(function(element) {
            element.classList.add('hidden');
        });
    
        if (selectedOption) {
            const groupClass = document.querySelectorAll(`.${selectedOption}`)
            groupClass.forEach(function(element) {
                element.classList.remove('hidden');
            });
        }
    }
    
    speelrondeSelect.addEventListener('change', function() {
        const selectedRound = this.value;
        document.querySelectorAll('.fixture-group').forEach(function(element) {
            element.classList.add('hidden');
        });
        if (selectedRound) {
            document.querySelectorAll(`.${selectedRound}`).forEach(function(element) {
                element.classList.remove('hidden');
            });
        }
    });
}