function Settings(container, datanavModel, map){

  var self = this;
  
  this.constructor(container, datanavModel, map);
  
  /** 
   * display datasets
   */  
  this.displayDatasets = function(){
    
    var data = datanavModel.data;    
    console.log(data);
    self.setHeadline.call(self, 'Anzeige', 0); 
    
    $(container).empty(); 
    
    for(i = 0; i < data.length; i++ ){
      $(container).append("<p id='" + i + "'>" 
        + data[i].metadata.title + " (" + data[i].metadata.publisher + ")"
        + "</p><div id='columns'></div>"  
      );

    var dataset = data[i];
    var columns = data[i].columns;

      for(i=0; i<columns.length; i++){
        var inputChecked = '';
        if(dataset.checked[i]){
          inputChecked = 'checked';
        }
        $(container + " #columns").append(
          "<li>" +
          "<input type='radio' name='columns' value='"+i+"' "+inputChecked+">"+columns[i]+
          "</li>"      
        );
      }
    }
        
    if($(container).html() == ""){
       $(container).append("<p>Du hast noch keine Datensätze ausgewählt</p>");
       return;
    }


    
    //listener
    $('input[name=columns]').click(function(){
      var index = $(this).attr('value');
      console.log("column clicked " +  index);
      
      var checked = [];
      for(i=0; i<dataset.columns.length; i++){
        checked.push(false);
      }
      dataset.checked = checked;
      
      console.log(dataset.checked);
      
      if(dataset.checked[index]){
        dataset.checked[index] = false;
      }else{
        dataset.checked[index] = true;
      }
      
      console.log(dataset.checked);
      self.displayMap(0);
    });
  }

  
  /** 
   * display legend settings
   */    
  this.displayLegendSettings = function(){
    $(container).empty(); 
    console.log("legend");
  }
  
  /** 
   * display color settings
   */  
  this.displayColorSettings = function(){
    $(container).empty(); 
    console.log("color");
  }
      
  this.id = null;
  this.breadcrumb = [this.displayDatasets];
  
  /** 
   * add on click listener to button 1 - one step back
  $('#left-navbar .btn_back1').click(function(){
    self.breadcrumb.pop();
    self.display();
  });  
  
   * add on click listener to button 1 - back to start
  $('#left-navbar .btn_back2').click(function(){
    self.breadcrumb = [self.displayDatasets];
    self.display();
  });
   */  
}

/** 
 * inheritance from Daatanav
 */  
Settings.prototype = new Datanav();

/** 
 * display last view
 */  
Settings.prototype.display = function(){  
  this.setHeadline.call(this, 'Anzeige gestalten', 0);
  this.displayDatasets();
}
