function DatanavAnimations(){
	var navopened = true;
	
	$('#left-navbar .nav-tabs li').click(function() {
	  if (!navopened) {
	    fadeIn();
	  }  
	  
	});
	
	$('#x').click(function() {
	  if (navopened) {
	   
	    $('#left-navbar .navarea').addClass('closed');
	    
	    $('#x i').removeClass('glyphicon-remove');
	    $('#x i').addClass('glyphicon-chevron-right');
	    navopened = false;
	  }else{
	  	fadeIn();
	  }
	});
	
	function fadeIn() {
	  
	  $('#left-navbar .navarea').removeClass('closed');
	  
	  $('#x i').removeClass('glyphicon-chevron-right');
	  $('#x i').addClass('glyphicon-remove');
	  
	  navopened = true;
	}
}

