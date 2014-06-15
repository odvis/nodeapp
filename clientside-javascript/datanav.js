function Datanav(container, datanavModel, map){  
  
  console.log("build datanav");
  this.container = container;
  this.datanavModel = datanavModel;
  this.map = map;
  
  /** 
   * set pixels from top of the navigation container in relation to the height of the headline
   */  
  setTop = function(){  
    var height = $('#left-navbar h1').height()+20;
    $('#scroll').css('top', height+'px');
  }
  
}

/** 
 * set headline
 * @param headline
 */  
Datanav.prototype.setHeadline = function(headline, btn){
  
  var h1 = $('.navarea .header h1');
  var btn1 = $('#left-navbar .btn_back1');
  var btn2 = $('#left-navbar .btn_back2');
  
  h1.html(headline);
  
  if(btn == 0){
    h1.css({'margin-left': '5px'});
    btn1.css({'visibility': 'hidden'});
    btn2.css({'visibility': 'hidden'});  
  }else if(btn == 1){
    h1.css({'margin-left': '25px'});
    btn1.css({'visibility': 'visible'});
    btn1.css({'margin-left': '0px'});  
    btn2.css({'visibility': 'hidden'});
  }else if(btn == 2){
    h1.css({'margin-left': '55px'});
    btn1.css({'visibility': 'visible'});
    btn1.css({'margin-left': '25px'});  
    btn2.css({'visibility': 'visible'});
    btn2.css({'margin-left': '0px'});  
  }    
  
  setTop(); 
}


/**
 * display data on map 
 * @param index
 */
Datanav.prototype.displayMap = function(index){  
    console.log("display map with index "+index);
    console.log(this._datanavModel.data);
    
    var data = this._datanavModel.data[index];
    this.map.displayDatamap( this._datanavModel.data[index] );
}

/** 
 * get datanavModel
 */  
Object.defineProperty(Datanav.prototype, "datanavModel", {
  get: function() {
    return "this._datanavModel";
  },
  set: function(datanavModel) {
    this._datanavModel = datanavModel;
  }
});
