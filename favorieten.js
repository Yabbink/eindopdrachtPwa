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

const favorieten = JSON.parse(localStorage.getItem('favorieten')) || [];
let li = '';
let p = '';

function favorieteCompetities(){
    ul.innerHTML = '';

    if (favorieten.length > 0) {
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

            favorieten.forEach(function(favId){
                const favoriteLeague = result.find(response => response.league.id === favId);
                if (favoriteLeague) {
                    li = document.createElement('li');
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
                    image.src = favoriteLeague.league.logo;
                    image.alt = favoriteLeague.league.name;

                    p = document.createElement('p');
                    p.classList.add('mdc-image-list__paragraph');
                    p.textContent = favoriteLeague.league.name;

                    li.appendChild(svg);
                    li.appendChild(image);
                    li.appendChild(p);
                    ul.appendChild(li);

                    svg.addEventListener('click', function(){
                        const index = favorieten.indexOf(favId);
                        if (index > -1) {
                            favorieten.splice(index, 1);
                            localStorage.setItem('favorieten', JSON.stringify(favorieten));
                            path.setAttribute("fill", "white");
                        }
                        console.log(favorieten);
                    });

                    image.addEventListener('click', function(){
                        if (image) {
                            const altTekst = image.alt;
                            console.log(altTekst);
                            window.location.href = `league.html?id=${favId}&alt=${encodeURIComponent(altTekst)}`;
                        }
                    });
                }
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {
        p = document.createElement('p');
        p.textContent = "Geen favorieten gevonden";

        li = document.createElement('li');
        li.appendChild(p);

        ul.appendChild(li);
    }
}

favorieteCompetities();
