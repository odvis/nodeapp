/**
 * Routes for navigation points
 * @author Katrin Hewer <khewer.mmt-m2012@fh-salzburg.ac.at>
 */

console.log("now someone is reading routes/index.js");
module.exports = {
  "/about" : function(req, res){
    console.log("running route through index.js ... /about ");
    res.render('about', { title: 'Über uns', name: 'about' });
  },
  "/" : function(req, res){
    console.log("running route through index.js ... / ");
    res.render('visualize', { title: 'Daten visualisieren', name: 'visualize', odvis: res.locals.odvis });
  },
  "/contact" :  function(req, res){
    console.log("running route through index.js ... /contact ");
    res.render('contact', { title: 'Impressum', name: 'contact' });
  }
};
