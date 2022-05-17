const http = require('http');
const fs = require("fs");
const https = require("https");
const express = require('express');
var cors = require('cors');
const config = require('config');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');


if (!config.db) {
  throw new Error("No 'db' configuration")
}

const uri = config.db.protocol + "://"  + config.db.username + ":" + config.db.password + "@" + config.db.host + "/" + config.db.database + "?" + Object.keys(config.db.options).map((key) => {return (key + "=" + config.db.options[key])}).join("&");

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect();

app.use(express.json());
app.use(cors());

app.use('/puzzle', function(req,res){
  client.db("main").collection("puzzles").aggregate([{ $sample: { size: 1 } }]).toArray().then(puz => {
    res.json(puz[0]);
  }).catch(err => {
    res.json("error")
  });
    
});

app.use('/puzzle/:puzzleNumber', function(req,res){
  client.db("main").collection("puzzles").find({puzzleNumber: Number(req.params.puzzleNumber)}).toArray().then(puz => {
    res.json(puz[0]);
  }).catch(err => {
    res.json("error")
  });
    
});

app.use('/schedule', function(req,res){
  client.db("main").collection("puzzles").find().toArray().then(puz => {
    res.json(puz);
  }).catch(err => {
    res.json("error")
  });
  
});

var privateKey = fs.readFileSync(__dirname + '/../localhost.key').toString();
var certificate = fs.readFileSync(__dirname + '/../localhost.crt').toString();
var credentials = {key: privateKey, cert: certificate, passphrase: "[passphrase]" };

const server = https.createServer(credentials, app);
const port = config.port || 3001;
server.listen(port);
console.debug('Server listening on port ' + port);