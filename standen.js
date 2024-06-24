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
const item = document.querySelectorAll('.mdc-tab')
const mdcItem = document.querySelectorAll('.mdc-item')
const leagueField = document.querySelector('.leagueField')
const leagueSearch = document.querySelector('.leagueSearch')
let ul = document.querySelector('.mdc-image-list'); 

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

function zoekCompetitie(){
    const naam = leagueField.value.toLowerCase();
    fetch('https://api-football-v1.p.rapidapi.com/v3/leagues', {
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
        ul.innerHTML = ''

        result.forEach(function(response){
            if(response.league.name.toLowerCase().includes(naam)){
               laatCompetitieZien(response)
            }
            else if(response.country.name.toLowerCase().includes(naam)){
               laatCompetitieZien(response)
            }
        })
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });    
}

const favorietenCompetities = JSON.parse(localStorage.getItem('favorietenCompetities')) || [];
function laatCompetitieZien(response){
    let li = document.createElement('li');
    li.classList.add('mdc-image-list__item');

    let leagueId = response.league.id;  
        
    let svgNS = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");

    let path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M12 .587l3.668 7.431 8.2 1.193-5.932 5.78 1.401 8.169L12 18.896 4.663 23.16l1.401-8.169L.132 9.211l8.2-1.193z");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "1");
    
    if(!favorietenCompetities.includes(leagueId)){
        path.setAttribute("fill", "white");
    }else{
        path.setAttribute("fill", "red");
    }
    
    svg.appendChild(path);

    let image = document.createElement('img');
    image.classList.add('mdc-image-list__image');
    image.src = response.league.logo;

    image.alt = response.league.name;

    let p = document.createElement('p');
    p.classList.add('mdc-image-list__paragraph');
    p.textContent = response.league.name;

    li.appendChild(svg);
    li.appendChild(image);
    li.appendChild(p);
    ul.appendChild(li);

    svg.addEventListener('click', function(){
        if (!favorietenCompetities.includes(leagueId)) {
            path.setAttribute("fill", "red");
            favorietenCompetities.push(leagueId);
        } else {
            path.setAttribute("fill", "white");
            const index = favorietenCompetities.indexOf(leagueId);
            if (index > -1) {
                favorietenCompetities.splice(index, 1);
            }
        }
        localStorage.setItem('favorietenCompetities', JSON.stringify(favorietenCompetities));
        console.log(favorietenCompetities);
    });

    image.addEventListener('click', function(){
        if (image) {
            const src = image.src;
            console.log(src)
            const altTekst = image.alt;
            console.log(altTekst);
            const seasons = response.seasons
            console.log(response)
            const today = new Date()
            console.log(today)
            let year = 0
            seasons.forEach(function(season){
                const startDate = new Date(season.start)
                console.log(startDate)
                console.log(season)
                if(season.current == true){
                    year = season.year
                }
                if(season.current == true && today < startDate){
                    year = season.year - 1
                }
            })
            console.log(year)
            window.location.href = `league.html?id=${leagueId}&alt=${encodeURIComponent(altTekst)}&src=${encodeURIComponent(src)}&season=${encodeURIComponent(year)}`;
        }
    });
}

leagueSearch.addEventListener('click', function(){
   zoekCompetitie();
});

leagueField.addEventListener('keydown', function(event){
  if(event.key == 'Enter'){
    zoekCompetitie();
  }
});
