const http = require('http');
const express = require('express');
const path = require('path')
var cors = require('cors');
const config = require('config');
const app = express();
const { MongoClient, ServerApiVersion, ISODate } = require('mongodb');


if (!config.db) {
  throw new Error("No 'db' configuration")
}

const uri = config.db.protocol + "://"  + config.db.username + ":" + config.db.password + "@" + config.db.host + "/" + config.db.database + "?" + Object.keys(config.db.options).map((key) => {return (key + "=" + config.db.options[key])}).join("&");

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect();

app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use('/puzzle', function(req,res){
  client.db("main").collection("puzzles").aggregate([{ $sample: { size: 1 } }]).toArray().then(puz => {
    res.json(puz[0]);
  }).catch(err => {
    res.json("error")
  });
    
});

app.use('/', function(req,res){

  const today = new Date().setUTCHours(0,0,0,0)
  
  let tomorrow = new Date().setUTCHours(24,0,0,0)
  client.db("main").collection("puzzles").findOne({ scheduled_date: { $gte:  new Date(today), $lte: new Date(tomorrow)}}).then(puzzle => {
    if (puzzle) {
      res.json(puzzle);
    }
    else {
      //select a random 
      client.db("main").collection("puzzles").aggregate([{ $match: { scheduled_date: null } },{ $sample: { size: 1 } }]).toArray().then(puzzles => {
        client.db("main").collection("puzzles").updateOne({ _id: puzzles[0]._id }, { $set: { scheduled_date: new Date(today)}})
        res.json(puzzles[0]);
      }).catch(err => {
        res.json("error: " + err)
      })
    }
      
  }).catch(err => {
    res.json("error: " + err)
  });
    
});

app.use('/schedule', function(req,res){
  client.db("main").collection("puzzles").find().toArray().then(puz => {
    res.render('schedule', {'puzzles': puz})
  }).catch(err => {
    res.json("error: " + err)
  });
  
});


const server = http.createServer(app);
const port = config.port || 3001;
server.listen(port);
console.debug('Server listening on port ' + port);