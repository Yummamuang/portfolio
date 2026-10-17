const cursor = document.getElementById('cursor');

const throttle = (callback, limit) => {
    let waiting = false;
    return function (...args) {
        if (!waiting) {
            callback.apply(this, args);
            waiting = true;
            setTimeout(() => waiting = false, limit);
        }
    };
};

document.addEventListener('mousemove', 
    throttle((event) => {
        const cursorX = event.clientX;
        const cursorY = event.clientY;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
    }, 10)
);
