/**
 * Add class .is-faded to all Siblings during hover
 *
 */

$(".jsFadeSiblings").on("mouseenter mouseleave", function(e){
    var siblings = $(this).siblings(".jsFadeSiblings");
    if( !siblings[0] ) siblings = $(this).parent().siblings().children(".jsFadeSiblings");
    if( e.type == "mouseenter" ) {
        $(siblings).addClass("is-faded");
    } else {
        $(siblings).removeClass("is-faded");
    }

});
