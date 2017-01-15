var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000));
app.set('db',   (process.env.MONGODB_URI || 'mongodb://heroku_66t99vts:jh4m8juf98hunt21k23go7ap1v@ds111589.mlab.com:11589/heroku_66t99vts'))

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


// Use connect method to connect to the server
MongoClient.connect(app.get('db'), function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

      app.get('/', function (req, res) {
        res.send('Hello World!')
      })

      app.post('/new', function(req, res){
        var col = db.collection('Note');
        col.insertOne({
          body: req.param('body'),
          username: req.param('username')
        }, function(err, r) {
          if (err) throw err;
          console.log('We posted something to the database!')
          // Finish up test
          db.close();
        });
      })
  db.close();
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
