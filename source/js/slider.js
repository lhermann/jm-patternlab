/*
 * Joel Media Slider
 * @author: Lukas Hermann
 */

/* Keep in sync with _components.slider.scss */
var sliders = [
    {
        slideDuration:   3000,
        slideTransition: 800,
        slideDelay:      200,
        automatic:       "initial",
        node:            $("#mainSlider"),
        object:          false
    },
    {
        slideDuration:   8000,
        slideTransition: 800,
        slideDelay:      200,
        automatic:       "always",
        node:            $("#quoteSlider"),
        object:          false
    }
]

var slideDuration   = 3000;
var slideTransition = 800;
var slideDelay      = 200;

var mainSlider = $("#mainSlider");
var quoteSlider = $("#quoteSlider");

function mod(n, m) {
    return ((n % m) + m) % m;
}

// holder class for each slide
class Slide {
    constructor(id, slide, nav, slideTransition) {
        this.id = id;
        this.slide = slide;
        this.nav = nav;
        this.class = "";
        this.zIndex = false;
        this.slideTransition = typeof slideTransition === 'number' ? slideTransition : 800;
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
    constructor(slider, slideDelay, slideTransition) {
        var sliderList = $(slider).find('.jsSliderList').children();
        var sliderNav = $(slider).find('.jsSliderNav').children();

        // attach event handler to buttons
        $(".jsSliderBtn").on( "click", this, function(event){
            event.data.deactivateAutomatic();
            if( $(this).attr('data') == 'next' ) {
                event.data.nextSlide();
            } else {
                event.data.previousSlide();
            }
        });

        // attach event handler to slider navigation
        $(".jsSliderNav li").on( "click", this, function(event){
            event.preventDefault();
            event.data.deactivateAutomatic();
            event.data.slide( $(this).attr('data') );
        })

        // populate slides array
        var slides = [];
        $(sliderList).each(function( index ) {
            slides.push(new Slide(
                index+1,
                this,
                $(sliderNav[index]).get(0),
                slideTransition
            ));
        })

        // bring slide array into initial order
        slides
            .reverse()
            .unshift(slides.pop());

        // Slide Stack
        this.slideStack = slides;
        this.slideCount = slides.length;
        this.currentSlide = 1;

        // slider
        this.slider = slider;
        this.numChanged = 0;
        this.isAutomatic = true;

        // timing
        this.slideDelay = typeof slideDelay === 'number' ? slideDelay : 200;

        // setup dom
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

    transitionSlide(direction) {
        this.setZIndices();
        this.setActiveNav();

        if(direction == 'backwards') {
            (this.slideStack[ this.slideStack.length - 1 ]).animateLeave();
        } else {
            (this.slideStack[0]).animateEnter();
        }
    }

    /*
     * Interval Function handles one single slide transition
     */
    intervalFunction(obj, id) {
        if( obj.currentSlide == id ) {
            clearInterval(obj.intervalId);
            return true;
        }

        if( id > obj.currentSlide ) {
            obj.slideStack.unshift( obj.slideStack.pop() );
            obj.transitionSlide('forwards');
        } else {
            obj.slideStack.push( obj.slideStack.shift() );
            obj.transitionSlide('backwards');
        }

        obj.currentSlide = obj.slideStack[0].id;

        if( obj.currentSlide == id ) {
            clearInterval(obj.intervalId);
            return true;
        }
        return false;
    }

    /*
     * Change to slide with id
     */
    slide(id) {

        this.intervalFunction(this, id);
        this.intervalId = setInterval( this.intervalFunction, this.slideDelay, this, id);

        if( this.numChanged++ >= this.slideCount - 1 ) {
            this.deactivateAutomatic();
        }
    }

    /*
     * Change to next slide
     */
    nextSlide() {
        if( this.currentSlide == this.slideCount ) {
            this.slide( 1 )
        } else {
            this.slide( this.currentSlide + 1 )
        }
    }

    /*
     * Change to previous slide
     */
    previousSlide() {
        if( this.currentSlide == 1 ) {
            this.slide( this.slideCount )
        } else {
            this.slide( this.currentSlide - 1 )
        }
    }

    /*
     * Deactivate automatic changing of slides
     */
    deactivateAutomatic() {
        if( this.isAutomatic == true ) {
            $(this.slider).removeClass('is-automatic');
            this.isAutomatic = false;
        }
    }

}





$(".jsSliderNav a").click(function( event ) {
    event.preventDefault();
});

sliders.forEach(function(slider) {

    if( $(slider.node).length ) {

        slider.object = new Slider( slider.node, slider.slideDelay, slider.slideTransition );

        switch(slider.automatic) {
            case "initial":
                setInterval( function(){
                    if( slider.object.isAutomatic ) {
                        slider.object.nextSlide();
                    }
                }, slider.slideDuration );
                break;

            case "always":
                setInterval( function(){
                    slider.object.nextSlide();
                }, slider.slideDuration );
                break;
        }

    }

});
