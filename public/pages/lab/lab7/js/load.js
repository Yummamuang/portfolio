var loader = document.getElementById('preloader')
var box = document.getElementById('box-preloader')
var body = document.querySelector('body')
var square = document.getElementById('square')
var postload = document.getElementById('postloader');

window.addEventListener('load', function(){
    setTimeout(function() {
        loader.style.transform = 'translateY(100%)';
        body.style.overflow = 'unset';
        square.style.height = '0';
        square.style.width = '0';
        square.style.borderWidth = '0';
        postload.style.display = 'block';
    }, 1000);

    setTimeout(function() {
        box.style.zIndex = '-10';
    }, 3000);
    
})