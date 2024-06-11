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
    const naam = leagueField.value.toLowerCase()
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
        let ul = document.querySelector('.mdc-image-list'); 
        let li = '' 

        ul.innerHTML = ''

        const filteredResults = result.filter(response => {
            const leagueNameMatch = response.league.name.toLowerCase().includes(naam);
            const countryNameMatch = response.country.name.toLowerCase().includes(naam);
            return leagueNameMatch || countryNameMatch;
        });

        filteredResults.forEach(function(response) {
            li = document.createElement('li');
            li.classList.add('mdc-image-list__item');
            let leagueId = response.league.id;  
                
            let image = document.createElement('img');
            image.classList.add('mdc-image-list__image');
            image.src = response.league.logo;
        
            image.alt = response.league.name;
        
            let p = document.createElement('p')
            p.classList.add('mdc-image-list__paragraph')
            p.textContent = response.league.name
        
            li.appendChild(image);
            li.appendChild(p)
            ul.appendChild(li);
        
            li.addEventListener('click', function(){
                if (image) {
                    altTekst = image.alt
                    console.log(altTekst)
                    window.location.href = `league.html?id=${leagueId}&alt=${encodeURIComponent(altTekst)}`;
                }
            })
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });    
}

leagueSearch.addEventListener('click', function(){
   zoekCompetitie()
})

leagueField.addEventListener('keydown', function(event){
  if(event.key == 'Enter'){
    zoekCompetitie()
  }
})