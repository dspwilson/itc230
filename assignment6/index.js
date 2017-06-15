/*-----------------------------------------/
/ index.js
/
/ Derek S Wilson
/ Assignment 6
/ ITC 230 Advanced JavaScript
/ Seattle Central College
/ May 2017
/
/ Description:
/
/
/-----------------------------------------*/

'use strict';

var copyrightYear = {copyrightYear: '2017'}; // copyright year

var http = require("http"), fs = require('fs'), queryString = require("querystring");
var express = require('express');
var app = express();

var handlebars = require('express-handlebars')
   .create({ defaultLayout: 'main',
             helpers: function(name, options){
               if(!this._sections) this._sections = {};
               this._sections[name] = options.fn(this);
               return null;
             }
   });  // handlebars view engine, sections helper
   
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// bring in the data methods file
//let publicArt = require("./lib/seattle-public-art-methods.js");

// bring in the mongoose model file
var Art = require('./models/features.js');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(require('body-parser').urlencoded({ extended: true }));

app.get('/home', function(req, res) {
  console.log('home: Got GET request.');
  //  publicArt.getAll(function (err, items) {
    Art.find({}, function (err, items) {
    if (err) return next(err);
    if (items.length) { 
    //     var context = {items: items.map(function(item){
    //     // map database array to context variable to filter rendering unwanted properties
    //     return {
    //       Title: item.Title,
    //       Artist: item.Artist,
    //       ADDRESS: item.ADDRESS,
    //       Description: item.Description
    //     };
    //   })
    // };
    res.render('home', {feature: items});  // render the returned items
    }
  });
 });

app.get('/get-art-title', function(req,res) {
  console.log('get-art-title: Got GET request.');
  let searchTitle = req.query.artTitle; // could be array of requested titles to get
  // let foundArt = publicArt.get(searchTitle); // get public art objects into array
  Art.findOne({Title: searchTitle}, function (err, foundArt) {
    if (err) {
      console.log(err); 
      return;
    }
    if (foundArt) { 
      res.render('report', { Title: searchTitle, foundArt});
    }
  });
});


app.post('/get-art-title', function(req,res){
  console.log('get-art-title: Got POST request.');
  let searchTitle = req.body.artTitle; // could be array of requested titles to get
//let foundArt = publicArt.get(searchTitle); // get public art objects into array
  Art.findOne({Title: searchTitle}, function (err, foundArt) {
    if (err) {console.log(err); return;}
    if (foundArt) { 
      res.render('report', { Title: searchTitle, foundArt});
    }
  });
});

app.post('/delete-art-title', function(req,res){
  console.log('Got POST request.');
  console.log(req.body.deleteArtTitle);
  let deleteArtTitle = req.body.deleteArtTitle;  // title of art to delete
  // let deleteArtResult = publicArt.delete(deleteArtTitle);
  Art.findOneAndRemove({Title: deleteArtTitle}, function (err, deleteArt) {
    if (err) {
      console.log(err); 
      return;
    }
    if (deleteArt) {
      let countArt = Art.count({});
      let deleteArtResult = {numAdded : '1',
            newLength: countArt};
      res.render('deleted', { Title: deleteArt, deleteArtResult});
    }
  });
});

app.get('/submit', function(req, res) {
  console.log('submit: Got GET request.');
    res.render('submit', { Title: '',
                           Artist: '',
                           Description: '',
                           Address: '' });  // render empty item
  });

app.post('/add-art-title', function(req,res){
  console.log('add-art-title: Got POST request.');
  console.log(req.body.artTitle);
  
  let addArtTitle = req.body.artTitle;  // title of art to add
  let addArtArtist = req.body.artArtist;  // artist of art to add
  let addArtDescription = req.body.artDescription;  // Description of art to add
  let addArtAddress = req.body.artAddress;  // Address of art to add

  Art.findOneAndUpdate({Title: addArtTitle}, 
                      {Title: addArtTitle,
                        Artist: addArtArtist,
                        Description: addArtDescription,
                        Address: addArtAddress}, 
                        {upsert: true},
                        function (err, addArt) {
                          if (err) {console.log(err); return;}
                          if (addArt) {
                            res.render('submit', { Title: addArtTitle,
                              Artist: addArtArtist,
                              Description: addArtDescription,
                              Address: addArtAddress });
                          }
  }
  );
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
