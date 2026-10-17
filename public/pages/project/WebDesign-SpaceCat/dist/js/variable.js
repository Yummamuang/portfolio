/* <======== Body ========> */
const body = document.getElementById('body');

/* <======== Navbar ========> */
const nav = document.getElementById('navbar');

/* <======== Logo ========> */
const logoWidth = document.getElementById('logo');


/* <============================== Loader js ==============================> */
const loaderAnotherPage = document.getElementById('loader-another-page');
const menuMobileText = document.getElementsByClassName('menu-items-lv1');
const Loader = document.getElementById('loader');
const logo = document.getElementById('logo-loading');
const meow = document.getElementsByClassName('letter-load-text');

/* <============================== Menu Mobile js ==============================> */
const menuCollapse = document.getElementById('menu-collapse');
const logoBlack = document.getElementById('logo-black');
const logoWhite = document.getElementById('logo-white');
const cart = document.getElementById('cart');
const menuMobile = document.getElementById('menu-mobile');
const menuMobileWrap = document.getElementById('menu-mobile-wrap');
const lineMenu1 = document.getElementById('line-menu-1');
const lineMenu12 = document.getElementById('line-menu-1/2');
const lineMenu2 = document.getElementById('line-menu-2');
const menuMobileItemsLv1 = document.getElementsByClassName('menu-items-lv1');
const changeLang = document.getElementById('change-language-wrap');
const header = document.getElementById('header');
const headerHeight = header.clientHeight;
const openMenuMobileClass = document.getElementsByClassName('open-menu')[0];

let menuMobileWrapHeight = window.innerHeight - headerHeight;
let isOpenLv1 = false;
let isOpenLv2 = false;
let index = 0;

/* <============================== Menu PC js ==============================> */
const menuCategoriesShow = document.getElementById('menu-categories-show');
const arrowLv1PC = document.getElementById('down-arrow-pc');
const arrowDown = document.getElementsByClassName('fa-arrow-down');
const arrowLv2PC1 = document.getElementById('down-left-arrow-pc-1');
const arrowLv2PC2 = document.getElementById('down-left-arrow-pc-2');

const featuredPC = document.getElementById('featured-pc');
const categoriesPC = document.getElementById('categories-pc');
const menu_pc = document.getElementById('menu_pc');
const down_arrow_pc = document.getElementById('down_arrow_pc');
const featuredCategoriesMenulineCart = document.getElementsByClassName('hide-it');

const logoBlackPc = document.getElementById('logo-black');
const logoWhitePc = document.getElementById('logo-white');

const lineMenuPc = document.getElementsByClassName('line-menu-pc');
const menuLv2PC = document.getElementsByClassName('menu-lv2-');

const pelletFoodPc = document.getElementById('pellet-food-pc');
const pelletFoodShow = document.getElementById('pellet-food-show');
const pelletFoodLv3 = document.getElementsByClassName('pellet-lv3');

const wetFoodPc = document.getElementById('wet-food-pc');
const wetFoodShow = document.getElementById('wet-food-show');
const wetFoodLv3 = document.getElementsByClassName('wet-lv3');

const featuredCategories = document.getElementById('featured&categories');
const menuPcWrap = document.getElementById('menu-pc-wrap');
const menuCollapsePc = document.getElementById('menu-collapse-pc');
const menuItemPc = document.getElementsByClassName('menu-items-pc');
const openMenuPcClass = document.getElementsByClassName('open-menu-pc')[0];

const changeLanguageWrapPc = document.getElementById('change-language-wrap-pc');
const changeLanguageTHPc = document.getElementById('change-language-th-pc');
const changeLanguageENPc = document.getElementById('change-language-en-pc');

const wrapMenuLineCart = document.getElementById('wrap-menu-line-cart');

const menuItemsPc = document.getElementsByClassName('menu-items-pc');

let isOpenPC = false;
let isOpenPelletFood = false;
let isOpenWetFood = false;
let openMenuPC = false;

let langTogglePc = false

let pelletTarget = document.querySelectorAll('.target-for-nav');
const space_cat_swim = document.getElementsByClassName('space_cat_swim');
const space_cat_sleep = document.getElementsByClassName('space_cat_sleep');


/* <============================== Responsive js ==============================> */
const lineMenuHeight = document.getElementById('line-menu');
const menuButtom = document.getElementById('buttom-menu');

let menuMobileLv3FirstHeight = 0;
let menuMobileLv3SecondHeight = 0;

/* <============================== Home Page ==============================> */
const spaceCatTextWrap = document.getElementById('space-cat-text-wrap');

const spaceCatH1 = document.getElementsByClassName('spaceCat-h1');
const theSaturn = document.getElementById('the-saturn');

let scrollY = window.scrollY;
let parallaxValue = -scrollY;
let parallaxButt = scrollY;
const catFoodParallax = document.getElementById("parallax-image-1");
const catToysParallax = document.getElementById("parallax-image-2");
const catHouseParallax = document.getElementById("parallax-image-3");

const ButtonHome = document.getElementsByClassName('food_toy_house_text');
const star_pop = document.getElementsByClassName('star_pop');


/* <============================== Product Page ==============================> */
const value = document.getElementById('value')
const value_2 = document.getElementById('value_')

const dot = document.getElementsByClassName('dot')[0]

/* <============================== Profile Page ==============================> */
const profile_button = document.getElementById('profile_button');
const profile_button_1 = document.getElementById('profile_button_1');

