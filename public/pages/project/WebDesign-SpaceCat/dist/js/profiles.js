setTimeout(() => {
    if (window.innerWidth >= 1024) {
        document.body.style.overflow = 'hidden auto'
    } else {
        document.body.style.overflow = 'hidden'
    }
    
}, 1615);

starHover = (num,numStar) => {
    const star_container = document.getElementsByClassName('star_container')[num];
    const star = star_container.querySelectorAll('.fa-star');

    for (let index = 0; index < numStar + 1; index++) {
        star[index].style.color = 'var(--green-light)';
    }
}

unStarHover = (num) => {
    const star_container = document.getElementsByClassName('star_container')[num];
    const star = star_container.querySelectorAll('.fa-star');
    for (let index = 0; index < star.length; index++) {
        star[index].style.color = 'var(--black)';
    }
}

thankForReview = (num) => {
    const product_history = document.getElementsByClassName('product_history')[num];
    const logo_thank = document.getElementsByClassName('logo_thank')[num];
    const thank_for_review = document.getElementsByClassName('thank_for_review')[num];
    const glass = document.getElementById('glass');

    product_history.style.opacity = '0';
    document.body.style.pointerEvents = 'none';

    glass.style.left = '0';

    setTimeout(() => {
        product_history.style.display = 'none';
        logo_thank.style.display = 'block';
        thank_for_review.style.display = 'block';
    }, 100);

    setTimeout(() => {
        logo_thank.style.opacity = '1';
        thank_for_review.style.opacity = '1';
        glass.style.opacity = '0.7';
    }, 150);

    setTimeout(() => {
        logo_thank.style.opacity = '0';
        thank_for_review.style.opacity = '0';
        glass.style.opacity = '0';
    }, 1500);

    setTimeout(() => {
        logo_thank.style.display = 'none';
        thank_for_review.style.display = 'none';
        document.body.style.pointerEvents = 'auto';
        glass.style.left = '-100%';
    }, 1800);
}

const profile_container = document.getElementById('profile_container');

openProfile = () => {
    profile_container.style.left = '0%';
    profile_button.style.right = '100%';

    setTimeout(() => {
        profile_button_1.style.left = '0';
        document.body.style.overflow = 'hidden'
    }, 350);
}

closeProfile = () => {
    profile_button_1.style.left = '-50%';

    setTimeout(() => {
        profile_container.style.left = '100%';
        profile_button.style.right = '0%';
        document.body.style.overflow = 'hidden auto'
    }, 150);
}

const point = document.getElementById('point');
const bought_history = document.getElementById('bought_history');
const recive = document.getElementById('recive');
const edit_profiles = document.getElementById('edit_profiles');
const coupon = document.getElementById('coupon');

const rate_product_container = document.getElementById('rate_product_container');
const product_history_container = document.getElementById('product_history_container');
const product_recive_container = document.getElementById('product_recive_container');
const edit_profile_container = document.getElementById('edit_profile_container');
const coupon_container = document.getElementById('coupon_container');


loadToRate = () => {
    closeProfile();
    point.classList.add('active');
    point.style.pointerEvents = 'none';
    
    recive.classList.remove('active');
    recive.style.pointerEvents = 'auto';

    bought_history.classList.remove('active');
    bought_history.style.pointerEvents = 'auto';

    coupon.classList.remove('active');
    coupon.style.pointerEvents = 'auto';

    edit_profiles.classList.remove('active');
    edit_profiles.style.pointerEvents = 'auto';
    
    product_recive_container.style.opacity = '0';
    rate_product_container.style.opacity = '0';
    product_history_container.style.opacity = '0';
    edit_profile_container.style.opacity = '0';
    coupon_container.style.opacity = '0';

    product_recive_container.style.display = 'none';
    product_history_container.style.display = 'none';
    edit_profile_container.style.display = 'none';
    coupon_container.style.display = 'none';

    if (window.innerWidth >= 768) {
        rate_product_container.style.display = 'grid';
    } else {
        rate_product_container.style.display = 'block';
    }

    setTimeout(() => {
        rate_product_container.style.opacity = '1';
    }, 200);
}

loadToHistory = () => {
    closeProfile();
    point.classList.remove('active');
    point.style.pointerEvents = 'auto';

    recive.classList.remove('active');
    recive.style.pointerEvents = 'auto';

    bought_history.classList.add('active');
    bought_history.style.pointerEvents = 'none';

    coupon.classList.remove('active');
    coupon.style.pointerEvents = 'auto';

    edit_profiles.classList.remove('active');
    edit_profiles.style.pointerEvents = 'auto';
    
    product_recive_container.style.opacity = '0';
    rate_product_container.style.opacity = '0';
    product_history_container.style.opacity = '0';
    edit_profile_container.style.opacity = '0';
    coupon_container.style.opacity = '0';

    rate_product_container.style.display = 'none';
    product_recive_container.style.display = 'none';
    edit_profile_container.style.display = 'none';
    coupon_container.style.display = 'none';
    
    if (window.innerWidth >= 768) {
        product_history_container.style.display = 'grid';
    } else {
        product_history_container.style.display = 'block';
    }

    setTimeout(() => {
        product_history_container.style.opacity = '1';
    }, 200);
}

loadToRecive = () => {
    closeProfile();
    point.classList.remove('active');
    point.style.pointerEvents = 'auto';

    recive.classList.add('active');
    recive.style.pointerEvents = 'none';

    bought_history.classList.remove('active');
    bought_history.style.pointerEvents = 'auto';

    coupon.classList.remove('active');
    coupon.style.pointerEvents = 'auto';

    edit_profiles.classList.remove('active');
    edit_profiles.style.pointerEvents = 'auto';
    
    product_recive_container.style.opacity = '0';
    rate_product_container.style.opacity = '0';
    product_history_container.style.opacity = '0';
    edit_profile_container.style.opacity = '0';
    coupon_container.style.opacity = '0';

    rate_product_container.style.display = 'none';
    product_recive_container.style.display = 'grid';
    product_history_container.style.display = 'none';
    edit_profile_container.style.display = 'none';
    coupon_container.style.display = 'none';

    setTimeout(() => {
        product_recive_container.style.opacity = '1';
    }, 200);
}

loadToEditProfiles = () => {
    closeProfile();
    point.classList.remove('active');
    point.style.pointerEvents = 'auto';

    recive.classList.remove('active');
    recive.style.pointerEvents = 'auto';

    bought_history.classList.remove('active');
    bought_history.style.pointerEvents = 'auto';

    coupon.classList.remove('active');
    coupon.style.pointerEvents = 'auto';

    edit_profiles.classList.add('active');
    edit_profiles.style.pointerEvents = 'none';

    product_recive_container.style.opacity = '0';
    rate_product_container.style.opacity = '0';
    product_history_container.style.opacity = '0';
    edit_profile_container.style.opacity = '0';
    coupon_container.style.opacity = '0';

    rate_product_container.style.display = 'none';
    product_recive_container.style.display = 'none';
    product_history_container.style.display = 'none';
    edit_profile_container.style.display = 'block';
    coupon_container.style.display = 'none';

    setTimeout(() => {
        edit_profile_container.style.opacity = '1';
    }, 200);
}

loadToCoupon = () => {
    closeProfile();
    point.classList.remove('active');
    point.style.pointerEvents = 'auto';

    recive.classList.remove('active');
    recive.style.pointerEvents = 'auto';

    bought_history.classList.remove('active');
    bought_history.style.pointerEvents = 'auto';

    coupon.classList.add('active');
    coupon.style.pointerEvents = 'none';

    edit_profiles.classList.remove('active');
    edit_profiles.style.pointerEvents = 'auto';

    product_recive_container.style.opacity = '0';
    rate_product_container.style.opacity = '0';
    product_history_container.style.opacity = '0';
    edit_profile_container.style.opacity = '0';
    coupon_container.style.opacity = '0';

    rate_product_container.style.display = 'none';
    product_recive_container.style.display = 'none';
    product_history_container.style.display = 'none';
    edit_profile_container.style.display = 'none';
    coupon_container.style.display = 'grid';

    setTimeout(() => {
        coupon_container.style.opacity = '1';
    }, 200);
}