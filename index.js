var express = require('express')
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var app = express()
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'))

app.set('port', (process.env.PORT || 5000));
app.set('db',   (process.env.MONGODB_URI || 'mongodb://heroku_66t99vts:jh4m8juf98hunt21k23go7ap1v@ds111589.mlab.com:11589/heroku_66t99vts'))
app.set('view engine', 'pug')

var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var assert = require('assert');

app.get('/', function (req, res) {
  MongoClient.connect(app.get('db'), function(err, db) {
    db.collection('Note').find().toArray(function(err, docs) {
      for(var i = 0; i < docs.length; i++){
        var isImgUrl= /https?:\/\/.*\.(?:png|jpg|gif)/ig
        docs[i].body = docs[i].body.replace(isImgUrl,'<img src="$&"/>')
      }
      res.render('index', { title: 'Home', notes: docs })
      db.close()
    });
  })
})

app.post('/note', function(req, res) {
  MongoClient.connect(app.get('db'), function(err, db) {
    var col = db.collection('Note');
    col.insertOne({
      id: (new ObjectID()),
      body: req.body.body,
      username: req.body.username
    }, function(err, r) {
      if (err) throw err;
      db.close()
      res.redirect('/')
    });
  })
})

app.delete('/note', function(req, res){
  MongoClient.connect(app.get('db'), function(err, db) {
    db.collection('Note', {}, function(err, notes) {
        notes.remove({id: ObjectID(req.body.id)}, function(err, result) {
            if (err) throw err;
            db.close();
            res.send("success")
        });
    });
});
})

app.put('/note', function(req, res){
  MongoClient.connect(app.get('db'), function(err, db) {
    db.collection('Note', {}, function(err, notes){
      notes.update({id: ObjectID(req.body.id)},{ $set : { body:req.body.body, username:req.body.username } }, function(err, result){
        if(err) throw err;
        db.close()
        res.send("edit")
      })
    })
  })
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
