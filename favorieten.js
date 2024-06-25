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

// Selecteer de hamburger-knop en de lijst-items in de drawer
const hamburger = document.querySelector('.mdc-top-app-bar__navigation-icon');
const hamburgerItem = document.querySelectorAll('.mdc-list-item');
const title = document.querySelector('.mdc-top-app-bar__title');

// Selecteer en initialiseer de MDCTabBar
const tabBarElement = document.querySelector('.mdc-tab-bar');
const tabBar = new MDCTabBar(tabBarElement);

// Voeg een click event toe aan de hamburger-knop om de drawer te openen
hamburger.addEventListener('click', () => {
    openDrawer();
});

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

// Elementen selecteren voor verschillende secties van de favorieten pagina
const item = document.querySelectorAll('.mdc-tab');
const item2 = document.querySelectorAll('.mdc-tab-indicator');
const mdcItem = document.querySelectorAll('.mdc-item');
const home = document.querySelector('.mdc-list-item:nth-child(2)');
const body = document.querySelector('body');
const competitieH2 = document.querySelector('.competities h2');
const ul = document.querySelector('.mdc-image-list');
const datePicker = document.querySelector('.datePicker');
const wedstrijdH2 = document.querySelector('.wedstrijden h2');
const table = document.querySelector('.match-table');
const tbody = document.querySelector('.match-table tbody');

// Voeg een click event toe aan elk tab-item om de bijbehorende content weer te geven
item.forEach(function(button) {
    button.addEventListener('click', () => {
        const text = button.querySelector('.mdc-tab__text-label').textContent.toLowerCase();
        mdcItem.forEach(function(element) {
            element.classList.add('hidden');
            if (element.classList.contains(text)) {
               element.classList.remove('hidden');
            }
        });
    });
});

// Voeg een click event toe aan de pagina-titel om alle tabs te deactiveren en alle content te tonen
title.addEventListener('click', () => {
    item.forEach(function(element) {
        element.classList.remove('mdc-tab--active');
    });
    item2.forEach(function(element) {
        element.classList.remove('mdc-tab-indicator--active');
    });
    mdcItem.forEach(function(element) {
        element.classList.remove('hidden');
    });
});

// loop door de mdcItem elementen heen en laad de bijbehorende functies voor competities en wedstrijden in
mdcItem.forEach(function(element) {
    if (element.classList.contains('competities')) {
        favorieteCompetities();
    }
    if (element.classList.contains('wedstrijden')) {
        favorieteWedstrijden();

        // Voeg een change event toe aan de datePicker om wedstrijden op een specifieke datum te laden
        datePicker.addEventListener('change', function() {
            favorieteWedstrijden(datePicker.value);
        });
    }
});

function favorieteCompetities() {
    // Haal favoriete competities op uit localStorage, als er geen zijn, gebruik dan een lege array
    const favorietenCompetities = JSON.parse(localStorage.getItem('favorietenCompetities')) || [];
    // Maak de lijst leeg om te beginnen zodat er geen andere competities tevoorschijn komen
    ul.innerHTML = ''; 

    if (favorietenCompetities.length > 0) {
        // Maak een fetch-aanroep naar de API om gegevens van competities op te halen
        fetch(`https://api-football-v1.p.rapidapi.com/v3/leagues`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '862ebac7f9msh969c479e23695a1p15ea43jsn5ad4cf9b18cd',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        })
        .then(response => {
            // Controleer of de response succesvol is
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Converteer de response naar JSON
            return response.json(); 
        })
        .then(data => {
            // Haal het response veld uit de JSON data array
            const result = data.response; 
            console.log(result);
            console.log(favorietenCompetities);

            // loop door de lijst van favoriete competitie-IDs
            favorietenCompetities.forEach(function(id) {
                // loop dan door de opgehaalde competities
                result.forEach(function(response) {
                    // vergelijk of het id van een opgehaalde competitie gelijk is aan de id van de favoriete competitie
                    if (response.league.id === id) {
                        // Zet de header tekst
                        competitieH2.textContent = "Favoriete Competities"; 

                        // Maak een nieuw lijstitem
                        let li = document.createElement('li'); 
                        // Voeg een CSS-klasse toe
                        li.classList.add('mdc-image-list__item'); 

                        // Haal de competitie ID op
                        let leagueId = response.league.id; 

                        // Maak een SVG element voor de ster
                        let svgNS = "http://www.w3.org/2000/svg";
                        let svg = document.createElementNS(svgNS, "svg");
                        svg.setAttribute("width", "24");
                        svg.setAttribute("height", "24");
                        svg.setAttribute("viewBox", "0 0 24 24");

                        let path = document.createElementNS(svgNS, "path");
                        path.setAttribute("d", "M12 .587l3.668 7.431 8.2 1.193-5.932 5.78 1.401 8.169L12 18.896 4.663 23.16l1.401-8.169L.132 9.211l8.2-1.193z");
                        path.setAttribute("stroke", "black");
                        path.setAttribute("stroke-width", "1");
                        path.setAttribute("fill", "red");

                        svg.appendChild(path);

                        // Maak een img element voor het competitie logo
                        let image = document.createElement('img');
                        image.classList.add('mdc-image-list__image');
                        image.src = response.league.logo;
                        image.alt = response.league.name;

                        // Maak een paragraaf element voor de competitie naam
                        let p = document.createElement('p');
                        p.classList.add('mdc-image-list__paragraph');
                        p.textContent = response.league.name;

                        // Voeg SVG, image en paragraaf toe aan het lijstitem
                        li.appendChild(svg);
                        li.appendChild(image);
                        li.appendChild(p);
                        // Voeg het lijstitem toe aan de ul
                        ul.appendChild(li); 

                        // Voeg een click event toe aan de SVG om de competitie uit favorieten te verwijderen
                        svg.addEventListener('click', function() {
                            const index = favorietenCompetities.indexOf(id);
                            if (index > -1) {
                                favorietenCompetities.splice(index, 1);
                                localStorage.setItem('favorietenCompetities', JSON.stringify(favorietenCompetities));
                                 // Verander de kleur van de ster
                                path.setAttribute("fill", "white");
                            }
                            console.log(favorietenCompetities);
                        });

                        // Voeg een click event toe aan de image om naar de league pagina te gaan
                        image.addEventListener('click', function() {
                            if (image) {
                                const src = image.src;
                                console.log(src);
                                const altTekst = image.alt;
                                console.log(altTekst);
                                const seasons = response.seasons;
                                console.log(response);
                                const today = new Date();
                                console.log(today);
                                let year = 0;

                                // loop door alle seizoenen in de array om het huidige seizoen te vinden en 
                                // als het nieuwe seizoen nog niet is begonnen laat dan het vorige afgespeelde seizoen zien
                                seasons.forEach(function(season) {
                                    const startDate = new Date(season.start);
                                    console.log(startDate);
                                    console.log(season);
                                    if (season.current === true) {
                                        year = season.year;
                                    }
                                    if (season.current === true && today < startDate) {
                                        year = season.year - 1;
                                    }
                                });
                                console.log(year);

                                // Navigeer naar de league pagina met verschillende query parameters 
                                window.location.href = `league.html?id=${leagueId}&alt=${encodeURIComponent(altTekst)}&src=${encodeURIComponent(src)}&season=${encodeURIComponent(year)}`;
                            }
                        });
                    }
                });
            });
        })
        .catch(error => {
            // Log een foutmelding als er iets misgaat met de fetch-aanroep
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {
        // Als er geen favoriete competities zijn, verander de header tekst
        competitieH2.textContent = "Geen favoriete competities gevonden";
    }
}

function favorieteWedstrijden(date) {
    // Haal favoriete wedstrijden op uit localStorage, als er geen zijn, gebruik dan een lege array
    const favorietenWedstrijden = JSON.parse(localStorage.getItem('favorietenWedstrijden')) || [];

    // Controleer of er favoriete wedstrijden zijn
    if (favorietenWedstrijden.length > 0) {
        // Als geen datum is opgegeven, gebruik de huidige datum
        if (!date) {
            let dateToday = new Date();
            console.log(dateToday);
            // Haal de datum in het formaat 'YYYY-MM-DD' op
            date = dateToday.toISOString().split('T')[0]; 
            console.log(date);
        }

        // Maak een fetch-aanroep naar de API om gegevens van wedstrijden op te halen op de opgegeven datum
        fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${date}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '862ebac7f9msh969c479e23695a1p15ea43jsn5ad4cf9b18cd',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        })
        .then(response => {
            // Controleer of de response succesvol is
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse de response naar JSON
            return response.json(); 
        })
        .then(data => {
            // Haal het response veld uit de JSON data array
            const result = data.response; 
            console.log(result);
            console.log(favorietenWedstrijden);
            // Maak de tabelbody leeg om te beginnen
            tbody.innerHTML = ''; 
            // Variabele om te controleren of er favoriete wedstrijden zijn gevonden
            let found = false; 

            // loop door de lijst van favoriete wedstrijd-IDs
            favorietenWedstrijden.forEach(function(id) {
                // loop door de opgehaalde wedstrijden
                result.forEach(function(response) {
                    // vergelijk of het id van een opgehaalde wedstrijd gelijk is aan de id van de favoriete wedstrijd
                    if(response.fixture.id === id) {
                        // Stel de variabele in op true als er een favoriete wedstrijd is gevonden
                        found = true; 
                        // Zet de header tekst
                        wedstrijdH2.textContent = "Favoriete Wedstrijden"; 
                        const leagueName = response.league.name;
                        const roundName = response.league.round;
                        const groupKey = `${leagueName}-${roundName}`;

                        // Zoek naar een bestaande groep div voor deze league en ronde
                        let fixtureGroupDiv = document.querySelector(`.fixture-group[data-group-key="${groupKey}"]`);
                        console.log(`.fixture-group[data-group-key="${groupKey}"]`);

                        // Als de groep div niet bestaat, maak er een
                        if (!fixtureGroupDiv) {
                            fixtureGroupDiv = document.createElement('div');
                            fixtureGroupDiv.classList.add('fixture-group');
                            fixtureGroupDiv.setAttribute('data-group-key', groupKey);

                            const leagueNameH2 = document.createElement('h2');
                            leagueNameH2.textContent = leagueName;

                            const roundNameH2 = document.createElement('h2');
                            roundNameH2.textContent = roundName;

                            fixtureGroupDiv.appendChild(leagueNameH2);
                            fixtureGroupDiv.appendChild(roundNameH2);

                            // Voeg de groep div toe aan de tabelbody
                            tbody.appendChild(fixtureGroupDiv); 
                        }

                        // Maak een nieuwe rij
                        const row = document.createElement('tr'); 

                        // Maak en vul de cellen voor de wedstrijdstatus, teams en score
                        const stateCell = document.createElement('td');
                        stateCell.classList.add('state');
                        stateCell.textContent = response.fixture.status.short;

                        const teamsCell = document.createElement('td');
                        const teamsDiv = document.createElement('div');
                        teamsDiv.classList.add('teams-info');
                        const team1Div = document.createElement('div');
                        team1Div.classList.add('team-info');
                        const team1Logo = document.createElement('img');
                        team1Logo.src = response.teams.home.logo;
                        team1Logo.alt = `${response.teams.home.name} logo`;
                        team1Logo.classList.add('team-logo');
                        const team1Name = document.createElement('p');
                        team1Name.textContent = response.teams.home.name;

                        const team2Div = document.createElement('div');
                        team2Div.classList.add('team-info');
                        const team2Logo = document.createElement('img');
                        team2Logo.src = response.teams.away.logo;
                        team2Logo.alt = `${response.teams.away.name} logo`;
                        team2Logo.classList.add('team-logo');
                        const team2Name = document.createElement('p');
                        team2Name.textContent = response.teams.away.name;

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
                        team1Score.textContent = response.goals.home;
                        const team2Score = document.createElement('p');
                        team2Score.textContent = response.goals.away;
                        scoreDiv.appendChild(team1Score);
                        scoreDiv.appendChild(team2Score);
                        scoreCell.appendChild(scoreDiv);

                        const fixtureId = response.fixture.id;

                        // Maak een cel voor de favorieten ster en voeg een event listener toe
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
                        path.setAttribute("fill", "red");

                        svg.appendChild(path);

                        // Voeg een click event toe aan de SVG om de wedstrijd uit favorieten te verwijderen
                        svg.addEventListener('click', function(){
                            const index = favorietenWedstrijden.indexOf(id);
                            if (index > -1) {
                                favorietenWedstrijden.splice(index, 1);
                                localStorage.setItem('favorietenWedstrijden', JSON.stringify(favorietenWedstrijden));
                                // Verander de kleur van de ster
                                path.setAttribute("fill", "white"); 
                            }
                            console.log(favorietenWedstrijden);
                        });

                        favorieteCell.appendChild(svg);

                        // Voeg alle cellen toe aan de rij en voeg de rij toe aan de groep div
                        row.appendChild(stateCell);
                        row.appendChild(teamsCell);
                        row.appendChild(scoreCell);
                        row.appendChild(favorieteCell);
                        fixtureGroupDiv.appendChild(row);

                        // Voeg een click event toe aan de teams cel om naar de uitslagen pagina te gaan
                        teamsCell.addEventListener('click', function () {
                            window.location.href = `uitslagen.html?id=${fixtureId}`;
                        });
                        // Voeg de tabelbody toe aan de tabel
                        table.appendChild(tbody); 
                    }
                });
            });

            // Als er geen favoriete wedstrijden zijn gevonden op de opgegeven datum, toon een bericht 
            if (found == false) {
                wedstrijdH2.textContent = "Op deze dag zijn er geen favoriete wedstrijden gevonden";
            }
        })
        .catch(error => {
            // Log een foutmelding als er iets misgaat met de fetch-aanroep
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {
        // Als er geen favoriete wedstrijden zijn, verander de header tekst
        wedstrijdH2.textContent = "Geen favoriete wedstrijden gevonden";
    }
}

