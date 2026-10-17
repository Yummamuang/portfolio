/* <========================================= Open Menu for Mobile Lv 1 =========================================> */

/* <============= Function Menu Mobile onClick Open ============= > */
clickMenuMobileOpen = () => {
    if (window.location.href.endsWith('account.html')) {
        profile_button.style.opacity = '0';
        profile_button_1.style.opacity = '0';
    }

    openMenuMobileClass.title = "Close Menu";

    body.style.overflow = 'hidden auto';

    menuCollapse.style.pointerEvents = 'none';

    menuMobileWrap.style.display = 'block';
    logoBlack.style.display = 'none';
    logoBlack.style.opacity = '0';
    
    logoWhite.style.opacity = '0';
    logoWhite.style.display = 'block';

    setTimeout(() => {
        lineMenu1.style.background = 'white';

        lineMenu12.style.opacity = '0';
        
        lineMenu2.style.background = 'white';
        cart.style.color = 'white';
        menuCollapse.style.background = 'var(--black)';
    },100)

    setTimeout(() => {
        logoWhite.style.opacity = '1';
        lineMenu1.style.transform = 'rotate(40deg)';
        lineMenu2.style.transform = 'rotate(-40deg)';
        lineMenu1.style.top = '50%';
        lineMenu2.style.top = '50%';
        menuMobileWrap.style.height = '100vh';

    },200)

    setTimeout(() => {
        menuMobile.style.opacity = '1';
    },250) 

    setTimeout(() => {
        menuMobile.style.transform = 'translateY(0)';
        menuMobile.style.color = 'white';
    },200)

    
    setTimeout(() => {
        for (let index = 0; index < menuMobileItemsLv1.length; index++) {
            setTimeout(() => {
                menuMobileItemsLv1[index].style.transform = 'translateY(0)'
            }, ((index*100)/2));
        }

        if (window.location.href.endsWith('account.html')) {
            profile_button.style.display = 'none';
            profile_button_1.style.display = 'none';
        }
    },350)


    setTimeout(() => {
        menuCollapse.style.pointerEvents = 'all';

        /* <============= Get Height from top ============= > */
        aboutUsHeight = menuButtom.clientHeight;
    },1000)
}   

/* <============= Function Menu Mobile onClick Close ============= > */
clickMenuMobileClose = () => {
    if (window.location.href.endsWith('account.html')) {
        profile_button.style.display = 'block';
        profile_button_1.style.display = 'block';
    }

    openMenuMobileClass.title = "Open Menu";

    body.style.overflow = 'hidden auto';

    menuCollapse.style.pointerEvents = 'none';

    menuMobileLv2.style.height = '0';
    downLeftArrowLv1[0].style.transform = 'rotate(45deg)'

    menuMobileLv3First.style.height = '0';
    downLeftArrowLv1[0].style.transform = 'rotate(45deg)'

    menuMobileLv3Second.style.height = '0';
    downLeftArrowLv1[0].style.transform = 'rotate(45deg)'
    
    downLeftArrowLv2[0].style.transform = 'rotate(45deg)'
    downLeftArrowLv2[1].style.transform = 'rotate(45deg)'
    
    lineMenu1.style.transform = 'rotate(0)';
    lineMenu2.style.transform = 'rotate(0)';
    lineMenu1.style.top = '0';
    lineMenu2.style.top = '100%';
    menuMobile.style.opacity = '0';

    for (index = 0; index < menuMobileItemsLv1.length; index++) {
        menuMobileItemsLv1[index].style.transform = 'translateY(100%)';
    }
    index = 0

    setTimeout(() => {
        menuMobile.style.transform = 'translateY(-150%)';
    }, 150);

    setTimeout(() => {
        menuMobileWrap.style.height = '0';
    },400);

    setTimeout(() => {
        logoWhite.style.display = 'none';
        logoBlack.style.display = 'block';
    }, 600);

    setTimeout(() => {
        menuMobileWrap.style.display = 'none';
        logoBlack.style.opacity = '1';
        lineMenu1.style.background = 'black';
        
        lineMenu12.style.opacity = '1';

        lineMenu2.style.background = 'black';
        cart.style.color = 'black';
        if (window.location.href.endsWith('cart.html')) {
            cart.style.color = 'var(--gray)';
        }

        menuCollapse.style.background = 'var(--white)'
    }, 800);

    setTimeout(() => {
        menuCollapse.style.pointerEvents = 'all';

        if (window.location.href.endsWith('account.html')) {
            profile_button.style.opacity = '1';
            profile_button_1.style.opacity = '1';
        }
    },1000)

    if (isOpenLv2) {
        isOpenLv2 = false;
    }
    if (isOpenLv3First) {
        isOpenLv3First = false;
    }
    if (isOpenLv3Second) {
        isOpenLv3Second = false;
    }
}
/* <============= Main Function Menu Mobile onClick ============= > */
toggleMenuMobile = () => {

    if (isOpenLv1) {
        clickMenuMobileClose();
    } else {
        clickMenuMobileOpen();
    }
    isOpenLv1 = !isOpenLv1;
}

/* <========================================= Open Menu for Mobile Lv 2 =========================================> */

/* <============= Set Variable ============= > */
const menuMobileLv2 = document.getElementById('menu-mobile-lv-2');
const downLeftArrowLv1 = document.getElementsByClassName('down-left-arrow-lv1');
const menuMobileLv3First = document.getElementById('menu-mobile-lv-3-first');
const menuMobileLv3Second = document.getElementById('menu-mobile-lv-3-second');
const bttMenuMobileLv1 = document.getElementById('bt-menu-mobile-lv-1');

let  menuMobileLv2Height = 210;

/* <============= Function Menu Mobile onClick Open ============= > */
clickMenuMobileLv2Open = () => {

    bttMenuMobileLv1.style.pointerEvents = 'none';

    menuMobileLv2.style.height = `calc(${menuMobileLv2Height}px)`;
    downLeftArrowLv1[0].style.transform = 'rotate(0deg)'
    setTimeout(() => {
        menuMobileLv2.style.opacity = '1';
    }, 150);

    setTimeout(() => {
        bttMenuMobileLv1.style.pointerEvents = 'all';
    },500)
}

/* <============= Function Menu Mobile onClick Close ============= > */
clickMenuMobileLv2Close = () => {

    bttMenuMobileLv1.style.pointerEvents = 'none';

    menuMobileLv2.style.opacity = '0';
    menuMobileLv3First.style.height = '0';
    menuMobileLv3Second.style.height = '0';
    setTimeout(() => {
        menuMobileLv2.style.height = '0';
        downLeftArrowLv1[0].style.transform = 'rotate(45deg)'
        downLeftArrowLv2[0].style.transform = 'rotate(45deg)'
        downLeftArrowLv2[1].style.transform = 'rotate(45deg)'
    }, 150);

    setTimeout(() => {
        bttMenuMobileLv1.style.pointerEvents = 'all';
    },500)

    if (isOpenLv3First) {
        isOpenLv3First = false;
    }
    if (isOpenLv3Second) {
        isOpenLv3Second = false;
    }
}
/* <============= Main Function Menu Mobile onClick ============= > */
toggleMenuMobileLv2 = () => {
    if (isOpenLv2) {
        clickMenuMobileLv2Close();
    } else {
        clickMenuMobileLv2Open();
    }
    isOpenLv2 = !isOpenLv2;
}



/* <========================================= Open Menu for Mobile Lv 3 =========================================> */

/* <============= Set Variable ============= > */
const downLeftArrowLv2 = document.getElementsByClassName('down-left-arrow-lv2');
const bttMenuMobileLv3First = document.getElementById('bt-menu-mobile-lv-3-first');
const bttMenuMobileLv3Second = document.getElementById('bt-menu-mobile-lv-3-second');

let isOpenLv3First = false;
let isOpenLv3Second = false;


/* <============= Function Menu Mobile onClick Open(FirstMenu) ============= > */
clickMenuMobileLv3OpenFirst = () => {
    bttMenuMobileLv3First.style.pointerEvents = 'none';
    
    downLeftArrowLv2[0].style.transform = 'rotate(0)'
    setTimeout(() => {
        menuMobileLv3First.style.opacity = '1';

    }, 150);

    setTimeout(() => {
        bttMenuMobileLv3First.style.pointerEvents = 'all';
    },500)
}

/* <============= Function Menu Mobile onClick Close(FirstMenu) ============= > */
clickMenuMobileLv3CloseFirst = () => {
    bttMenuMobileLv3First.style.pointerEvents = 'none';

    menuMobileLv3First.style.opacity = '0';
    
    setTimeout(() => {
        menuMobileLv3First.style.height = '0';
        downLeftArrowLv2[0].style.transform = 'rotate(45deg)'
        
    }, 150);

    setTimeout(() => {
        bttMenuMobileLv3First.style.pointerEvents = 'all';
    },500)
}

/* <============= Main Function Menu Mobile onClick(FirstMenu) ============= > */
toggleMenuMobileLv3First = () => {
    if (isOpenLv3First) {
        clickMenuMobileLv3CloseFirst();
    } else {
        clickMenuMobileLv3OpenFirst();
    }
    isOpenLv3First = !isOpenLv3First;
}


/* <============= Function Menu Mobile onClick Open(SecondMenu) ============= > */
clickMenuMobileLv3OpenSecond = () => {
    bttMenuMobileLv3Second.style.pointerEvents = 'none';

    downLeftArrowLv2[1].style.transform = 'rotate(0)'
    
    setTimeout(() => {
        menuMobileLv3Second.style.opacity = '1';
 
    }, 50);

    setTimeout(() => {
        bttMenuMobileLv3Second.style.pointerEvents = 'all';
    },500)
}

/* <============= Function Menu Mobile onClick Close(SecondMenu) ============= > */
clickMenuMobileLv3CloseSecond = () => {
    bttMenuMobileLv3Second.style.pointerEvents = 'none';

    menuMobileLv3Second.style.opacity = '0';
    menuMobileLv2.style.height = `calc(${menuMobileLv2Height}px + ${menuMobileLv3FirstHeight}px + ${menuMobileLv3SecondHeight}px)`;

    setTimeout(() => {
        menuMobileLv3Second.style.height = '0';
        downLeftArrowLv2[1].style.transform = 'rotate(45deg)'
    }, 150);

    setTimeout(() => {
        bttMenuMobileLv3Second.style.pointerEvents = 'all';
    },500)
}

/* <============= Main Function Menu Mobile onClick(SecondMenu) ============= > */
toggleMenuMobileLv3Second = () => {
    if (isOpenLv3Second) {
        clickMenuMobileLv3CloseSecond();
    } else {
        clickMenuMobileLv3OpenSecond();
    }
    isOpenLv3Second = !isOpenLv3Second;
}
