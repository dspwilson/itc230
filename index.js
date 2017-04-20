/*-----------------------------------------/
/ index.js
/
/ Derek S Wilson
/ Assignment 2
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
let publicArt = require("./lib/seattle-public-art-methods.js");

function serveStatic(res, path, contentType, responseCode){
  if(!responseCode) responseCode = 200;
  fs.readFile(__dirname + path, function(err, data){
      if(err){
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
      }
      else{
        res.writeHead(responseCode, {'Content-Type': contentType});
        res.end(data);
      }
  });
}

console.log('Waiting for browser input on localhost:3000...');  // show console you are running

http.createServer((req,res) => {
  let url = req.url.split("?");  // seperate route from query string
  let params = queryString.parse(url[1]); // convert query string to object
  let path = url[0].toLowerCase();

  switch(path) {
    case '/home':
      serveStatic(res, '/public/home.html', 'text/html');
      break;
    case '/about':
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('About Seattle Public Art by Ohanapecosh Maps');
      break;
    case '/get':
      /* array titles logic */
      let getTitles = []; // could be array of requested titles to get
      getTitles.push(params.title);  // push titles reuqested onto array of titles
      var foundArt = []; // array to contain public art objects
      let currentLength; // holds current length
      getTitles.forEach(function(title){
        let getResult = publicArt.get(title);
        foundArt.push(getResult.foundArt); // get public art objects into array
        currentLength = getResult.currentLength;  // will have length from last title
      });
      /* array return titles logic */
      res.writeHead(200, {'Content-Type': 'text/plain'});
      foundArt.forEach(function(thisArt) {
        if (!thisArt) {
          res.write('Results for ' + params.title + '\n' + 'That title not found.\n'
                     + currentLength + ' art objects available.');
        } else {
          res.end('Results for ' + params.title + '\n' + JSON.stringify(thisArt) + '\n'
                   + currentLength + ' art objects available.');
        }
      });
      break;
    case '/delete':
      let deleteTitle = params.title;  // title of art to delete
      let deleteResult = publicArt.delete(deleteTitle);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      if (deleteResult.numDeleted == 0) {  // if nothing deleted, title not found
        res.end('Title not found. ' + deleteResult.newLength + ' art objects remain.\n');
      } else {  // number deleted not 0, so title found and deleted
        res.end('Deleted ' + deleteTitle + '. ' + 'Now ' + deleteResult.newLength + ' art objects remain.\n');
      }
      break;
    case '/add' :
      let addTitle = params.title;  // title of art to delete
      let addResult = publicArt.add(addTitle);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      if (addResult.numAdded == 0) {  // if nothing added, failed
        res.end('Title not added. ' + addResult.newLength + ' art objects remain.\n');
      } else {  // number add not 0, so title added
        res.end('Added ' + addTitle + '. ' + 'Now ' + addResult.newLength + ' art objects remain.\n');
      }
    break;  
    default:
      console.log('Got unknown request...');
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404:Page not found.');
  }
  
}).listen(process.env.PORT || 3000);