#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
 
var client = new WebSocketClient();

var SERVER_PORT = 9910;
 

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');


    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });



    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });



    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
            parseMessage(message.utf8Data, connection)
        }
    });

    //connection.sendUTF(number.toString());

    sendClientId(connection);


    setInterval(function(){
        askForTime(connection);
    }, 1000)
    

});
 
client.connect('ws://localhost:'+SERVER_PORT+'/', '');

function sendClientId(conn){
    conn.sendUTF("CLIENT_ID*"+ 'client1');
}

function askForTime(conn){
    let mytime = new Date().getTime();

    conn.sendUTF("ASK_TIME*"+mytime);

   
}

function parseMessage(content, connection){


    let parts = content.split("*");

    if(parts[0].toLowerCase() == "ask_time_resp"){

        let t0 = parseInt(parts[1])
        let t1 = new Date().getTime();
        let tserver = parseInt(parts[2]);


        let tclient = tserver + (t1 - t0) / 2.0;

        console.log("\n TCLIENT: " +tclient);
        console.log("\nSynchronization error : " + (t1 - tclient)  + "\n");

        //console.log(parts[1], parts[2]);
    }
}