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
      let getTitle = params.title;  // title of art to get
      let foundArt = publicArt.get(getTitle); // get public art object
      res.writeHead(200, {'Content-Type': 'text/plain'});
        if (!foundArt) { // title(s) not found case
          res.end('Results for ' + getTitle + '\n' + 'That title not found.\n');
        } else { // found title(s)
          res.end('Results for ' + getTitle + '\n' + JSON.stringify(foundArt) + '\n');
        }
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
    default:
      console.log('Got unknown request...');
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404:Page not found.');
  }
  
}).listen(process.env.PORT || 3000);