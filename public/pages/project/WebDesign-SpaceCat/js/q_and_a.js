
const questionStates = Array.from({ length: 10 }, () => false);


const toggleQuestion = (number) => {
    const arrow = document.getElementsByClassName('fa-angle-down')[number];
    const answer = document.getElementsByClassName('answer')[number];

    if (questionStates[number] === false) {
        arrow.style.transform = 'rotate(0deg)';
        answer.style.display = 'block';

        setTimeout(() => {
            answer.style.opacity = '1';
            answer.style.height = '100%';
            answer.style.transform = 'translateY(0)';
        }, 200);

    } else {
        arrow.style.transform = 'rotate(180deg)';
        answer.style.transform = 'translateY(-150%)';

        setTimeout(() => {
            answer.style.height = '0%';
            answer.style.opacity = '0';
        }, 200);

        setTimeout(() => {
            answer.style.display = 'none';
        }, 250);
    }
    
    questionStates[number] = !questionStates[number];
}
