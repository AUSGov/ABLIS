// JavaScript Document

$(document).ready(function(){
    $("input:radio").change(function(){
        console.log(this);
        if(this.value == 'Yes' && this.name == 'myofficeissue'){
            $('#slidingDiv').slideDown();
        }else if(this.value == 'No' && this.name == 'myofficeissue'){
            $('#slidingDiv').slideUp();
            $('#slidingDiv_2').slideUp();
        }else if(this.value == 'Yes' && this.name == 'passwordissue'){
            $('#slidingDiv_2').slideDown();
        }else if(this.value == 'No' && this.name == 'passwordissue'){
            $('#slidingDiv_2').slideUp();
        }
    });
});