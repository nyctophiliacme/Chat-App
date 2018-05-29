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
var ObjectID = require('mongodb').ObjectID;

mongoose.connect(url, function(err)
{
	if(err)
		throw err;
	console.log("Mongoose connection established");
});

var userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
},
{
	collection: 'users'
});

var channelSchema = mongoose.Schema(
{
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String
},
{
	collection: 'channels'
});

var channelUserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: String,
	channelName: String
},
{
	collection: 'channelUsers'
});

var User = mongoose.model('users', userSchema);
var Channel = mongoose.model('channels', channelSchema);
var ChannelUser = mongoose.model('channelUsers', channelUserSchema);
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

app.post('/signup', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');

	var name = request.body.name;
	var email = request.body.email;
	var password = request.body.password;

	if(request.body.email && request.body.password && request.body.name)
	{
		var userData = {
			_id: new ObjectID(),
			email: request.body.email,
			password: request.body.password,
			name: request.body.name
		}
	}
	else
	{
		response.send(JSON.stringify({
			message: 'Invalid Data'
		}));
	}
	var query = {email : email};
	User.find(query, function(err, result)
	{
		if (err) throw err;
		console.log(result);
	    if (typeof result !== 'undefined' && result.length > 0) {
	    	response.send(JSON.stringify({
				message: 'User exists'
			}));
		}
		else
		{
			var userObj = new User(userData);
			userObj.save(function(error,data)
			{
				if(error)
				{
					response.send(JSON.stringify({
						message: "Unable to write to DB",
						extra: error
					}));
				}
				else
				{
					response.send(JSON.stringify({
						extra: data,
						message: "Successful"
					}));
				}
			});
		}
	});
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
	else
	{
		response.send(JSON.stringify({
			message: 'Invalid Data'
		}));
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
		    		email: email,
		    		name: result[0].name,
					message: 'Successful'
				}));
		    }
		    else
		    {
		    	response.send(JSON.stringify({
					message: 'Wrong Password'
				}));
		    }
		}
		else
		{
			response.send(JSON.stringify({
				message: 'No Such User'
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

app.post('/createChannel', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');
	console.log(request.body);
	var email = request.body.email;
	var channelName = request.body.channelName;
	var description = request.body.description;

	if(request.body.email && request.body.channelName && request.body.description)
	{
		var channelData = {
			_id: new ObjectID(),
			name: channelName,
			description: description
		}
		var query = {name : channelName};
		Channel.find(query, function(err, result)
		{
			if (err) throw err;
		    if (typeof result !== 'undefined' && result.length > 0) {
		    	response.send(JSON.stringify({
					message: 'Channel name already exists'
				}));
			}
			else
			{
				var channelObj = new Channel(channelData);
				channelObj.save(function(error,data)
				{
					if(error)
					{
						response.send(JSON.stringify({
							message: "Unable to write to DB",
							extra: error
						}));
					}
					else
					{
						var channelUserData = {
							_id: new ObjectID(),
							email: email,
							channelName: channelName
						}
						var channelUserObj = new ChannelUser(channelUserData);
						channelUserObj.save(function(error,data)
						{
							if(error)
							{
								response.send(JSON.stringify({
									message: "Unable to write to DB!",
									extra: error
								}));
							}
							else
							{
								response.send(JSON.stringify({
									extra: data,
									message: "Successful"
								}));
							}
						});
					}
				});
			}
		});
	}
	else
	{
		response.send(JSON.stringify({
			message: 'Please enter the channelName'
		}));
	}
});


app.post('/loadChannels', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');
	var email = request.body.email;
	if(request.body.email)
	{
		var query = {email : email};
		var constraints = { 
	        __v: false,
	        _id: false,
	        email: false
	    };
		ChannelUser.find(query, constraints, function(err, result)
		{
			if (err) throw err;
			console.log(result);
		    if (typeof result !== 'undefined' && result.length > 0) {
			    response.send(JSON.stringify({
			    	message: 'Retrieved Channels',
			    	data: result
			    }))
			}
			else
			{
				response.send(JSON.stringify({
					message: 'User has no channels'
				}));
			}
		});
	}
	else
	{
		response.send(JSON.stringify({
			message: 'No email'
		}));
	}
});


app.post('/addUser', function(request,response)
{
	response.setHeader('Content-Type', 'application/json');
	console.log(request.body);
	var email = request.body.email;
	var channel = request.body.channel;

	if(request.body.email && request.body.channel)
	{
		var query = {email : email};
		User.find(query, function(err, result)
		{
			if(err)
			{
				response.send(JSON.stringify({
					message: "Unable to connect to DB!",
					extra: err
				}));
			}
			else
			{
				if(typeof result !== 'undefined' && result.length > 0)
				{
					var queryCheck = {email: email, channelName: channel};

					ChannelUser.find(queryCheck, function(err,result)
					{
						if(err)
						{
							response.send(JSON.stringify({
								message: "Unable to connect to DB!",
								extra: err
							}));
						}
						else
						{
							console.log(result);
							if(typeof result !== 'undefined' && result.length > 0)
							{
								response.send(JSON.stringify({
									message: "User already in channel!"
								}));
							}
							else
							{
								var channelUserData = {
									_id: new ObjectID,
									email: email,
									channelName: channel
								};
								var channelUserObj = new ChannelUser(channelUserData);
								channelUserObj.save(function(error,data)
								{
									if(error)
									{
										response.send(JSON.stringify({
											message: "Unable to connect to DB!",
											extra: error
										}));
									}
									else
									{
										response.send(JSON.stringify({
											message: "Successful",
											extra: data
										}));
									}
								});
							}
						}
					});
				}
				else
				{
					response.send(JSON.stringify({
						message: "User does not exist!"
					}));
				}
			}
		});
	}
	else
	{
		response.send(JSON.stringify({
			message: 'Please enter the email-id'
		}));
	}
});