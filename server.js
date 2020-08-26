var http = require('http')
var WebSocketServer = require('websocket').server
var fs = require('fs')
var PORT = 18000
var server = http.createServer(function(request, response) {
	var responsePage
	switch(request.url){
		case '/':
			response.writeHead(200, {'Content-Type': 'text/html'});
			responsePage = fs.readFileSync('client.html')
		break;
		case '/GameManager.js':
			response.writeHead(200, {'Content-Type': 'text/javascript'});
			responsePage = fs.readFileSync('GameManager.js')
		break;
		case '/client.js':
			response.writeHead(200, {'Content-Type': 'text/javascript'});
			responsePage = fs.readFileSync('client.js')
		break;
		//404 Not found
		default:
			response.writeHead(404, {'Content-Type': 'text/html'});
			responsePage = '<html><head><meta charset="utf-8"><title>Oops !</title></head><body>L\'url demandée n\'existe pas.</body>'
		break;
	}
	response.end(responsePage);
})
server.listen(PORT, function() {
	console.log("Server listening on port "+PORT)
})


// create the server
wsServer = new WebSocketServer({
    httpServer: server
})

// WebSocket server
///*
var clients = []
var count = 0
PACKET_TYPE = {
	"ClientJoined" : 0,
	"ClientLeft" : 1,
	"Keep-alive" : 2,
	"Message" : 3,
	"Position" : 4,
	"Hello" : 5
}
//*/

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin)
 //   /*
    var id = count++
	clients[id] = {"con" : connection, "pos" : null, "name" : null}
	console.log("New connection : "+id)
//*/

    connection.on('message', function(message) {
		if(message.type == 'utf8')
			message = JSON.parse(message.utf8Data);
		else
			return
		//TO-DO
///*
		switch(message.type){
			case PACKET_TYPE["Hello"]:
				if (clients[id].name && clients[id].pos)
					return 
				clients[id].name = message.data.name
				clients[id].pos = message.data.pos

				//Send hello packet to inform the client about his id
				var packet = {
					"type" : PACKET_TYPE["Hello"],
					"data" : {
						"id" : id
					}
				}
				connection.sendUTF(JSON.stringify(packet))

				//Inform clients that a new client is here
				packet = {
					"type" : PACKET_TYPE["ClientJoined"],
					"data" : {
						"id" : id,
						"name" : clients[id].name,
						"pos" : clients[id].pos
					}
				}
				clients.forEach(function(client){
					client.con.sendUTF(JSON.stringify(packet))
				})

				//Inform the new client about all the already connected clients
				for(var i = 0; i < clients.length; i++){
					if(clients[i] == undefined)
						continue
					packet = {
						"type" : PACKET_TYPE["ClientJoined"],
						"data" : {
							"id" : i,
							"name" : clients[i].name,
							"pos" : clients[i].pos
						}
					}
					connection.sendUTF(JSON.stringify(packet))
				}

			break
			case PACKET_TYPE["Message"]:
				var packet = {
					"type" : PACKET_TYPE["Message"],
					"data" : {
						"id" : id,
						"message" : message.data.message
					}
				}
				clients.forEach(function(client){
					client.con.sendUTF(JSON.stringify(packet))
				})
			break
			case PACKET_TYPE["Position"]:
				clients[id].pos = message.data.pos
				var packet = {
					"type" : PACKET_TYPE["Position"],
					"data" : {
						"id" : id,
						"pos" : message.data.pos
					}
				}
				clients.forEach(function(client){
					client.con.sendUTF(JSON.stringify(packet))
				})
			break
			default:
			break

		}//*/
    })

    connection.on('close', function(connection) {
    	//TO DO
    	///*
		console.log("Connection closed : "+id)
		delete clients[id]
		var packet = {
			"type": PACKET_TYPE["ClientLeft"],
			"data" : {
				"id" : id
			}
		}
		clients.forEach(function(client){
			client.con.sendUTF(JSON.stringify(packet));
		})//*/
    })
})

