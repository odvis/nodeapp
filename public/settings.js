function Settings(container, datanavModel){
	
	var self = this;
  
  this.constructor(container, datanavModel);
	
	this.displayFavourites = function(){		
		
		var favourites = datanavModel.favourites;		
		
    self.setHeadline.call(self, 'Meine Daten'); 
		
  	$(container).empty(); 
  	
  	for(i = 0; i < favourites.length; i++ ){
  		$(container).append("<li id='" + i + "'>" 
  			+ favourites[i].title + " (" + favourites[i].publisher + ")"
  			+ "<a href='#' class='glyphicon glyphicon-chevron-right'></a>"
  			+ "<a href='#' class='glyphicon glyphicon-trash'></a>"
  			+ "</li>"	
  		);
  	}
  	  	
  	// listener
  	$(container + " .glyphicon-trash").click(function(){
  		var id = $(this).parent().attr("id");
  		datanavModel.favourites.splice(id, 1);
  		self.displayFavourites();
  	});
  	
  	$(container + " .glyphicon-chevron-right").click(function(){
  		self.displaySettings();
  	});
  			
		if($(container).html() == ""){
 			$(container).append("<p>Du hast noch keine Datensätze ausgewählt</p>");
 		}
	}	

	this.displaySettings = function(){
		$(container).empty(); 
		self.breadcrumb.push(self.displaySettings);
		$(container).append(
			"<li class='type'><a href='#'>Anzeigetyp</a></li>" +
			"<li><a href='#'>Legende</a></li>" +
			"<li><a href='#'>Farbschema</a></li>"
	  );
	  
	  //listener
	  $(container + " .type").click(function(){
	  	self.displayTypeSettings();
	  });
	}
	
	this.displayTypeSettings = function(){
		$(container).empty(); 
		self.breadcrumb.push(self.displayTypeSettings);
		$(container).append(
			"<li>##############</li>"
			// TODO:
			// Typ: Maximum einfärben, Werte vergleichen (Radio)
			// get DataColumns
			// bei Maximum: Auswahl einer Column über Radiobuttons
			// bei Werte vergleichen: Auswahl mehrerer Columns über Checkboxen
		);
	}
	
	this.displayLegendSettings = function(){
		$(container).empty(); 
		console.log("legend");
	}
	
	this.displayColorSettings = function(){
		$(container).empty(); 
		console.log("color");
	}
		  
  this.id = null;
  this.breadcrumb = [this.displayFavourites];
}

Settings.prototype = new Datanav();

Settings.prototype.display = function(){	
	this.breadcrumb[this.breadcrumb.length-1]();
}
