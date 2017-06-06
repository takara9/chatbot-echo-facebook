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

// セッション管理
var sc = require("./sessionCtrl.js");

// メッセージ到着
bot.on(MessengerPlatform.Events.MESSAGE, function(userId, message) {
    console.log("get message");
    console.log("UserID ", userId);
    console.log("Message ", message.getText());
    console.log("Message Id ", message.getMessageId());
    console.log("Message Type ", message.getType());

    agent = "facebook";
    sc.sessionCtrl( agent, userId, message, function(err, session) {
        if (err) {
            errorHandler(agent,message, "内部エラー", err);
        } else {
            eventHandler(message, session, function(err,session) {
                sc.sessionUpdate(session, function(err,session) {});
            });
        }
    });

    // エコー応答

});


// イベント処理 共通                                                                                                          
function eventHandler(message, session, callback) {
    if (session.agent == "LINE") {
        //_eventHandlerLine( message, session, function(err,session) {
        //    callback(err,session);
        //});
	callback(err,session);
    } else if (session.agent == "facebook") {
        _eventHandlerFB( message, session, function(err,session) {
            callback(err,session);
	});
    }
}

// エラー処理 共通
function errorHandler(agent, message, errorMessage, err) {
    console.log("errorHandler message = ", errorMessage, err.message);
    if (agent == "LINE") {
        bot.replyMessage(message.events[0].replyToken, errorMessage);
    } else if (session.agent == "facebook") {
	bot.sendTextMessage(userId, errorMessage);
    }
}



// Facebookイベント処理
function _eventHandlerFB( message, session, callback) {
    bot.sendTextMessage(userId,message.getText());
    callback(null, session);
});



// Bluemix で稼働する場合はポート番号を取得
var portno = process.env.PORT || 9080;
console.log("Listening on port ", portno);

server.listen(portno);


