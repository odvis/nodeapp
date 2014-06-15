$(document).ready(function() {  
  console.log("document ready, ODVIS = ");
  console.dir(ODVIS);

  new DatanavAnimations();
  var map = new Map(ODVIS);  
  var datanavModel = new DatanavModel;   

  ODVIS.search    = new Search(   '#datanav', datanavModel, map);
  ODVIS.settings  = new Settings( '#datanav', datanavModel, map);
  ODVIS.embedding = new Embedding('#datanav', datanavModel, map);

  ODVIS.search.display();

  $('#search a').click(function () {
    ODVIS.search.display();
  });

  $('#mydata a').click(function () {
    ODVIS.settings.display();
  });
  $('#embed a').click(function () {
    ODVIS.embedding.display();
  });
});
