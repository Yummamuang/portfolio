let textTheSpace = document.querySelectorAll('.targetText');
let footerLogo = document.querySelectorAll('.targetLogo');

window.addEventListener("scroll", () => {
    textTheSpace.forEach(sec => {
        let offset = sec.offsetTop / 3;
        
        if (window.scrollY >= offset) {
            sec.style.transform = 'translateY(0)';
        } 
    })

    footerLogo.forEach(sec => {
        let offset = sec.offsetTop / 3;

        if (window.scrollY >= offset) {
            sec.classList.remove('animate-footer-logo-unp');

            setTimeout(() => {
                sec.classList.add('animate-footer-logo');
            }, 50); 
            
        }
    })
})