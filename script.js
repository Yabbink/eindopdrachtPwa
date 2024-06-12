const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

function openDrawer()
{
    drawer.open = true
}

function closeDrawer()
{
    drawer.open = false
}

const hamburger = document.querySelector('.mdc-top-app-bar__navigation-icon')

hamburger.addEventListener('click', () => {
    openDrawer()
})

const title = document.querySelector('.mdc-top-app-bar__title')
const hamburgerItem = document.querySelectorAll('.mdc-list-item')
const home = document.querySelector('.mdc-list-item:nth-child(2)')
const body = document.querySelector('body')
const datePicker = document.querySelector('.datePicker')
let tableMatch2 = document.querySelector('.match-table')
let tbodyMatch2 = document.querySelector('.match-table tbody')

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

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retries = 3, backoff = 3000, maxBackoff = 30000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                if (response.status === 429 && i < retries - 1) {
                    console.log(`Rate limited, retrying after ${backoff}ms`);
                    await sleep(backoff);
                    backoff = Math.min(backoff * 2, maxBackoff);
                    continue;
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        } catch (error) {
            if (i < retries - 1) {
                console.error(`Error on attempt ${i + 1}:`, error);
                await sleep(backoff);
                backoff = Math.min(backoff * 2, maxBackoff);
            } else {
                throw error;
            }
        }
    }
}

async function wedstrijden(date) {
    if (!date) {
        date = getCurrentDate();
    }

    try {
        const data = await fetchWithRetry(`https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${date}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '862ebac7f9msh969c479e23695a1p15ea43jsn5ad4cf9b18cd',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        });

        const result = data.response;
        console.log(result);
        toonWedstrijden(result);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function toonWedstrijden(wedstrijden) {
    tbodyMatch2.innerHTML = ''
    const groupedMatches = [];

    wedstrijden.forEach(wedstrijd => {
        const league = wedstrijd.league.name;
        const round = wedstrijd.league.round;
        let leagueGroup = groupedMatches.find(group => group.league === league && group.round === round);
        if (!leagueGroup) {
            leagueGroup = { league, round, matches: [] };
            groupedMatches.push(leagueGroup);
        }
        leagueGroup.matches.push(wedstrijd);
    });

    groupedMatches.forEach(group => {
        const fixtureGroupDiv = document.createElement('div')
        fixtureGroupDiv.classList.add('fixture-group')

        const leagueName = document.createElement('h2');
        leagueName.textContent = group.league;

        const roundName = document.createElement('h2');
        roundName.textContent = group.round;

        fixtureGroupDiv.appendChild(leagueName)
        fixtureGroupDiv.appendChild(roundName)

        const matches = group.matches

        matches.forEach(wedstrijd => {
            const row = document.createElement('tr');

            const stateCell = document.createElement('td');
            stateCell.classList.add('state');
            stateCell.textContent = wedstrijd.fixture.status.short;

            const teamsCell = document.createElement('td');
            const teamsDiv = document.createElement('div');
            teamsDiv.classList.add('teams-info');
            const team1Div = document.createElement('div');
            team1Div.classList.add('team-info');
            const team1Logo = document.createElement('img');
            team1Logo.src = wedstrijd.teams.home.logo;
            team1Logo.alt = `${wedstrijd.teams.home.name} logo`;
            team1Logo.classList.add('team-logo');
            const team1Name = document.createElement('p');
            team1Name.textContent = wedstrijd.teams.home.name;

            const team2Div = document.createElement('div');
            team2Div.classList.add('team-info');
            const team2Logo = document.createElement('img');
            team2Logo.src = wedstrijd.teams.away.logo;
            team2Logo.alt = `${wedstrijd.teams.away.name} logo`;
            team2Logo.classList.add('team-logo');
            const team2Name = document.createElement('p');
            team2Name.textContent = wedstrijd.teams.away.name;

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
            team1Score.textContent = wedstrijd.goals.home;
            const team2Score = document.createElement('p');
            team2Score.textContent = wedstrijd.goals.away;
            scoreDiv.appendChild(team1Score);
            scoreDiv.appendChild(team2Score);
            scoreCell.appendChild(scoreDiv);

            row.appendChild(stateCell);
            row.appendChild(teamsCell);
            row.appendChild(scoreCell);
            fixtureGroupDiv.appendChild(row);
            tbodyMatch2.appendChild(fixtureGroupDiv);
        });

        tableMatch2.appendChild(tbodyMatch2);
    });
}

wedstrijden()

datePicker.addEventListener('change', function(){
    wedstrijden(datePicker.value);
})


