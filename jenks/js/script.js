// Build file selection 

		d3.select("#selectfile")
		  .append("input")
          .attr("type", "file")
          .attr("accept", ".csv")
          .on("change", function() {
            var file = d3.event.target.files[0];
            if (file) {
              var reader = new FileReader();
                reader.onloadend = function(evt) {
                  dataUrl = evt.target.result;
				  previewCsvUrl(dataUrl);
              };
             reader.readAsDataURL(file);
            }
         })
		 
	
		 d3.select("#numberofbreaks")
		 .html("then the number of breaks...<br>")
		 .style("font-weight","bold")
		  .append("input")
		  .attr("id","breaks")
          .attr("type", "number")
		  .attr("min","1")
		  .attr("max","15")
		  .attr("value","5")
		  .on("change", function(){previewCsvUrl(dataUrl);})
		 
function previewCsvUrl(dataUrl) {
	
		d3.select("#jenksvalues").selectAll("*").remove();
		
		nobreaks = d3.select("#breaks").node().value;
		
		d3.csv( dataUrl, function( rows ) {
			
		row = rows[0]; 
		
		values = [];	
	
		tablesetup = d3.select("#jenksvalues")
						.append("table");
						
						
		tablerows= tablesetup.append("tr");
						
		tablerows.append("td")
			.html("<b>Var Name</b>");
			
		tablerows.append("td")
			.html("<b>&nbsp;&nbsp;&nbsp;Breaks</b>");
			
		
		
	
		for (key in row) {
		
		   values[key] =  rows.map(function(d) { return +eval("d." + key); }).filter(function(d) {return !isNaN(d)})
			
			breaks = ss.jenks(values[key], +nobreaks);
		
			xx = tablesetup.append("tr");
		
			xx.append("td")
				.text(key);
				
			xx.append("td")
				.html("&nbsp;&nbsp;&nbsp;[" + breaks + "]");
			
			
	
		}
	})

}

