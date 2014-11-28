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
				var inputs = $('<div class="tableRow addedNode"><p>Lump sum in investment '+(numInputs-i)+':</p><p><input type="number" class="lump"></p></div><div class="tableRow addedNode"><p>Annual interest for investment '+(numInputs-i)+' (percent):</p><p><input type="number" class="interest"></p></div>');
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
		var popupNode = $('<div class="popupBackground" id="popup1"><div class="container"><p>Are you sure you want to repopulate the inputs?<br>All previously entered data for these inputs will be lost</p><div class="outerContainer"><button id="yes">Yes</button><button id="no">No</button></div></div></div>');
		//if inputs have or have not been populated before how should we handle when "populate input" button is clicked
		if(populatedInputs) {
			//show popup warning
			$('body').append(popupNode);
			//delete inserted nodes
			$('#popup1 #yes').on('click',function(){
				$('.popupBackground').remove();
				removeInputs();
				populateInputs();
				lumpSumCalc();
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


//Calculate lump sums when calculate button is clicked
	var numInvestments;
	var futureWorthLump = 0;
	function lumpSumCalc() {
		//variables
		//future worth lump sum value
		var fw = 0;
		//present values array
		var pv = [];
		while(pv.length > 0) {
    		pv.pop();
		}
		//interest arrays divided by 12
		var r = [];
		while(r.length > 0) {
    		r.pop();
		}
		//future worth calculation
		function futureWorth () {
			for (i=0; i < numInvestments; i++) {
				//present value calc
				var element3 = Math.pow(( 1 + r[i]), n);
				element3 = pv[i] * element3;
				//two decimal places
				fw = fw + element3;
			}
		};
		numInvestments = $('.addedNode').length/2;
		//user enters years or months
		var yearsOrMonths = $('#yearsMonths1').val();
		//number of periods in years
		var n = $('#numPeriods').val();
		//Present value lump sums array
		$('.lump').each(function() {
			var element = $(this).val();
			pv.push(element);
		});
		//interest lump sums array divided by 12 to compound by month
		$('.interest').each(function(){
			var element2 = ($(this).val()/12)/100;
			r.push(element2);
		})
		//if user enters years or if user enters months for calculation change period accordingly.
		if(yearsOrMonths == "years") {
			n = n * 12;
			futureWorth();
		} else {
			futureWorth();
		} //end if
		//insert answer in html
		$('#fw').text('$ ' + fw.toFixed(0));
		futureWorthLump = fw;
	};//end lump sum calc

//Monthly savings calculations
	var futureWorthMonth = 0;
	function monthlySavings() {
		//variables
		//future worth monthly savings total
		var fw2 = 0;
		//monthly investments
		var a = $('#a').val() * 1;
		console.log("a " + a);
		//interest divided by 12 for compounding and divided by 100 to turn to decimal
		var r = (($('#r').val())/12)/100;
		console.log("r " + r);
		//number of periods in years
		var n = $('#numPeriods').val() * 1;
		console.log("n " + n);
		//get if years or months is selected for saving time
		var yearsOrMonths = $('#yearsMonths1').val();
		//future worth calc function
		function futureWorth() {
			if (r == 0) {
				fw2 = a * n;
				futureWorthMonth = fw2;
			} else {
				fw2 = Math.pow((1 + r), n);
				fw2 = fw2 - 1;
				fw2 = fw2 / r;
				fw2 = fw2 * a;
				futureWorthMonth = fw2;
			}
		};
		//if user enters years or if user enters months for calculation change period accordingly.
		if(yearsOrMonths == "years") {
			n = n * 12;
			futureWorth();
		} else {
			futureWorth();
		} //end if
		//enter answer into html
		$('#fw2').text('$ ' + fw2.toFixed(0));
	};//end Monthly savings function

//Add Lump Sum Investments and Monthly savings for total retirement worth
	function totalRetirement() {
		var fwTotal = futureWorthMonth + futureWorthLump;
		$('#fwTotal').text('$ ' + fwTotal.toFixed(0));
	};	

//when calculate is clicked calculate lump sum and monthly savings
	$('#calcLumpSums').on('click',function(){
		lumpSumCalc();
		monthlySavings();
		totalRetirement();
		$('.one').animate({
			fontWeight:'900',
			fontSize:'1.4em'
			}, 2000,
			function(){
				$('.one').animate({
					fontWeight:'100',
					fontSize:'1em'
				}, 1000);
		});
	});

//----------------------------------	
});