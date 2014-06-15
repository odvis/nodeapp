function Embedding(container, datanavModel, map){

  var self = this;
  
  this.constructor(container, datanavModel, map);
  
  /** 
   * display Code for embedding
   */  
  this.displayCode = function(){    
    
    var data = datanavModel.data;    
    console.log("data");
    console.dir(data);
    self.setHeadline.call(self, 'Mein Code', 0); 
    
    $(container).empty(); 
    
    $(container).append("<textarea></textarea>");

    var code = "";
    for(i = 0; i < data.length; i++ ){
      code += self.map.mapCode(data[i]);

    }
    $(container).append("<p>Einfach den HTML-Code in die eigene Webseite kopieren</p>");

    var soda2_doku_url = "http://dev.socrata.com/consumers/getting-started";
    var api_url        = "http://odvis.at:"+ ODVIS.port + "/resource/" + data[0].metadata.table + ".json";
    $(container).append("<p>oder die <a href='"+ api_url + "'>SODA2 API</a> abfragen "
                        + "um die rohen Daten zu bekommen. (<a href='" + soda2_doku_url + "'>Dokumentation</a>)"
                        + "</p>");

    console.log(code);
    $(container).find('textarea').append(_.escape(code) );

  }  
  
  this.id = null;
  this.breadcrumb = [this.displayCode];
  
  /** 
   * add on click listener to button 1 - one step back
   */  
  $('#left-navbar .btn_back1').click(function(){
    self.breadcrumb.pop();
    self.display();
  });  
  
  /** 
   * add on click listener to button 1 - back to start
   */  
  $('#left-navbar .btn_back2').click(function(){
    self.breadcrumb = [self.displayDatasets];
    self.display();
  });
}

/** 
 * inheritance from Daatanav
 */  
Embedding.prototype = new Datanav();

/** 
 * display last view
 */  
Embedding.prototype.display = function(){  
  this.breadcrumb[this.breadcrumb.length-1]();
}
