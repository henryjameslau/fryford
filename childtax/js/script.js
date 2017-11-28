// Build file selection 

	 
		 d3.select("#children")
		 .html("How many children with childcare?<br>")
		 .style("font-weight","bold")
		  .append("input")
		  .attr("id","child")
          .attr("type", "number")
		  .attr("value","0")
		  .attr("min","0")
		  .attr("max","5")
		  .on("change", function(){calcsavings();})
		  
		  
		 d3.select("#days")
		 .html("How many days per week?<br>")
		 .style("font-weight","bold")
		  .append("input")
		  .attr("id","day")
          .attr("type", "number")
		  .attr("value","0")
		  .attr("min","0")
		  .attr("max","5")
		  .on("change", function(){calcsavings();})
		  
		  
		 d3.select("#hours")
		 .html("How many hours per day? (average)<br>")
		 .style("font-weight","bold")
		  .append("input")
		  .attr("id","hour")
          .attr("type", "number")
		  .attr("value","0")
		  .attr("min","0")
		  .attr("max","15")
		  .on("change", function(){calcsavings();})
		  
		  
		d3.select("#weeks")
		 .html("How many weeks per year?<br>")
		 .style("font-weight","bold")
		  .append("input")
		  .attr("id","week")
          .attr("type", "number")
		  .attr("value","0")
		  .attr("min","0")
		  .attr("max","52")
		  .on("change", function(){calcsavings();})
		  
		  
		 d3.select("#cost")
		 .html("What cost per hour? (average)<br>")
		 .style("font-weight","bold")
		  .append("input")
		  .attr("id","money")
          .attr("type", "number")
		  .attr("value","0")
		  .attr("min","0")
		  .attr("max","5")
		  .on("change", function(){calcsavings();})
		  
		 d3.select("#adults1")
		 .html("How many parents on basic tax rate?<br>")
		 .style("font-weight","bold")
		  .append("input")
		  .attr("id","adultsbasic")
          .attr("type", "number")
		  .attr("value","0")
		  .attr("min","0")
		  .attr("max","2")
		  .on("change", function(){calcsavings();})
		  
	    d3.select("#adults2")
		 .html("How many parents on higher tax rate?<br>")
		 .style("font-weight","bold")
		  .append("input")
		  .attr("id","adultshigh")
          .attr("type", "number")
		  .attr("value","0")
		  .attr("min","0")
		  .attr("max","2")
		  .on("change", function(){calcsavings();})
		  
		  
		d3.select("#go").on("click", function(){initiate();})
		
function initiate() {
	
	d3.select("#go").remove();
	
	d3.select("#results").style("display","block");
	
	d3.select("#totalcost").text(0);
	d3.select("#totalcostvouchers").text(0);
	d3.select("#totalcostgovt").text(0);
	
	calcsavings();
	
}
		 
function calcsavings() {
	
	children = d3.select("#child").property("value");
	days = d3.select("#day").property("value");
	hours = d3.select("#hour").property("value");
	weeks = d3.select("#week").property("value");
	money = d3.select("#money").property("value");
	
	adultsh = d3.select("#adultsbasic").property("value");
	adultsl = d3.select("#adultshigh").property("value");
	
	totalcost = children * days * hours * weeks * money;
	
	totalsavingvouchers = (adultsh * 625) + (adultsl * 933)
	totalsavinggovt = totalcost * 0.2;
	
	totalcostvouchers = totalcost - totalsavingvouchers;
	totalcostgovt = totalcost - totalsavinggovt;
	
	
	d3.select("#totalcost").text(totalcost);
	d3.select("#totalcostvouchers").text(totalcostvouchers);
	d3.select("#totalcostgovt").text(totalcostgovt);
	console.log(totalcost);
	
		
}

