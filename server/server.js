
var WebSocketServer = require('websocket').server;
var http = require('http');


var PORT = 9910;


var clients = {};
 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(PORT, function() {
    console.log((new Date()) + ' Server is listening on port ' + PORT);
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('', request.origin);

    console.log((new Date()) + ' Connection accepted.');




    var remoteAddr = connection.remoteAddress;

    //clients[remoteAddr] = connection;


    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            //connection.sendUTF(message.utf8Data);
            parseMessage(message.utf8Data, connection);
        }
       
    });


    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        clients[remoteAddr] = undefined;
    });
});



function parseMessage(content, connection){
    let parts = content.split("*");

    if(parts[0].toLowerCase() == "client_id"){
        //Set the client ID
        let id = parts[1];
        clients[id] = connection;

        //console.log("clients[" + id + "] = " + connection);
    }

    if(parts[0].toLowerCase() == "ask_time"){
        //The client wants to synchronize
        let mytime = new Date().getTime();

        connection.sendUTF("ASK_TIME_RESP*"+ parts[1]+"*"  +mytime);
    }
}