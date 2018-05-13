//for express
const express = require('express');
const app = express();

//Body Parser Setup
const bodyParser = require('body-parser');
const path = require("path");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'www')));
app.set('trust proxy', 1);
//For session
const session = require("express-session");
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  // proxy: true,
  // cookie: { secure: true }
}));

//For mongodb
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/chatAppDB";

//For mongoose
var mongoose = require('mongoose');

mongoose.connect(url, function(err)
{
	if(err)
		throw err;
	console.log("Mongoose connection established");
});

var userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    password: String,
});

var User = mongoose.model('User', userSchema);

//Listen to the required Port
app.listen(3005, function () {
	console.log('Server is running. Point your browser to: http://localhost:3005');
});

app.get('/checkLogin', function(request, response)
{
	console.log(request.session.email);
	console.log(request.session);
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
	var query = {email : email};
	User.find(query, function(err, result)
	{
		if (err) throw err;
		console.log(result);
	    if (typeof result !== 'undefined' && result.length > 0) {
		    // console.log("User Exists");
		    console.log(result[0].password);
		    console.log(result);
		    if(result[0].password == password)
		    {
		    	save_session(request, email);
		    	console.log(request.session);
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
	})
});
var save_session = function(request, email)
{
	request.session.email = email;
	console.log(request.session);
	console.log(request.session.email);
}