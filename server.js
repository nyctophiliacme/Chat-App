//for express
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

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

// Making mongodb connection
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/chatAppDB";

// Mongoose connection
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

mongoose.connect(url, function(err)
{
	if(err)
		throw err;
	console.log("Mongoose connection established");
});

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
},
{
	collection: 'users'
});

const channelSchema = mongoose.Schema(
{
    _id: mongoose.Schema.Types.ObjectId,
    channelName: String,
    description: String
},
{
	collection: 'channels'
});

const buddySchema = mongoose.Schema(
{
    _id: mongoose.Schema.Types.ObjectId,
    directRelation: String,
    email1: String,
    email2: String,
    name1: String,
    name2: String
},
{
	collection: 'buddies'
});

const channelUserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: String,
	channelName: String
},
{
	collection: 'channelUsers'
});

const messageSchema = mongoose.Schema({
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
const User = mongoose.model('users', userSchema);
const Channel = mongoose.model('channels', channelSchema);
const ChannelUser = mongoose.model('channelUsers', channelUserSchema);
const Message = mongoose.model('messages', messageSchema);
const Buddy = mongoose.model('buddies', buddySchema);
// Listen to the required Port
http.listen(3005, function () {
	console.log('Server is running. Point your browser to: http://localhost:3005');
});

app.get('/checkLogin', function(request, response)
{
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
	    if (typeof result !== 'undefined' && result.length > 0) {
		    if(result[0].password == password)
		    {
		    	save_session(request, email);
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
}

app.post('/createChannel', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');
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

app.post('/addBuddy', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');
	var email1 = request.body.email1;
	var email2 = request.body.email2;
	var name1 = request.body.name1;
	var directRelation = '';

	if(email1 && email2)
	{
		if(email1 < email2)
		{
			directRelation = email1+'-'+email2;
		}
		else
		{
			directRelation = email2+'-'+email1;
		}
		console.log("Direct Relation of the buddies is: " + directRelation);
		var query = {directRelation : directRelation};
		Buddy.find(query, function(err, result)
		{
			if (err) throw err;
		    if (typeof result !== 'undefined' && result.length > 0) {
		    	response.send(JSON.stringify({
					message: 'Buddy already exists!'
				}));
			}
			else
			{
				var userQuery = {email: email2};
				var constraints = { 
			        __v: false,
			        _id: false,
			        email: false,
			        password: false
			    };
			    User.find(userQuery, constraints, function(err, result)
			    {
			    	if(err) throw err;

			    	if(typeof result !== 'undefined' && result.length > 0)
			    	{
			    		var name2 = result[0].name;
			    		var buddyData = {
							_id: new ObjectID(),
							directRelation: directRelation,
							email1: email1,
							email2: email2,
							name1: name1,
							name2: name2
						};
			    		var buddyObj = new Buddy(buddyData);
						buddyObj.save(function(error,data)
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
									message: "Successful",
									buddyName: name2
								}));
							}
						});
			    	}
			    	else
			    	{
			    		response.send(JSON.stringify({
			    			message: 'No such User found'
			    		}));
			    	}
			    });		
			}
		});
	}
	else
	{
		response.send(JSON.stringify({
			message: 'Please enter your buddy name'
		}));
	}
});

app.get('/loadBuddies', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');
	if(request.query.email)
	{
		var email = request.query.email;
		var query = { $or: [ {email1: email}, {email2: email} ] };
		var constraints = {
			__v: false,
			_id: false
		};
		Buddy.find(query, constraints, function(err, result)
		{
			if(err) throw err;
			console.log(result);
			if (typeof result !== 'undefined' && result.length > 0) 
			{
				var buddyDesc = new Array();
				for(var i = 0; i < result.length; i++)
				{
					if(result[i].email1 === email)
					{
						var temp = {'email': result[i].email2, 'name': result[i].name2, 'relation': result[i].directRelation};
						buddyDesc.push(temp);
					}
					else
					{
						var temp = {'email': result[i].email1, 'name': result[i].name1, 'relation': result[i].directRelation};
						buddyDesc.push(temp);
						// buddyEmail.push(result[i].email1);
						// buddyName.push(result[i].name1);
					}
					// buddyRelation.push(result[i].directRelation);
				}
				response.send(JSON.stringify({
			    	message: 'Retrieved Buddies',
			    	data: buddyDesc	
			    }));
			}
			else
			{
				response.send(JSON.stringify({
					message: 'User has no buddies'
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

app.get('/loadChannels', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');
	if(request.query.email)
	{
		var email = request.query.email;
		var query = {email : email};
		var constraints = { 
	        __v: false,
	        _id: false,
	        email: false
	    };
		ChannelUser.find(query, constraints, function(err, result)
		{
			if (err) throw err;
		    if (typeof result !== 'undefined' && result.length > 0) {
				var channelDesc = new Array();
		    	asyncLoop(0, result, channelDesc, function()
				{
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
});

app.get('/getMessage', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');
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
			else if(typeof result !== 'undefined' && result.length >= 0)
			{
				response.send(JSON.stringify({
					message: "Chat Received",
					data: result
				}));
			}
		});
	}
});

app.get('/checkUserEmail', function(request, response)
{
	response.setHeader('Content-Type', 'application/json');
	if(request.query.email)
	{
		var email = request.query.email;
		var query = {email: email};
		var constraints = { 
	        __v: false,
	        _id: false,
	        password: false
	    };
		User.find(query, constraints, function(err, result)
		{
			if(err) throw err;
			if(typeof result !== 'undefined' && result.length > 0)
			{
				response.send(JSON.stringify({
					message: 'Found',
					data: result[0]
				}));
			}
			else
			{
				response.send(JSON.stringify({
					message: 'No such user exists' 
				}));
			}
		});
	}
	else
	{
		response.send(JSON.stringify({
			message: 'No email-id passed'
		}));
	}
});

io.sockets.on('connection', function(socket){
	// console.log("A user has connected");

	// socket.on('chat-message', function(msg){
	// 	console.log("Message --> " + msg);
	// 	io.emit('message', msg);
	// });

	// socket.on('disconnect', function(){
	// 	console.log("User disconnected");
	// });
	socket.on('subscribe', function(room){
		console.log("Joining Room", room);
		socket.join(room);
	});

	socket.on('unsubscribe', function(room){
		console.log("Leaving room", room);
		socket.leave(room);
	});

	socket.on('send', function(data){
		if(data.email && data.name && data.channelName && data.message)
		{
			var email = data.email;
			var message = data.message;
			var channelName = data.channelName;
			var name = data.name;
			var date = Date.now();
			var messageData = {
				_id: new ObjectID(),
				email: email,
				name: name,
				channelName: channelName,
				message: message,
				date: date
			};
			data.date = date;
			var messageObj = new Message(messageData);
			messageObj.save(function(error, res){
				if(error)
				{
					console.log("Error saving");
					data.extra = "Error";
					io.sockets.in(data.channelName).emit('message', data);
				}
				else
				{
					console.log("Sending Message");
					console.log(data);
					io.sockets.in(data.channelName).emit('message', data);
				}
			});
		}
		
	})
});
