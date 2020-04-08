var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongo = require('mongodb');
var sanitize = require('mongo-sanitize');

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine', 'ejs');
app.use('/assets', express.static('stuff'));

var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/', function(req, res){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("customers").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.render('index',{data: result});
      db.close();
    });
  });
});

app.post('/', urlencodedParser, function(req, res){
  var cool = true;
  if (!(req.body.name && typeof req.body.name === 'string'
     && req.body.lastname && typeof req.body.lastname === 'string')) {
    cool = false;
  }
  if (cool){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = { name: sanitize(req.body.name), lastname: sanitize(req.body.lastname) };
      dbo.collection("customers").insertOne(myobj, function(err, result) {
        if (err) throw err;
        res.redirect('/');
        db.close();
      });
    });
  }
  else{
    res.redirect('/');
  }
});

app.get('/delete/', function(req, res){
  var cool = true;
  if (!(req.query.id && typeof req.query.id === 'string')){
    cool = false;
  }
  if (cool){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myquery = { _id: new mongo.ObjectID(req.query.id)};
      dbo.collection("customers").deleteOne(myquery, function(err, result) {
        if (err) throw err;
        res.redirect('/');
        db.close();
      });
    });
  }
  else{
    res.redirect('/');
  }
});

app.post('/edit/', urlencodedParser, function(req, res){
  res.render('edit', {data: req.body});
});

app.post('/save/', urlencodedParser, function(req, res){
  var cool = true;
  if (!(req.body.id && typeof req.body.id === 'string'
      && req.body.name && typeof req.body.name === 'string'
      && req.body.lastname && typeof req.body.lastname === 'string')){
    cool = false;
  }
  if (cool){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myquery = { _id: new mongo.ObjectID(req.body.id)};
      var newvalues = { $set: {name: sanitize(req.body.name), lastname: sanitize(req.body.lastname)} };
      dbo.collection("customers").updateOne(myquery, newvalues, function(err, result) {
        if (err) throw err;
        res.redirect('/');
        db.close();
      });
    });
  }
  else{
    res.redirect('/');
  }
});

app.listen(80);
