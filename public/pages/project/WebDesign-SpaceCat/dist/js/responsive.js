
/* <========================================= Make a Responsive =========================================> */
updateIconSize = () => {
    /* <============================== Width < 375 ==============================> */
    if (window.innerWidth < 375) {
        /* <========= Logo ==========> */
        logoWidth.classList.remove('w-8');
        logoWidth.classList.add('w-6');

        /* <========= Cart ==========> */
        cart.classList.remove('fa-xl');
        cart.classList.remove('fa-2xl');
        cart.classList.add('fa-lg');


        /* <========= image ==========> */
        paraValue = 10;
    }

    /* <============================== Width >= 375 and < 640==============================> */
    if (window.innerWidth >= 375 && window.innerWidth < 640) {
        /* <========= Logo ==========> */
        logoWidth.classList.remove('w-6');
        logoWidth.classList.add('w-8');

        /* <========= Cart ==========> */
        cart.classList.remove('fa-lg');
        cart.classList.remove('fa-2xl');
        cart.classList.add('fa-xl');

        /* <========= Line Menu ==========> */
        lineMenuHeight.classList.remove('h-2');
        lineMenuHeight.classList.add('h-3');

        /* <========= image ==========> */
        paraValue = 14;
    }
    

    /* <============================== Width > 640 ==============================> */
    if (window.innerWidth >= 640 && window.innerWidth < 1024) {

        /* <========= Cart ==========> */
        cart.classList.remove('fa-lg');
        cart.classList.remove('fa-xl');
        cart.classList.add('fa-2xl');

    }

    if (window.innerWidth >= 768 ) {
        /* <========= Cart ==========> */
        cart.classList.remove('fa-lg');
        cart.classList.remove('fa-xl');
        cart.classList.remove('fa-2xl');
        
    }

}

/* <========= change window size ==========> */
window.addEventListener("resize", updateIconSize);
window.addEventListener("load", updateIconSize);

setInterval(() => {

    /* <============================== Width < 640 ==============================> */
    if (window.innerWidth < 640) { 
        /* <========= Menu Height ==========> */
        if (isOpenLv2 === false) {
            menuMobileLv2Height = 0;
        } else {
            menuMobileLv2Height = 210;
        }
        
        if (isOpenLv3First === false) {
            menuMobileLv3FirstHeight = 0;
        } else {
            menuMobileLv3FirstHeight = 128;
        }
        
        if (isOpenLv3Second === false) {
            menuMobileLv3SecondHeight = 0;
        } else {
            menuMobileLv3SecondHeight = 96;
        }

        setHeightAll(menuMobileLv2Height,menuMobileLv3FirstHeight,menuMobileLv3SecondHeight);
    }

    if (window.innerWidth >= 640 && window.innerWidth < 1024) {
        
        if (isOpenLv2 === false) {
            menuMobileLv2Height = 0;
        } else {
            menuMobileLv2Height = 330;
        }
     
        if (isOpenLv3First === false) {
            menuMobileLv3FirstHeight = 0;
        } else {
            menuMobileLv3FirstHeight = 174;
        }
     
        if (isOpenLv3Second === false) {
            menuMobileLv3SecondHeight = 0;
        } else {
            menuMobileLv3SecondHeight = 130;
        }

        setHeightAll(menuMobileLv2Height,menuMobileLv3FirstHeight,menuMobileLv3SecondHeight);
        
    }

}, 50);


/* <========= Set Height Function ==========> */
setHeightAll = (Lv2Height,Lv3FirstHeight,Lv3SecondHeight) => {
    menuMobileLv2.style.height = `calc(${Lv2Height}px + ${Lv3FirstHeight}px + ${Lv3SecondHeight}px)`;
    menuMobileLv3First.style.height = `${Lv3FirstHeight}px`;
    menuMobileLv3Second.style.height = `${Lv3SecondHeight}px`;
}
