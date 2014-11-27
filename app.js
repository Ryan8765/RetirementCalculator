$(document).ready(function() {
//--------------------------------

//make both container divs the same width initially and on window resize for appearance
	var outerWidth = $("#updateWidth").width();
	$('#revisedWidth').css('width',outerWidth);
	$(window).resize(function(){
		var outerWidth = $("#updateWidth").width();
		$('#revisedWidth').css('width',outerWidth);
	});
	
//Populate investment areas when "populate input" button is clicked
	//global variables
	var populatedInputs = false;

	$('#populateInputs').on('click',function(){
		//populate input function
		function populateInputs(){
			for(i=0; i<numInputs; i++) {
				var inputs = $('<div class="tableRow addedNode"><p>Lump sum in investment '+(numInputs-i)+':</p><p><input type="text"></p></div><div class="tableRow addedNode"><p>Interest for investment '+(numInputs-i)+' (percent):</p><p><input type="text"></p></div>');
				$('#updateWidth .table div').eq(0).after(inputs);
			}
		}; //end populate inputs function

		//function to remove populated input nodes.
		function removeInputs(){
			$('.addedNode').remove();
		};
		//Number of investment areas entered by user
		var numInputs = $('#numInputs').val();
		//popup html
		var popupNode = $('<div class="popupBackground" id="popup1"><div class="container"><p>Are you sure you want to re-populate the inputs?<br>All previously entered data for these inputs will be lost</p><div class="outerContainer"><button id="yes">yes</button><button id="no">No</button></div></div></div>');
		//if inputs have or have not been populated before how should we handle when "populate input" button is clicked
		if(populatedInputs) {
			//show popup warning
			$('body').append(popupNode);
			//delete inserted nodes
			$('#popup1 #yes').on('click',function(){
				$('.popupBackground').remove();
				removeInputs();
				populateInputs();
			});
			$('#popup1 #no').on('click',function(){
				$('.popupBackground').remove();
			});
		} else {
			//populate inputs
			populateInputs();
		}
		//set populated inputs to true so we know they have been populated.
		populatedInputs = true;
	}); //end populate input button





//----------------------------------	
});