/*
 * Joel Media Slider
 * @author: Lukas Hermann
 */

/* Keep in sync with _components.slider.scss */
var slideDuration   = 4000;
var slideTransition = 600;
var slideDelay      = 100;

function mod(n, m) {
        return ((n % m) + m) % m;
}

// holder class for each slide
class Slide {
    constructor(id, slide, nav) {
        this.id = id;
        this.slide = slide;
        this.nav = nav;
        this.class = "";
        this.zIndex = false;
    }

    setZIndex(z) {
        $(this.slide).css( "z-index", z );
        this.zIndex = z;
    }

    activateNav() {
        $(this.nav).addClass('is-active');
    }

    deactivateNav() {
        $(this.nav).removeClass('is-active');
    }

    animateEnter() {
        this.add('is-entering');
        setTimeout(function(obj) {
            obj.rm('is-entering');
        }, slideTransition, this);
    }

    animateLeave() {
        this.add('is-leaving');
        setTimeout(function(obj) {
            obj.rm('is-leaving');
        }, slideTransition, this);
    }

    add(cssClass) {
        $(this.slide).addClass(cssClass);
    }

    rm(cssClass) {
        $(this.slide).removeClass(cssClass);
    }
}

// slider with its methods
class Slider {
    constructor(slider) {
        var sliderList = $(slider).find('#sliderList').children();
        var sliderNav = $(slider).find('#sliderNav').children();

        var slides = [];

        // populate slides array
        $(sliderList).each(function( index ) {
            slides.push(new Slide(
                index+1,
                this,
                $(sliderNav[index]).get(0)
            ));
        })

        slides
            .reverse()
            .unshift(slides.pop());

        this.slider = slider;

        this.slideStack = slides;
        this.slideCount = slides.length;
        this.currentSlide = 1;

        this.numChanged = 0;
        this.isAutomatic = true;

        this.setZIndices();
        this.setActiveNav();
    }

    setZIndices() {
        var slideCount = this.slideCount;
        this.slideStack.forEach( function(slide, index) {
            slide.setZIndex( slideCount - index );
        });
    }

    setActiveNav() {
        this.slideStack.forEach( function(slide, index) {
            if( index == 0 ) {
                slide.activateNav();
            } else {
                slide.deactivateNav();
            }
        });
    }

    changeSlides(direction) {
        this.setZIndices();
        this.setActiveNav();

        if(direction == 'backwards') {
            (this.slideStack[ this.slideStack.length - 1 ]).animateLeave();
        } else {
            (this.slideStack[0]).animateEnter();
        }
    }

    slide(id) {

        var intervalId = setInterval( function(obj) {

            if( obj.currentSlide == id ) {
                clearInterval(intervalId);
            }

            if( id > obj.currentSlide ) {
                obj.slideStack.unshift( obj.slideStack.pop() );
                obj.changeSlides('forwards');
            } else {
                obj.slideStack.push( obj.slideStack.shift() );
                obj.changeSlides('backwards');
            }

            obj.currentSlide = obj.slideStack[0].id;
            // console.log(obj.slideStack);

            if( obj.currentSlide == id ) {
                clearInterval(intervalId);
            }

        }, slideDelay, this);

        if( this.numChanged++ >= this.slideCount - 1 ) {
            this.deactivateAutomatic();
        }
    }

    nextSlide() {
        if( this.currentSlide == this.slideCount ) {
            this.slide( 1 )
        } else {
            this.slide( this.currentSlide + 1 )
        }
    }

    previousSlide() {
        if( this.currentSlide == 1 ) {
            this.slide( this.slideCount )
        } else {
            this.slide( this.currentSlide - 1 )
        }
    }

    deactivateAutomatic() {
        if( this.isAutomatic == true ) {
            $(this.slider).removeClass('is-automatic');
            this.isAutomatic = false;
        }
    }

}

$('#sliderNav a').click(function( event ) {
    event.preventDefault();
});


if( $('#slider').length ) {

    var slider = new Slider( $('#slider') );

    $( "[name=sliderBtn]" ).on( "click", function(){
        slider.deactivateAutomatic();
        if( $(this).attr('data') == 'next' ) {
            slider.nextSlide();
        } else {
            slider.previousSlide();
        }
    });

    $('#sliderNav').children().on( "click", function(event){
        event.preventDefault();
        slider.deactivateAutomatic();
        slider.slide( $(this).attr('data') );
    })

    setInterval( function(){
        if( slider.isAutomatic ) {
            slider.nextSlide();
        }
    }, slideDuration );

}
