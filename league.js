const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

const backIcon = document.querySelector('.mdc-top-app-bar__back-icon')

backIcon.addEventListener('click', () => {
    window.location.href = `standen.html`;
})

const tabBarElement = document.querySelector('.mdc-tab-bar')
const tabBar = new MDCTabBar(tabBarElement);

const title = document.querySelector('.mdc-top-app-bar__title')
const item = document.querySelectorAll('.mdc-tab')
const item2 = document.querySelectorAll('.mdc-tab-indicator')
const hamburgerItem = document.querySelectorAll('.mdc-list-item')
const home = document.querySelector('.mdc-list-item:nth-child(2)')
const body = document.querySelector('body')
const main = document.querySelector('.main')
const mdcItem = document.querySelectorAll('.mdc-item')
const tableLeague = document.querySelector('.standings-table')
const theadLeague = document.querySelector('.standings-table thead')
const headerRowLeague = document.querySelector('.standings-table thead tr')
const tbodyLeague = document.querySelector('.standings-table tbody')
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
const altTekst = urlParams.get('alt');
title.textContent = decodeURIComponent(altTekst)

mdcItem.forEach(function(element){
    let hasSameClass = false;
    if (element.classList.contains('standings-table')) {
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
        if (element.classList.contains('standings-table')) {
            hasSameClass = true;
        }
        if (hasSameClass == true) {
            element.classList.remove('hidden')
        }
    })
})


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

function fetchLeagueStandings(leagueId) {
    fetch(`https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=2023`, {
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
        const standings = data.response[0].league.standings[0];
        console.log(standings)
        displayLeagueStandings(standings);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function displayLeagueStandings(standings) {
    const headers = ['#', 'Team', 'P', 'DS', 'PTN'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRowLeague.appendChild(th);
    });
    theadLeague.appendChild(headerRowLeague);
    
    standings.forEach(function(team) {
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
    });
    tableLeague.appendChild(theadLeague)
    tableLeague.appendChild(tbodyLeague);
    main.appendChild(tableLeague)
}

function fetchTopStandings(leagueId, text) {
    let endpoint;
    if (text == 'goals') {
        endpoint = 'topscorers';
    } else if (text == 'assists') {
        endpoint = 'topassists';
    } else if (text == 'yellow') {
        endpoint = 'topyellowcards';
    } else if (text == 'red') {
        endpoint = 'topredcards';
    } else {
        throw new Error('Invalid type');
    }

    fetch(`https://api-football-v1.p.rapidapi.com/v3/players/${endpoint}?league=${leagueId}&season=2023`, {
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
        displayTopStandings(result, text);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function displayTopStandings(standings, text) {
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
        
        if (text == 'goals') {
            statCell.textContent = player.statistics[0].goals.total
        } else if (text == 'assists') {
            statCell.textContent = player.statistics[0].goals.assists;
        } else if (text == 'yellow') {
            statCell.textContent = player.statistics[0].cards.yellow;
        } else if (text == 'red') {
            statCell.textContent = player.statistics[0].cards.yellowred + player.statistics[0].cards.red;
        } else {
            throw new Error('Invalid type');
        }

        row.appendChild(rankCell);
        row.appendChild(playerCell);
        row.appendChild(statCell);

        if (text == 'goals') {
            tbodyTopScorers.appendChild(row);
        } else if (text == 'assists') {
            tbodyTopAssisters.appendChild(row);
        } else if (text == 'yellow') {
            tbodyTopYellow.appendChild(row);
        } else if (text == 'red') {
            tbodyTopRed.appendChild(row);
        } else {
            throw new Error('Invalid type');
        }
    });

    if (text == 'goals') {
        tableTopScorers.appendChild(tbodyTopScorers);
        goalsDiv.appendChild(tableTopScorers);
        stats.appendChild(goalsDiv)
    } else if (text == 'assists') {
        tableTopAssisters.appendChild(tbodyTopAssisters);
        assistDiv.appendChild(tableTopAssisters);
        stats.appendChild(assistDiv)
    } else if (text.includes('yellow')) {
        tableTopYellow.appendChild(tbodyTopYellow);
        yellowDiv.appendChild(tableTopYellow);
        stats.appendChild(yellowDiv)
    } else if (text.includes('red')) {
        tableTopRed.appendChild(tbodyTopRed);
        redDiv.appendChild(tableTopRed);
        stats.appendChild(redDiv)
    } else {
        throw new Error('Invalid type');
    }
    
}

function fetchLeagueMatches(leagueId) {
    fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=2023`, {
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
    const fixturesByRound = new Map();

    matches.forEach(fixture => {
        const round = fixture.league.round;
        const fixtureDate = new Date(fixture.fixture.date).toLocaleDateString();
        if (!fixturesByRound.has(round)) {
            fixturesByRound.set(round, new Map());
        }
        const roundMap = fixturesByRound.get(round);
        if (!roundMap.has(fixtureDate)) {
            roundMap.set(fixtureDate, []);
        }
        roundMap.get(fixtureDate).push(fixture);
    });

    fixturesByRound.forEach((dates, round) => {
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

        dates.forEach((matchup, date) => {
            const dateP = document.createElement('p');
            dateP.classList.add('date');
            dateP.textContent = date;
            fixtureGroupDiv.appendChild(dateP);

            matchup.forEach((match) => {
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

                row.appendChild(stateCell);
                row.appendChild(teamsCell);
                row.appendChild(scoreCell);
                fixtureGroupDiv.appendChild(row);
                tbodyMatch.appendChild(fixtureGroupDiv)

                const fixtureId = match.fixture.id

                row.addEventListener('click', function(){
                   window.location.href = `uitslagen.html?id=${fixtureId}`;
                })
            });
        });

        tableMatch.appendChild(tbodyMatch)
    });

    if (speelrondeSelect.options.length > 1) {
        const lastOption = speelrondeSelect.options[speelrondeSelect.options.length - 1];
        lastOption.selected = true;
        const selectedRound = lastOption.value;
        document.querySelectorAll(`.${selectedRound}`).forEach(group => {
            group.classList.remove('hidden');
        });
    }

    speelrondeSelect.addEventListener('change', function() {
        const selectedRound = this.value;
        document.querySelectorAll('.fixture-group').forEach(group => {
            group.classList.add('hidden');
        });
        if (selectedRound) {
            document.querySelectorAll(`.${selectedRound}`).forEach(group => {
                group.classList.remove('hidden');
            });
        }
    });
}