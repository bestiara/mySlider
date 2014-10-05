/**
 * User: bestiara
 * Date: 02.10.14
 * Time: 11:52
 */
(function($) {
    $.fn.slider = function( options ) {

        var settings = $.extend( {
            'autoslide' : 'false',
            'speed' : '1000',
            'arrows' : 'true',
            'controls' : 'true',
            'thumbnail' : 'true',
            'thumbPos' : 'bottom'
        }, options);

        this.each(function() {
            var $this = $(this),
                $slideWrapper = $this.find('.slidewrapper'),
                $controlSlide = $this.find('.control-slide'),
                $thumbnails = $this.parent().find('.thumb'),
                slideCount = $slideWrapper.children().size(),
                slideWidth = $this.parent().width(),
                slideHeight = $this.parent().height(),
                sliderTimer;

            $slideWrapper.width(slideCount * slideWidth);
            $this.css({
                overflow : 'hidden',
                position : 'relative'
            });
            setSlider();
            startAutoSlide();
            $this.hover(function() {
                clearInterval(sliderTimer);
            }, function() {
                startAutoSlide()
            });

            $this.find('.next').click(function(event) {
                event.preventDefault();
                nextSlide();
            });

            $this.find('.prev').click(function(event) {
                event.preventDefault();
                prevSlide();

            });

            $controlSlide.click(function(event) {
                event.preventDefault();
                setSlide($(this));
            });

            $thumbnails.click(function(event) {
                event.preventDefault();
                setSlide($(this));
            });

            function startAutoSlide(){
                if (settings.autoslide == 'true') {
                    sliderTimer=setInterval(nextSlide, settings.speed);
                }
            }
            function nextSlide() {
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

            function prevSlide() {
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

            function setSlide(slide) {
                var statedSlide = slide.index();
                changeControlSlide(statedSlide);

                $slideWrapper.animate({
                        left: -(statedSlide) * slideWidth
                    }, 500)
                    .data('current', statedSlide);
            }
            
            function changeControlSlide(index) {
                $this.find('.control-slide.active').removeClass('active');
                $this.find('.control-slide:eq(' + index + ')').addClass('active');
                $this.parent().find('.thumb.active').removeClass('active');
                $this.parent().find('.thumb:eq(' + index + ')').addClass('active');
            }

            function setSlider() {
                var thumbnail = $this.parent().find('.thumbnail');
                var thumb =thumbnail.find('.thumb');
                if (settings.arrows == 'false'){
                    $this.find('.arrow').css('visibility', 'hidden');
                }
                if (settings.arrows == 'false'){
                    $this.find('.control-slide').css('visibility', 'hidden');
                }
                if (settings.thumbnail == 'false') {
                    $this.height(slideHeight);
                    $this.find('.slide').height(slideHeight);
                    $this.find('.slide').width(slideWidth);
                }
                if (settings.thumbnail == 'true') {

                    thumbnail.css("visibility", "visible");

                    if (settings.thumbPos == 'bottom'){
                        $this.height(slideHeight - slideHeight/5);
                        $this.find('.slide').height(slideHeight - slideHeight/5);
                        $this.find('.slide').width(slideWidth);
                        thumb.width($this.find('.slide').width()/5);
                        thumb.height($this.find('.slide').height()/5);
                    }

                    if (settings.thumbPos == 'top') {
                        $this.height(slideHeight - slideHeight/5);
                        $this.find('.slide').height(slideHeight - slideHeight/5);
                        $this.find('.slide').width(slideWidth);
                        thumb.width($this.find('.slide').width()/5);
                        thumb.height($this.find('.slide').height()/5);
                        thumb.css('margin', '0 5px 5px 0');
                        $this.css("padding-top", $this.find('.slide').height()/5+5+'px');
                        thumbnail.clone().insertBefore($this);
                        thumbnail.remove();
                    }
                    if (settings.thumbPos == 'left') {
                        slideWidth = slideWidth - slideWidth/5;
                        $this.width(slideWidth);
                        $this.find('.slide').width(slideWidth);
                        $this.find('.slide').height(slideHeight);
                        thumb.width($this.find('.slide').width()/5);
                        thumb.height($this.find('.slide').height()/5);
                        $this.css("margin-left", $this.width()/5+5+'px');
                        thumb.css('margin', '0 5px  5px  0 ');
                        thumb.css('float', 'none');
                        thumbnail.clone().insertBefore($this);
                        thumbnail.remove();
                    }

                    if (settings.thumbPos == 'right') {
                        slideWidth = slideWidth - slideWidth/5;
                        $this.width(slideWidth);
                        $this.find('.slide').width(slideWidth);
                        $this.find('.slide').height(slideHeight);
                        thumb.width($this.find('.slide').width()/5);
                        thumb.height($this.find('.slide').height()/5);
                        thumbnail.css('margin-left', slideWidth);
                        thumb.css('margin', '0 0 5px 5px');
                        thumb.css('float', 'none');
                        $this.css('float', 'left');
                        $this.width(slideWidth);
                    }
                }
            }
        });
    }
})(jQuery);