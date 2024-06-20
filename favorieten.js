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
const hamburgerItem = document.querySelectorAll('.mdc-list-item')
const title = document.querySelector('.mdc-top-app-bar__title')
const tabBarElement = document.querySelector('.mdc-tab-bar')
const tabBar = new MDCTabBar(tabBarElement);

hamburger.addEventListener('click', () => {
    openDrawer()
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

const item = document.querySelectorAll('.mdc-tab')
const item2 = document.querySelectorAll('.mdc-tab-indicator')
const mdcItem = document.querySelectorAll('.mdc-item')
const home = document.querySelector('.mdc-list-item:nth-child(2)')
const body = document.querySelector('body')
const competitieH2 = document.querySelector('.competities h2')
const ul = document.querySelector('.mdc-image-list')
const datePicker = document.querySelector('.datePicker')
const wedstrijdH2 = document.querySelector('.wedstrijden h2')
const table = document.querySelector('.match-table')
const tbody = document.querySelector('.match-table tbody')

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

mdcItem.forEach(function(element){
    if(element.classList.contains('competities')){
        favorieteCompetities()
    }
    if(element.classList.contains('wedstrijden')){
        favorieteWedstrijden()

        datePicker.addEventListener('change', function(){
            favorieteWedstrijden(datePicker.value);
        })
    }
})

function favorieteCompetities(){
    const favorietenCompetities = JSON.parse(localStorage.getItem('favorietenCompetities')) || [];
    ul.innerHTML = '';

    if (favorietenCompetities.length > 0) {
        fetch(`https://api-football-v1.p.rapidapi.com/v3/leagues`, {
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
            console.log(result)

            favorietenCompetities.forEach(function(id){
                const favorieteCompetitie = result.find(response => response.league.id === id);
                if (favorieteCompetitie) {
                    competitieH2.textContent = "Favoriete Competities"
                    let li = document.createElement('li');
                    li.classList.add('mdc-image-list__item');

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

                    let image = document.createElement('img');
                    image.classList.add('mdc-image-list__image');
                    image.src = favorieteCompetitie.league.logo;
                    image.alt = favorieteCompetitie.league.name;

                    let p = document.createElement('p');
                    p.classList.add('mdc-image-list__paragraph');
                    p.textContent = favorieteCompetitie.league.name;

                    li.appendChild(svg);
                    li.appendChild(image);
                    li.appendChild(p);
                    ul.appendChild(li);

                    svg.addEventListener('click', function(){
                        const index = favorietenCompetities.indexOf(id);
                        if (index > -1) {
                            favorietenCompetities.splice(index, 1);
                            localStorage.setItem('favorietenCompetities', JSON.stringify(favorietenCompetities));
                            path.setAttribute("fill", "white");
                        }
                        console.log(favorietenCompetities);
                    });

                    image.addEventListener('click', function(){
                        if (image) {
                            const altTekst = image.alt;
                            console.log(altTekst);
                            window.location.href = `league.html?id=${id}&alt=${encodeURIComponent(altTekst)}`;
                        }
                    });
                }
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {
        competitieH2.textContent = "Geen favoriete competities gevonden";
    }
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function favorieteWedstrijden(date){
    const favorietenWedstrijden = JSON.parse(localStorage.getItem('favorietenWedstrijden')) || [];
    if (favorietenWedstrijden.length > 0) {
        if (!date) {
            date = getCurrentDate();
        }

        fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${date}`, {
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
            console.log(result)
            console.log(favorietenWedstrijden)

            favorietenWedstrijden.forEach(function(id){
                const favorieteWedstrijd = result.filter(response => response.fixture.id === id);
                if(favorieteWedstrijd){
                    console.log(favorieteWedstrijd)
                    tbody.innerHTML = ''

                    favorieteWedstrijd.forEach(function(wedstrijd) {
                        const leagueName = wedstrijd.league.name;
                        const roundName = wedstrijd.league.round;
                        const groupKey = `${leagueName}-${roundName}`;
                
                        let fixtureGroupDiv = document.querySelector(`.fixture-group[data-group-key="${groupKey}"]`);
                        
                        console.log(`.fixture-group[data-group-key="${groupKey}"]`)
                
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
                
                            tbody.appendChild(fixtureGroupDiv);
                        }
                
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
                
                        if (!favorietenWedstrijden.includes(fixtureId)) {
                            path.setAttribute("fill", "white");
                        } else {
                            path.setAttribute("fill", "red");
                        }
                
                        svg.appendChild(path);
                
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
                
                        teamsCell.addEventListener('click', function () {
                            window.location.href = `uitslagen.html?id=${fixtureId}`;
                        });
                    });
                
                    table.appendChild(tbody);
                }
            })
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {
        wedstrijdH2.textContent = "Geen favoriete wedstrijden gevonden";
    }
}
