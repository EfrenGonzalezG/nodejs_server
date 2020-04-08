var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongo = require('mongodb');

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
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { name: req.body.name, lastname: req.body.lastname };
    dbo.collection("customers").insertOne(myobj, function(err, result) {
      if (err) throw err;
      res.redirect('/');
      db.close();
    });
  });
});

app.get('/delete/', function(req, res){
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
});

app.post('/edit/', urlencodedParser, function(req, res){
  console.log(req.body);
  res.render('edit', {data: req.body});
});

app.post('/save/', urlencodedParser, function(req, res){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { _id: new mongo.ObjectID(req.body.id)};
    var newvalues = { $set: {name: req.body.name, lastname: req.body.lastname} };
    dbo.collection("customers").updateOne(myquery, newvalues, function(err, result) {
      if (err) throw err;
      res.redirect('/');
      db.close();
    });
  });
});

app.get('/llenar/', function(req, res){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = [
      { name: 'John', lastname: 'Highway 71'},
      { name: 'Peter', lastname: 'Lowstreet 4'},
      { name: 'Amy', lastname: 'Apple st 652'},
      { name: 'Hannah', lastname: 'Mountain 21'},
      { name: 'Michael', lastname: 'Valley 345'},
      { name: 'Sandy', lastname: 'Ocean blvd 2'},
      { name: 'Betty', lastname: 'Green Grass 1'},
      { name: 'Richard', lastname: 'Sky st 331'},
      { name: 'Susan', lastname: 'One way 98'},
      { name: 'Vicky', lastname: 'Yellow Garden 2'},
      { name: 'Ben', lastname: 'Park Lane 38'},
      { name: 'William', lastname: 'Central st 954'},
      { name: 'Chuck', lastname: 'Main Road 989'},
      { name: 'Viola', lastname: 'Sideway 1633'}
    ];
    dbo.collection("customers").insertMany(myobj, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
  });
  console.log("Llenar db");
  res.redirect('/');
});

app.listen(80);
