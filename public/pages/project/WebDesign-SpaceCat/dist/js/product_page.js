let quantity = 1

decrement = () => {
    quantity++
    value.textContent = quantity
    value_2.textContent = quantity
}

increment = () => {
    if (quantity > 1) {
        quantity--
        value.textContent = quantity
        value_2.textContent = quantity
    }
}

addtoCart = (number) => {
    const buttonAddToCart = document.getElementsByClassName('button_add_to_cart')[number]
    const addtoCart = document.getElementsByClassName('addtoCartText')[number]
    const check = document.getElementsByClassName('fa-check')[number]

    buttonAddToCart.style.pointerEvents = 'none'
    addtoCart.style.transform = 'translateY(-150%)'
    check.style.top = '0%'

    cart.style.transform = 'rotate(5deg)'

    setTimeout(() => {
        check.style.transform = 'rotate(0)'
        dot.style.transform = 'scale(1)'
        cart.style.transform = 'rotate(-15deg)'
    }, 100);


    setTimeout(() => {
        cart.style.transform = 'rotate(0deg)'    
    }, 300);

    setTimeout(() => {
        check.style.top = '100%'
        
    }, 1000);
    
    setTimeout(() => {
        addtoCart.style.transform = 'translateY(0%)'
        check.style.transform = 'rotate(-15deg)'
        buttonAddToCart.style.pointerEvents = 'auto'
    }, 1200);
}