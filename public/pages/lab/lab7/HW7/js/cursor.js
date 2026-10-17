const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', function(e){
    var x = e.clientX;
    var y = e.clientY;
    if (x > 0.98*x || y > 0.9*y) {
        x = e.clientX * 0.98;
        y = e.clientY * 0.9;
    }

    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
})

const hover = document.getElementById('navbar');

hover.addEventListener('mouseover', () => {
    cursor.style.transform = 'scale(1.5)';
});

hover.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
});