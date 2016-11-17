/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/

'use strict';
$(document).ready(function() {
    $(".custom-controls input[type=file]").each(function() {
        var $input = $(this),
            $label = $input.next("label"),
            labelVal = $label.html();

        $label.html($("<strong></strong>").text(labelVal));
        $label.prepend($("<span></span>"));

        $input.on("change", function(e) {
            var fileName = "";

            if (this.files && this.files.length > 1)
                fileName = (this.getAttribute("data-multiple-caption") || "").replace("{count}", this.files.length);
            else if (e.target.value)
                fileName = e.target.value.split("\\").pop();

            $label.find("span").html(fileName);
        });

        // Firefox bug fix
        $input
            .on("focus", function() { $input.addClass("has-focus"); })
            .on("blur", function() { $input.removeClass("has-focus"); });
    });
});