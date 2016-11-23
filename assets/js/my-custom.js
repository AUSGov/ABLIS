// ABLIS Custom functions, wrapped in own namespace
//
//check if namespace already exists - do not clobber
var industry = industry || {};
// perform a similar existence check when defining nested children
industry.ABLIS = industry.ABLIS | {};

//industry.ABLIS = (function() {
industry.ABLIS = {

    CloseSystemMessage: function () {
        // To close system message
        $(".closeSystemMessage")
            .click(function() {
                console.log("in close");
                $(".dashboard-message").slideUp();
                $(".system-message").slideUp();
            });
    },

    ToggleNestedAccordion: function() {
        var parentDivs = $('#nestedAccordion div'),
        childDivs = $('#nestedAccordion h3').siblings('div');

        // Open or close parent accordion
        $('#nestedAccordion h2').click(function () {
            $(this).find('i').toggleClass('fa-chevron-up fa-chevron-down');
            $('#nestedAccordion h2').removeClass('active');
            parentDivs.slideUp();

            if ($(this).next().is(':hidden')) {
                $(this).addClass('active');
                $(this).next().slideDown();
            } else {
                $(this).next().slideUp();
            }
        });

        // Open or close child accordion
        $('#nestedAccordion h3').click(function () {
            $(this).find('i').toggleClass('fa-chevron-up fa-chevron-down');
            childDivs.slideUp();
            if ($(this).next().is(':hidden')) {
                $(this).next().slideDown();
            } else {
                $(this).next().slideUp();
            }
        });
        /*$('#nestedAccordion h3').click(function(){
        var collapsed=$(this).find('i').hasClass('fa-chevron-down');

        $('#nestedAccordion h3').find('i').removeClass('fa-chevron-up');

        $('#nestedAccordion h3').find('i').addClass('fa-chevron-up');
        if(collapsed)
        $(this).find('i').toggleClass('fa-chevron-up fa-chevron-down')
        });*/
    },

    ToggleYesNoAnswers: function () {
        // Show/hide on "Yes/No" answer in form
        $("input:radio").change(function () {
            console.log(this);
            if (this.value == 'Yes' && this.name == 'question1') {
                $('#slidingDiv').slideDown(200);
            } else if (this.value == 'No' && this.name == 'question1') {
                $('#slidingDiv').slideUp(200);
            }
            if (this.value == 'Yes' && this.name == 'question2') {
                $('#slidingDiv2').slideDown(200);
            } else if (this.value == 'No' && this.name == 'question2') {
                $('#slidingDiv2').slideUp(200);
            }
        });
    },

    ToggleDisplayUserDetailsPanel: function () {
        // Accordion toggle on Right-hand side panel
        $('#rhs-accordion').find('.accordion-toggle').click(function () {
            $(this).next().slideToggle('fast');
            $(this).find('i').toggleClass('fa-chevron-up fa-chevron-down')
        });
        /* Accordion toggle on Right-hand side panel
            $('#rhs-accordion').find('.accordion-toggle').click(function(){
        
            //Expand or collapse this panel
            $(this).next().slideToggle('fast');
        
            //Hide the other panels
            $(".accordion-content").not($(this).next()).slideUp('fast');
        
             });
        */
    },

    SystemWarningMessageCookie: function() {
        // temporary system warning message - session cookie code

        //TODO: SystemWarningMessageCookie - NOT SURE WHAT THIS LINE IS USED FOR, but html is undefined error if left in:
        //$("header").after(html);

        $("#dismiss-system-message").click(function () {
            $("#system-message").slideUp(200);
            document.cookie = "testMessageVisible=hide";
        });

        if (Cookies.get('testMessageVisible') === 'undefined') {
            //no cookie
        } else {
            //have cookie
            if (Cookies.get('testMessageVisible') != "hide") {
                $("#system-message").show();
            }
        }
       
       /* if (typeof document.cookie('testMessageVisible') === 'undefined') {
            //no cookie
        } else {
            //have cookie
            if (getCookie("testMessageVisible") != "hide") {
                $("#system-message").show();
            }
        }*/
    }
};
//})();


jQuery(document).ready(function ($) {

    //TODO: Javascript document ready - check path to determine if the below function needs to be called on EVERY page load or just the one it refers to:

    //console.log("in");

    industry.ABLIS.CloseSystemMessage();

    industry.ABLIS.ToggleNestedAccordion();
    
    industry.ABLIS.ToggleYesNoAnswers();

    industry.ABLIS.ToggleDisplayUserDetailsPanel();

    industry.ABLIS.SystemWarningMessageCookie();

});
