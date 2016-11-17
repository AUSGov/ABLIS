// JavaScript Document

// Nested Accordion
$(document).ready(function () {
    var parentDivs = $('#nestedAccordion div'),
        childDivs = $('#nestedAccordion h3').siblings('div');
    $('#nestedAccordion h2').click(function () {
		$('#nestedAccordion h2').removeClass('active');
		});
    $('#nestedAccordion h2').click(function () {
        parentDivs.slideUp();
		
        if ($(this).next().is(':hidden')) {
			$(this).addClass('active');
            $(this).next().slideDown();
        } else {
            $(this).next().slideUp();
        }
    });

    $('#nestedAccordion h3').click(function () {
        childDivs.slideUp();
        if ($(this).next().is(':hidden')) {
            $(this).next().slideDown();
        } else {
            $(this).next().slideUp();
        }
    });
});

// Show/hide on "Yes/No" answer in form
$(document).ready(function(){
    $("input:radio").change(function(){
        console.log(this);
        if(this.value == 'Yes' && this.name == 'question1'){
            $('#slidingDiv').slideDown(200);
        }else if(this.value == 'No' && this.name == 'question1'){
            $('#slidingDiv').slideUp(200);
            }
		if(this.value == 'Yes' && this.name == 'question2'){
            $('#slidingDiv2').slideDown(200);
        }else if(this.value == 'No' && this.name == 'question2'){
            $('#slidingDiv2').slideUp(200);
        }
    });
});


// Accordion toggle on Right-hand side panel
$(document).ready(function($) {
    $('#rhs-accordion').find('.accordion-toggle').click(function(){

	//Expand or collapse this panel
	$(this).next().slideToggle('fast');

    //Hide the other panels
    $(".accordion-content").not($(this).next()).slideUp('fast');

     });
});
