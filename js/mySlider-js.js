/**
 * User: bestiara
 * Date: 02.10.14
 * Time: 11:52
 */
var slideWidth=$('.slider').width();
var sliderTimer;
$(function(){
    $('.slidewrapper').width($('.slidewrapper').children().size()*slideWidth);
    //sliderTimer=setInterval(nextSlide,1000);
    $('.slider').hover(function(){
        clearInterval(sliderTimer);
    },function(){
        //sliderTimer=setInterval(nextSlide,1000);
    });
    $('.next').click(function(){
        //clearInterval(sliderTimer);
        nextSlide();
        //sliderTimer=setInterval(nextSlide,1000);
    });
    $('.prev').click(function(){
        //clearInterval(sliderTimer);
        prevSlide();
        //sliderTimer=setInterval(nextSlide,1000);
    });
    $('.control-slide').click(function(){
        setSlide(this);
    });
});


function nextSlide(){
    var currentSlide=parseInt($('.slidewrapper').data('current'));
    $('.control-slide').removeClass('active');
    currentSlide++;
    if(currentSlide>=$('.slidewrapper').children().size())
    {
        currentSlide=0;
    }
    $('.slidewrapper').animate({left: -currentSlide*slideWidth},500).data('current',currentSlide);
    $('#'+currentSlide).addClass('active');
}

function prevSlide(){
    var currentSlide=parseInt($('.slidewrapper').data('current'));
    $('.control-slide').removeClass('active');
    currentSlide--;
    if(currentSlide<0)
    {
        currentSlide=$('.slidewrapper').children().size()-1;
    }
    $('.slidewrapper').animate({left: -currentSlide*slideWidth},500).data('current',currentSlide);
    $('#'+currentSlide).addClass('active');
}

function setSlide(_this){
    var statedSlide=_this.id;
    $('.control-slide').removeClass('active');
    $('#'+statedSlide).addClass('active');
    $('.slidewrapper').animate({left: -(statedSlide)*slideWidth},500).data('current',statedSlide);
}