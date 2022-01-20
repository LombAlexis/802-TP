var express = require('express'); 
var app = express(); 
var http = require('http').Server(app);
var soap = require('soap');
var io = require('socket.io')(http);

var url = 'http://127.0.0.1:8080/?wsdl';

app.use(express.static(__dirname + '/public'));
//On envoie la page html
app.get('/', function(req, res){ 			//! mettre le nom de la voiture dans l'url ? ou alors faire des Ajax call
	res.sendFile(__dirname + '/index.html');
});

http.listen(80,function(){
	console.log('server listen on 80 port');
});

function carsList(io) {
	soap.createClient(url, function(err, client) {
		client.getCars(function(err, result) {
			io.emit('cars', result);
		});
	});
}

function carInfo(io, name) {
	let args = {name: name};
	soap.createClient(url, function(err, client) {
		client.getInfo(args, function(err, result) {
			io.emit('info', result);
		});
	});
}

io.on('connect', function(socket){
	carsList(io);

	socket.on('car', function (name) {
		carInfo(io, name);
	});
});