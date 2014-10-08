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
                thumbsPerSlide,
                slideWidth = $this.parent().width(), //ширина родителя слайдера
                slideHeight = $this.parent().height(), //высота родителя слайдера
                $sliderControls = $('<div/>', {
                    class: 'slider-controls'
                }),
                $controlSlide = $('<span/>', {
                    class: 'control-slide',
                    style: 'width: 12px; height: 12px;'
                }),
                $thumbnail = $('<div/>', {
                    class: 'thumbnail',
                    style: 'overflow: hidden; position: absolute;'
                }),
                $thumbContainer = $('<ul/>', {
                    class: 'thumbnail-container',
                    width: slideCount * slideWidth
                }),
                $thumb = $('<li/>', {
                    class: 'thumb',
                    style: 'background-size: cover;'
                }),
                $link = $('<a/>', {
                }),
                sliderTimer;
            $thumbnail.width(slideWidth);
            $thumbnail.height(slideHeight / 5);
            $thumbContainer.attr('data-current', 0);

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
                            if (settings.thumbnail) {
                                if ((settings.thumbPos == 'top') || (settings.thumbPos == 'bottom')) {
                                    setSlide($(this), 'horizontal');
                                } else if ((settings.thumbPos == 'left') || (settings.thumbPos == 'right')) {
                                    setSlide($(this), 'vertical');
                                }
                            }
                        });
                        $sliderControls.append($clone);
                        $sliderControls.css('margin-left', -$controlSlide.width() * slideCount / 2);
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

                            $this.height(slideHeight - slideHeight / 5);
                            $this.width(slideWidth);

                            $slide.height(slideHeight - slideHeight / 5);
                            $slide.width(slideWidth);

                            $thumb.width(slideHeight / 5);
                            $thumb.height(slideHeight / 5);

                            $thumbContainer.width($thumb.width() * slideCount);

                            thumbsPerSlide = $slide.width() / $thumb.width();

                            break;

                        case 'left':


                            $this.width(slideWidth - slideHeight / 5);
                            $this.height(slideHeight);

                            $slide.width(slideWidth - slideHeight / 5);
                            $slide.height(slideHeight);

                            $thumb.width(slideHeight / 5);
                            $thumb.height(slideHeight / 5);

                            $thumbnail.width($thumb.width());
                            $thumbnail.height($slide.height());

                            $thumbContainer.width($thumb.width());
                            $thumbContainer.height($thumb.height() * slideCount);

                            thumbsPerSlide = $slide.height() / $thumb.height();

                            $this.css("margin-left", $thumb.width() + 'px');
                            $this.css('float', 'left');

                            $thumb.css('float', 'none');

                            break;

                        case 'top':

                            $this.height(slideHeight - slideHeight / 5);
                            $this.width(slideWidth);

                            $slide.height(slideHeight - slideHeight / 5);
                            $slide.width(slideWidth);

                            $thumb.width(slideHeight / 5);
                            $thumb.height(slideHeight / 5);

                            $this.css("margin-top", $thumb.height());

                            $thumbnail.css({
                                position: 'absolute',
                                top: 0
                            });

                            break;

                        case 'right':

                            if (settings.links == true) {

                                $this.width(slideWidth - 3 * slideHeight / 5);
                                $this.height(slideHeight);

                                $slide.width(slideWidth - 3 * slideHeight / 5);
                                $slide.height(slideHeight);

                                $thumb.width(slideHeight / 5);
                                $thumb.height(slideHeight / 5);

                                $thumbnail.width(3 * $thumb.width());
                                $thumbnail.height($slide.height());

                                $thumbContainer.width($thumb.width());
                                $thumbContainer.height($thumb.height() * slideCount);

                                $thumbnail.css('margin-left', slideWidth - 3 * $thumb.width());

                                $thumb.css('float', 'none');

                                $this.css('float', 'left');

                            } else {

                                $this.width(slideWidth - slideHeight / 5);
                                $this.height(slideHeight);

                                $slide.width(slideWidth - slideHeight / 5);
                                $slide.height(slideHeight);

                                $thumb.width(slideHeight / 5);
                                $thumb.height(slideHeight / 5);

                                $thumbnail.width($thumb.width());
                                $thumbnail.height($slide.height());

                                $thumbContainer.width($thumb.width());
                                $thumbContainer.height($thumb.height() * slideCount);

                                thumbsPerSlide = $slide.height() / $thumb.height();

                                $thumbnail.css('margin-left', slideWidth - $thumb.width());

                                $this.css("margin-right", $thumb.width() + 'px');

                                $thumb.css('float', 'none');

                                $this.css('float', 'left');
                            }


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
                        if (settings.thumbnail) {
                            if ((settings.thumbPos == 'top') || (settings.thumbPos == 'bottom')) {
                                setSlide($(this), 'horizontal');
                            } else if ((settings.thumbPos == 'left') || (settings.thumbPos == 'right')) {
                                setSlide($(this), 'vertical');
                            }
                        }
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
                if (settings.thumbnail) {
                    if ((settings.thumbPos == 'top') || (settings.thumbPos == 'bottom')) {
                        $thumbnail.append('<div class="arrow_thumb prev"></div><div class="arrow_thumb next"></div>');
                    } else if ((settings.thumbPos == 'left') || (settings.thumbPos == 'right')) {
                        $thumbnail.append('<div class="arrow_thumb_vert prev"></div><div class="arrow_thumb_vert next"></div>');
                    }
                }

                $slideWrapper.width(slideCount * $slide.width());

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

            $this.parent().find('.arrow_thumb.next').click(function (event) {
                var direction = 'horizontal';
                event.preventDefault();
                nextThumbs(direction);
            });

            $this.parent().find('.arrow_thumb.prev').click(function (event) {
                var direction = 'horizontal';
                event.preventDefault();
                prevThumbs(direction);
            });


            $this.parent().find('.arrow_thumb_vert.next').click(function (event) {
                var direction = 'vertical';
                event.preventDefault();
                nextThumbs(direction);
            });

            $this.parent().find('.arrow_thumb_vert.prev').click(function (event) {
                var direction = 'vertical';
                event.preventDefault();
                prevThumbs(direction);
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
                if ((settings.thumbPos == 'top') || (settings.thumbPos == 'bottom')) {
                    var direction = 'horizontal';
                } else if ((settings.thumbPos == 'left') || (settings.thumbPos == 'right')) {
                    var direction = 'vertical';
                }

                if (direction == 'horizontal') {
                    $thumbContainer.animate({
                        left: -(parseInt(currentSlide / thumbsPerSlide)) * $slide.width()
                    }, 500)
                        .data('current', parseInt(currentSlide / thumbsPerSlide));
                    $slideWrapper.animate({
                        left: -currentSlide * $slide.width()
                    }, 500)
                        .data('current', currentSlide);
                } else {
                    $thumbContainer.animate({
                        top: -(parseInt(currentSlide / thumbsPerSlide)) * $slide.height()
                    }, 500)
                        .data('current', parseInt(currentSlide / thumbsPerSlide));
                    $slideWrapper.animate({
                        left: -currentSlide * $slide.width()
                    }, 500)
                        .data('current', currentSlide);
                }
                changeControlSlide(currentSlide);
            }

            function prevSlide() { //функция, переключающая предыдущий слайд

                var currentSlide = parseInt($slideWrapper.data('current'));
                currentSlide--;

                if (currentSlide < 0) {
                    currentSlide = slideCount - 1;
                }
                if ((settings.thumbPos == 'top') || (settings.thumbPos == 'bottom')) {
                    var direction = 'horizontal';
                } else if ((settings.thumbPos == 'left') || (settings.thumbPos == 'right')) {
                    var direction = 'vertical';
                }

                if (direction == 'horizontal') {
                    $thumbContainer.animate({
                        left: -(parseInt(currentSlide / thumbsPerSlide)) * $slide.width()
                    }, 500)
                        .data('current', parseInt(currentSlide / thumbsPerSlide));
                    $slideWrapper.animate({
                        left: -currentSlide * $slide.width()
                    }, 500)
                        .data('current', currentSlide);
                } else {
                    $thumbContainer.animate({
                        top: -(parseInt(currentSlide / thumbsPerSlide)) * $slide.height()
                    }, 500)
                        .data('current', parseInt(currentSlide / thumbsPerSlide));
                    $slideWrapper.animate({
                        left: -currentSlide * $slide.width()
                    }, 500)
                        .data('current', currentSlide);
                }
                changeControlSlide(currentSlide);
            }

            function setSlide(slide, direction) { //функция, переключающая слайд по индексу
                var statedSlide = slide.index();
                setThumbs(slide, direction);
                $slideWrapper.animate({
                    left: -(statedSlide) * $slide.width()
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

            function nextThumbs(direction) {

                var currentSlide = parseInt($thumbContainer.data('current'));
                currentSlide++;

                if (currentSlide == parseInt(slideCount / thumbsPerSlide) + 1) {
                    currentSlide = 0;
                }
                if (direction == 'vertical') {

                    $thumbContainer.animate({
                        top: -currentSlide * $slide.height()
                    }, 500)
                        .data('current', currentSlide);
                } else {

                    $thumbContainer.animate({

                        left: -currentSlide * $slide.width()
                    }, 500)
                        .data('current', currentSlide);
                }

            }

            function prevThumbs(direction) {

                var currentSlide = parseInt($thumbContainer.data('current'));
                currentSlide--;

                if (currentSlide < 0) {
                    currentSlide = parseInt(slideCount / thumbsPerSlide);
                }
                if (direction == 'vertical') {
                    $thumbContainer.animate({
                        top: -currentSlide * $slide.height()
                    }, 500)
                        .data('current', currentSlide);
                } else {
                    $thumbContainer.animate({
                        left: -currentSlide * $slide.width()
                    }, 500)
                        .data('current', currentSlide);
                }
            }

            function setThumbs(slide, direction) {

                var statedSlide = parseInt(slide.index() / thumbsPerSlide);

                if (direction == 'vertical') {
                    $thumbContainer.animate({
                        top: -statedSlide * $slide.height()
                    }, 500)
                        .data('current', statedSlide);

                } else {
                    $thumbContainer.animate({
                        left: -statedSlide * $slide.width()
                    }, 500)
                        .data('current', statedSlide);

                }
            }
        });
    }
})(jQuery);