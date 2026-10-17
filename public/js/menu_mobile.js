const content = document.getElementById('content')
const menu_mobile = document.getElementById('menu_mobile')

const line_1 = document.getElementById('l1')
const line_2 = document.getElementById('l2')
const line_3 = document.getElementById('l3')


let MenuMobile = false 

toggleMenuMobile = () => {
    if (MenuMobile) {
        CloseMenu()
    } else {
        OpenMenu()
    }
    MenuMobile = !MenuMobile
}

OpenMenu = () => {
    content.style.transform = 'translateX(-100%)'

    line_2.style.transform = 'scale(0.5)'

    setTimeout(() => {
        line_2.style.opacity = '0'

        line_1.style.transform = 'rotate(40deg)'
        line_1.style.top = '50%'
        line_3.style.transform = 'rotate(-40deg)'
        line_3.style.top = '50%'
    }, 50);
    setTimeout(() => {
        menu_mobile.style.right = '-50%'
    }, 150);
}

CloseMenu = () => {
    menu_mobile.style.right = '-150%'

    line_1.style.transform = 'rotate(0deg)'
    line_1.style.top = '0%'
    line_3.style.transform = 'rotate(0deg)'
    line_3.style.top = '100%'
    line_2.style.opacity = '1'
    setTimeout(() => {
        line_2.style.transform = 'scale(1)'
    }, 50);

    setTimeout(() => {
        content.style.transform = 'translateX(0)'
    }, 150);
    
}



