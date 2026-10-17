
body.style.overflow = 'hidden';
/* <========================================= Loader Page =========================================> */
window.addEventListener('load', () => {
    let index = 0;


    setTimeout(() => {
        logo.classList.add('logo-loading-image')
        for (index = 0; index < meow.length; index++) {
            meow[index].style.opacity = '0';
        }
    }, 1000);

    setTimeout(() => {
        Loader.style.height = '0'
        for (index = 0; index < meow.length; index++) {
            meow[index].style.transform = 'translateX(100%)'
        }
    }, 1500);

    setTimeout(() => {
        

        body.style.overflow = 'hidden auto';
        


        for (let index = 0; index < spaceCatH1.length; index++) {
            spaceCatH1[index].classList.add('spaceCat-h1-ani');
        }
    }, 1600);
    
    setTimeout(() => {
        Loader.style.display = 'none'
    }, 2000);
    
})