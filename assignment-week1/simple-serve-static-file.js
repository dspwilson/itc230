/*--------------------------------
 simple-serve-static-file.js
 Derek S. Wilson
 April 5, 2017
 
 Seattle Central College
 ITC 230 Advanced JavaScript
 
 Purpose: Example reading static file
 and serving it in node.js, mostly taken
 right from the book.
----------------------------------*/
var http = require('http'),
	fs = require('fs');

function serveStaticFile(res, path, contentType, responseCode) {
	if(!responseCode) responseCode = 200;
	fs.readFile(__dirname + path, function(err,data) { // good practice to have error handling first
		if(err) {
			console.log(err);
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end('500 - Internal Error');
		} else {
			res.writeHead(responseCode,
				{ 'Content-Type': contentType });
			res.end(data);
		}
	});
}

http.createServer(function(req,res){
	// normalize url by removing querystring, optional
	// trailing slash, and making lowercase
	var path = req.url.replace(/\/?(?:\?.*)?$/, '')
		.toLowerCase();
	switch(path) {
		case '':
			serveStaticFile(res, '/public/home.html', 'text/html');
			console.log('Received localhost:3000 request...');
			break;
		case '/about':
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('This is Assignment for Week 1 ITC 230, for Derek S. Wilson, April 5, 2017');
			console.log('Received localhost:3000/about request...');
			break;
		default:
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('404 - File for this URL input not found.');
			console.log('Received localhost:3000 unknown request...');
			break;
	}
}).listen(3000);

console.log('Server started on localhost:3000; press Ctrl-C to terminate....');