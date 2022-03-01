//Définit variable global
var express = require('express'); 
var app = express(); 
var http = require('http').Server(app);
var soap = require('soap');
var io = require('socket.io')(http);
var fetch = require('node-fetch');

//Lien vers API Soap
var url = 'https://calm-basin-70231.herokuapp.com/?wsdl';

app.use(express.static(__dirname + '/public'));
//On envoie la page html
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

//Connexion port 90
const PORT = process.env.PORT || 80;
http.listen(PORT, err => {
    if(err) throw err;
    console.log("server listen on " + PORT + " port");
});

//demande des véhicules a l'api Soap
function carsList(io) {
	soap.createClient(url, function(err, client) {
		client.getCars(function(err, result) {
			io.emit('cars', result);
		});
	});
}

//demande les information d'un véhicule a l'api
function carInfo(io, name) {
	let args = {name: name};
	soap.createClient(url, function(err, client) {
		client.getInfo(args, function(err, result) {
			io.emit('info', result);
		});
	});
}

//https://opendata.reseaux-energies.fr/api/records/1.0/search/?dataset=bornes-irve&rows=50&geofilter.distance=45.6423,5.8726,1000
//demande les bornes dans un rayon a une lattiutude et longitude
async function borneDemande(io, longitude, lattitude, rayon){
	const response = await fetch('https://opendata.reseaux-energies.fr/api/records/1.0/search/?dataset=bornes-irve&rows=50&geofilter.distance='+ longitude +','+ lattitude +','+rayon)
	.catch(erreur => { throw erreur})
  	const myJson = await response.json()

	//traitement json (on y met dans un tableau)
	let myData = [[],[]];
	let max = myJson['nhits']>50?50:myJson['nhits'];
	for (let i=0; i<max; i++){
		myData[0].push(myJson['records'][i]['fields']['xlongitude'])
		myData[1].push(myJson['records'][i]['fields']['ylatitude'])
	}

	let longi = 0
	let lati = 0
	let moy = (longitude + lattitude) / 2

	//On récupère la borne la plus proche
	for (let i=0; i< max; i++){
		if (moy > (myData[0][i] + myData[1][i])/2){
			moy = ((myData[0][i] + myData[1][i])/2);
			longi = myData[0][i]
			lati = myData[1][i]
		}
	}
	io.emit('borneTrouve', [longi,lati]);
}

https://testpythonrest.azurewebsites.net/tempsTrajet/100/10000/10/80/60
//Demande a l'api Rest le temps moyen (dépend de km, capacité, conso, recharge, vitesse)
async function tempsDemande(io,request){
    let response = await fetch('https://testpythonrest.azurewebsites.net/tempsTrajet/'+request[0]+'/'+request[1]+'/'+request[2]+'/'+request[3]+'/'+request[4])
    .catch(erreur => { throw erreur})
    let myJson = await response.json()
    io.emit('tempsTrouve', myJson);
}

//dès qu'un client se connecte
io.on('connect', function(socket){
	carsList(io);

	//Quand le server reçoit un message 'car', on récupère les infos
	socket.on('car', function (name) {
		carInfo(io, name);
	});

	//Quand le server reçoit un message 'borneDemande', on récupère les bornes proches des coordonnées
	socket.on('borneDemande', function (coords) {
		borneDemande(io,coords[0], coords[1], coords[2]);
	})

	//Quand le server reçoit un message 'tempsDemande', on récupère le temps 
	socket.on('tempsDemande',function(request){
		tempsDemande(io,request);
	})

});
