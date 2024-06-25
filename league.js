// Selecteer de top-app-bar en initialiseer de MDCTopAppBar
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

// Selecteer de terugknop in de top-app-bar
const backIcon = document.querySelector('.mdc-top-app-bar__back-icon');

// Event listener voor terugknop om door te sturen naar 'standen.html'
backIcon.addEventListener('click', () => {
    window.location.href = `standen.html`;
});

// Selecteer de tab-bar en initialiseer de MDCTabBar
const tabBarElement = document.querySelector('.mdc-tab-bar');
const tabBar = new MDCTabBar(tabBarElement);

// Elementen selecteren voor verschillende secties van de competitie pagina
const image = document.querySelector('.mdc-top-app-bar__image');
const title = document.querySelector('.mdc-top-app-bar__title');
const item = document.querySelectorAll('.mdc-tab');
const item2 = document.querySelectorAll('.mdc-tab-indicator');
const hamburgerItem = document.querySelectorAll('.mdc-list-item');
const home = document.querySelector('.mdc-list-item:nth-child(2)');
const body = document.querySelector('body');
const main = document.querySelector('.main');
const stand = document.querySelector('.stand');
const mdcItem = document.querySelectorAll('.mdc-item');
const stats = document.querySelector('.statistieken');
const tableItem = document.querySelectorAll('.table-item');
const tableItemTbody = document.querySelector('.table-item tbody');
const statDiv = document.querySelectorAll('.stats');
const goalsDiv = document.querySelector('.goals');
const assistDiv = document.querySelector('.assists');
const yellowDiv = document.querySelector('.yellow');
const redDiv = document.querySelector('.red');
const goalsH2 = document.querySelector('.goals h2');
const tableTopScorers = document.querySelector('.goals-table');
const tbodyTopScorers = document.querySelector('.goals-table tbody');
const assistH2 = document.querySelector('.assists h2');
const tableTopAssisters = document.querySelector('.assists-table');
const tbodyTopAssisters = document.querySelector('.assists-table tbody');
const yellowH2 = document.querySelector('.yellow h2');
const tableTopYellow = document.querySelector('.yellow-table');
const tbodyTopYellow = document.querySelector('.yellow-table tbody');
const redH2 = document.querySelector('.red h2');
const tableTopRed = document.querySelector('.red-table');
const tbodyTopRed = document.querySelector('.red-table tbody');
const fixtures = document.querySelector('.uitslagen');
const tableMatch = document.querySelector('.match-table');
const tbodyMatch = document.querySelector('.match-table tbody');
const speelrondeSelect = document.querySelector('.speelronde');

// Functie om de actieve link in de navigatiebalk in te stellen op basis van de huidige pagina
function setActiveLink() {
    const currentPage = title.textContent.trim();
    hamburgerItem.forEach(function(button) {
        if (button.textContent.trim() === currentPage) {
            button.classList.add('mdc-list-item--activated');
        } else {
            button.classList.remove('mdc-list-item--activated');
        }
    });
}

// Roep setActiveLink aan om de actieve link te initialiseren
setActiveLink();

// Voeg event listeners toe aan alle hamburger items om setActiveLink aan te roepen bij klik
hamburgerItem.forEach(function(button) {
    button.addEventListener('click', setActiveLink);
});

// Event listeners voor tabbladen om de juiste sectie weer te geven op basis van het gekozen tabblad
item.forEach(function(button) {
    button.addEventListener('click', () => {
        const text = button.querySelector('.mdc-tab__text-label').textContent;
        mdcItem.forEach(function(element) {
            element.classList.add('hidden');
            if (element.classList.contains(text.toLowerCase())) {
               element.classList.remove('hidden');
            }
        });
    });
});

// Haal de query parameters op uit de URL voor verdere verwerking
const urlParams = new URLSearchParams(window.location.search);
const leagueId = urlParams.get('id');
const src = urlParams.get('src');
const altTekst = urlParams.get('alt');

// Zet de bron en alternatieve tekst van de afbeelding in de top app bar
image.src = decodeURIComponent(src);
title.textContent = decodeURIComponent(altTekst);

// Haal het seizoen op uit de query parameters
let season = urlParams.get('season');

// Loop door alle mdcItem elementen en voer de juiste acties uit op basis van hun klassen
mdcItem.forEach(function(element) {
    let hasSameClass = false;
    if (element.classList.contains('stand')) {
        hasSameClass = true;
        // Roep functie aan om competitie standen op te halen
        fetchCompetitieStanden(leagueId); 
    }
    if (!hasSameClass) {
        element.classList.add('hidden');
    }
    if (element.classList.contains('statistieken')) {
        // Loop door alle statDiv elementen en haal de top standen op voor goals, assists, yellow cards en red cards
        statDiv.forEach(function(statDiv) {
            let tables = ['goals', 'assists', 'yellow', 'red'];
            tables.forEach(function(statType) {
                if (statDiv.classList.contains(statType)) {
                    // Roep functie aan om top standen op te halen voor een specifiek type dus goals, assist, gele kaarten en rode kaarten
                    fetchTopStanden(leagueId, statType); 
                }
            });
        });
    } 
    if (element.classList.contains('uitslagen')) {
        // Roep functie aan om competitie wedstrijden op te halen
        fetchCompetitieWedstrijden(leagueId); 
    }
});

// Event listener voor klik op titel om alle tabbladen te resetten naar hun standaard staat 
// en laat de competitiestand weer zien
title.addEventListener('click', () => {
    item.forEach(function(element) {
        element.classList.remove('mdc-tab--active');
    });
    item2.forEach(function(element) {
        element.classList.remove('mdc-tab-indicator--active');
    });
    mdcItem.forEach(function(element) {
        let hasSameClass = false;
        if (element.classList.contains('stand')) {
            hasSameClass = true;
        }
        if (hasSameClass) {
            element.classList.remove('hidden');
        }
    });
});

// Functie om competitie standen op te halen van een API
function fetchCompetitieStanden(leagueId) {
    fetch(`https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=${season}`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '862ebac7f9msh969c479e23695a1p15ea43jsn5ad4cf9b18cd',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    })
    .then(response => {
        // Controleer of het netwerkverzoek succesvol was
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Zet de ontvangen data om naar JSON
        return response.json();
    })
    .then(data => {
        // Haal de competitie standen op uit de ontvangen data
        const standings = data.response[0].league.standings;
        // Roep de functie aan om de standen weer te geven op de webpagina
        displayLeagueStandings(standings);
    })
    .catch(error => {
        // log eventuele fouten tijdens het ophalen van de standen
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// Functie om de competitie standen weer te geven op de webpagina
function displayLeagueStandings(standings) {
    // Controleer of er tussen de 2 en 5 groepen zijn
    if (standings.length > 1 && standings.length < 6) {
        // Maak een dropdown menu voor groep selectie
        const selectGroup = document.createElement('select');
        selectGroup.classList.add('groep');

        // Voor elke groep, maak een optie in de dropdown
        standings.forEach(function(group) {
            const option = document.createElement('option');
            group.forEach(function(team) {
                // Stel de tekst en waarde van de optie in op basis van de groepsnaam
                const groepNaam = team.group;
                option.textContent = groepNaam;
                // verander de witregels en de dubbele punt in de tekst door streepjes zodat ik de value 
                // dadelijk weer kan selecteren en kan hergebruiken en geen foutmelding krijg 
                // van het is geen valid selector
                const naam = groepNaam.replace(/ /g, '-').replace(/:/g, '-');
                option.value = naam;
            });
            // Voeg de optie toe aan de dropdown
            selectGroup.appendChild(option);
        });

        // Voeg de dropdown toe aan de standen sectie op de pagina
        stand.appendChild(selectGroup);

        // Voor elke groep, maak een div voor de standen en voeg deze toe aan de pagina
        standings.forEach(function(group) {
            const standingGroupDiv = document.createElement('div');
            standingGroupDiv.classList.add('standing-group');
            const groupName = document.createElement('h2');
            group.forEach(function(team) {
                // Toon de groepsnaam in een h2 element
                const groepNaam = team.group;
                groupName.textContent = groepNaam;
                // Voeg een klasse toe aan de div op basis van de groepsnaam voor latere selectie
                const naam = groepNaam.replace(/ /g, '-').replace(/:/g, '-');
                standingGroupDiv.classList.add(naam);
            });
            // Voeg de groepsnaam toe aan de div
            standingGroupDiv.appendChild(groupName);
            // Roep de functie aan om de standen van de groep weer te geven
            competitieStanden(group, standingGroupDiv);
        });

        // Logica om de juiste groep standen te tonen op basis van geselecteerde optie in dropdown
        selectGroup.addEventListener('change', function() {
            const selectedOption = this.value;
            const standingGroup = document.querySelectorAll('.standing-group');
            // Verberg alle standen groepen
            standingGroup.forEach(function(element) {
                element.classList.add('hidden');
            });
            // Toon de geselecteerde groep standen
            if (selectedOption) {
                const groupClass = document.querySelectorAll(`.${selectedOption}`);
                groupClass.forEach(function(element) {
                    element.classList.remove('hidden');
                });
            }
        });
    } else {
        // Als er minder dan 2 groepen zijn, toon alle standen zonder dropdown selectie
        standings.forEach(function(group) {
            const standingGroupDiv = document.createElement('div');
            standingGroupDiv.classList.add('standing-group');

            // Voeg een h2 element toe voor de groepsnaam als er meerdere groepen zijn
            if (standings.length > 1) {
                const groupName = document.createElement('h2');
                group.forEach(function(team) {
                    groupName.textContent = team.group;
                });
                standingGroupDiv.appendChild(groupName);
            }
            
            // Roep de functie aan om de standen van de groep weer te geven
            competitieStanden(group, standingGroupDiv);
        });
    }
}

// Functie om de standen van een competitiegroep weer te geven op de webpagina
function competitieStanden(group, div) {
    // Maak een nieuwe HTML-tabel voor de standen
    const tableLeague = document.createElement('table');
    tableLeague.classList.add('standings-table');

    // Maak de thead van de tabel
    const theadLeague = document.createElement('thead');
    const headerRowLeague = document.createElement('tr');

    // Definieer de headers voor de tabel
    const headers = ['#', 'Team', 'W', 'DS', 'PTN'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRowLeague.appendChild(th);
    });

    // Voeg de headerrij toe aan de thead
    theadLeague.appendChild(headerRowLeague);

    // Maak de tbody  van de tabel
    const tbodyLeague = document.createElement('tbody');

    // Voor elke team in de groep, maak een rij in de tabel
    group.forEach(function(team) {
        const row = document.createElement('tr');

        // Cel voor rangnummer
        const rankCell = document.createElement('td');
        rankCell.textContent = team.rank;

        // Cel voor team informatie (logo en naam)
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

        // Cel voor aantal gespeelde wedstrijden
        const matchesCell = document.createElement('td');
        matchesCell.textContent = team.all.played;

        // Cel voor doelsaldo
        const goalDiffenceCell = document.createElement('td');
        goalDiffenceCell.textContent = team.goalsDiff;

        // Cel voor aantal punten
        const pointsCell = document.createElement('td');
        pointsCell.textContent = team.points;

        // Voeg alle cellen toe aan de rij
        row.appendChild(rankCell);
        row.appendChild(teamCell);
        row.appendChild(matchesCell);
        row.appendChild(goalDiffenceCell);
        row.appendChild(pointsCell);

        // Voeg de rij toe aan de tbody
        tbodyLeague.appendChild(row);
    });

    // Voeg de thead en tbody toe aan de tabel
    tableLeague.appendChild(theadLeague);
    tableLeague.appendChild(tbodyLeague);

    // Voeg de tabel toe aan de div voor deze groep standen
    div.appendChild(tableLeague);

    // Voeg de div toe aan de standen div op de pagina
    stand.appendChild(div);
}

// Functie om de topspelers op te halen op basis van het type (goals, assists, yellow cards, red cards)
function fetchTopStanden(leagueId, type) {
    let endpoint;

    // Bepaal het juiste eindpunt op basis van het type
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

    // Maak een fetch-aanroep naar de API om de gegevens op te halen
    fetch(`https://api-football-v1.p.rapidapi.com/v3/players/${endpoint}?league=${leagueId}&season=${season}`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '862ebac7f9msh969c479e23695a1p15ea43jsn5ad4cf9b18cd',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    })
    .then(response => {
        // Controleer of het antwoord van het netwerk OK is
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Verwerk de ontvangen gegevens en geef ze door aan de functie voor het weergeven van topstanden
        const result = data.response;
        console.log(result);
        laatTopStandenZien(result, type);
    })
    .catch(error => {
        // Vang eventuele fouten op tijdens de fetch-operatie
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// Functie om de topstand van spelers weer te geven op de webpagina
function laatTopStandenZien(standings, type) {
    // Neem alleen de top 5 resultaten voor weergave
    const top5 = standings.slice(0, 5);

    // Voor elk van de top 5 spelers, maak 5 rijen in de juiste tabel
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
        
        // Bepaal het juiste type en voeg de waarde toe aan de cel
        if (type == 'goals') {
            statCell.textContent = player.statistics[0].goals.total;
        } else if (type == 'assists') {
            statCell.textContent = player.statistics[0].goals.assists;
        } else if (type == 'yellow') {
            statCell.textContent = player.statistics[0].cards.yellow;
        } else if (type == 'red') {
            statCell.textContent = player.statistics[0].cards.yellowred + player.statistics[0].cards.red;
        } else {
            throw new Error('Invalid type');
        }

        // Voeg de cellen toe aan de rij op basis van het type
        row.appendChild(rankCell);
        row.appendChild(playerCell);
        row.appendChild(statCell);

        // Voeg de rij toe aan de juiste tbody op basis van het type
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

    // Voeg de volledige tabel toe aan de juiste sectie op basis van het type
    if (type == 'goals') {
        tableTopScorers.appendChild(tbodyTopScorers);
        goalsDiv.appendChild(tableTopScorers);
        stats.appendChild(goalsDiv);
    } else if (type == 'assists') {
        tableTopAssisters.appendChild(tbodyTopAssisters);
        assistDiv.appendChild(tableTopAssisters);
        stats.appendChild(assistDiv);
    } else if (type.includes('yellow')) {
        tableTopYellow.appendChild(tbodyTopYellow);
        yellowDiv.appendChild(tableTopYellow);
        stats.appendChild(yellowDiv);
    } else if (type.includes('red')) {
        tableTopRed.appendChild(tbodyTopRed);
        redDiv.appendChild(tableTopRed);
        stats.appendChild(redDiv);
    } else {
        throw new Error('Invalid type');
    }
}

// Functie om de wedstrijden van een competitie op te halen
function fetchCompetitieWedstrijden(leagueId) {
    // Fetch-aanroep naar de API om de wedstrijdgegevens op te halen
    fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=${season}`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '862ebac7f9msh969c479e23695a1p15ea43jsn5ad4cf9b18cd',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    })
    .then(response => {
        // Controleer of het antwoord van het netwerk OK is
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Verwerk de ontvangen gegevens en geef ze door aan de functie om wedstrijden weer te geven
        const result = data.response;
        console.log(result);
        laatWedstrijdenZien(result);
    })
    .catch(error => {
        // Vang eventuele fouten op tijdens de fetch-operatie
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// Functie om wedstrijdgegevens weer te geven op de webpagina
function laatWedstrijdenZien(wedstrijden) {
    // loop door de wedstrijden lijst heen 
    wedstrijden.forEach(function(wedstrijd) {
        console.log(wedstrijd);

        // Haal de speelronde op van de wedstrijd
        const round = wedstrijd.league.round;

        // Controleer of de speelronde al bestaat in het selectie-element 
        // en als dat zo is zet de variabele op true
        let roundExists = false;
        for (let i = 0; i < speelrondeSelect.options.length; i++) {
            if (speelrondeSelect.options[i].value === round.replace(/ /g, '-')) {
                roundExists = true;
                break;
            }
        }

        // Voeg de speelronde toe aan het selectie-element als deze nog niet bestaat 
        // en de roundExists variabele dus false is
        if (!roundExists) {
            const option = document.createElement('option');
            option.textContent = round;
            option.value = round.replace(/ /g, '-');
            speelrondeSelect.appendChild(option);
        }

        // Formatteer de datum van de wedstrijd
        const date = new Date(wedstrijd.fixture.date);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

        // Creëer een unieke sleutel voor de wedstrijdgroep
        const groupKey = `${round}-${formattedDate}`;

        // Zoek naar een bestaand element met dezelfde groepssleutel
        let fixtureGroupDiv = document.querySelector(`.fixture-group[data-group-key="${groupKey}"]`);
        console.log(`.fixture-group[data-group-key="${groupKey}"]`);

        // Als de wedstrijdgroep nog niet bestaat, maak deze dan aan
        if (!fixtureGroupDiv) {
            fixtureGroupDiv = document.createElement('div');
            fixtureGroupDiv.classList.add('fixture-group');
            fixtureGroupDiv.classList.add(round.replace(/ /g, '-'));
            fixtureGroupDiv.setAttribute('data-group-key', groupKey);

            // Maak elementen aan voor ronde en datum
            const roundNameH2 = document.createElement('h2');
            roundNameH2.textContent = round;
            const dateP = document.createElement('p');
            dateP.textContent = formattedDate;

            // Voeg elementen toe aan de wedstrijdgroep
            fixtureGroupDiv.appendChild(roundNameH2);
            fixtureGroupDiv.appendChild(dateP);

            // Voeg de wedstrijdgroep toe aan de tabel met wedstrijden
            tbodyMatch.appendChild(fixtureGroupDiv);
        }

        // Maak een nieuwe rij aan voor elke wedstrijd
        const row = document.createElement('tr');

        // Cel voor de status van de wedstrijd
        const stateCell = document.createElement('td');
        stateCell.classList.add('state');
        stateCell.textContent = wedstrijd.fixture.status.short;

        // Cel voor teams en logo's
        const teamsCell = document.createElement('td');
        const teamsDiv = document.createElement('div');
        teamsDiv.classList.add('teams-info');

        // Team 1 informatie
        const team1Div = document.createElement('div');
        team1Div.classList.add('team-info');
        const team1Logo = document.createElement('img');
        team1Logo.src = wedstrijd.teams.home.logo;
        team1Logo.alt = `${wedstrijd.teams.home.name} logo`;
        team1Logo.classList.add('team-logo');
        const team1Name = document.createElement('p');
        team1Name.textContent = wedstrijd.teams.home.name;
        team1Div.appendChild(team1Logo);
        team1Div.appendChild(team1Name);

        // Team 2 informatie
        const team2Div = document.createElement('div');
        team2Div.classList.add('team-info');
        const team2Logo = document.createElement('img');
        team2Logo.src = wedstrijd.teams.away.logo;
        team2Logo.alt = `${wedstrijd.teams.away.name} logo`;
        team2Logo.classList.add('team-logo');
        const team2Name = document.createElement('p');
        team2Name.textContent = wedstrijd.teams.away.name;
        team2Div.appendChild(team2Logo);
        team2Div.appendChild(team2Name);

        // Voeg teamdivs toe aan teamsdiv
        teamsDiv.appendChild(team1Div);
        teamsDiv.appendChild(team2Div);
        teamsCell.appendChild(teamsDiv);

        // Cel voor scores
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

        // Voeg cellen toe aan de rij
        row.appendChild(stateCell);
        row.appendChild(teamsCell);
        row.appendChild(scoreCell);

        // Voeg de rij toe aan de wedstrijdgroep
        fixtureGroupDiv.appendChild(row);

        // Voeg een event listener toe aan teamsCell om door te verwijzen naar de wedstrijdresultatenpagina
        teamsCell.addEventListener('click', function () {
            window.location.href = `uitslagen.html?id=${wedstrijd.fixture.id}`;
        });
    });

    // Voeg de tbody voor wedstrijden toe aan de tabel met wedstrijden
    tableMatch.appendChild(tbodyMatch);

    // Zorg ervoor dat de laatst geselecteerde speelronde geselecteerd blijft na toevoegen van nieuwe opties
    if (speelrondeSelect.options.length >= 1) {
        const lastOption = speelrondeSelect.options[speelrondeSelect.options.length - 1];
        lastOption.selected = true;
        const selectedOption = lastOption.value;

        // Verberg alle wedstrijdgroepen
        const fixtureGroup = document.querySelectorAll('.fixture-group');
        fixtureGroup.forEach(function(element) {
            element.classList.add('hidden');
        });

        // Toon de geselecteerde speelronde
        if (selectedOption) {
            const groupClass = document.querySelectorAll(`.${selectedOption}`);
            groupClass.forEach(function(element) {
                element.classList.remove('hidden');
            });
        }
    }

    // Voeg een event listener toe aan speelrondeSelect om wedstrijdgroepen te filteren op geselecteerde speelronde
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
