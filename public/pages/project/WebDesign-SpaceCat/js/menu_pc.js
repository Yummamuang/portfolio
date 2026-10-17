catSwimShow = () => {
    for (let index = 0; index < space_cat_swim.length; index++) {
        space_cat_swim[index].style.opacity = '1';
    }
}

catSwimClose = () => {
    for (let index = 0; index < space_cat_swim.length; index++) {
        space_cat_swim[index].style.opacity = '0';
    }
}

catSleepShow = () => {
    for (let index = 0; index < space_cat_sleep.length; index++) {
        space_cat_sleep[index].style.opacity = '1'  
    }
}

catSleepClose = () => {
    for (let index = 0; index < space_cat_sleep.length; index++) {
        space_cat_sleep[index].style.opacity = '0'  
    }
}

scrollToTop = () => {
    scrollTo(0,0);
}

/* <============= Show Categories for pc ============= > */
showCategories = () => {
    let time = 0;
    if (openMenuPC == true) {
        closeMenu();
        time = 700;
        openMenuPC  = false;
    }

    document.body.style.overflow = 'hidden';

    /* ===== Set can't click ===== */
    categoriesPC.style.pointerEvents = 'none';
    featuredCategories.style.pointerEvents = 'none';

    categoriesPC.classList.add('swapcolor');
    featuredPC.classList.add('swapcolor');
    menu_pc.classList.add('swapcolor');

    setTimeout(() => {
        /* ===== show background ===== */
        menuCategoriesShow.style.display = 'block';

    }, time);
    
    
    setTimeout(() => {
        menuCategoriesShow.style.height = `${window.innerHeight}px`;
    },100 + time)

    setTimeout(() => {
        /* ===== background ===== */
        wrapMenuLineCart.style.background = 'var(--black)';

        /* ===== text menu ===== */
        featuredPC.style.color = 'var(--white)'
        categoriesPC.style.color = 'var(--white)'
        menu_pc.style.color = 'var(--white)'
        categoriesPC.style.opacity = '0.75';

        /* ===== logo ===== */
        logoBlackPc.style.display = 'none';
        logoWhitePc.style.display = 'block';

        /* ===== arrow ===== */
        arrowDown[0].style.color = 'var(--white)';
        arrowDown[0].style.opacity = '0.75';
        arrowDown[0].style.transform = 'rotate(0deg)';

        /* ===== Menu line ===== */
        for (let index = 0; index < lineMenuPc.length; index++) {
            lineMenuPc[index].style.background = 'var(--white)';
        }

        /* ===== Cart ===== */
        cart.style.color = 'var(--white)';
    },150 + time)

    setTimeout(() => {
        /* ===== logo ===== */
        logoBlackPc.style.opacity = '0';
        logoWhitePc.style.opacity = '1';

        /* ===== Show menu list ===== */
        for (let index = 0; index < menuLv2PC.length; index++) {
            setTimeout(() => {
                menuLv2PC[index].style.transform = 'translateY(0)'
            }, ((index*100)/2));
        }
    }, 300 + time);

    setTimeout(() => {
        categoriesPC.style.pointerEvents = 'auto';
        featuredCategories.style.pointerEvents = 'auto';

    }, 800 + time);
    
    if (isOpenPelletFood == true) {
        isOpenPelletFood = false;
    }
    if (isOpenWetFood == true) {
        isOpenWetFood = false;
    }
}

/* <============= Close Categories for pc ============= > */
closeCategories = () => {
    
    document.body.style.overflow = 'hidden auto';

    let timePellet = 0;
    let timeWet = 0;

    if (isOpenPelletFood == true) {
        timePellet = 100;
        isOpenPelletFood = false;
    }

    if (isOpenWetFood == true) {
        timeWet = 200;
        isOpenWetFood = false;
    }

    /* ===== Set can't click ===== */
    categoriesPC.style.pointerEvents = 'none';
    featuredCategories.style.pointerEvents = 'none';

    categoriesPC.classList.remove('swapcolor');
    featuredPC.classList.remove('swapcolor');
    menu_pc.classList.remove('swapcolor');

    
    setTimeout(() => {
        pelletFoodShow.style.opacity = '0';
        wetFoodShow.style.opacity = '0';
    }, 100);

    setTimeout(() => {
        pelletFoodShow.style.height = '0';
        arrowDown[2].style.transform = 'rotate(45deg)';
    }, timePellet + 100);

    setTimeout(() => {
        wetFoodShow.style.height = '0';
        arrowDown[1].style.transform = 'rotate(45deg)';
    }, timeWet + 100);

    setTimeout(() => {
        /* ===== hide menu list ===== */
        for (let index = 0; index < menuLv2PC.length; index++) {
            setTimeout(() => {
                menuLv2PC[index].style.transform = 'translateY(150%)'
            }, ((index*100)/2));
        }
    }, 100 + timePellet + timeWet);

    /* ===== hide background ===== */
    setTimeout(() => {
        menuCategoriesShow.style.height = '0';
    }, 600 + timePellet + timeWet);

    setTimeout(() => {
         /* ===== background ===== */
         wrapMenuLineCart.style.background = 'var(--white)';

        /* ===== text menu ===== */
        featuredPC.style.color = 'var(--black)'
        categoriesPC.style.color = 'var(--black)'
        menu_pc.style.color = 'var(--black)'
        categoriesPC.style.opacity = '1';

        /* ===== logo ===== */
        logoBlackPc.style.display = 'block';
        logoWhitePc.style.display = 'none';

        /* ===== arrow ===== */
        arrowDown[0].style.color = 'var(--black)';
        arrowDown[0].style.opacity = '1';
        arrowDown[0].style.transform = 'rotate(45deg)';

        /* ===== Menu line ===== */
        for (let index = 0; index < lineMenuPc.length; index++) {
            lineMenuPc[index].style.background = 'var(--black)';
        }

        /* ===== Cart ===== */
        cart.style.color = 'var(--black)';

    }, 650 + timePellet + timeWet);

    setTimeout(() => {
        /* ===== logo ===== */
        logoBlackPc.style.opacity = '1';
        logoWhitePc.style.opacity = '0';
    }, 700 + timePellet + timeWet);

    setTimeout(() => {
        menuCategoriesShow.style.display = 'none';

        /* ===== set click ===== */
        categoriesPC.style.pointerEvents = 'auto';
        featuredCategories.style.pointerEvents = 'auto';

    }, 1200 + timePellet + timeWet);

}

/* <============= Toggle Categories for pc ============= > */
showCategoriesToggle = () => {
    if (isOpenPC) {
        closeCategories();
    } else {
        showCategories();
    }
    isOpenPC = !isOpenPC;
}


/* <============= Open Pellet for pc ============= > */
showPelletFood = () => {
    pelletFoodShow.style.display = 'block';
    pelletFoodPc.style.pointerEvents = 'none';


    setTimeout(() => {
        /* ===== Show menu list  ===== */
        pelletFoodShow.style.height = '300px'
        arrowDown[1].style.transform = 'rotate(0deg)';
    }, 100);

    setTimeout(() => {
        /* ===== Show menu list pellet ===== */
        for (let index = 0; index < pelletFoodLv3.length; index++) {
            pelletFoodLv3[index].style.opacity = '1';
        }
        pelletFoodShow.style.opacity = '1';
    }, 150);

    setTimeout(() => {
        pelletFoodPc.style.pointerEvents = 'all';
    }, 500);
}


/* <============= Close Pellet for pc ============= > */
closePelletFood = () => {
    pelletFoodPc.style.pointerEvents = 'none';
    /* ===== close menu list pellet ===== */
    for (let index = 0; index < pelletFoodLv3.length; index++) {
        pelletFoodLv3[index].style.opacity = '0';
    }

    setTimeout(() => {
        /* ===== set height ===== */
        pelletFoodShow.style.height = '0';
    }, 100);
    
    setTimeout(() => {
        /* ===== set arrow ===== */
        arrowDown[1].style.transform = 'rotate(45deg)';
        
    }, 150);

    setTimeout(() => {
        pelletFoodPc.style.pointerEvents = 'all';
    }, 500);
}

/* <============= Toggle Pellet for pc ============= > */
pelletFoodShowToggle = () => {
    if (isOpenPelletFood) {
        closePelletFood();
    } else {
        showPelletFood();
    }
    isOpenPelletFood = !isOpenPelletFood;
}


/* <============= Open Wet for pc ============= > */
showWetFood = () => {
    wetFoodShow.style.display = 'block';
    wetFoodPc.style.pointerEvents = 'none';

    setTimeout(() => {
        /* ===== Show menu list  ===== */
        wetFoodShow.style.height = '225px'
        arrowDown[2].style.transform = 'rotate(0deg)';
    }, 100);

    setTimeout(() => {
        /* ===== Show menu list pellet ===== */
        for (let index = 0; index < wetFoodLv3.length; index++) {
            wetFoodLv3[index].style.opacity = '1';
        }
        wetFoodShow.style.opacity = '1';
    }, 150);

    setTimeout(() => {
        wetFoodPc.style.pointerEvents = 'all';
    }, 500);
}

/* <============= Open Wet for pc ============= > */
closeWetFood = () => {
    wetFoodPc.style.pointerEvents = 'none';
    /* ===== close menu list wet ===== */
    for (let index = 0; index <  wetFoodLv3.length; index++) {
        wetFoodLv3[index].style.opacity = '0';
    }

    setTimeout(() => {
        /* ===== set height ===== */
        wetFoodShow.style.height = '0';
    }, 100);
    
    setTimeout(() => {
        /* ===== set arrow ===== */
        arrowDown[2].style.transform = 'rotate(45deg)';
    }, 150);

    setTimeout(() => {
        wetFoodPc.style.pointerEvents = 'all';
    }, 500);
}

/* <============= Toggle Wet for pc ============= > */
wetFoodShowToggle = () => {
    if (isOpenWetFood) {
        closeWetFood();
    } else {
        showWetFood();
    }
    isOpenWetFood = !isOpenWetFood;
}

/* <============= open Main Menu for pc ============= > */
openMenu = () => {
    document.body.style.overflow = 'hidden';

    openMenuPcClass.title = "Close Menu";

    let time = 0;
    let timePellet = 0;
    let timeWet = 0;

    if (isOpenPelletFood == true) {
        timePellet = 100;
        isOpenPelletFood = false;
    }

    if (isOpenWetFood == true) {
        timeWet = 200;
        isOpenWetFood = false;
    }

    if (isOpenPC == true) {
        closeCategories();
        time = 1000;
        isOpenPC = false;
    }

    categoriesPC.classList.add('swapcolor');
    featuredPC.classList.add('swapcolor');
    menu_pc.classList.add('swapcolor');

    setTimeout(() => {
        /* ===== show background ===== */
        menuPcWrap.style.display = 'block';

        /* ===== Set can't click ===== */
        menuCollapsePc.style.pointerEvents = 'none';
    }, time + timePellet + timeWet);
    
    setTimeout(() => {
        menuPcWrap.style.height = `${window.innerHeight}px`;
    },100 + time + timePellet + timeWet)

    setTimeout(() => {
        /* ===== background ===== */
        wrapMenuLineCart.style.background = 'var(--black)';

        /* ===== text menu ===== */
        featuredPC.style.color = 'var(--white)'
        categoriesPC.style.color = 'var(--white)'
        menu_pc.style.color = 'var(--white)'
        menu_pc.style.opacity = '0.75'

        /* ===== logo ===== */
        logoBlackPc.style.display = 'none';
        logoWhitePc.style.display = 'block';

        /* ===== arrow ===== */
        arrowDown[0].style.color = 'var(--white)';
        arrowDown[3].style.transform = 'rotate(0)';

        /* ===== Cart ===== */
        cart.style.color = 'var(--white)';
    },150 + time + timePellet + timeWet)

    setTimeout(() => {
        /* ===== logo ===== */
        logoBlackPc.style.opacity = '0';
        logoWhitePc.style.opacity = '1';

        /* ===== Show menu list ===== */
        for (let index = 0; index < menuItemPc.length; index++) {
            setTimeout(() => {
                menuItemPc[index].style.transform = 'translateY(0)'
            }, ((index*100)/2));
        }
    }, 300 + time + timePellet + timeWet);

    setTimeout(() => {
        menuCollapsePc.style.pointerEvents = 'all';

    }, 600 + time + timePellet + timeWet);

};

/* <============= close Main Menu for pc ============= > */
closeMenu = () => {
    document.body.style.overflow = 'hidden auto';

    /* ===== Set can't click ===== */
    menuCollapsePc.style.pointerEvents = 'none';

    menuPcWrap.style.pointerEvents = 'none';

    openMenuPcClass.title = "Open Menu";

    categoriesPC.classList.remove('swapcolor');
    featuredPC.classList.remove('swapcolor');
    menu_pc.classList.remove('swapcolor');

    setTimeout(() => {
        /* ===== hide menu list ===== */
        for (let index = 0; index < menuItemPc.length; index++) {
            setTimeout(() => {
                menuItemPc[index].style.transform = 'translateY(150%)'
            }, ((index*100)/2));
        }
    }, 100);

    /* ===== hide background ===== */
    setTimeout(() => {
        menuPcWrap.style.height = '0';
    }, 500);

    setTimeout(() => {
        /* ===== background ===== */
        wrapMenuLineCart.style.background = 'var(--white)';

        /* ===== text menu ===== */
        featuredPC.style.color = 'var(--black)'
        categoriesPC.style.color = 'var(--black)'
        menu_pc.style.color = 'var(--black)'
        menu_pc.style.opacity = '1'

        /* ===== logo ===== */
        logoBlackPc.style.display = 'block';
        logoWhitePc.style.display = 'none';

        /* ===== arrow ===== */
        arrowDown[0].style.color = 'var(--black)';

        /* ===== Cart ===== */
        cart.style.color = 'var(--black)';

    }, 600);

    setTimeout(() => {
        /* ===== logo ===== */
        logoBlackPc.style.opacity = '1';
        logoWhitePc.style.opacity = '0';

        /* Down arrow */
        arrowDown[3].style.transform = 'rotate(45deg)';
    }, 650);

    setTimeout(() => {
        menuPcWrap.style.display = 'none';

        /* ===== set click ===== */
        menuCollapsePc.style.pointerEvents = 'all';
        menuPcWrap.style.pointerEvents = 'all';
    }, 1000);
};

/* <============= Toggle Main Menu for pc ============= > */
toggleMenuPC = () => {
    if (openMenuPC) {
        closeMenu();
    } else {
        openMenu();
    }
    openMenuPC = !openMenuPC;
}