/* jQuery(document).ready(function ($) {
    //console.log("in");
    CloseSystemMessage();
	
	// temporary system warning message - session cookie code
	$("header").after(html);
	$("#dismiss-system-message").click(function() {
		$("#system-message").slideUp(200);
		document.cookie="testMessageVisible=hide";
	});

	if (getCookie("testMessageVisible") != "hide") {
		$("#system-message").show();
	}	
});

function CloseSystemMessage() {
    $(".closeSystemMessage").click(function () {
        console.log("in close");
        $(".dashboard-message").slideUp();
        $(".system-message").slideUp();
    });
}*/


function initialiseRegistrationCollapse(speed, openTheFristSection) {
    if (speed === undefined) {
        speed = 150;
    }
    var section = null;
    section = new jQueryCollapse($(".sub-section-container"), {
        open: function () {
            if (!$(this).is(":visible")) {
                $(".sub-section-open").removeClass('sub-section-open');
                this.slideDown(speed);
                var index = $("div.sub-section-content").index(this);
                section.closeOther(index); // close all other sections
                $(this).parent().addClass("sub-section-open");
                $("h2:first").focus();

                // scroll to top if the page is super long
                var targetTop = $(this).parent().offset().top;
                jQuery('html, body').animate({
                    scrollTop: targetTop
                }, 1200);
            }
        },
        close: function () {
            if ($(this).is(":visible")) {
                $(this).parent().removeClass("sub-section-open");
                this.slideUp(speed);
            }
        }
    });
    if (openTheFristSection) {
        section.sections[0].open(true);
    }
    $("a:contains('Next')").click(function () {
        $(this).closest(".sub-section-content").slideUp("", function () {
            $(".sub-section-open").removeClass("sub-section-open");
            var index = $("div.sub-section-content").index(this);
            section.close();
            section.open(index + 1);
        });
    });
    return section;
}

function clearElement(element, classNameToBeHidden) {
    $(element).children().each(function () {
        $(this).find("input, select, textarea").not("input[type=checkbox], input[type=radio], input[type=button], input[type=submit]").val("");
        $(this).find("input[type=checkbox], input[type=radio]").prop("checked", false);
        if (classNameToBeHidden !== undefined && classNameToBeHidden.length > 0) {
            $(classNameToBeHidden).hide();
        }
    });
}

function loadHelpContent(url) {
    $("#helpFile").load(url + "?t=" + (new Date()).getTime(), function () {
        setTimeout(initHelp, 10);
    });    
}

function notifyGAofHelpRequest(href) {
	var helpKey = href.substring(href.indexOf("#help-")+6);
    if (helpKey.length > 0 && typeof(ga) != "undefined") {
		console.log("Helplink followed: " + helpKey);
        // ga('send', 'event', {
            // eventCategory: 'Help Link',
            // eventAction: 'click',
            // eventLabel: helpKey
        // });
    }
}

function initHelp(helpID, linkClass) {
    // default values when none provided:
    helpID = helpID ? helpID : "#help";
    linkClass = linkClass ? linkClass : ".cd-btn, .cd-help-link";

    /* Expand collapse headings config */
    var help = new jQueryCollapse($(helpID).find(".showhide"), {
        query: 'h3',
        open: function () {
            this.slideDown(150);
        },
        close: function () {
            this.slideUp(150);
        }
    });
    $(helpID).find('.cd-panel').on('click', function (event) {
        if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
            help.close();
            $(helpID).find('.cd-panel').removeClass('is-visible');
            event.preventDefault();
            help.element.focus();
        }
    });
    $(linkClass).on('click', function (event) {
        help.element = $(this);
        var href = $(this).attr("href");
        notifyGAofHelpRequest(href);
        var helpAnchors = $(helpID + " .help-anchor");
        var anchor = helpAnchors.eq(helpAnchors.index($(href)));
        var section = anchor.nextAll("h3").first();
        var index = $(helpID + " h3").index($(section));
        //var index = $(helpID + " .help-anchor").index($(href));
        $(helpID + " .cd-panel-content").scrollTop(0);
        help.open(index);
        event.preventDefault();
        $(helpID).find('.cd-panel').addClass('is-visible').promise().done(function() {
            window.setTimeout(function () {
                scrollInParent($(helpID + " h3.open"));
                $(helpID + " h3.open a").focus();
            }, 500);
        });
    });

    $(helpID).keydown(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 9) {
            var links = $(helpID).find("a:visible");
            var index = links.index(e.target);
            index += e.shiftKey ? -1 : 1;
            //alert($(e.target).html() + ": " + index);
            if (index < 0 || index >= links.length) {
                help.close();
                $(helpID).find('.cd-panel').removeClass('is-visible');
                e.preventDefault();
                help.element.focus();
            }
        }
    });
}
function initSaveForLater() {
    $("#saveForLater").load("save-for-later-content.html?t=" + (new Date()).getTime(), function () {
        setTimeout(function() {
            var saveForLater = new jQueryCollapse($("#saveForLater").find(".saveforlater"), {
                open: function () {
                    this.slideDown(150);
                },
                close: function () {
                    this.slideUp(150);
                }
            });
            $("#saveForLater").find('.cd-panel').on('click', function (event) {
                if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ||
                    $(event.target).is('#save-cancel') || $(event.target).is('#save-save')) {
                    saveForLater.close();
                    $("#saveForLater").find('.cd-panel').removeClass('is-visible');
                    event.preventDefault();
                    $('#settings').toggle();
                }
            });
            $('.btn-save').on('click', function (event) {
                saveForLater.open();
                event.preventDefault();
                $('#settings').toggle();
                $("#saveForLater").find('.cd-panel').addClass('is-visible');$("#saveForLater").find('.cd-panel').addClass('is-visible');
            });
        }, "10");
    });    
}

function initApplicationOptions() {
    $("#applicationOptions").load("application-options-content.html?t=" + (new Date()).getTime(), function () {
        setTimeout(function() {
            var applicationOptions = new jQueryCollapse($("#applicationOptions").find(".applicationoptions"), {
                open: function () {
                    this.slideDown(150);
                },
                close: function () {
                    this.slideUp(150);
                }
            });
            $("#applicationOptions").find('.cd-panel').on('click', function (event) {
                if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
                    applicationOptions.close();
                    $("#applicationOptions").find('.cd-panel').removeClass('is-visible');
                    event.preventDefault();
                    $('#settings').toggle();
                }
            });
            $('.btn-options').on('click', function (event) {
                applicationOptions.open();
                event.preventDefault();
                $('#settings').toggle();
                $("#applicationOptions").find('.cd-panel').addClass('is-visible');
            });
        }, "10");
    });    
}

function GetCheckedItems(elementId) {
    var checkedCount = 0;
    elementId = (elementId.indexOf("#") >= 0) ? elementId : "#" + elementId;
    $(elementId).find(":checkbox").each(function (index, item) {
        if ($(item).prop("checked")) {
            checkedCount++;
        }
    });

    $(elementId).find(":radio").each(function (index, item) {
        if ($(item).prop("checked")) {
            checkedCount++;
        }
    });
    return checkedCount;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function navigationWithinPage() {
    $(".next").click(function (event) {
		if (event.isDefaultPrevented())
			return;
        // get the index of current button in whole list of buttons with class '.next'
        var index = $(".next").index(this);
        $.each($(".sub-section-container"), function (i, item) {
            if (index === i) {
                $(item).find("div").first().slideUp("slow", function () {
                    $(item).removeClass("sub-section-open").addClass("sub-section-done"); // add class for your need.
                    
//                    setTimeout(function(){
                        $(item).next(".sub-section-container").addClass("sub-section-open").find("div").first().slideDown("slow", function() {
							var targetTop = $(this).prev().offset().top;
							$('html, body').animate({
								scrollTop: targetTop
							}, 100);
						}); 
 //                   }, 100); // add class for your need.;
                });

            }
        });

    });

    $(".previous").click(function (event) {
		if (event.isDefaultPrevented())
			return;
        // get the index of current button in whole list of buttons with class '.next'
        var index = $(".previous").index(this);
        $.each($(".sub-section-container"), function (i, item) {
            if (index === i) {
				$(item).next(".sub-section-container").removeClass("sub-section-open").find("div").first().slideUp("slow", function() {
					$(item).removeClass("sub-section-done").addClass("sub-section-open").find("div").first().slideDown("slow", function () {
						var targetTop = $(this).prev().offset().top;
						$('html, body').animate({
							scrollTop: targetTop
						}, 100);
					});
                });
            }
            
        });

    })
}

/* test system warning message - session cookie */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

var html = '<div id="system-message" class="system-message wrapper" style="margin-top: 0; display: none">'
		 + '<div class="system-message-content">'
		 + '<h1>Prototype system</h1>'
		 + '<p>You are currently viewing an instance of the ABLIS web site that has been activated for usability testing. This is not a production system, and any activities carried out in this environment will not result in any live application lodgements.</p>'
		 + '<p>For more information about when the new web site will be available, see <a href="https://www.business.gov.au/for-government/streamlining-business-registration">business.gov.au</a>.'
		 + '</p></div>'
		 + '<button id="dismiss-system-message" class="closeSystemMessage" type="button">Dismiss</button>'
		 + '</div><div class="environment">'
		 + '<p><strong>PROTOTYPE</strong></p>'
		 + '</div>';



/*
* jQuery Dropdown: A simple dropdown plugin
*
* Contribute: https://github.com/claviska/jquery-dropdown
*
* @license: MIT license: http://opensource.org/licenses/MIT
*
*/
jQuery && function ($) { function t(t, e) { var n = t ? $(this) : e, d = $(n.attr("data-jq-dropdown")), a = n.hasClass("jq-dropdown-open"); if (t) { if ($(t.target).hasClass("jq-dropdown-ignore")) return; t.preventDefault(), t.stopPropagation() } else if (n !== e.target && $(e.target).hasClass("jq-dropdown-ignore")) return; o(), a || n.hasClass("jq-dropdown-disabled") || (n.addClass("jq-dropdown-open"), d.data("jq-dropdown-trigger", n).show(), r(), d.trigger("show", { jqDropdown: d, trigger: n })) } function o(t) { var o = t ? $(t.target).parents().addBack() : null; if (o && o.is(".jq-dropdown")) { if (!o.is(".jq-dropdown-menu")) return; if (!o.is("A")) return } $(document).find(".jq-dropdown:visible").each(function () { var t = $(this); t.hide().removeData("jq-dropdown-trigger").trigger("hide", { jqDropdown: t }) }), $(document).find(".jq-dropdown-open").removeClass("jq-dropdown-open") } function r() { var t = $(".jq-dropdown:visible").eq(0), o = t.data("jq-dropdown-trigger"), r = o ? parseInt(o.attr("data-horizontal-offset") || 0, 10) : null, e = o ? parseInt(o.attr("data-vertical-offset") || 0, 10) : null; 0 !== t.length && o && t.css(t.hasClass("jq-dropdown-relative") ? { left: t.hasClass("jq-dropdown-anchor-right") ? o.position().left - (t.outerWidth(!0) - o.outerWidth(!0)) - parseInt(o.css("margin-right"), 10) + r : o.position().left + parseInt(o.css("margin-left"), 10) + r, top: o.position().top + o.outerHeight(!0) - parseInt(o.css("margin-top"), 10) + e } : { left: t.hasClass("jq-dropdown-anchor-right") ? o.offset().left - (t.outerWidth() - o.outerWidth()) + r : o.offset().left + r, top: o.offset().top + o.outerHeight() + e }) } $.extend($.fn, { jqDropdown: function (r, e) { switch (r) { case "show": return t(null, $(this)), $(this); case "hide": return o(), $(this); case "attach": return $(this).attr("data-jq-dropdown", e); case "detach": return o(), $(this).removeAttr("data-jq-dropdown"); case "disable": return $(this).addClass("jq-dropdown-disabled"); case "enable": return o(), $(this).removeClass("jq-dropdown-disabled") } } }), $(document).on("click.jq-dropdown", "[data-jq-dropdown]", t), $(document).on("click.jq-dropdown", o), $(window).on("resize", r) }(jQuery);
