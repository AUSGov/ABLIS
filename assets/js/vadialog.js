//www.visionaustralia.org/digital-access-dialog
//define global objectski
if(!window.visionaustralia){
	window.visionaustralia = {};
}


visionaustralia.addDialog = function (linkId, dialogId,fBeforeOpen,fForCloseButton){
	
	$(function(){
        //adds onclick handler to the link. Used when the content is already
		//event handlers are added inside this function, so scope is kept separate for each dialog box, YES.
		if (!linkId) return; //add console.log mersssage. OR throw error.
		if (!dialogId) return;
	
		//add event handler to link
		var triggerLink = $("#" + linkId);
		triggerLink.click(function(event) {
			open(this,event);
		});
				
		//gib z-index for shadow & dialog box
		var bigZ = 16123456;
		//body children that we will add or change aria-hidden on
		var bodyChildren = [];
			
		var heading;
		
		var startDialog;
		
		//outside of open function as they are used by close
		var dialog;
		var shadow;
		var parent;
		var isOpen = false;
		var contentCopy;
		var body = $("body");

		function open(link, ev){
		
			if(isOpen){
				startDialog.focus();
				ev.preventDefault();
				return;
			}
			
			isOpen = true;
			
			if(fBeforeOpen && typeof fBeforeOpen == "function") fBeforeOpen();
			
            //Note: .after() returns the link JQuery object - NOT the elements inserted
            
            //create JQuery objects
            shadow = $('<div class="vashadow"></div>');
            dialog = $('<div class="vadialog"></div>');
			
			var path = location.pathname.replace(/business-registration\/.*$/g, "business-registration\/assets\/img");
            
            var closeButton = $('<button class="vaCloseButton" aria-label="Close dialog"><img src="../../../business-registration/assets/js/' + path + '/ico-close.png" alt="Close" /></button>');
			var startCentinel = $('<span class="vaOffscreen" tabindex="0"></span>');
			startDialog = $('<a class="vaOffscreen" tabindex="0">Dialog start</a>');
			var endDialog = $('<span class="vaOffscreen" tabindex="0">Dialog end</span>');
			var endCentinel = $('<span class="vaOffscreen" tabindex="0"></span>');
			
			startCentinel.focus(function() {
				endDialog.focus();
			});
			
			endCentinel.focus(function() {
				startDialog.focus();
			});

			dialog.append(startCentinel);
			dialog.append(startDialog);
            dialog.append(closeButton)
            
        	var content = $("#" + dialogId);
  			
			parent = content.parent();
            
            var contentToShow = content.clone(true);
            //copy to re-insert after dialog box was closed
            contentCopy = content.clone(true);
            
            content.remove();
            
            dialog.append(contentToShow);
            
            contentToShow.show();
            
            dialog.append(endDialog);
			dialog.append(endCentinel);
			
			//add event handler to close button
			closeButton.click(function(){if(fForCloseButton && typeof fForCloseButton == "function") fForCloseButton(); close();})
            
			var win = $(window);

			function centerDialog(){
				var padLeft =parseInt( dialog.css("padding-left"));
				var padTop = parseInt(dialog.css("padding-top"));
				dialog.css("margin-left", - dialog.width() / 2 - padLeft + "px").css("margin-top", - dialog.height() / 2 - padTop + "px");
			}
			win.resize(function(){
				centerDialog();
			});
			
			//Changed to use aria-live much of the above - how we build the dialog - stays the same
			//insert in DOM - it made ALL the difference for JAWS 10 to have these two lines down here!!!!!!!
			dialog.css("z-index",bigZ);
			shadow.css("z-index",bigZ);
			
			//hide all top level elements & remember their aria-hidden status
			body.children().each(function () {
				var jQchild = $(this);
				
				var o = {};
				o.jqel = jQchild;

				if(jQchild.attr("aria-hidden") !== undefined){
					o.hadVal = true;
					o.originalVal = jQchild.attr("aria-hidden");
				}else{
					o.hadVal = false;
				}
				bodyChildren.push(o);
				//hide the child
				jQchild.attr("aria-hidden", "true");
			});

			body.append(shadow);
			body.append(dialog);
			
            shadow.show();

			centerDialog();

			dialog.show();
			
			startDialog.focus(); 

			ev.preventDefault();
			
        }//end open ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
		
		
		function close(){
			if(!isOpen)return;
			isOpen = false;

			for(var i=0, c; c=bodyChildren[i]; i++){
				//if element originally had aria-hidden attribute, reinstate value
				if(c.hadVal){
					c.jqel.attr("aria-hidden",c.originalVal);
				//if no original aria-hidden, remove the attribute entirely
				}else{
					c.jqel.removeAttr("aria-hidden");
				}
			}

			dialog.remove();
			shadow.remove();
			parent.append(contentCopy);

			triggerLink.focus();
		}
		
		visionaustralia[dialogId] = {};
		visionaustralia[dialogId].closeDialog = close;
		visionaustralia[dialogId].openDialog = open
		
	});//end jQUERY on page load

}// end addDialog
	

visionaustralia.closeDialog = function (dialogId){
	visionaustralia[dialogId].closeDialog();
}

visionaustralia.openDialog = function (dialogId){
	visionaustralia[dialogId].openDialog();
}


