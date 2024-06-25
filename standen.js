// Selecteer het element van de bovenste app-balk en initialiseer MDCTopAppBar
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

// Selecteer de zijbalk (drawer) en maak deze interactief
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

// Functie om de zijbalk te openen
function openDrawer() {
    drawer.open = true;
}

// Functie om de zijbalk te sluiten
function closeDrawer() {
    drawer.open = false;
}

// Selecteer het hamburgermenu icoon en voeg een klik gebeurtenis toe om de zijbalk te openen
const hamburger = document.querySelector('.mdc-top-app-bar__navigation-icon');
hamburger.addEventListener('click', () => {
    openDrawer();
});

// Elementen selecteren voor verschillende secties van de standen pagina
const title = document.querySelector('.mdc-top-app-bar__title');
const hamburgerItem = document.querySelectorAll('.mdc-list-item');
const home = document.querySelector('.mdc-list-item:nth-child(2)');
const body = document.querySelector('body');
const item = document.querySelectorAll('.mdc-tab');
const mdcItem = document.querySelectorAll('.mdc-item');
const leagueField = document.querySelector('.leagueField');
const leagueSearch = document.querySelector('.leagueSearch');
let ul = document.querySelector('.mdc-image-list');

// Functie om het actieve link-item in het hamburgermenu te markeren
function setActiveLink() {
    // Haal de huidige paginatitel op en verwijder eventuele extra spaties
    const currentPage = title.textContent.trim();
    console.log(currentPage);

    // loop door alle hamburgermenu items heen
    hamburgerItem.forEach(function(button) {
        // Vergelijk de tekst van elk item met de huidige paginatitel
        if (button.textContent.trim() === currentPage) {
            // Voeg de klasse toe voor geactiveerd item als ze overeenkomen
            button.classList.add('mdc-list-item--activated');
        } else {
            // Verwijder de klasse voor geactiveerd item als ze niet overeenkomen
            button.classList.remove('mdc-list-item--activated');
        }
    });
}

// Roep setActiveLink direct aan om het initieel actieve item te markeren
setActiveLink();

// Voeg een klikgebeurtenis toe aan elk hamburgermenu item om setActiveLink uit te voeren
hamburgerItem.forEach(function(button) {
    button.addEventListener('click', setActiveLink);
});

// Functie om te zoeken naar competities op basis van de ingevoerde naam
function zoekCompetitie() {
    // Haal de ingevoerde naam uit het inputveld en zet deze naar kleine letters om te matchen
    const naam = leagueField.value.toLowerCase();

    // Fetch request naar de API om competities op te halen
    fetch('https://api-football-v1.p.rapidapi.com/v3/leagues', {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '862ebac7f9msh969c479e23695a1p15ea43jsn5ad4cf9b18cd',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    })
    .then(response => {
        // Controleer of het antwoord OK is, anders gooi een fout
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Converteer het antwoord naar JSON
        return response.json(); 
    })
    .then(data => {
        const result = data.response; // Haal de array met resultaten op uit de JSON data
        console.log(result); // Log de resultaten naar de console

        ul.innerHTML = ''; // Maak de lijst (ul) leeg voordat nieuwe resultaten worden toegevoegd

        // loop door elk resultaat in de array
        result.forEach(function(response) {
            // Controleer of de naam van de competitie overeenkomt met de ingevoerde naam
            if (response.league.name.toLowerCase().includes(naam)) {
                // Toon de ingevoerde competitie op de pagina
                laatCompetitieZien(response); 
            } else if (response.country.name.toLowerCase().includes(naam)) {
                // Toon de competitie op de pagina op basis van het ingevoerde land
                laatCompetitieZien(response); 
            }
        });
    })
    .catch(error => {
        // Log een foutmelding naar de console als de fetch-operatie mislukt
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// Functie om een competitie te tonen op de pagina
function laatCompetitieZien(response) {
    // Haal favoriete competities op uit localStorage, als er geen zijn, gebruik dan een lege array
    const favorietenCompetities = JSON.parse(localStorage.getItem('favorietenCompetities')) || [];
    
    // Maak een nieuw list item element aan
    let li = document.createElement('li');
    li.classList.add('mdc-image-list__item');

    // Haal het leagueId op uit de response
    let leagueId = response.league.id;

    // Maak een SVG element aan voor het favorieten icoon
    let svgNS = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");

    // Maak een path element aan binnen de SVG voor het hart icoon
    let path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M12 .587l3.668 7.431 8.2 1.193-5.932 5.78 1.401 8.169L12 18.896 4.663 23.16l1.401-8.169L.132 9.211l8.2-1.193z");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "1");
    
    // Controleer of het leagueId in favorieten zit en pas de vulling van het hart icoon aan
    if (!favorietenCompetities.includes(leagueId)) {
        path.setAttribute("fill", "white");
    } else {
        path.setAttribute("fill", "red");
    }
    
    // Voeg het path element toe aan de SVG
    svg.appendChild(path);

    // Maak een afbeeldingselement aan voor het league logo
    let image = document.createElement('img');
    image.classList.add('mdc-image-list__image');
    image.src = response.league.logo;
    image.alt = response.league.name;

    // Maak een paragraafelement aan voor de competitienaam
    let p = document.createElement('p');
    p.classList.add('mdc-image-list__paragraph');
    p.textContent = response.league.name;

    // Voeg de SVG, afbeelding en paragraaf toe aan het list item
    li.appendChild(svg);
    li.appendChild(image);
    li.appendChild(p);

    // Voeg het list item toe aan de ongeordende lijst
    ul.appendChild(li);

    // Voeg een event listener toe aan het SVG element om favorieten toe te voegen of te verwijderen
    svg.addEventListener('click', function() {
        if (!favorietenCompetities.includes(leagueId)) {
            // Voeg leagueId toe aan de favorieten als die nog niet in de lijst staat en maak het sterretje rood
            path.setAttribute("fill", "red");
            favorietenCompetities.push(leagueId);
        } else {
            // Verwijder leagueId uit de favorieten lijst en maak het sterretje weer wit
            path.setAttribute("fill", "white");
            const index = favorietenCompetities.indexOf(leagueId);
            if (index > -1) {
                favorietenCompetities.splice(index, 1);
            }
        }
        // Bewaar de bijgewerkte favorieten in de localStorage
        localStorage.setItem('favorietenCompetities', JSON.stringify(favorietenCompetities));
        // Log de favorieten naar de console
        console.log(favorietenCompetities); 
    });

    // Voeg een event listener toe aan het afbeeldingselement om door te linken naar de league pagina
    image.addEventListener('click', function() {
        // geef de leagueId, league naam, logo bron en het huidige seizoen 
        // mee met de URL om ze er later op de league pagina er weer uit te halen
        const src = image.src;
        const altTekst = image.alt;
        const seasons = response.seasons;
        const today = new Date();
        let year = 0;

        // Zoek het huidige seizoen op basis van de startdatum
        seasons.forEach(function(season) {
            const startDate = new Date(season.start);
            if (season.current == true) {
                year = season.year;
            }
            if (season.current == true && today < startDate) {
                year = season.year - 1;
            }
        });

        // Navigeer naar de league pagina met de juiste parameters
        window.location.href = `league.html?id=${leagueId}&alt=${encodeURIComponent(altTekst)}&src=${encodeURIComponent(src)}&season=${encodeURIComponent(year)}`;
    });
}

// Voeg event listeners toe aan de zoekknop en het veld om competitie te zoeken
leagueSearch.addEventListener('click', function() {
    zoekCompetitie();
});

// Voeg event listeners toe aan de enter knop op het toetsenbord 
// en voer de functie dus ook uit als je op enter klikt
leagueField.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
        zoekCompetitie();
    }
});

