
import $ from 'cash-dom';
import Popper from 'popper.js';

$(document).ready(function(){

    $(".jsDropdown").each( function(dropdown, i) {

        var btn = $(dropdown).parent().find(".jsDropdownBtn").get(0);

        $(btn).on("click", function(){
            $(dropdown).toggleClass("u-hidden");
            if( $(this).attr("aria-expanded") == "false" ) {
                $(this).attr("aria-expanded", "true");
            } else {
                $(this).attr("aria-expanded", "false");
            }
        });

        var popper = new Popper(
            btn,
            dropdown,
            {
                placement: 'bottom-start'
            }
        );

    });

});
