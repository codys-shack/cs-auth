const express = require('express')
var path = require('path');
var mysql2 = require('mysql2');


const fs = require('fs');
function readFile(filePath) {
    try {
      const data = fs.readFileSync(filePath);
      return data.toString();
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }
 }
 
const sqlpass = readFile("sqlpass.txt");
var con = mysql2.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  database:process.env.DBNAME
});

con.connect(function(err) {
  if (err) throw err;
  // con.query("USE db",function(err,result,fields){
  //   if(err) throw err;
  // })
  console.log("MySQL Connected!");
});
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
  console.log(req.body.username +" is attempting to sign in with the password " +req.body.password);
  con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL Connected for Signin");
    con.query("SELECT * FROM users",function(err,result,fields){
      let sent = false;
      if (err) throw err;
      var json = result;
      for (i in json) {
        if(req.body.username == json[i].username && req.body.password == json[i].password && sent == false){
          res.send("<p>Logged in</p>");
          console.log(req.body.username +" successfully signed in with the password " +req.body.password);
          sent = true
        }
      }
      if(sent == false){
        res.send("<p>Wrong username/password</p>");
        console.log(`${req.body.username} failed to log in with password ${req.body.password}`)
      }

    });    
  });
  
  // console.log(req.body);
});
app.post('/register', function (req, res) {
  // res.send("<p>you sent "+req.body+"</p>");
  console.log("A user is attempting to register as " + req.body.username +" with the password " +req.body.password);
  var sent = false;
  con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL Connected for Register");
    con.query("SELECT * FROM users",function(err,result,fields){
      if (err) throw err;
      var json = result;
      for (i in json) {
        if(req.body.username == json[i].username && sent == false){
          console.log("The username " + req.body.username +" is already taken");
          res.send('<script>window.location.href = window.location.href + ".html?status=nametaken";</script>');
          // console.log("The username " + req.body.username +" is already taken");
          sent = true;
        }
        
      }
      var current_id;
      con.query("SELECT MAX(id)+1 AS current_id FROM users;",function(err,result,fields){
        if (err) throw err;
        current_id = result[0].current_id;
        // console.log(current_id+" a")
        if(sent!==true){
          con.query("INSERT INTO users VALUES ("+current_id+",'"+req.body.username+"','"+req.body.password+"')",function(erra,resulta,fieldsa){
            if (erra) throw erra;
          }) 
        }
      });
      if (sent == false){
        console.log("Tne user successfully registered as " + req.body.username +" with the password " +req.body.password);
        res.send("Successfully registered!");
      // console.log("Tne user successfully registered as " + req.body.username +" with the password " +req.body.password);
      }
    });
   
    // console.log(current_id+" b");
       
  });

});
app.all('*', (req, res) => {
    res.status(404).send('<h1>This page doesn'+"'"+'t exist, dumbass!</h1>');
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
