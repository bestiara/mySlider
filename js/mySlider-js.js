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
            'thumbPos': 'bottom', //положение миниатюр (bottom, top, left, right)
            'links': false
        }, options);

        this.each(function () {
            var $this = $(this),
                $slideWrapper = $this.find('.slidewrapper'), //контейнер с слайдами
                $slide = $this.find('.slide'), //контейнер слайда
                slideCount = $slideWrapper.children().size(), //количество слайдов
                slideWidth = $this.parent().width(), //ширина родителя слайдера
                slideHeight = $this.parent().height(), //высота родителя слайдера
                $sliderControls = $('<div/>', {
                    class: 'slider-controls'
                }),
                $controlSlide = $('<span/>', {
                    class: 'control-slide'
                }),
                $thumbnail = $('<div/>', {
                    class: 'thumbnail'
                }),
                $thumbContainer = $('<ul/>', {
                    class: 'thumbnail-container'
                }),
                $thumb = $('<li/>', {
                    class: 'thumb',
                    style: 'background-size: cover;'
                }),
                $link = $('<a/>', {
                }),
                sliderTimer;

            $slideWrapper.width(slideCount * slideWidth);
            $this.css({
                overflow: 'hidden',
                position: 'relative'
            });

            setSlider();
            startAutoSlide();

            function setSlider() { //создание слайдера, согласно конфигам
                if (settings.arrows) { //добавление стрелок
                    $this.append('<div class="arrow prev"></div><div class="arrow next"></div>');
                }
                if (settings.selector) { //создание шариков-селекторов
                    $controlSlide.addClass('active');
                    $slide.each(function () {
                        $clone = $controlSlide.clone();
                        $clone.click(function (event) {
                            event.preventDefault();
                            setSlide($(this));
                        });
                        $sliderControls.append($clone);
                        $controlSlide.removeClass('active');
                    });
                    $this.append($sliderControls);
                }
                if (!settings.thumbnail) {

                    $this.height(slideHeight);
                    $this.width(slideWidth);

                    $slide.height(slideHeight);
                    $slide.width(slideWidth);

                }

                else {

                    switch (settings.thumbPos) {

                        case 'bottom':

                            $this.height(slideHeight - slideHeight / slideCount);
                            $this.width(slideWidth);

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
                            $this.css('float', 'left');

                            $thumb.css('margin', '0 5px  5px  0 ');
                            $thumb.css('float', 'none');

                            break;

                        case 'top':

                            $this.height(slideHeight - slideHeight / slideCount);
                            $this.width(slideWidth);

                            $slide.height(slideHeight - slideHeight / slideCount);
                            $slide.width(slideWidth);

                            $thumb.width($slide.width() / slideCount - 5);
                            $thumb.height($slide.height() / slideCount);
                            $thumb.css('margin', '0 5px 5px 0');

                            $this.css("margin-top", $slide.height() / slideCount + 5 + 'px');

                            $thumbnail.css('position', 'static');

                            break;

                        case 'right':

                            if (settings.links == true) {

                                slideWidth = slideWidth - slideWidth / (slideCount + 2);

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

                            }
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
                //настройка миниатюр
                var image = new Image();

                $thumb.addClass('active');

                $slide.each(function () {

                    var $slide = $(this),
                        $img = $slide.find('img');
                    image.src = $img.attr('src');
                    if (settings.links == true) {

                        $link.attr('href', $slide.data('url'));
                        $link.css({
                            'margin-left': $thumb.width() + 10,
                            'padding-top': $thumb.height() / 2 - 10
                        });
                        $link.html($slide.data('text'));

                        $thumb.append($link);

                    }

                    $thumb.css('background-image', 'url(' + image.src + ')');

                    $clone = $thumb.clone();
                    $clone.click(function (event) {
                        event.preventDefault();
                        setSlide($(this));
                    });

                    $thumbContainer.append($clone);
                    $thumb.removeClass('active');

                    if ($slide.width() / image.width > $slide.height() / image.height) {
                        $img.width($slide.width());
                    } else {
                        $img.height($slide.height());
                    }

                    $thumbnail.append($thumbContainer);

                    $this.parent().append($thumbnail);

                });

            }

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
                $slideWrapper.animate({
                    left: -(statedSlide) * slideWidth
                }, 500)
                    .data('current', statedSlide);

                changeControlSlide(statedSlide);

            }

            function changeControlSlide(index) { //функция, переключающая управляющие элементы в статус active
                $this.find('.control-slide.active').removeClass('active');
                $this.find('.control-slide:eq(' + index + ')').addClass('active');
                $this.parent().find('.thumb.active').removeClass('active');
                $this.parent().find('.thumb:eq(' + index + ')').addClass('active');
            }
        });
    }
})(jQuery);