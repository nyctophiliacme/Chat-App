//for express
var express = require('express');
var app = express();

//Body Parser Setup
var bodyParser = require('body-parser');
var path = require("path");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'www')));

//For session
var session = require("express-session");
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false
}));

//For mongodb
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//Listen to the required Port
app.listen(3005, function () {
	console.log('Server is running. Point your browser to: http://localhost:3005');
});


// app.get('/users', function(request, response)
// {
// 	console.log("User invoked");
// 	response.json([
// 		{id: 1, username: "Pransh"},
// 		{id: 2, username: "Tiwari"}
// 	]);
// });

app.get('/checkLogin', function(request, response)
{
	console.log(request.session.email);
	if(!request.session.email)
	{
		response.send(JSON.stringify({
			result: 'No Session'
		}));
	}
	else
	{
		response.send(JSON.stringify({
			result: 'Session Exists',
			email: request.session.email
		}));
	}
});


app.post('/login', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');
	console.log(request.body.email);
	// console.log(request);
	var email = request.body.email;
	var password = request.body.password;
	// request.session.email = email;
	if(request.body.email && request.body.password)
	{
		var userData = {
			email: request.body.email,
			password: request.body.password
		}
	}
	MongoClient.connect(url, function(err, db)
	{
		if(err)
			throw err;
		var dbo = db.db("chatAppDB");
		var query = {email : email};
		dbo.collection("users").find(query).toArray(function(err, result) {
		    if (err) throw err;
		    if (typeof result !== 'undefined' && result.length > 0) {
			    // console.log("User Exists");
			    console.log(result[0].password);
			    console.log(result);
			    if(result[0].password == password)
			    {
			    	save_session(request, email);
			    	response.send(JSON.stringify({
						result: 'Successful'
					}));
			    }
			    else
			    {
			    	response.send(JSON.stringify({
						result: 'Wrong Password'
					}));
			    }
			}
			else
			{
				response.send(JSON.stringify({
					result: 'No Such User'
				}));
			}
		    // console.log(result);
		    db.close();
	  });
	});
});

var save_session = function(request, email)
{
	request.session.email = email;
	console.log(request.session.email);
}