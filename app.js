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
		};//end monthly savings function

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
	$('#calcLumpSums').on('click',function(event){
		lumpSumCalc();
		monthlySavings();
		totalRetirement();
		$('.one').animate({
			fontWeight:'900',
			fontSize:'1.6em'
			}, 1500,
			function(){
				$('.one').animate({
					fontWeight:'100',
					fontSize:'1.1em'
				}, 1000);
		});
	});
//if user hits enter button, populate input with savings from above calc in html
	$('#enter').on('click',function(){
		
		var valueString = $('#fwTotal').text();
		valueString = valueString.slice(2);
		valueString = parseInt(valueString);
		$('#retirementSavings').val(valueString);
	});
//function to calculate have a saved enough for retirement section
	//function to use when calculate button is clicked
	function enoughForRetirement() {
		//variables
		//global variables 
		var retirementSavings = $('#retirementSavings').val();
		//retirement inflation rate divided by 12 for months and 100 for decimal
		var inflationRet = (($('#inflationRet').val())/12)/100;
		console.log("retirement Inflation " + inflationRet);
		//user entering years or months for term
		var yearsOrMonths2 = $('#yearsOrMonths2').val();
		//lump sum retirement purchase expense
		var lumpSumRet = $('#lumpSumRet').val();
		console.log("lump sum expense " + lumpSumRet);
		// number of periods
		var n2 = $('#n2').val();
		//if user enters years or if user enters months for calculation, change period accordingly
		if(yearsOrMonths2 == "years") {
			n2 = n2 * 12;		
		}
		console.log("N periods " + n2);
		//interest earned on retirement divided by 12 for months and 100 to decimal
		var r2 = (($('#r2').val())/12)/100;
		console.log('Interest ' + r2);
		//Total retirement savings less lump sum purchase (house/car)
		var retirementSavingsLess;
		//how much does your retirement savings generate each year?
		var annualInc;
		//retirement tax rate in decimal
		var retirementTax = ($('#retirementTax').val())/100;
		console.log('Tax rate ' + retirementTax);
		//retirement monthly expenses entered by user divided by tax rate 
		var retExpenses = ($('#retExpenses').val())/retirementTax;
		console.log('retirement expenses calc ' + retExpenses);
		//how much money do you need a year for living?
		var annualNeed;
		//annual income less annual expenses of first year
		var annualDiff;
		//after x-amount of years, how much retirement savings do you have?
		var totRetSavings;
		//after x-amount of years how much money will you have spent
		var totRetExpenses;
		//what remains after all expenses are incorporated
		var netRemaining;
		
		console.log('retirementSavings ' + retirementSavings);
		alert('retirement savings ' + retirementSavings);
		//retirement savings less lump sum retirement expense calc
		retirementSavingsLess = retirementSavings - lumpSumRet;
		console.log('Retirement savings less lump sum ' + retirementSavingsLess);
		//how much income your retirement generates first year of retirement
		annualInc = Math.pow((1+r2),12);
		annualInc = annualInc * retirementSavingsLess;
		annualInc = annualInc - retirementSavingsLess;
		console.log('Annual Income ' + annualInc);
		//how much annual income do you need your first year based on your monthly expenses
		annualNeed = retExpenses * 12;
		console.log('annual need ' + annualNeed);
		//annual income less annual expenses difference
		annualDiff = annualInc -annualNeed;
		console.log('AnnualInc minus annual need ' + annualDiff);
		//total retirement savings over duration of retirement..based on number of periods user enters
		totRetSavings = Math.pow((1+r2),n2);
		totRetSavings = totRetSavings * retirementSavingsLess;
		console.log('Total retirement savings over duration ' + totRetSavings);
		//total retirement expenses over duration of retirement...factoring in inflation.
		totRetExpenses = Math.pow((1 + inflationRet),n2);
		totRetExpenses = totRetExpenses -1;
		totRetExpenses = totRetExpenses/inflationRet;
		totRetExpenses = totRetExpenses * retExpenses;
		console.log('Total retirement expenses over duration ' + totRetExpenses);
		//net remaining in retirement
		netRemaining = totRetSavings - totRetExpenses;
		console.log('Net remaining ' + netRemaining);
		//enter answers into html
		$('#annualInc').text('$ ' + annualInc.toFixed(0));
		$('#annualNeed').text('$ ' + annualNeed.toFixed(0));
		$('#annualDiff').text('$ ' + annualDiff.toFixed(0));
		//if annual difference is negative turn red
		if(annualDiff < 0) {
			$('#annualDiff').css('color', 'red');
		} else {
			$('#annualDiff').css('color', 'black');
		}
		$('#totRetSavings').text('$ ' + totRetSavings.toFixed(0));
		$('#totRetExpenses').text('$ ' + totRetExpenses.toFixed(0));
		$('#netRemaining').text('$ ' + netRemaining.toFixed(0));
		if(netRemaining < 0) {
			$('#netRemaining').css('color', 'red');
		} else {
			$('#netRemaining').css('color', 'black');
		}
	}; //end function 
	//enter answers when calculate button is clicked
	$('#calcRetirement').on('click',function() {
		enoughForRetirement();
		//animate second calcs answers
		$('.two').animate({
			fontWeight:'900',
			fontSize:'1.4em'
			}, 1500,
			function(){
				$('.two').animate({
					fontWeight:'100',
					fontSize:'1.1em'
				}, 1000);
		});
	});
	
	


//----------------------------------	
});