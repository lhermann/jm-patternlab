/**
 * open and close mobile nav
 */
var allowScrolling = true;

$( "[name=mobieNavBtn]" ).on( "click", toggleMobileNav );

function toggleMobileNav( event ) {
    if( $(this).attr('data') == 'open' ) {
        $('html').addClass('is-mobile-nav-open');
        allowScrolling = false;
    } else {
        $('html').removeClass('is-mobile-nav-open');
        allowScrolling = true;
    }
}

// Enable/Disable Scrolling in iPhone/iPad’s Safari
document.ontouchmove = function (e) {
    if(allowScrolling) {
        // Enable scrolling.
        return true;
    } else {
        // Disable scrolling.
        e.preventDefault();
    }
}


