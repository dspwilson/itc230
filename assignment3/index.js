/*-----------------------------------------/
/ index.js
/
/ Derek S Wilson
/ Assignment 3
/ ITC 230 Advanced JavaScript
/ Seattle Central College
/ April 2017
/
/ Description:
/
/
/-----------------------------------------*/

'use strict';

var http = require("http"), fs = require('fs'), queryString = require("querystring");
var express = require('express');
var app = express();
var handlebars = require('express-handlebars')
   .create({ defaultLayout: 'main' });  // handlebars view engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// bring in the public art JSON file
let publicArt = require("./lib/seattle-public-art-methods.js");

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(require('body-parser').urlencoded({ extended: true }));

app.get('/home', function(req, res) {
  res.render('home');
});

app.post('/get-art-title', function(req,res){
  console.log('Got POST request.');
  let searchTitle = req.body.artTitle; // could be array of requested titles to get
  let foundArt = publicArt.get(searchTitle); // get public art objects into array
  res.render('report', { Title: searchTitle, foundArt});
});

app.post('/delete-art-title', function(req,res){
  console.log('Got POST request.');
  console.log(req.body.deleteArtTitle);
  let deleteArtTitle = req.body.deleteArtTitle;  // title of art to delete
  let deleteArtResult = publicArt.delete(deleteArtTitle);
  res.render('deleted', { Title: deleteArtTitle, deleteArtResult});
});

app.get('/about', function(req, res) {
  res.render('about');
});

// custom 404 page
app.use(function(req, res) {
  res.type('text/plain');
  res.status(404);
   console.log('Got 404 - Not Found request.');
  res.send('404 - Not Found');
});

// custom 500 page
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:3000' + app.get('port') + '; press Ctrl-c to terminate.');  // show console you are running
});


