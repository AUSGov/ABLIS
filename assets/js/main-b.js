
/* data */

var businessStructure = {
    "name": "Business structure",
    "helpFile": "business_structure_help.html",
    "contentFile": "business_structure_question.html"
};

var activity_gst = { "name": "Goods & Services Tax (GST)", "helpFile": "activity_gst_help.html", "contentFile": "activity_gst_question.html" };
var activity_tax = { "name": "Other taxes", "helpFile": "activity_tax_help.html", "contentFile": "activity_tax_question.html" };
var finished = { "name": "Registration summary", "helpFile": "finished_help.html", "contentFile": "finished_content.html" };
var actions = { "eligibilityStep": "eligibility", "businessStructureStep": "businessStructure", "businessNameStep": "name", "employeeStep": "employee", "activityGSTStep": "activityGST", "activityTaxStep": "activityTax", "finishedStep": "finished", "helpMeDecideStep": "helpMeDecide", "helpMeDecideSelectStep": "helpMeDecideSelect", "helpMeDecideResultStep": "helpMeDecideResultStep" }

var helpMeDecide = {
    "name": "Business structure - help me decide",
    "helpFile": "helpmedecide_question_help.html",
    "contentFile": "helpmedecide_question.html",
    "helpMeDecideResult": {
    	"name": "Business structure",
    	"helpFile": "helpmedecide_result_content.html",
    	"contentFile": "helpmedecide_result_content.html"
    }
};

var soleTraderOrCompany = {
	"name": "Choose a structure",
	"helpFile": "soleTraderOrCompany_help.html",
	"contentFile": "soleTraderOrCompany_content.html",
	"soleTraderOrCompanyResult": {
		"name": "Business structure",
		"helpFile": "soleTrader_help.html",
		"contentFile": "soleTrader_content.html"
	}
};

var partnershipOrCompany = {
	"name": "Choose a structure",
	"helpFile": "partnershipOrCompany_help.html",
	"contentFile": "partnershipOrCompany_content.html",
	"partnershipOrCompanyResult": {
		"name": "Business structure",
		"helpFile": "partnership_help.html",
		"contentFile": "partnership_content.html"
	}
};

var registrations = null;

var applicationType = null;
var soleTraderName = "Sole trader";
var partnershipName = "Partnership";
var companyName = "Company";

var previousAction = "";
var nextAction = "";
var currentAction = "";

var help;
var step = 0;
var maxStep = 6;
var calculator = new HelpMeDecideCalculator();
var isTrust = false,
    isCompany = false,
    isPartnership = false,
    isSoleTrader = false;
var isHelpMeDecidUsed = false;
/* End of data */

function initializeRegistrationOptions() {
    registrations = {
        "isGST": false,
        "isPAYG": false,
        "isFBT": false,
        "isLCT": false,
        "isFTC": false,
        "isWET": false,
        "isBusinessName": false,
        "isCompany": false,
        "isTFN": false
    };
}
function initializeApplicationType(typename) {
    isTrust = false;
    initializeRegistrationOptions();
    switch (typename) {
        case soleTraderName:
            applicationType = {
                "name": soleTraderName,
                "helpFile": "business_structure_help.html",
                "contentFile": "business_structure_question.html",
                "nameApplication": { "name": "Business name", "helpFile": "name_help.html", "contentFile": "soleTrader_name_question.html" },
                "employee": { "name": "Employees", "helpFile": "employee_help.html", "contentFile": "employee_question.html" },
            };
            break;
        case partnershipName:
            applicationType = {
                "name": partnershipName,
                "helpFile": "business_structure_help.html",
                "contentFile": "business_structure_question.html",
                "nameApplication": { "name": "Business name", "helpFile": "name_help.html", "contentFile": "partnership_name_question.html" },
                "employee": { "name": "Employees", "helpFile": "employee_help.html", "contentFile": "employee_question.html" },
            };
            break;
        case companyName:
            applicationType = {
                "name": companyName,
                "helpFile": "business_structure_help.html",
                "contentFile": "business_structure_question.html",
                "nameApplication": { "name": "Business name", "helpFile": "name_help.html", "contentFile": "company_name_question.html" },
                "employee": { "name": "Employees", "helpFile": "employee_help.html", "contentFile": "company_employee_question.html" },
            };
            break;
    }
}

function loadQuestionHelp(applicationStep, callback) {
    var templateHelpDirectory = "../templates/help/";
    var templateQuestionsDirectory = "../templates/questions/";
    $("#heading").html(applicationStep.name);
    $("#helpTopic").html("Help topics");
    $('#next').prop('disabled', true);
    $('#previous').prop('disabled', true);
    //$("#heading").focus();

	// clear content and display loading gif:
	$('#questions').html(''); // '<div style="width: 100%; height:200px;"><img src="../../../business-registration/assets/assets/img/ico-loading.gif" style="display: block; margin: 75px auto;"></div>');

	// load help first to hopefully minimise any timing issues:
    if (applicationStep.helpFile.length > 0) {
        $("#helpFile").load(templateHelpDirectory + applicationStep.helpFile + "?t=" + (new Date()).getTime(), function () {
            // setTimeout(applyStyle, 10);
            applyStyle();
        });
    }
    
    if (applicationStep.contentFile.length > 0) {
        $("#questions").load(templateQuestionsDirectory + applicationStep.contentFile + "?t=" + (new Date()).getTime(), function () {
            setTimeout(callback, 0);
            setTimeout(function () {
                $('.cd-btn').on('click', function (event) {
                    var index = $("a.cd-btn").index(this);
                    // this is for registrations help content
                    if (applicationStep.name === "Registration summary") {
                        index = $(this)[0].id;
                    }
					notifyGAofHelpRequest($(this).attr("href"));
                    help.open(index);
                    var heading = $('#helpFile h3')[index];
                    event.preventDefault();
                    $('.cd-panel').addClass('is-visible');
//                    $('#settings').toggle(function () {
                    	// move open topic to top:
	                    $('.cd-panel-content').animate({
	                    	scrollTop: heading.offsetTop
	                    }, 200, function() {
							$(heading).find('a').focus();
						});
	                });
//                });
            }, 10);
			$('#next').prop('disabled', false);
			$('#previous').prop('disabled', false);
        });
    }

}

function applyStyle() {
    $('.cd-panel').on('click', function (event) {
        if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
            help.close();
            $('.cd-panel').removeClass('is-visible');
            $('#settings').toggle();
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


function manageState(action) {
    $("#validation").hide();
    if ($("#next").html() !== "Next") {
        $("#next").html("Next");
    }
    // set current action:
    currentAction = action;
    switch (action) {
        case actions.eligibilityStep:
            window.location = "eligibility.html";
            break;
        case actions.businessStructureStep: // choose business structure
            loadQuestionHelp(businessStructure, prepareBusinessStructurePage);
            break;
        case actions.helpMeDecideStep:
            loadQuestionHelp(helpMeDecide, prepareHelpMeDecide);
            break;
        case actions.helpMeDecideSelectStep:
        	if (isTrust) {
        		currentAction = actions.helpMeDecideResultStep;
        		loadQuestionHelp(helpMeDecide.helpMeDecideResult, prepareHelpMeDecideResult);
        	}
        	else if (calculator.manyOwners == 1) {
				// sole trader or company
				loadQuestionHelp(soleTraderOrCompany, prepareHelpMeDecideSelect);
			}
			else
			{
				// partnership or company
				loadQuestionHelp(partnershipOrCompany, prepareHelpMeDecideSelect);
			}
            break;
        case actions.helpMeDecideResultStep:
        	loadQuestionHelp(helpMeDecide.helpMeDecideResult, prepareHelpMeDecideResult);
            break;
        case actions.businessNameStep:
            loadQuestionHelp(applicationType.nameApplication, prepareNamePage);
            break;
        case actions.employeeStep:
            loadQuestionHelp(applicationType.employee, prepareEmployeePage);
            break;
        case actions.activityGSTStep:
            loadQuestionHelp(activity_gst, prepareActivityGSTPage);
            // $("#next").html("Next");
            break;
        case actions.activityTaxStep:
            loadQuestionHelp(activity_tax, prepareActivityTaxPage);
            // $("#next").html("Next");
            break;
        case actions.finishedStep:
            // based on user selection, generated the registrations form (those user needs to applied will be ticked)
            loadQuestionHelp(finished, showResults);
            $("#next").html("Start applying");
//            $("#next").off('click');
//            $("#next").click(function() {
//            	queryStr = "?type=";
//            	var first = true;
//            	$("input[type=checkbox]:checked").each(function(i, item) {
//            		first?first=false:queryStr+=',';
//            		queryStr += item.id;
//            	});
//            	location.href = "../register.html" + queryStr;
//            });
            break;
    }
}

// callbacks

// prepare the business structure page ---- > step 1
function prepareBusinessStructurePage() {
    // make sure the calculation is correct.
    step = 1;
    calculateCompletion();
    previousAction = actions.eligibilityStep;
    nextAction = actions.businessNameStep;
    
    if (applicationType != null) {
        if (applicationType.name === soleTraderName) {
            $("#structure-sole").prop('checked', true);
        }
        else if (applicationType.name === partnershipName) {
            $("#structure-partnership").prop('checked', true);
        }
        else if (applicationType.name === companyName) {
            $("#structure-company").prop('checked', true);
        }

        setBusStructTipStatus();
    }

    if (isHelpMeDecidUsed) {
        $("#structure-not-sure").prop('checked', true);
        nextAction = actions.helpMeDecideStep;
    }

    $("#structure-sole").on('click', function () {
        initializeApplicationType(soleTraderName);
        isHelpMeDecidUsed = false;
        nextAction = actions.businessNameStep;
        calculator = new HelpMeDecideCalculator();
        setBusStructTipStatus();
    });

    $("#structure-partnership").on('click', function () {
        initializeApplicationType(partnershipName);
        registrations.isTFN = true;
        isHelpMeDecidUsed = false;
        calculator = new HelpMeDecideCalculator();
        nextAction = actions.businessNameStep;
        setBusStructTipStatus();
   });

    $("#structure-company").on('click', function () {
        initializeApplicationType(companyName);
        registrations.isCompany = true;
        registrations.isTFN = true;
        isHelpMeDecidUsed = false;
        calculator = new HelpMeDecideCalculator();
        nextAction = actions.businessNameStep;
        setBusStructTipStatus();
    });

    $("#structure-trust").on('click', function () {
        isHelpMeDecidUsed = false;
        calculator = new HelpMeDecideCalculator();
        isTrust = true;
        applicationType = null;
        setBusStructTipStatus();
   });

    $("#structure-not-sure").on('click', function () {
        nextAction = actions.helpMeDecideStep;
        isHelpMeDecidUsed = true;
        isTrust = false;
        applicationType = null;
        setBusStructTipStatus();
   });
}

function setBusStructTipStatus() {
	if (applicationType == null) {
		$('#div-bus-tip').hide();
		$('#help-abn').hide();
		$('#help-tfn').hide();
		$('#help-company').hide();
		return;
	}

	// base options:
	$('#div-bus-tip').show();
	$('#item-tfn').hide();
	$('#item-company').hide();
	$('#tip-soletrader').hide();
	$('#tip-company').hide();
	$('#help-abn').show();
	$('#help-tfn').hide();
	$('#help-company').hide();
	
	switch (applicationType.name) {
		case soleTraderName:
			$('#tip-soletrader').show();
			break;
		/* these cases are cumulative */
		case companyName:		
			$('#item-company').show();
			$('#tip-company').show();
			$('#help-company').show();			
		case partnershipName:
			$('#item-tfn').show();
			$('#help-tfn').show();
			break;
	}
}



function prepareHelpMeDecide() {
    // make sure the calculation is correct.
    step = 1;
    calculateCompletion();
    previousAction = actions.businessStructureStep;
    nextAction = actions.helpMeDecideSelectStep;
    isTrust = false;
    isCompany = false;
    isPartnership = false;
    isSoleTrader = false;
    
    // set initial tip state:
    if (calculator.separatePersonalAsset == 1 || calculator.manyOwners > 0) {
    	$("#div-structure-tip").show();
    	if (calculator.separatePersonalAsset == 1) {
    		$("#tip-hold-control-asset").show();
    	} else if (calculator.manyOwners == 1) {
	        $("#tip-just-me").show();
	    } else {
    	    $("#tip-two-or-more").show();
    	}
    }


    // How many owners will your business have?
    $("#radioHowManyOwners1").click(function () {
        calculator.manyOwners = 1;
    	if  (calculator.separatePersonalAsset != 1) {
	        $("#div-structure-tip").show();
	        $("#tip-hold-control-asset").hide();
	        $("#tip-just-me").show();
    	    $("#tip-two-or-more").hide();
    	}
    });

    $("#radioHowManyOwners2").click(function () {
        calculator.manyOwners = 2;
        if (calculator.separatePersonalAsset != 1) {
	        $("#div-structure-tip").show();
	        $("#tip-hold-control-asset").hide();
	        $("#tip-two-or-more").show();
    	    $("#tip-just-me").hide();
    	}
    });
    resumeRadioButtonStateOnHelpMeDecidePage($("#radioHowManyOwners1"), $("#radioHowManyOwners2"), calculator.manyOwners)

    // Will you hold and control an asset for the benefit of others?
    $("#radioSeparatePersonalAsset1").click(function () {
        calculator.separatePersonalAsset = 1;
        $("#div-structure-tip").show();
        $("#tip-hold-control-asset").show();
        $("#tip-just-me").hide();
        $("#tip-two-or-more").hide();
       isTrust = true;
    });

    $("#radioSeparatePersonalAsset2").click(function () {
        calculator.separatePersonalAsset = 2;
        $("#tip-hold-control-asset").hide();
        switch (calculator.manyOwners) {
        	case 1:
		        $("#tip-just-me").show();
    		    $("#tip-two-or-more").hide();
    		    break;
    		case 2:
    	        $("#tip-just-me").hide();
		  	    $("#tip-two-or-more").show();
		  	    break;
		  	default:
		        $("#div-structure-tip").hide();
	    }
        calculator.businessLossReduceTax = 0;
        calculator.mostImportant = 0;
        calculator.planToSell = 0;
        isTrust = false;
    });
    resumeRadioButtonStateOnHelpMeDecidePage($("#radioSeparatePersonalAsset1"), $("#radioSeparatePersonalAsset2"), calculator.separatePersonalAsset)
    if (isEqual(calculator.separatePersonalAsset, 1)) {
        /*$("#divExtraQuestions").show();*/
        $("#helpMeDecideQ3Help").show();
        $("#helpMeDecideQ3HelpHeader").show();
    }
    // Do you want to use any business losses to reduce tax on future profits?
    $("#radioBusinessLossReduceTax1").click(function () {
        calculator.businessLossReduceTax = 1;
    });
    $("#radioBusinessLossReduceTax2").click(function () {
        calculator.businessLossReduceTax = 2;
    });
    resumeRadioButtonStateOnHelpMeDecidePage($("#radioBusinessLossReduceTax1"), $("#radioBusinessLossReduceTax2"), calculator.businessLossReduceTax)

    // What is most important for your business?
    $("#radioMostImportant1").click(function () {
        calculator.mostImportant = 1;
    });

    $("#radioMostImportant2").click(function () {
        calculator.mostImportant = 2;
    });
    resumeRadioButtonStateOnHelpMeDecidePage($("#radioMostImportant1"), $("#radioMostImportant2"), calculator.mostImportant)

    // Do you plan to you sell your business or pass it on to someone?
    $("#radioPlanToSellYourBusiness1").click(
    function () {
        calculator.planToSell = 1;
    });
    $("#radioPlanToSellYourBusiness2").click(
    function () {
        calculator.planToSell = 2;
    });
    resumeRadioButtonStateOnHelpMeDecidePage($("#radioPlanToSellYourBusiness1"), $("#radioPlanToSellYourBusiness2"), calculator.planToSell)

}

// prepare help me decide select page
function prepareHelpMeDecideSelect() {
	step = 1;
	calculateCompletion();
	previousAction = actions.helpMeDecideStep;
	nextAction = actions.helpMeDecideResultStep;
	
	$("#chooseStructureSoleTrader").click(function() {
		isSoleTrader = true;
		isTrust = false;
		isCompany = false;
		isPartnership = false;
	});
	$("#chooseStructurePartnership").click(function() {
		isSoleTrader = false;
		isTrust = false;
		isCompany = false;
		isPartnership = true;
	});
	$("#chooseStructureCompany").click(function() {
		isSoleTrader = false;
		isTrust = false;
		isCompany = true;
		isPartnership = false;
	});
}

// prepare help me decide result page
function prepareHelpMeDecideResult() {
    // make sure the calculation is correct.
    step = 1;
    calculateCompletion();
    if (isTrust)
	    previousAction = actions.helpMeDecideStep;
	else
		previousAction = actions.helpMeDecideSelectStep;
    nextAction = actions.businessNameStep;
    isHelpMeDecidUsed = true;
    
    // based on calculator
    // var result = calculator.calculateWeight();
    // decide which one to go
    if (isCompany) {
        initializeApplicationType(companyName);
        registrations.isCompany = true;
        registrations.isTFN = true;
        $("#fieldsetCompany").show();
    }
    else if (isPartnership) {
        initializeApplicationType(partnershipName);
        registrations.isTFN = true;
        $("#fieldsetPartner").show();
    }
    else if (isSoleTrader) {
        initializeApplicationType(soleTraderName);
        $("#fieldsetSoleTrader").show();
    }
    else if (isTrust) {
        isTrust = true;
        $("#fieldsetTrust").show();
    }
}

// prepare the Name selection page.  ---> step 2
function prepareNamePage() {
    // make sure the calculation is correct.
    step = 2;
    calculateCompletion();
    if (isHelpMeDecidUsed)
        previousAction = actions.helpMeDecideResultStep;
    else
        previousAction = actions.businessStructureStep;

    nextAction = actions.employeeStep;
    if (applicationType != null) {
        if (applicationType.businessName1 != undefined && applicationType.businessName1) {
            $("#name1").prop('checked', true);
            $('#div-name-tip').show();
        }
        else if (applicationType.businessName2 != undefined && applicationType.businessName2) {
            $("#name2").prop('checked', true);
        }
    }
    $("#name1").click(function () {
        applicationType.businessName1 = true;
        applicationType.businessName2 = false;
        registrations.isBusinessName = true;
        $('#div-name-tip').show();
    });
    $("#name2").click(function () {
        applicationType.businessName2 = true;
        applicationType.businessName1 = false;
        registrations.isBusinessName = false;
        $('#div-name-tip').hide();
    });
}

// prepare the Employee page
function prepareEmployeePage() {
    // make sure the calculation is correct.
    step = 3;
    calculateCompletion();
    previousAction = actions.businessNameStep;
    nextAction = actions.activityGSTStep;

    checkEmployeeTips();

    // company stream
    if (applicationType.name === companyName) {
        // check which option user has selected
        if (applicationType.hasEmployee != undefined) {
            if (applicationType.hasEmployee) {
                $("#companyEmployeeYes").prop('checked', true);
            }
            else {
                $("#companyEmployeeNo").prop('checked', true);
            }
        }
        // check whether user selected benefits to employee or not.
        if (applicationType.fringeBenefit != undefined) {
            if (applicationType.fringeBenefit) {
                $("#fringeBenefitsEmployeeYes").prop('checked', true);
            }
            else {
                $("#fringeBenefitsEmployeeNo").prop('checked', true);
            }
        }

        // company employee
        $("#companyEmployeeYes").click(function () {
            applicationType.hasEmployee = true;
            registrations.isPAYG = true;
	        checkEmployeeTips();
        });

        $("#companyEmployeeNo").click(function () {
            applicationType.hasEmployee = false;
            applicationType.fringeBenefit = false;
            registrations.isFBT = false;
            registrations.isPAYG = false;
            checkEmployeeTips();
	    });

        // Company fringe benefits
        $("#fringeBenefitsEmployeeYes").click(function () {
            applicationType.fringeBenefit = true;
            registrations.isFBT = true;
	        checkEmployeeTips();
        });

        $("#fringeBenefitsEmployeeNo").click(function () {
            applicationType.fringeBenefit = false;
            registrations.isFBT = false;
	        checkEmployeeTips();
        });
    }
    else {
        // sole trader or partnership
        if (applicationType.hasEmployee != undefined) {
            if (applicationType.hasEmployee) {
                $("#employeeYes").prop('checked', true);
                $("#fringeBenefit").show();
            }
            else {
                $("#employeeNo").prop('checked', true);
            }
        }
        else {
            $("#fringeBenefit").hide();
        }
        if ($("#fringeBenefit").is(':visible')) {
            if (applicationType.fringeBenefit != undefined) {
                if (applicationType.fringeBenefit) {
                    $("#fringeBenefitYes").prop('checked', true);
                }
                else {
                    $("#fringeBenefitNo").prop('checked', true);
                }
            }
        }
        // employee
        $("#employeeYes").click(function () {
            $("#fringeBenefit").show(100);
            applicationType.hasEmployee = true;
            registrations.isPAYG = true;
	        checkEmployeeTips();
        });

        $("#employeeNo").click(function () {
            hideElementAndClear("fringeBenefit");
            applicationType.hasEmployee = false;
            applicationType.fringeBenefit = false;
            registrations.isPAYG = false;
	         checkEmployeeTips();
       });
        // fringe benefits
        $("#fringeBenefitYes").click(function () {
            applicationType.fringeBenefit = true;
            registrations.isFBT = true;
	        checkEmployeeTips();
        });

        $("#fringeBenefitNo").click(function () {
            applicationType.fringeBenefit = false;
            registrations.isFBT = false;
        	checkEmployeeTips();
        });
    }
}

function checkEmployeeTips() {
	if (parseboolean(applicationType.hasEmployee) ||
		parseboolean(applicationType.fringeBenefit)) {
		$('#div-employees-tip').show();
		$('#tip-payg').toggle(parseboolean(applicationType.hasEmployee));
		$('#tip-fbt').toggle(parseboolean(applicationType.fringeBenefit));
		$('#help-payg').toggle(parseboolean(applicationType.hasEmployee));
		$('#help-fbt').toggle(parseboolean(applicationType.fringeBenefit));
	} else {
		$('#div-employees-tip').hide();
		$('#help-payg').hide();
		$('#help-fbt').hide();
	}
}

// prepare the activity GST page
function prepareActivityGSTPage() {
    // make sure the calculation is correct.
    step = 4;
    calculateCompletion();
    previousAction = actions.employeeStep;
    nextAction = actions.activityTaxStep;

    $(":checkbox").click(function () {
        if (this.id !== 'ckNone') {
            if ($("#ckNone").prop("checked") && $(this).prop("checked")) {
                $("#ckNone").trigger("click");
            }
        } else {
            {
                if ($("#ckNone").prop("checked")) {
                    applicationType.noneOfAbove1 = true;
                    $(":checkbox").each(function (i, element) {
                        if (element.id !== "ckNone" && $(element).prop('checked')) {
                            $(element).trigger('click');
                        }
                    });
                }
            }
        }
    });
    // none of the above
    $("#ckNone").click(function () {
        applicationType.noneOfAbove1 = $("#ckNone").prop('checked');
		checkGST();
    });
    if (applicationType.noneOfAbove1 !== undefined) {
        setCheckBox("#ckNone", applicationType.noneOfAbove1);
    }

    // turnover 75k and over
    $("#ckTurnover75k").click(function () {
        applicationType.turnOver75k = $("#ckTurnover75k").prop('checked');
        checkGST();
    });

    if (applicationType.turnOver75k != undefined) {
        setCheckBox("#ckTurnover75k", applicationType.turnOver75k);
    }

    // taxi
    $("#ckTaxi").click(function () {
        applicationType.taxi = $("#ckTaxi").prop('checked');
        checkGST();
    });

    if (applicationType.taxi != undefined) {
        setCheckBox("#ckTaxi", applicationType.taxi);
    }

    // limo
    $("#ckLimousine").click(function () {
        applicationType.limo = $("#ckLimousine").prop('checked');
        checkGST();
    });

    if (applicationType.limo != undefined) {
        setCheckBox("#ckLimousine", applicationType.limo);
    }
    
    // set initial tip/help status:
    window.setTimeout(checkGST, 10);
}

function checkGST() {
	if (applicationType.noneOfAbove1) {
		$('#div-gst-tip').show();
		$('#div-gst-register').hide();
		$('#div-gst-optional').show();
		$('#gstOptionalHelpHeader').show();
		$('#gstOptionalHelp').show();
		$('#gstRegisterHelpHeader').hide();
		$('#gstRegisterHelp').hide();
	} else if ($('#activityFieldset input:checkbox:checked').length > 0) {
		$('#div-gst-tip').show();
		$('#div-gst-register').show();
		$('#div-gst-optional').hide();
		$('#gstRegisterHelpHeader').show();
		$('#gstRegisterHelp').show();
	} else {
		$('#div-gst-tip').hide();
		$('#gstRegisterHelpHeader').hide();
		$('#gstRegisterHelp').hide();
		$('#gstOptionalHelpHeader').hide();
		$('#gstOptionalHelp').hide();
	}
}

// prepare the activity Tax page
function prepareActivityTaxPage() {
    // make sure the calculation is correct.
    step = 5;
    calculateCompletion();
    previousAction = actions.activityGSTStep;
    nextAction = actions.finishedStep;

    $(":checkbox").click(function () {
        if (this.id !== 'ckNone') {
            if ($("#ckNone").prop("checked") && $(this).prop("checked")) {
                $("#ckNone").trigger("click");
            }
        } else {
            {
                if ($("#ckNone").prop("checked")) {
                    applicationType.noneOfAbove2 = true;
                    $(":checkbox").each(function (i, element) {
                        if (element.id !== "ckNone" && $(element).prop('checked')) {
                            $(element).trigger('click');
                        }
                    });
                }
            }
        }
    });
    // none of the above
    $("#ckNone").click(function () {
        applicationType.noneOfAbove2 = $("#ckNone").prop('checked');
        if ($("#ckNone").prop('checked')) {
        	$('#div-gst-tip').hide();
        }
        
    });

    if (applicationType.noneOfAbove2 !== undefined) {
        setCheckBox("#ckNone", applicationType.noneOfAbove2);
    }

    // wine
    $("#ckDealInWine").click(function () {
        registrations.isWET = $("#ckDealInWine").prop('checked');
        checkTaxes();
    });

    if (registrations.isWET != undefined) {
        setCheckBox("#ckDealInWine", registrations.isWET);
    }

    // fuel
    $("#ckUseFuel").click(function () {
        registrations.isFTC = $("#ckUseFuel").prop('checked');
        checkTaxes();
    });

    if (registrations.isFTC != undefined) {
        setCheckBox("#ckUseFuel", registrations.isFTC);
    }

    // luxury cars
    $("#ckLuxury").click(function () {
        registrations.isLCT = $("#ckLuxury").prop('checked');
        checkTaxes();
    });

    if (registrations.isLCT != undefined) {
        setCheckBox("#ckLuxury", registrations.isLCT);
    }
    
	// set initial tip/help status:
    window.setTimeout(checkTaxes, 10);
}

function checkTaxes() {
	if (!applicationType.noneOfAbove2 && $('#activityFieldset input:checkbox:checked').length > 0) {
		var haveGST = (parseboolean(applicationType.taxi) || parseboolean(applicationType.turnOver75k) || parseboolean(applicationType.limo));
       	$('#div-gst-tip').show();
       	if (haveGST) {
       		if (registrations.isWET || registrations.isLCT) {
				$('#tips-part1').show();
				$('#tip-no-gst').hide();
				$('#tip-have-gst').show();
				$('#tip-wet').toggle(registrations.isWET);
				$('#tip-lct').toggle(registrations.isLCT);
				$('#wetHelpHeader').toggle(registrations.isWET);
				$('#lctHelpHeader').toggle(registrations.isLCT);
			} else {
				$('#tips-part1').hide();
			}
			$('#tips-part2').toggle(registrations.isFTC);
			$('#ftc-no-gst').hide();
			$('#ftcHelpHeader').toggle(registrations.isFTC);
		} else {
      		if (registrations.isWET || registrations.isLCT ) {
				$('#tips-part1').show();
				$('#tip-no-gst').show();
				$('#tip-have-gst').hide();
				$('#tip-wet').toggle(registrations.isWET);
				$('#tip-lct').toggle(registrations.isLCT);
				$('#wetHelpHeader').toggle(registrations.isWET);
				$('#lctHelpHeader').toggle(registrations.isLCT);
			} else {
				$('#tips-part1').hide();
			}
			$('#tips-part2').toggle(registrations.isFTC);
			$('#ftc-no-gst').toggle(registrations.isFTC);
			$('#ftcHelpHeader').toggle(registrations.isFTC);
		}
/*
		if (registrations.isWET) {
			$('#tip-wet').show();
			$('#wetHelpHeader').show();
		} else {
			$('#tip-wet').hide();
			$('#wetHelpHeader').hide();
		}
		if (registrations.isFTC) {
			$('#tip-ftc').show();
			if (!haveGST) {
				$('#extra-ftc').show();
			}
			$('#ftcHelpHeader').show();
			//$('#ftcHelp').show();
		} else {
			$('#tip-ftc').hide();
			$('#extra-ftc').hide();
			$('#ftcHelpHeader').hide();
			//$('#ftcHelp').hide();
		}
		if (registrations.isLCT) {
			$('#tip-lct').show();
			$('#lctHelpHeader').show();
			//$('#lctHelp').show();
		} else {
			$('#tip-lct').hide();
			$('#lctHelpHeader').hide();
			//$('#lctHelp').hide();
		} */
	}
	else
		$('#div-gst-tip').hide();
}

// prepare the finished page
function showResults() {
    // make sure the calculation is correct.
    step = 6;
    calculateCompletion();
    previousAction = actions.activityTaxStep;
    nextAction = "";

    if (parseboolean(registrations.isTFN)) {
        $('#resultTable tr:last').after(getResult("Tax File Number (TFN)", "tfn", true, "", "Free", 1));
    }
    if (parseboolean(registrations.isCompany)) {
        $('#resultTable tr:last').after(getResult("Company", "co", true, "", "up to $463 for 1 year", 2));
    }
    if (parseboolean(registrations.isBusinessName)) {
        $('#resultTable tr:last').after(getResult("Business name", "bn", true, "", "$34 for 1 year or $79 for 3 years", 3));
    }
    if (parseboolean(registrations.isPAYG)) {
        $('#resultTable tr:last').after(getResult("Pay As You Go (PAYG) Withholding", "payg", true, "", "Free", 4));
    }
    if (parseboolean(registrations.isFBT)) {
        $('#resultTable tr:last').after(getResult("Fringe Benefits Tax (FBT)", "fbt", true, "", "Free", 5));
    }
    var needGST = (parseboolean(applicationType.taxi) || parseboolean(applicationType.turnOver75k) || parseboolean(applicationType.limo));
    if (needGST) {
        $('#resultTable tr:last').after(getResult("Goods & Services Tax (GST)", "gst", true, "", "Free", 6));
    }
    if (parseboolean(registrations.isLCT) && needGST) {
        $('#resultTable tr:last').after(getResult("Luxury Car Tax (LCT)", "lct", true, "", "Free", 7));
    }
    if (parseboolean(registrations.isFTC) && needGST) {
        $('#resultTable tr:last').after(getResult("Fuel Tax Credits (FTC)", "ftc", true, "", "Free", 8));
    }
    if (parseboolean(registrations.isWET) && needGST) {
        $('#resultTable tr:last').after(getResult("Wine Equalisation Tax (WET)", "wet", true, "", "Free", 9));
    }
    if (!needGST) {
        $("#gstRecommend").show();
        $("#ckGstRecommend").click(function () {
            if ($(this).prop('checked')) {
                $("#lctOptional").prop('checked', true);
                $("#wetOptional").prop('checked', true);
                $("#ftcOptional").prop('checked', true);

            }
            else {
                $("#lctOptional").prop('checked', false);
                $("#wetOptional").prop('checked', false);
                $("#ftcOptional").prop('checked', false);
            }
        });

        if (parseboolean(registrations.isLCT)) {
            $("#lctOptionalRow").show();
            $("#lctOptional").click(function () {
                if ($(this).prop('checked')) {
                    $("#ckGstRecommend").prop('checked', true);
                }
            });
        }
        if (parseboolean(registrations.isWET)) {
            $("#wetOptionalRow").show();
            $("#wetOptional").click(function () {
                if ($(this).prop('checked')) {
                    $("#ckGstRecommend").prop('checked', true);
                }
            });
        }
        if (parseboolean(registrations.isFTC)) {
            $("#ftcOptionalRow").show();
            $("#ftcOptional").click(function () {
                if ($(this).prop('checked')) {
                    $("#ckGstRecommend").prop('checked', true);
                }
            });
        }
    }
    
    setTimeout(showRegistrationsHelpContent, 1);

}

// show the help content for selected tax types
function showRegistrationsHelpContent() {
    var needGST = (parseboolean(applicationType.taxi) || parseboolean(applicationType.turnOver75k) || parseboolean(applicationType.limo) || parseboolean(applicationType.isFTC) || parseboolean(applicationType.isLCT));
    if (needGST) {
        // $('#gstHelp').show();
        $('#gstHelpHeader').show();

        // following code to switch on some help content for gst help
/*        if (parseboolean(applicationType.taxi)) {
            $("#liTaxi").show();
        }

        if (parseboolean(applicationType.turnOver75k)) {
            $("#liMoreThan75k").show();
        }

        if (parseboolean(applicationType.limo)) {
            $("#liLimo").show();
        } */
    }
    if (parseboolean(registrations.isTFN)) {
        // $("#tfnHelp").show();
        $("#tfnHelpHeader").show();
        // $("#helpBusinessStructureSelected").html(applicationType.name);
    }
    if (parseboolean(registrations.isCompany)) {
        // $("#companyHelp").show();
        $("#companyHelpHeader").show();
    }
    if (parseboolean(registrations.isBusinessName)) {
        // $("#businessNameHelp").show();
        $("#businessNameHelpHeader").show();
/*        if (applicationType.name === soleTraderName) {
            $("#yourOwnNameInHelp").show();
            $("#yourOwnNameInHelp1").show();
        }
        else if (applicationType.name === companyName) {
            $("#theCompanyNameInHelp1").show();
            $("#theCompanyNameInHelp").show();
        } else if (applicationType.name === partnershipName) {
            $("#yourPartnersNameInHelp").show();
            $("#yourPartnersNameInHelp1").show();
        } */
    }

    if (parseboolean(registrations.isPAYG)) {
        // $("#paygHelp").show();
        $("#paygHelpHeader").show();
        if (parseboolean(registrations.isCompany)) {
            $("#divCompanyPAYG").show();
//            if (parseboolean(applicationType.hasEmployee)) {
//                $("#paygCompanyHasEmployee").show();
//            }
//            else {
//                $("#paygCompanyNoEmployee").show();
//            }
        }
        else {
            $("#divNonCompanyPAYG").show();
        }
    }

    if (parseboolean(registrations.isFBT)) {
        // $('#fbtHelp').show();
        $('#fbtHelpHeader').show();

    }
    if (needGST && parseboolean(registrations.isLCT)) {
        // $('#lctHelp').show();
        $('#lctHelpHeader').show();
    }
    if (needGST && parseboolean(registrations.isFTC)) {
        // $('#ftcHelp').show();
        $('#ftcHelpHeader').show();
    }
    if (needGST && parseboolean(registrations.isWET)) {
        // $('#wetHelp').show();
        $('#wetHelpHeader').show();
    }
    if (!needGST) {
        // $('#gstHelp1').show();
        $('#gstHelp1Header').show();
        if (parseboolean(registrations.isFTC)) {
            $("#ftcHelpHeader1").show();
            // $("#ftcHelp1").show();
        }
        if (parseboolean(registrations.isLCT)) {
            $("#lctHelpHeader1").show();
            // $("#lctHelp1").show();
        }
        if (parseboolean(registrations.isWET)) {
            $("#wetHelpHeader1").show();
            // $("#wetHelp1").show();
        }
    }
}

// end of callbacks

/* Discovery Page*/
function initDiscoveryPage() {
    manageState(actions.businessStructureStep);
    $("#previous").click(function () {
        $(window).scrollTop($('#heading').offset().top);
        $("#previous").blur();
        manageState(previousAction);
    });
    $("#next").click(function () {
        if (isTrust) {
        	if (currentAction == actions.businessStructureStep || currentAction == actions.helpMeDecideResultStep) {
            	window.location.href = "trust.html";
            }
        }
        if (currentAction == actions.finishedStep) {
        	// finished selecting, start applying...
           	var queryStr = "?type=";
           	var first = true;
           	$("input[type=checkbox]:checked").each(function(i, item) {
           		first?first=false:queryStr+=',';
           		queryStr += item.id;
           	});
           	location.href = "../register.html" + queryStr;
           	return;
        }
        $(window).scrollTop($('#heading').offset().top);
        $("#next").blur();
        if (!ifAnythingSelected("questions") && previousAction != actions.helpMeDecideStep
        	 && previousAction != actions.helpMeDecideSelectStep && previousAction != actions.employeeStep
        	 && previousAction != actions.activityGSTStep) { // ignore step 4
            $("#validation").show();
            $(window).scrollTop($('#validation').offset().top);
            $(".scroll").click(function (event) {
                event.preventDefault();
                var full_url = this.href;
                var parts = full_url.split("#");
                var trgt = parts[1];
                var target_offset = $("#" + trgt).offset();
                var target_top = target_offset.top;
                jQuery('html, body').animate({
                    scrollTop: target_top
                }, 1200);
            });
            return;
        }
        manageState(nextAction);
    });
}
/* End of Discovery Page */


// Utilities
function calculateCompletion() {
    $("#stepNo").html(step);
    var percentCompleted = Math.round((step - 1) / (maxStep - 1) * 100 / 5) * 5;
    if (percentCompleted == 0) {
        percentCompleted += 5;
    }
    $("#percentCompleted").html(percentCompleted);
    $("#percentMeter").css('width', percentCompleted + '%');
}

function selectRadioButton(value, name) {
    if (value != null) {
        setTimeout(function () {
            setValue(value, name);
        }, 50);
    }
}

function setCheckBox(id, isChecked) {
    $(id).prop('checked', isChecked);
}

function hideElementAndClear(elementId) {
    $('#' + elementId).hide(100);
    $('#' + elementId + ' :radio').each(function () {
        $(this).prop('checked', false);
    });
}

function setValue(value, name) {
    $('input[name=' + name + '][value=' + value + ']').prop('checked', true);
}

/*function getResult(registrationName, id, isSelected, reason, cost, helpId) {
    var result = '<tr>    <td class="choice ';
    if (isSelected) {
        result += " results-success-message";
    }
    else {
        result += " results-alert-message";
    }
    result += '"><input id="' + id + '" type="checkbox" checked="checked"></td>    <td class="registration-type';
    if (!isSelected) {
        result += " results-alert-message";
    }
    result += '"><label for="' + id + '">' + registrationName + '</label></td>    <td class="cost';
    if (!isSelected) {
        result += " results-alert-message";
    }
    result += '">' + cost + '</td>  <td class="help"><span class="form-help"><a href="#help-structure" id="' + helpId + '" class="cd-btn"><img src="../../../ablis - Copy/assets/img/ico-help-form.png" alt="" /></a></span></td></tr>';
    if (!isSelected) {
        result += '<tr><td class="results-alert-message" colspan="3"><span class="smaller">' + reason + '</span></td></tr>';
    }
    return result;
}
*/

function getResult(registrationName, id, isSelected, reason, cost, helpId) {
    var result = '<tr><td><p><input id="' + id + '" type="checkbox" checked="checked"><label for="' + id + '">' + registrationName + '</label></p></td>';
    result += '<td class="cost';
    if (!isSelected) {
        result += " results-alert-message";
    }
    result += '">' + cost + '</td>  <td class="help"><span class="form-help"><a href="#help-structure" id="' + helpId + '" class="cd-btn help"><span>help</span></a></span></td></tr>';
    if (!isSelected) {
        result += '<tr><td class="results-alert-message" colspan="2"><span class="smaller">' + reason + '</span></td></tr>';
    }
    return result;
}

function parseboolean(value) {
    return (value != undefined && value);
}

function ifAnythingSelected(containerId) {
    var ifUserInputCount = 0;
    var elementCount = 0;
    $("#" + containerId + " :radio").each(function () {
        if ($(this).is(":visible") && $(this).parent().parent().is(":visible")) {
            elementCount++;
            var ifUserInput = $(this).prop("checked");
            if (ifUserInput) {
                ifUserInputCount++;
            }
        }
    });
    if (previousAction === actions.helpMeDecideStep) {
        return true;
    }
    // user needs to select all the options in 'help me decide' step
    return nextAction === actions.helpMeDecideResultStep ? ifUserInputCount === elementCount / 2 : ifUserInputCount > 0;
}

function hideValidationMessages() {
    $('input:radio').click(
                          function () {
                              $("#validation").hide(150);
                          }
      );
}

function returnToGivenStep(action) {
    $(".cd-panel").click();
    manageState(action);
    return false;
}

function printHelp() {
    var helpCSS = "";
    if (window.location.host === "busgov.github.io") {
        helpCSS = window.location.protocol + '//' + location.host + "/registration/css/help.css";
    }
    else {
        helpCSS = window.location.protocol + '//' + location.host + "/css/help.css";
    }
    $('#help').printThis({
        importCSS: false,
        //printContainer: true,
        //debug: true,
        loadCSS: [helpCSS]
    });

    return false;
}

function isEqual(compareFrom, compareTo) {
    if (compareFrom != undefined && compareFrom === compareTo) {
        return true;
    }
    return false;
}

// this function is only used for help me decide section
function resumeRadioButtonStateOnHelpMeDecidePage(radio1, radio2, stateValue) {

    if (isEqual(stateValue, 1)) {
        $(radio1).prop('checked', true);
    }
    else if (isEqual(stateValue, 2)) {
        $(radio2).prop('checked', true);
    }
}
// End Utilities
