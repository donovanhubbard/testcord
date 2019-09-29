//TODO
//Find out what other events get sent by this framework
//especially the invalid login event
//Start trying to implement the gateway
//Figure out how you are going to structure the tests



"use strict";
const WebSocket = require('ws');

//const ws = new WebSocket('wss://gateway.discord.gg/?v=6&encoding=json');
const ws = new WebSocket('ws://localhost:8080');

//https://discordapp.com/developers/docs/topics/opcodes-and-status-codes
const OP_DISPATCH = 0;
const OP_HEARTBEAT = 1;
const OP_IDENTIFY = 2;
const OP_STATUS_UPDATE = 3;
const OP_VOICE_STATE_UPDATE=4;
const OP_RESUME = 6;
const OP_RECONNECT = 7;
const OP_REQUEST_GUILD_MEMBERS=8;
const OP_INVALID_SESSION=9;
const OP_HELLO = 10;
const OP_HEARTBEAT_ACK = 11;
let last_sequence = null;


function send_heartbeat(){
  let heartbeat = {
    "op": OP_HEARTBEAT,
    "d":last_sequence
  };

  send_data(heartbeat);
}

function identify(){
  let payload = {
    "token":"bad",
    "properties": {
      "$os": "linux",
      "$browser": "my_library",
      "$device": "my_library"
    }
  };

  let data = {
    "op":OP_IDENTIFY,
    "d":payload,
    "s":null,
    "t":null
  };

  console.log(data);
  send_data(data);
}

function send_data(data){
  let str = JSON.stringify(data);
  console.log('Sending:'+str);
  ws.send(str);
}

ws.on('open', function open() {
  console.log('connected?');
  setTimeout(identify,5000);
});

ws.on('message', function incoming(data) {
  console.log('Received:'+data);
  let payload = JSON.parse(data);
  console.log(payload);

  switch(payload.op){
    case OP_DISPATCH:
      console.log('DISPATCH');
      break;
    case OP_STATUS_UPDATE:
      console.log('STATUS UPDATE');
      break;
    case OP_VOICE_STATE_UPDATE:
      console.log('VOICE STATE UPDATE');
      break;
    case OP_RESUME:
      console.log('RESUME');
      break;
    case OP_RECONNECT:
      console.log('RECONNECT');
      break;
    case OP_REQUEST_GUILD_MEMBERS:
      console.log('REQUEST GUILD MEMBERS');
      break;
    case OP_INVALID_SESSION:
      console.log('INVALID SESSION');
      break;
    case OP_HELLO:
      setInterval(send_heartbeat,payload.d.heartbeat_interval);
      break;
    case OP_HEARTBEAT_ACK:
      console.log('Heartbeat ACK');
      break;

    default:
      console.log('unrecognized opcode:' + payload.op);
  }

});

ws.on('error',data => {
  console.log(data);
});

ws.on('close', function() {
  console.log('Connection Closed');
  process.exit(0);
});

let list = ws.eventNames();
console.log(list);
