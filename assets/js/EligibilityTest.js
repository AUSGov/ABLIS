// Eligibility
function checkEligibility() {
    $("#validation").hide();
    $("#validation-list").html("");

    var IsEmployeeValid = IsValid("employee");
    var IsOverseasValid = IsValid("overseas");
    var IsOtherValid = IsValid("other");

    if (IsEmployeeValid && IsOverseasValid && IsOtherValid) {
        var isEligibilityEmployee = $("#employee-no").is(':checked');
        var isEligibilityOverseas = $("#overseas-no").is(':checked');
        var isEligibilityOther = $("#other-no").is(':checked');

        if (isEligibilityEmployee && isEligibilityOverseas && isEligibilityOther) {
            window.location.href = "registration-discovery.html";
        }
        else {
            $('#eligibilityTest').toggle();
            $('#eligibilityResult').toggle();
            if (!isEligibilityEmployee) {
                $('#eligibilityResultEmployee').show();
            }
            else {
                $('#eligibilityResultEmployee').hide();
            }
            if (!isEligibilityOverseas) {
                $('#eligibilityResultOverseas').show();
            }
            else {
                $('#eligibilityResultOverseas').hide();
            }
            if (!isEligibilityOther) {
                $('#eligibilityResultOther').show();
            }
            else {
                $('#eligibilityResultOther').hide();
            }
        }
    }
}

function showEligibilityTest() {
    $('#eligibilityTest').toggle();
    $('#eligibilityResult').toggle();
}


function initEligibilityPage() {
    //if (document.referrer != undefined && document.referrer.indexOf("discovery.html") > 0) {
    //    $('input[type=radio][value=no]').prop('checked', true);
    //}
    applyStyle();
}

function IsValid(id) {
    if (getValueFromRadioButton(id) == undefined) {
        $("#validation-list").append("<li><a class='scroll' href='#" + id + "'>" + $("#" + id).html() + "</a></li>");
        $("#validation").show();
        $(window).scrollTop($('#validation').offset().top);
        $(".scroll").click(function (event) {
            event.preventDefault();
            var full_url = this.href;
            var parts = full_url.split("#");
            var trgt = parts[1];
            var target_offset = $("#" + trgt).offset();
            var target_top = target_offset.top;
            jQuery('html, body').animate({ scrollTop: target_top }, 1200);
        });
        return false;
    }
    return true;
}


function applyStyle() {
    $('.cd-btn').on('click', function (event) {
        var index = $("a.cd-btn").index(this);
        help.open(index);
        event.preventDefault();
        $('.cd-panel').addClass('is-visible');
    });
    $('.cd-panel').on('click', function (event) {
        if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
            help.close();
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
        }
    });

    /* Expand collapse headings config */
    help = new jQueryCollapse($(".showhide"), {
        open: function () {
            this.slideDown(150);
            $("#helpTopic").focus();
        },
        close: function () {
            this.slideUp(150);
        }
    });
}
function getValueFromRadioButton(name) {
    return $('input[name=' + name + ']:checked').val();
}

function printHelp() {

    $('#help').printThis({
        importCSS: false,
        //printContainer: true,
        //debug: true,
        loadCSS: [window.location.protocol + '//' + location.host + "/registration2/css/help.css", ]
    });

    return false;
}
// End Eligibility