const express = require('express')
var path = require('path');

const fs = require('fs');
function readFile(filePath) {
    try {
      const data = fs.readFileSync(filePath);
      return data.toString();
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }
 }
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const port = 4000
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.send('<script>window.location.href = window.location.href + "public/index.html";</script>')
})

app.post('/game', function (req, res) {
    res.send("<p>you sent "+req.body.name+"</p>");
    console.log(req.body);
});
app.post('/signin', function (req, res) {
  var json = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
  console.log(json);
  for (i in json) {
    if(req.body.username == json[i].username && req.body.password == json[i].password){
      res.send("<p>Logged in</p>");
    }
  }
  console.log(req.body);
});
app.post('/register', function (req, res) {
  // res.send("<p>you sent "+req.body+"</p>");
  var json = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
  let sent = false;
  for (i in json) {
    if(req.body.username == json[i].username){
      res.send('<script>window.location.href = window.location.href + ".html?status=nametaken";</script>');
      sent = true;
    }
  }
  if(sent == false){
    res.send("<p>Registered succesfully</p>");
  }
  console.log(req.body);
  
  json.push({"username":req.body.username,"password":req.body.password});
  fs.writeFileSync("./users.json",JSON.stringify(json));
});
app.all('*', (req, res) => {
    res.status(404).send('<h1>This page doesn'+"'"+'t exist, dumbass!</h1>');
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
