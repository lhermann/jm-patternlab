
/*
 * Initiate variables
 * 1. Width of one of the nav buttons
 */
var overflowNavWidth = 42, /* 1 */
    overflowArray = [];

/*
 * Class for .o-overflow objects
 */
class Overflow {
    constructor(container) {
        this.container     = container;
        this.content       = $(container).children(".o-overflow__content").get(0);
        this.count         = $(this.content).children().length;
        this.childrenWidth = $(this.content).children().first().width();
        this.spaceBetween  = $(this.content).data("space-between");
        this.innerWidth    = this.count * this.childrenWidth + (this.count - 1) * this.spaceBetween;
        this.currentPos    = 0;
        this.state         = "is-left";
        this.updateContainerWidth();

        $(container).find(".jsNavLeft").on( "click", this, function(event){
            event.data.shiftLeft();
        });

        $(container).find(".jsNavRight").on( "click", this, function(event){
            event.data.shiftRight();
        });
    }

    getShiftWidth() {
        var shiftCount = Math.round( (this.outerWidth - overflowNavWidth) / (this.childrenWidth + this.spaceBetween));
        if( this.state == "is-left" || this.state == "is-right" ) {
            return (this.childrenWidth + this.spaceBetween) * shiftCount - (overflowNavWidth + this.spaceBetween/2);
        } else {
            return (this.childrenWidth + this.spaceBetween) * shiftCount;
        }
    }

    shiftRight() {
        var shift = this.getShiftWidth();
        if( this.currentPos + shift >= this.innerWidth - this.outerWidth ) {
            this.currentPos = this.innerWidth - this.outerWidth;
        } else {
            this.currentPos += shift;
        }
        this.setContentX( this.currentPos );
        this.updateContainerState();
    }

    shiftLeft() {
        var shift = this.getShiftWidth();
        if( this.currentPos - shift <= 0 ) {
            this.currentPos = 0;
        } else {
            this.currentPos -= shift;
        }
        this.setContentX( this.currentPos );
        this.updateContainerState();
    }

    setContentX(x) {
        $(this.content).css( "transform", "translateX(-" + x + "px)" );
    }

    updateContainerState() {
        $(this.container).removeClass( this.state );
        if( this.currentPos === 0 ) {
            $(this.container).addClass( "is-left" );
            this.state = "is-left";
        } else if( this.currentPos >= this.innerWidth - this.outerWidth ) {
            $(this.container).addClass( "is-right" );
            this.state = "is-right";
        } else {
            $(this.container).addClass( "is-middle" );
            this.state = "is-middle";
        }
    }

    updateContainerWidth() {
        this.outerWidth = $(this.container).width();
        if( this.currentPos > this.innerWidth - this.outerWidth ) {
            this.currentPos = this.innerWidth - this.outerWidth;
            this.setContentX( this.currentPos );
        }
        this.updateContainerState();
    }
}

/*
 * Initiate objects for overflow elements
 */
$(".o-overflow").each( function(i, element) {
    overflowArray.push( new Overflow(element) );
});

/*
 * Adapt responsively to viewport changes
 */
$( window ).resize(function() {
    overflowArray.forEach( function(overflow) {
        overflow.updateContainerWidth();
    })
});
