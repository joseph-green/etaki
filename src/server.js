const http = require('http');
const express = require('express');
const path = require('path');
var cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');



const uri = "mongodb+srv://etakiuser:[pwd]@cluster0.ot16m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect();

app.use(express.json());
app.use(cors());

// default URL for website
app.use('/public', express.static(__dirname + '/public'));
app.use('/puzzle/:puzzleNumber', function(req,res){
    console.log(Number(req.params.puzzleNumber))
    client.db("main").collection("puzzles").find().toArray().then(puz => {

      res.json(puz[0]);
    }).catch(err => {
      res.json("error")
    });
    
    
    
    //__dirname : It will resolve to your project folder.
  });

const server = http.createServer(app);
const port = 3001;
server.listen(port);
console.debug('Server listening on port ' + port);