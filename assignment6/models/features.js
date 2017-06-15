  /*---------------------------------------
/ features.js
/ Description: Mongo db data-model script.
/ Collection name is database is features.
/
/ Derek S Wilson
/ May, 2017
/ ITC 230 Advanced JavaScript
/ Seattle Central College
/--------------------------------------*/

var credentials = require("../lib/credentials");  // needed only for remote db

var mongoose = require("mongoose");

// remote db settings 
//   var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }  } };
//   mongoose.connect(credentials.mongo.development.connectionString, options);
  
//local db settings 
 var ip = process.env.ip || '127.0.0.1';
 mongoose.connect('mongodb://' + ip + '/seattle-public-art');

var conn = mongoose.connection; 

conn.on('error', console.error.bind(console, 'connection error:'));  

var artSchema = mongoose.Schema({

    Title: String,

    Artist: String,
    
    ADDRESS: String,

    Description: String

});


// assumes database collection is lower case plural of data-model
module.exports = mongoose.model('features', artSchema);
