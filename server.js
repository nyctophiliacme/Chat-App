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
    channelName: String,
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

var messageSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: String,
	name: String,
	channelName: String,
	message: String,
	date: { type : Date, default: Date.now }
},
{
	collection: 'messages'
});
var User = mongoose.model('users', userSchema);
var Channel = mongoose.model('channels', channelSchema);
var ChannelUser = mongoose.model('channelUsers', channelUserSchema);
var Message = mongoose.model('messages', messageSchema);
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
			channelName: channelName,
			description: description
		}
		var query = {channelName : channelName};
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
				var channelDesc = new Array();
		    	asyncLoop(0, result, channelDesc, function()
				{
					console.log(channelDesc);
					response.send(JSON.stringify({
				    	message: 'Retrieved Channels',
				    	data: result,
						desc: channelDesc	
				    }));
				});
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
function asyncLoop(i, result, channelDesc, callback)
{
	if( i < result.length)
	{
		var constraintsDesc = {
    		__v: false,
    		_id: false,
    		channelName: false
    	};
		var queryDesc = {channelName: result[i].channelName};
    	Channel.find(queryDesc, constraintsDesc, function(err, resultDesc)
    	{
    		if(err) throw err;
    		if(typeof resultDesc !== 'undefined' && resultDesc.length > 0)
    		{
    			console.log(resultDesc[0]);
    			channelDesc.push(resultDesc[0]);
    			asyncLoop(i+1, result, channelDesc, callback);
    		}
    	});
	}
	else
	{
		callback();
	}
}


app.post('/addUser', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');
	console.log(request.body);
	var email = request.body.email;
	var channelName = request.body.channelName;

	if(request.body.email && request.body.channelName)
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
					var queryCheck = {email: email, channelName: channelName};

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
									channelName: channelName
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

app.post('/postMessage', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');

	console.log(request.body);
	// console.log(Date.now());

	if(request.body.email && request.body.name && request.body.channelName && request.body.message)
	{
		var email = request.body.email;
		var message = request.body.message;
		var channelName = request.body.channelName;
		var name = request.body.name;
		var messageData = {
			_id: new ObjectID(),
			email: email,
			name: name,
			channelName: channelName,
			message: message
		};
		var messageObj = new Message(messageData);
		messageObj.save(function(error, data){
			if(error)
			{
				response.send(JSON.stringify({
					message: "Unable to save message",
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
});

app.get('/getMessage', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');
	console.log(request.query.channelName);
	if(request.query.channelName)
	{
		var channelName = request.query.channelName;
		var constraints = {
			__v: false,
			_id: false,
			channelName: false
		}
		var query = {channelName: channelName};
		Message.find(query, constraints).sort('date').exec(function(err, result)
		{
			if(err)
			{
				response.send(JSON.stringify({
					message: "Error in fetching chat"
				}));
			}
			else if(typeof result !== 'undefined' && result.length > 0)
			{
				response.send(JSON.stringify({
					message: "Chat Received",
					data: result
				}));
			}
		});
	}
});