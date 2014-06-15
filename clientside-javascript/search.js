function Search(container, datanavModel, map){
  
  var self = this;
  
  this.constructor(container, datanavModel, map);
     
  /** 
   * get available datasets
   */
  this.getAvailableDatasets = function(callback){
    $.ajax({
      type : 'GET',
      url : '/RetrieveDatasets',
      dataType : 'json',
      //data : JSON.stringify(table),
      contentType : 'application/json; charset=utf-8',
      success : function(availableDataSets) {
        datanavModel.availableDatasets = availableDataSets;
        callback(availableDataSets);
      },
      error : function(req, status, error) {
        alert('Unable to get datasets');
      }
    });   
  }
     
  /** 
   * display datasets
   */
  this.displayDatasets = function(availableDataSets){ 
    
    var datasets = availableDataSets.data;
    self.setHeadline.call(self, 'Daten auswählen', 0);

    
    $(container).empty();    
    
    for(i = 0; i < datasets.length; i++ ){
      $(container).append("<li id='" + i + "'>" + datasets[i].title + " (" + datasets[i].publisher + ")<a href='#' class='glyphicon glyphicon-plus-sign add-to-favourites'></a></li>");
    }
    
    $(container+" .add-to-favourites").bind( "click", function() {
      var id = $(this).parent().attr('id');
      self.addData(datasets[id], function(){
        //TODO: schönere Meldung, wenn nötig vorher ladeanimation 
        var index = datanavModel.data.length-1;
        $('#console').html("Datensatz " + index + " wird angezeigt...");
        $('#mydata a').trigger("click");
        self.displayMap.call(self, index);
      });
    });
  
     if($(container).html() == ""){
       $(container).append("<p>Keine Datensätze vorhanden</p>");
     }
   }
   
   /**
    * add data columns to datanav model
    * @param dataset
    */
   this.addData = function(dataset, callback){
     var data = datanavModel.data;
     var uuid = dataset.uuid
     var newData = {type: 1, columns:[], checked:[], metadata: dataset};
     self.requestDataColumns(dataset, function(result){ 
       var columns = result.data;  
       for(i=0; i<columns.length; i++){
         newData.columns.push(columns[i].title);
         if ( columns[i].title == "pop_total" ) {
           newData.checked.push(true);
         } else {
           newData.checked.push(false);
         }
       }         
       console.log(newData);
       /* es kann immer nur ein Datensatz behandelt werden */
       /* data.push(newData); */
       data[0] = newData;
       callback();
     });     
     
   }

  /** 
   * request data columns of choosen dataset
   * @param dataset
   * @param callback
  */
  this.requestDataColumns = function(dataset, callback){
    var table = {"table": dataset.table}
    console.log("data columns");
    $.ajax({
      type : 'GET',
      url : '/RetrieveData?table=' + dataset.table,
      success : function(result) {
        callback(result);
      },
      error : function(req, status, error) {
        alert('Unable to get data');
      }
    });  
  } 
  
}

Search.prototype = new Datanav();

Search.prototype.display = function(){  
  this.setHeadline.call(this, 'Meine Daten', 0); 
  
  var availableDatasets = this._datanavModel.availableDatasets;
  if(availableDatasets.length==0){
    this.getAvailableDatasets(this.displayDatasets); 
  }else{
    this.displayDatasets(availableDatasets);
  } 
}
