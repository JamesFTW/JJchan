var express = require('express')
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var app = express()
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('port', (process.env.PORT || 5000));
app.set('db',   (process.env.MONGODB_URI || 'mongodb://heroku_66t99vts:jh4m8juf98hunt21k23go7ap1v@ds111589.mlab.com:11589/heroku_66t99vts'))

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

app.get('/', function (req, res) {
  MongoClient.connect(app.get('db'), function(err, db) {
    db.collection('Note').find().toArray(function(err, docs) {
      var results = ''
      for (var i = 0; i < docs.length; i++){
        results += (" '" + docs[i].body + "' - " +  docs[i].username + "\n\n")
      }
      res.send('<pre>' + results+ '</pre>')
      db.close()
    });
  })
})

app.post('/new', function(req, res) {
  MongoClient.connect(app.get('db'), function(err, db) {
    var col = db.collection('Note');
    col.insertOne(req.body, function(err, r) {
      if (err) throw err;
      db.close()
      res.send('Success!')
    });
  })
})



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
