// Selecteer de top-app-bar en initialiseer de MDCTopAppBar
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

// Selecteer de drawer en initialiseer de MDCDrawer
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

// Functie om de drawer te openen
function openDrawer() {
    drawer.open = true;
}

// Functie om de drawer te sluiten
function closeDrawer() {
    drawer.open = false;
}

// Selecteer de hamburger-knop in de top-app-bar
const hamburger = document.querySelector('.mdc-top-app-bar__navigation-icon');

// Voeg een click event toe aan de hamburger-knop om de drawer te openen
hamburger.addEventListener('click', () => {
    openDrawer();
});

// Elementen selecteren voor verschillende secties van de home pagina
const title = document.querySelector('.mdc-top-app-bar__title');
const hamburgerItem = document.querySelectorAll('.mdc-list-item');
const home = document.querySelector('.mdc-list-item:nth-child(2)');
const body = document.querySelector('body');
const datePicker = document.querySelector('.datePicker');
let tableMatch2 = document.querySelector('.match-table');
let tbodyMatch2 = document.querySelector('.match-table tbody');

// Functie om het actieve link-item in de drawer in te stellen op basis van de huidige pagina-titel
function setActiveLink() {
    const currentPage = title.textContent.trim();
    console.log(currentPage);
    hamburgerItem.forEach(function(button) {
        if (button.textContent.trim() === currentPage) {
            button.classList.add('mdc-list-item--activated');
        } else {
            button.classList.remove('mdc-list-item--activated');
        }
    });
}

// Stel de actieve link in bij het laden van de pagina
setActiveLink();

// Voeg een click event toe aan elk lijst-item in de drawer om de actieve link in te stellen
hamburgerItem.forEach(function(button) {
    button.addEventListener('click', setActiveLink);
});

// functie om een bepaalde tijd in milliseconden te wachten om te zorgen dat alle logo's rustig in kunnen laden
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Functie om data op te halen met retries en exponential backoff bij fouten of rate limiting
async function fetchWithRetry(url, options, retries = 3, backoff = 3000, maxBackoff = 30000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                if (response.status === 429 && i < retries - 1) {
                    // Rate limited, wacht en probeer opnieuw
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

// Functie om wedstrijden op te halen en te tonen
async function wedstrijden(date) {
    // Als er geen datum is opgegeven, gebruik de datum van vandaag
    if (!date) {
        let dateToday = new Date();
        console.log(dateToday);
        date = dateToday.toISOString().split('T')[0];
        console.log(date);
    }

    try {
        // Haal de wedstrijden op met retries bij het niet laden van bijvoorbeeld logo's
        const data = await fetchWithRetry(`https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${date}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '862ebac7f9msh969c479e23695a1p15ea43jsn5ad4cf9b18cd',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        });
    
        // Haal de response data op uit het resultaat van de fetch-aanroep
        const result = data.response;
        console.log(result);
    
        // Roep de functie aan om de wedstrijden weer te geven
        toonWedstrijden(result);
    } catch (error) {
        // Log een foutmelding naar de console als de fetch-operatie mislukt
        console.error('There has been a problem with your fetch operation:', error);
    }    
}

// Functie om de wedstrijden te tonen
function toonWedstrijden(wedstrijden) {
    const favorietenWedstrijden = JSON.parse(localStorage.getItem('favorietenWedstrijden')) || [];
    // maak eerst de tbody leeg zodat je echt alleen de wedstrijden van de gekozen dag ziet 
    tbodyMatch2.innerHTML = '';

    // loop door de wedstrijden heen
    wedstrijden.forEach(function(wedstrijd) {
        // Haal de naam van de league en de ronde van de wedstrijd op
        const leagueName = wedstrijd.league.name;
        const roundName = wedstrijd.league.round;

        // Maak een unieke sleutel voor de groep op basis van de league en ronde
        const groupKey = `${leagueName}-${roundName}`;

        // Zoek naar een bestaande fixture-groep div met de gegenereerde sleutel
        let fixtureGroupDiv = document.querySelector(`.fixture-group[data-group-key="${groupKey}"]`);

        console.log(`.fixture-group[data-group-key="${groupKey}"]`);

        // Als de fixture-groep div niet bestaat, maak er een nieuwe aan
        if (!fixtureGroupDiv) {
            fixtureGroupDiv = document.createElement('div');
            fixtureGroupDiv.classList.add('fixture-group');
            fixtureGroupDiv.setAttribute('data-group-key', groupKey);

            // Maak en voeg een h2 element toe voor de league naam
            const leagueNameH2 = document.createElement('h2');
            leagueNameH2.textContent = leagueName;

            // Maak en voeg een h2 element toe voor de ronde naam
            const roundNameH2 = document.createElement('h2');
            roundNameH2.textContent = roundName;

            fixtureGroupDiv.appendChild(leagueNameH2);
            fixtureGroupDiv.appendChild(roundNameH2);

            // Voeg de nieuwe fixture-groep div toe aan de tabel body
            tbodyMatch2.appendChild(fixtureGroupDiv);
        }

        // Maak een nieuwe rij aan voor de wedstrijd
        const row = document.createElement('tr');

        // Maak een cel aan voor de wedstrijdstatus en vul deze in
        const stateCell = document.createElement('td');
        stateCell.classList.add('state');
        stateCell.textContent = wedstrijd.fixture.status.short;

        // Maak een cel aan voor de teams informatie
        const teamsCell = document.createElement('td');
        const teamsDiv = document.createElement('div');
        teamsDiv.classList.add('teams-info');

        // Maak divs aan voor het eerste team en vul deze in
        const team1Div = document.createElement('div');
        team1Div.classList.add('team-info');
        const team1Logo = document.createElement('img');
        team1Logo.src = wedstrijd.teams.home.logo;
        team1Logo.alt = `${wedstrijd.teams.home.name} logo`;
        team1Logo.classList.add('team-logo');
        const team1Name = document.createElement('p');
        team1Name.textContent = wedstrijd.teams.home.name;

        // Maak divs aan voor het tweede team en vul deze in
        const team2Div = document.createElement('div');
        team2Div.classList.add('team-info');
        const team2Logo = document.createElement('img');
        team2Logo.src = wedstrijd.teams.away.logo;
        team2Logo.alt = `${wedstrijd.teams.away.name} logo`;
        team2Logo.classList.add('team-logo');
        const team2Name = document.createElement('p');
        team2Name.textContent = wedstrijd.teams.away.name;

        // Voeg de team logo's en namen toe aan de teams div
        team1Div.appendChild(team1Logo);
        team1Div.appendChild(team1Name);
        teamsDiv.appendChild(team1Div);
        team2Div.appendChild(team2Logo);
        team2Div.appendChild(team2Name);
        teamsDiv.appendChild(team2Div);
        teamsCell.appendChild(teamsDiv);

        // Maak een cel aan voor de scores en vul deze in
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

        // Haal het ID van de wedstrijd op
        const fixtureId = wedstrijd.fixture.id;

        const favorieteCell = document.createElement('td');
        let svgNS = "http://www.w3.org/2000/svg";
        let svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");
        svg.setAttribute("viewBox", "0 0 24 24");

        let path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M12 .587l3.668 7.431 8.2 1.193-5.932 5.78 1.401 8.169L12 18.896 4.663 23.16l1.401-8.169L.132 9.211l8.2-1.193z");
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "1");

        // Controleer of de wedstrijd een favoriet is en stel de kleur van het ster-icoon in
        if (!favorietenWedstrijden.includes(fixtureId)) {
            path.setAttribute("fill", "white");
        } else {
            path.setAttribute("fill", "red");
        }

        svg.appendChild(path);

        // Voeg een click event toe aan het ster-icoon om de wedstrijd als favoriet in te stellen of te verwijderen
        svg.addEventListener('click', function () {
            if (!favorietenWedstrijden.includes(fixtureId)) {
                path.setAttribute("fill", "red");
                favorietenWedstrijden.push(fixtureId);
            } else {
                path.setAttribute("fill", "white");
                const index = favorietenWedstrijden.indexOf(fixtureId);
                if (index > -1) {
                    favorietenWedstrijden.splice(index, 1);
                }
            }
            localStorage.setItem('favorietenWedstrijden', JSON.stringify(favorietenWedstrijden));
            console.log(favorietenWedstrijden);
        });

        favorieteCell.appendChild(svg);

        row.appendChild(stateCell);
        row.appendChild(teamsCell);
        row.appendChild(scoreCell);
        row.appendChild(favorieteCell);
        fixtureGroupDiv.appendChild(row);

        // Voeg een click event toe aan de team-cel om naar de uitslagenpagina te navigeren
        teamsCell.addEventListener('click', function () {
            window.location.href = `uitslagen.html?id=${fixtureId}`;
        });
    });

    tableMatch2.appendChild(tbodyMatch2);
}

// Haal wedstrijden op bij het laden van de pagina
wedstrijden();

// Voeg een event listener toe aan de date picker om wedstrijden op te halen bij het wijzigen van de datum
datePicker.addEventListener('change', function() {
    wedstrijden(datePicker.value);
});



