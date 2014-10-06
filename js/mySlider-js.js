/**
 * User: bestiara
 * Date: 02.10.14
 * Time: 11:52
 */
(function ($) {
    $.fn.slider = function (options) {

        var settings = $.extend({
            'autoslide': false, //автоскролл
            'speed': '1000', //скорость (частота) автоскролла
            'arrows': true, //отображение стрелок
            'selector': true, //отображение селекторов
            'thumbnail': true, //отображение миниатюр
            'thumbPos': 'bottom' //положение миниатюр (bottom, top, left, right)
        }, options);

        this.each(function () {
            var $this = $(this),
                $slideWrapper = $this.find('.slidewrapper'), //контейнер с слайдами
                $controlSlide = $this.find('.control-slide'), //селектор
                slideCount = $slideWrapper.children().size(), //количество слайдов
                slideWidth = $this.parent().width(), //ширина родителя слайдера
                slideHeight = $this.parent().height(), //высота родителя слайдера
                sliderTimer;

            $slideWrapper.width(slideCount * slideWidth);
            $this.css({
                overflow: 'hidden',
                position: 'relative'
            });
            setSlider();
            startAutoSlide();
            $this.hover(function () { //стопаем автоскролл при наведении на слайдер
                clearInterval(sliderTimer);
            }, function () {
                startAutoSlide()
            });

            $this.find('.next').click(function (event) {
                event.preventDefault();
                nextSlide();
            });

            $this.find('.prev').click(function (event) {
                event.preventDefault();
                prevSlide();

            });

            $controlSlide.click(function (event) {
                event.preventDefault();
                setSlide($(this));
            });

            $thumbnails.click(function (event) {
                event.preventDefault();
                setSlide($(this));
            });

            function startAutoSlide() { //запускаем автоскролл, если он включен
                if (settings.autoslide == true) {
                    sliderTimer = setInterval(nextSlide, settings.speed);
                }
            }

            function nextSlide() { //функция, переключающая следующий слайд
                var currentSlide = parseInt($slideWrapper.data('current'));
                currentSlide++;
                if (currentSlide == slideCount) {
                    currentSlide = 0;
                }

                $slideWrapper.animate({
                    left: -currentSlide * slideWidth
                }, 500)
                    .data('current', currentSlide);

                changeControlSlide(currentSlide);
            }

            function prevSlide() { //функция, переключающая предыдущий слайд
                var currentSlide = parseInt($slideWrapper.data('current'));
                currentSlide--;

                if (currentSlide < 0) {
                    currentSlide = slideCount - 1;
                }

                $slideWrapper.animate({
                    left: -currentSlide * slideWidth
                }, 500)
                    .data('current', currentSlide);

                changeControlSlide(currentSlide);
            }

            function setSlide(slide) { //функция, переключающая слайд по индексу
                var statedSlide = slide.index();
                changeControlSlide(statedSlide);

                $slideWrapper.animate({
                    left: -(statedSlide) * slideWidth
                }, 500)
                    .data('current', statedSlide);
            }

            function changeControlSlide(index) { //функция, переключающая управляющие элементы в статус active
                $this.find('.control-slide.active').removeClass('active');
                $this.find('.control-slide:eq(' + index + ')').addClass('active');
                $this.parent().find('.thumb.active').removeClass('active');
                $this.parent().find('.thumb:eq(' + index + ')').addClass('active');
            }

            function setSlider() { //создание слайдера, согласно конфигам
                //todo организовать создание управляющих элементов, в зависимости от количества и содержимого слайдов
                var $thumbnail = $this.parent().find('.thumbnail'); //контейнер с миниатюрами
                var $thumb = $thumbnail.find('.thumb'); //контейнер самой миниатюры
                var $slide = $this.find('.slide'); //контейнер слайда

                if (settings.arrows == false) {
                    $this.find('.arrow').css('visibility', 'hidden');
                }
                if (settings.selector == false) {
                    $this.find('.control-slide').css('visibility', 'hidden');
                }
                if (settings.thumbnail == false) {
                    $this.height(slideHeight);
                    $slide.height(slideHeight);
                    $slide.width(slideWidth);
                }
                else if (settings.thumbnail == true) {

                    $thumbnail.css("visibility", "visible");

                    switch (settings.thumbPos) {
                        case 'bottom':
                            $this.height(slideHeight - slideHeight / slideCount);
                            $slide.height(slideHeight - slideHeight / slideCount);
                            $slide.width(slideWidth);
                            $thumb.width($slide.width() / slideCount - 5);
                            $thumb.height($slide.height() / slideCount);
                            break;
                        case 'left':
                            slideWidth = slideWidth - slideWidth / slideCount;
                            $this.width(slideWidth);
                            $slide.width(slideWidth);
                            $slide.height(slideHeight);
                            $thumb.width($slide.width() / slideCount);
                            $thumb.height($slide.height() / slideCount - 5);
                            $this.css("margin-left", $this.width() / slideCount + 5 + 'px');
                            $thumb.css('margin', '0 5px  5px  0 ');
                            $thumb.css('float', 'none');
                            $thumbnail.clone().insertBefore($this);
                            $thumbnail.remove();
                            break;
                        case 'top':
                            $this.height(slideHeight - slideHeight / slideCount);
                            $slide.height(slideHeight - slideHeight / slideCount);
                            $slide.width(slideWidth);
                            $thumb.width($slide.width() / slideCount - 5);
                            $thumb.height($slide.height() / slideCount);
                            $thumb.css('margin', '0 5px 5px 0');
                            $this.css("padding-top", $slide.height() / slideCount + 5 + 'px');
                            $thumbnail.clone().insertBefore($this);
                            $thumbnail.remove();
                            break;
                        case 'right':
                            slideWidth = slideWidth - slideWidth / slideCount;
                            $this.width(slideWidth);
                            $slide.width(slideWidth);
                            $slide.height(slideHeight);
                            $thumb.width($slide.width() / slideCount);
                            $thumb.height($slide.height() / slideCount - 5);
                            $thumbnail.css('margin-left', slideWidth);
                            $thumb.css('margin', '0 0 5px 5px');
                            $thumb.css('float', 'none');
                            $this.css('float', 'left');
                            $this.width(slideWidth);
                            break;
                    }
                }
            }
        });
    }
})(jQuery);