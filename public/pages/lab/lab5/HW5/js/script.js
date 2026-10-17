let contents = document.querySelectorAll('div');
let span = document.querySelectorAll('span');
let head = document.querySelectorAll('header');
let section = document.querySelectorAll('.section-1');
let section4 = document.querySelectorAll('.section-4');

window.onscroll = () => {
    contents.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 300;
        let height = sec.offsetHeight;

        if (top >= offset) {
            sec.classList.add('show-animate');
        }else{
            sec.classList.remove('show-animate');
        }
    })
    
    span.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 300;
        let height = sec.offsetHeight;

        if (top >= offset && top < offset + height) {
            sec.classList.add('show-animate');
        }else{
            sec.classList.remove('show-animate');
        }
    })

    section.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTo;
        let height = sec.offsetHeight + 500;

        if (top >= height) {
            sec.classList.add('animate-up');
        }else{
            sec.classList.remove('animate-up');
        }
    })

    section4.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTo;
        let height = sec.offsetHeight + 4000;

        if (top >= height) {
            sec.classList.add('animate-up');
        }else{
            sec.classList.remove('animate-up');
        }
    })

    head.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 200;
        let height = sec.offsetHeight;

        if (top >= offset && top < offset + height) {
            sec.classList.add('animate');
        }else{
            sec.classList.remove('animate');
        }
    })
}