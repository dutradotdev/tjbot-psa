var TJBot = require('tjbot');
var config = require('./config');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

mongoose
.connect("mongodb+srv://usr:pwd@cluster0-yppvo.gcp.mongodb.net/test?retryWrites=true", { useNewUrlParser: true })
.then(() => console.log('funcionou'))
.catch(err => console.log(err))
const connection = mongoose.connection;
connection.once('open', (err) => err ? console.log(err) : console.log('TJBot is connected to MongoDB on cloud!!'))

async function timer(time){
	return new Promise(function(resolve) {
		setTimeout(() => {
			resolve();
		}, time)
	});
}

async function abaixaELevantaBraco(time) {
	tj.lowerArm();
	await timer(time).then(r => tj.raiseArm());
}

// obtain our credentials from config.js
var credentials = config.credentials;

// obtain user-specific config
var WORKSPACEID = config.workspaceId;

// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['led', 'servo', 'speaker'];

// set up TJBot's configuration
var tjConfig = {
    verboseLogging: true,
    robot: {
        name: 'Watson',
        gender: 'female'
    },
	speak: {
        language: 'pt-BR', // see TJBot.prototype.languages.speak
        voice: undefined, // use a specific voice; if undefined, a voice is chosen based on robot.gender and speak.language
        speakerDeviceId: "plughw:1,0" // plugged-in USB card 1, device 0; see aplay -l for a list of playback devices
    }
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);
tj.shine('red');
abaixaELevantaBraco(500);

http.listen('3000', () => console.log('server listening on port 3000'));

io.on('connection', async (socket) => {
	console.log('alguem se conectou');

	socket.on("qrcodeRead", async function(_id) {
	    await abaixaELevantaBraco(1000);
		//let frase = `Olá  ${_id}, tudo bem?`		
		let frase = `Olá ${_id}, como vai? Você respondeu o nosso teste nas redes sociais e logo observamos que você é a cara da nossa marca. Por isso te mandamos um carro amarelo com um rockzinho de fundo! Nosso carro é inspirado em pessoas como você! Que tal fazer um test-drive?`
		console.log("_id:",  _id);
		tj.shine('blue');
		tj.speak(frase, () => abaixaELevantaBraco(150));

	});

});

//tj.speak("oi lucas", () => console.log("funcionou"));
