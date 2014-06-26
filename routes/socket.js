var idUser = 0;

exports.socket = function(socket) {

	socket.username = idUser.toString();
	console.log('User ' + idUser++ + ' connected');
	var address = socket.handshake.address;
	console.log("New connection from " + address.address + ":" + address.port);
	socket.on('position', function (message) {
		console.log('Client ' + socket.username + ' send :');
		console.log(message);
		socket.broadcast.emit('s_pos', {
			username: socket.username,
			message: message
		});
	});
}
