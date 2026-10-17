$(document).scroll(function(){
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var scroll = $(window).scrollTop();
    var amount = -80+(scroll*1.8);
    var left = scroll*0.8;
    var right = -scroll*0.3;

    if (amount > 0){
        $('.background').css({left: -left+"px"});
    }

    if (amount > 500){
        $('#navbar').css({top:  -100 +"px"});
    }else{
        $('#navbar').css({top:  -0 +"px"});
    }

    if (amount > 600){
        $('.method').css({left: left+"px"});
    }

    
    if (amount > 1500){
        $('.development').css({left: right+"px"});
    }

    if (scroll > screenHeight*1.5){
        $('.process').css({transform: "translateX(0)"});
    }else{
        $('.process').css({transform: "translateX(-100%)"});
    }


    if (scroll > screenHeight*1.5){
        $('.develop').css({transform: "translateX(0)"});
    }else{
        $('.develop').css({transform: "translateX(-150%)"});
    }

    if (scroll > screenHeight*1.5){
        $('.website').css({transform: "translateX(0)"});
    }else{
        $('.website').css({transform: "translateX(-100%)"});
    }

    if (scroll > screenHeight*1.5){
        $('.subtopic-5step').css({opacity: "1"});
    }else{
        $('.subtopic-5step').css({opacity: "0.2"});
    }

    if (scroll > screenHeight*2.5){
        $('.side1').css({height: "100vh"});
        $('.num1').css({transform: "translateY(0)"});
        $('.num1').css({opacity: "1"});
        $('.head1').css({transform: "translateY(0)"});
        $('.head1').css({opacity: "1"});
    }

    if (scroll > screenHeight*3.5){
        $('.num2').css({transform: "translateY(0)"});
        $('.num2').css({opacity: "1"});
        $('.head2').css({transform: "translateY(0)"});
        $('.head2').css({opacity: "1"});
    }

    if (scroll > screenHeight*4.5){
        $('.num3').css({transform: "translateY(0)"});
        $('.num3').css({opacity: "1"});
        $('.head3').css({transform: "translateY(0)"});
        $('.head3').css({opacity: "1"});
    }

    if (scroll > screenHeight*5.5){
        $('.num4').css({transform: "translateY(0)"});
        $('.num4').css({opacity: "1"});
        $('.head4').css({transform: "translateY(0)"});
        $('.head4').css({opacity: "1"});
    }

    if (scroll > screenHeight*6.5){
        $('.num5').css({transform: "translateY(0)"});
        $('.num5').css({opacity: "1"});
        $('.head5').css({transform: "translateY(0)"});
        $('.head5').css({opacity: "1"});
    }

});