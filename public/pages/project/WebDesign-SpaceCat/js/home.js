/* <============================== Botton (get class) ==============================> */
bttPop = (cls) => {
    const element = document.getElementsByClassName(`${cls}`);

    element[0].style.transform = 'scale(0.8)';
    element[0].style.background = 'var(--white)';
    element[0].style.color = 'var(--black)';

    setTimeout(() => {
        element[0].style.transform = 'scale(1)';
        element[0].style.background = 'var(--black)';
        element[0].style.color = 'var(--white)';
    }, 300);
}

window.addEventListener('load', () => {
    setTimeout(() => {
        const SaturnShow = [
            'home.html',
            'index.html',
            'login.html',
            'register.html',
            'contact.html',
        ]

        let shouldSaturnShow = false;

        for (const url of SaturnShow) {
            if (window.location.href.endsWith(url)) {
                shouldSaturnShow = true;
                break;
            }
        }

        if (shouldSaturnShow) {
            theSaturn.style.opacity = '1';
        }
        
    }, 2500);
})


blurImg = (cls,star_index) => {
    const element = document.getElementById(`${cls}`);
    element.style.filter = 'blur(5px)';

    star_pop[star_index].style.display = 'block';
    star_pop[star_index].style.opacity = '1';     
}

unBlurImg = (cls,star_index) => {
    const element = document.getElementById(`${cls}`);
    element.style.filter = 'blur(0px)'

    star_pop[star_index].style.display = 'none';
    star_pop[star_index].style.opacity = '0';
    
}


updateIconSize = () => {
    /* <============================== Width < 640 ==============================> */
    if (window.innerWidth < 640) { 
        /* <============================== Parallax Image ==============================> */
        window.addEventListener("scroll", () => {
            scrollY = window.scrollY;
            parallaxValue = -scrollY / 11.125045;
            parallaxButt = scrollY / 15.125045;

            catFoodParallax.style.transform = `translateY(${parallaxValue}px)`;
            catToysParallax.style.transform = `translateY(${parallaxValue}px)`;
            catHouseParallax.style.transform = `translateY(${parallaxValue}px)`;
            for (let index = 0; index < ButtonHome.length; index++) {
                ButtonHome[index].style.top = `calc(5rem + ${parallaxButt}px)`
            }
            
        });

    }

    if (window.innerWidth >= 640) { 
        /* <============================== Parallax Image ==============================> */
        window.addEventListener("scroll", () => {
            scrollY = window.scrollY;
            parallaxValue = -scrollY / 9.125045;
            parallaxButt = scrollY / 11.125045;

            catFoodParallax.style.transform = `translateY(${parallaxValue}px)`;
            catToysParallax.style.transform = `translateY(${parallaxValue}px)`;
            catHouseParallax.style.transform = `translateY(${parallaxValue}px)`;
            for (let index = 0; index < ButtonHome.length; index++) {
                ButtonHome[index].style.top = `calc(6rem + ${parallaxButt}px)`
            }
            
        });

    }
}
const Parallax = [
    'home.html',
    'promotion.html',
    'index.html',
]

let shouldParallax = false;

for (const url of Parallax) {
    if (window.location.href.endsWith(url)) {
        shouldParallax = true;
        break;
    }
}

if (shouldParallax) {
    updateIconSize();
}

