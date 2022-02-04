var express = require('express'); 
var app = express(); 
var http = require('http').Server(app);
var soap = require('soap');
var io = require('socket.io')(http);
var fetch = require('node-fetch');



var url = 'https://calm-basin-70231.herokuapp.com/?wsdl';

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

async function borneDemande(io,longitude,lattitude){
	const response = await fetch('https://opendata.reseaux-energies.fr/api/records/1.0/search/?dataset=bornes-irve&rows=50&geofilter.distance='+ longitude +','+ lattitude +',1000')
	.catch(erreur => { throw erreur})
  	const myJson = await response.json()

	//traitement json
	let myData = [[],[]];
	for (let i=0; i< myJson['nhits']; i++){
		myData[0].push(myJson['records'][i]['fields']['xlongitude'])
		myData[1].push(myJson['records'][i]['fields']['ylatitude'])
	}

	let longi = 0
	let lati = 0
	let moy = (longitude + lattitude) / 2

	for (let i=0; i< myJson['nhits']; i++){
		if (moy > (myData[0][i] + myData[1][i])/2){
			moy = ((myData[0][i] + myData[1][i])/2);
			longi = myData[0][i]
			lati = myData[1][i]
		}
	}
	io.emit('borneTrouve', [longi,lati]);
}

io.on('connect', function(socket){
	carsList(io);

	socket.on('car', function (name) {
		carInfo(io, name);
	});

	socket.on('borneDemande', function (coords) {
		borneDemande(io,coords[0],coords[1]);
	})

});
