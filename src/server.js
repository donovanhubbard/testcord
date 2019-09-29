"use strict";

const WebSocket = require('ws');
const opcodes = require('./opcodes.js');
const bot_data = require('./data/bot.js').data;
const guild_data = require('./data/guild.js').data;

const PORT = 8080;

const wss = new WebSocket.Server({ port: PORT });
console.log('started server on port:'+PORT);


function send_message(ws,data){
  let str = JSON.stringify(data);  
  console.log('sending ' + str);
  ws.send(str);
}

function send_hello(ws){
  let data = { 
    t: null,
    s: null,
    op: opcodes.HELLO,
    d: {
      heartbeat_interval: 41250,
     _trace: [ '["gateway-prd-main-pqcd",{"micros":0.0}]' ] 
    } 
  };
  send_message(ws,data);
}

function send_heartbeat_ack(ws){
  let data = {
    "t":null,
    "s":null,
    "op":11,
    "d":null
  };
  send_message(ws,data);
}

function send_ready(ws){
  let data = { t: 'READY',
    s: 1,
    op: 0,
    d:
     { v: 6,
       user_settings: {},
       user:
        { verified: bot_data.verified,
          username: bot_data.username,
          mfa_enabled: bot_data.mfa_enabled,
          id: bot_data.id,
          email: bot_data.email,
          discriminator: bot_data.discriminator,
          bot: bot_data.bot,
          avatar: bot_data.avatar },
       session_id: 'b3f38f4d87986649f4e1007168e5ea26',
       relationships: [],
       private_channels: [],
       presences: [],
       guilds: [ [Object] ],
       _trace:
        [ '["gateway-prd-main-9zsp",{"micros":39326,"calls":["discord-sessions-prd-1-4",{"micros":37447,"calls":["start_session",{"micros":36590,"calls":["api-prd-main-nk10",{"micros":32287,"calls":["get_user",{"micros":8493},"add_authorized_ip",{"micros":5},"get_guilds",{"micros":1998},"coros_wait",{"micros":2}]}]},"guilds_connect",{"micros":2,"calls":[]},"presence_connect",{"micros":101,"calls":[]}]}]}]' ] } }

  send_message(ws,data);
  send_guild_create(ws);
  
}

function send_guild_create(ws){
  let data = 
  { 
    t: 'GUILD_CREATE',
    s: 2,
    op: 0,
    d:
     { verification_level: guild_data.verification_level,
       large: guild_data.large,
       premium_subscription_count: guild_data.premium_subscription_count,
       description: guild_data.description,
       region: guild_data.region,
       afk_channel_id: guild_data.afk_channel_id,
       lazy: guild_data.lazy,
       /*members:
        [ [Object],
          [Object],
          [Object],
          [Object],
          [Object],
          [Object],
          [Object] ],*/
       splash: guild_data.splash,
       vanity_url_code: guild_data.vanity_url_code,
       name: guild_data.name,
       unavailable: guild_data.unavailablem,
       owner_id: guild_data.owner_id,
       /*channels: [ [Object], [Object], [Object], [Object] ],*/
       premium_tier: guild_data.premium_tier,
       id: guild_data.id,
       explicit_content_filter: guild_data.explicit_content_filter,
       member_count: guild_data.member_count,
       system_channel_id: guild_data.system_channel_id,
       mfa_level: guild_data.mfa_level,
       emojis: guild_data.emojis,
       banner: guild_data.banner,
       /*roles: [ [Object], [Object], [Object], [Object], [Object] ],*/
       system_channel_flags: guild_data.system_channel_flags,
       voice_states: guild_data.voice_states,
       features: guild_data.features,
       icon: guild_data.icon,
       afk_timeout: guild_data.afk_timeout,
       joined_at: guild_data.joined_at,
       default_message_notifications: guild_data.default_message_notifications,
       preferred_locale: guild_data.preferred_locale,
       application_id: guild_data.application_id,
       /*presences: [ [Object], [Object], [Object], [Object] ]*/ 
    } 
  }

  send_message(ws,data);

}

function handle_message(ws,message){
  let data = JSON.parse(message);
  let op = data.op; 
  switch (op){
    case opcodes.HEARTBEAT:
      console.log("Received HEARTBEAT");
      send_heartbeat_ack(ws);
      break;
    case opcodes.IDENTIFY:
      console.log('Received READY'); 
      send_ready(ws); 
      break;
    default:
      console.log('unrecoginized opcode:'+op);
  }
}

wss.on('connection', ws => {
  console.log('Client connected');
  send_hello(ws);

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    handle_message(ws,message);  
  });
  
});

