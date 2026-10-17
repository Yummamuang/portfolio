/* <========================================= Loader to Another Page =========================================> */
loadToPage = (page) => {

    logoWidth.style.opacity = '0';

    setTimeout(() => {
        loaderAnotherPage.style.height = '100vh';
    },50)

    setTimeout(() => {
        window.location.href = `./${page}.html`;
    },300)
}