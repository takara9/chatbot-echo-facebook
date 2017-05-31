#!/usr/bin/env node
//
// Facebook メッセンジャー のエコーバック ボット
//
// Facebook Message API Library
//  https://www.npmjs.com/package/facebook-bot-messenger
//

var MessengerPlatform = require('facebook-bot-messenger');
var credentials = require('./credentials.json');

// HTTPサーバー開設
const fs = require('fs');
const https = require('https');
const http = require('http');
var server = null;

if ( credentials.https ) { 
    // for Virtual Server
    server = https.createServer({
	key: fs.readFileSync(credentials.https.key),
	cert: fs.readFileSync(credentials.https.cert)
    });
} else {
    // for Bluemix CF runtime
    server = http.createServer();
}

// メッセージ
var bot = MessengerPlatform.create(credentials, server);

//　コールバック
bot.webhook('/webhook');

// メッセージ到着
bot.on(MessengerPlatform.Events.MESSAGE, function(userId, message) {
    console.log("get message");
    console.log("UserID ", userId);
    console.log("Message ", message.getText());
    console.log("Message Id ", message.getMessageId());
    console.log("Message Type ", message.getType());
    // エコー応答
    bot.sendTextMessage(userId,message.getText());   
});

// Bluemix で稼働する場合はポート番号を取得
var portno = process.env.PORT || 9080;
console.log("Listening on port ", portno);

server.listen(portno);


