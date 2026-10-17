const preloader = document.getElementById('preloader')
const inner_preloader = document.getElementById('inner_preloader')
document.body.style.overflow = 'hidden'

window.addEventListener('load', () => {

    setTimeout(() => {
        inner_preloader.style.opacity = '0';
    }, 400);
    
    setTimeout(() => {
        preloader.style.height = '0'
    }, 600);

    setTimeout(() => {
        preloader.style.display = 'none'

        if (window.location.href.endsWith('home.html') || window.location.href.endsWith('index.html')) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'hidden auto'
        }
        
    }, 1100);
})