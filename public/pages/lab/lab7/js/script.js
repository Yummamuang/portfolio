const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', function(e){
    var x = e.clientX;
    var y = e.clientY;
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
})

const websiteDesignMethod = document.getElementById('.website-design-method');

websiteDesignMethod.addEventListener('mouseover', () => {
    cursor.style.transform = 'scale(1.5)';
});