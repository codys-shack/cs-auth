const express = require('express')
var path = require('path');
var mysql2 = require('mysql2');
const fs = require('fs');
//Simple function to synchronously read a file using fs
function readFile(filePath) {
    try {
      const data = fs.readFileSync(filePath);
      return data.toString();
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }
 }
//creates the connection that will be used to connect to the sql database
var con = mysql2.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  database:process.env.DBNAME
});
//tests if the sql connection is working
con.connect(function(err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});
const app = express()
const bodyParser = require('body-parser');
//I don't know what this is for; I got it from the internet
app.use(bodyParser.urlencoded({ extended: true }));
//Defines the port the app runs on
//1
const port = 4000
//marks the public directory to be sent to the user
app.use(express.static(path.join(__dirname, 'public')));
//Redirects anyone visiting the / directory to public/index.html; may be vestigial
app.get('/', (req, res) => {
  res.send('<script>window.location.href = window.location.href + "public/index.html";</script>')
})
//Handles requests to log in
app.post('/signin', function (req, res) {
  console.log(req.body.username +" is attempting to sign in with the password " +req.body.password);
  //Connects to SQL for checking if the user's username and password are correct
  con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL Connected for Signin");
    //Gets data from the 'users' table
    con.query("SELECT * FROM users",function(err,result,fields){
      //A variable that will be set to 'true' if the user's credentials are correct
      let sent = false;
      if (err) throw err;
      var json = result;
      //Loops through the retrieved data to check for a match for the user's credentials
      for (i in json) {
        //The code to execute if the user's credentials are correct, and a match has not already been found (there should only ever be one match, but you never know)
        if(req.body.username == json[i].username && req.body.password == json[i].password && sent == false){
          //2
          res.send("<p>Logged in</p>");
          console.log(req.body.username +" successfully signed in with the password " +req.body.password);
          sent = true
        }
      }
      //The code to be executed if no match for the user's credentials has been found
      if(sent == false){
        //3
        res.send("<p>Wrong username/password</p>");
        console.log(`${req.body.username} failed to log in with password ${req.body.password}`)
      }
    });    
  });
});
//Handles requests to register an account
app.post('/register', function (req, res) {
  console.log("A user is attempting to register as " + req.body.username +" with the password " +req.body.password);
  //A variable that will be set to true if the user's credentials already exist in the database
  var sent = false;
  //Connects to the SQL database to get user data
  con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL Connected for Register");
    //Gets data from the users table
    con.query("SELECT * FROM users",function(err,result,fields){
      if (err) throw err;
      var json = result;
      //Loops through the users data to check if the user's credentials already exist in the database
      for (i in json) {
        //Code to be executed if the user's credentials already exist in the system
        if(req.body.username == json[i].username && sent == false){
          //4
          console.log("The username " + req.body.username +" is already taken");
          res.send('<script>window.location.href = window.location.href + ".html?status=nametaken";</script>');
          sent = true;
        }  
      }
      //A variable that stores the new user's ID
      var current_id;
      //Queries the database for the highest user ID, and then increments it by 1
      con.query("SELECT MAX(id)+1 AS current_id FROM users;",function(err,result,fields){
        if (err) throw err;
        current_id = result[0].current_id;
        if(sent!==true){
          //Writes the user's credentials to the database
          con.query("INSERT INTO users VALUES ("+current_id+",'"+req.body.username+"','"+req.body.password+"')",function(erra,resulta,fieldsa){
            if (erra) throw erra;
          })
        }
      });
      //Code to execute if no match for the user's credentials has been found
      if (sent == false){
        //5
        console.log("Tne user successfully registered as " + req.body.username +" with the password " +req.body.password);
        res.send("Successfully registered!");
      }
    });
  });
});
//Catches any requests not already handled and sends the 404 page
app.all('*', (req, res) => {
    //6
    res.status(404).send('<h1>This page doesn'+"'"+'t exist, dumbass!</h1>');
});
//Starts the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
