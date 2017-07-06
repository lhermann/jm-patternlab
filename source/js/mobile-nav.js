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

/**
 * Enable/Disable scrolling on #siteWrapper when mobile nav is open
 * on iPhone/iPad’s Safari
 */
var siteWrapper = document.getElementById("siteWrapper");
siteWrapper.ontouchmove = function (e) {
    if(allowScrolling) {
        return true; // Enable scrolling.
    } else {
        e.preventDefault(); // Disable scrolling.
    }
}


