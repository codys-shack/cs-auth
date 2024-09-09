setup instructions (yes I know i could use a dockerfile but I don't know how, cody could you help me out?)
run npm install
add a .env file with DBHOST, DBUSERNAME, DBPASSWORD, and DBNAME
set up mySQL, and make sure that there is a table named "users" with the columns: id INTEGER PRIMARY KEY, username TEXT, password TEXT
manually add an entry to the users table

to run:
run node --env-file .env index.jsm