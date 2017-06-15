#!/usr/bin/env node
//
//  Sample code
//    Author: Maho Takara
//

var MessengerPlatform = require('facebook-bot-messenger');
var cnf = require('./credentials.json');

// HTTPサーバー開設
const fs = require('fs');
const https = require('https');
const http = require('http');
var server = null;

if ( cnf.https ) { 
    // for Virtual Server
    server = https.createServer({
	key: fs.readFileSync(cnf.https.key),
	cert: fs.readFileSync(cnf.https.cert)
    });
} else {
    // for Bluemix CF runtime
    server = http.createServer();
}

// メッセージ
var bot = MessengerPlatform.create(cnf, server);
bot.webhook('/webhook');  //　コールバック


var sc = require("./sessionCtrl.js");  // セッション管理
var wn = require("./watsonAPI.js");    // Watson API



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
            errorHandler(agent, userId, message, "内部エラー", err);
        } else {
            eventHandler(session, message, function(err,session) {
                sc.sessionUpdate(session, function(err,session) {});
            });
        }
    });
});


// イベント処理 共通
function eventHandler(session, message, callback) {
    if (session.agent == "LINE") {
	_eventHandlerLINE(session,message,function(err,session) {
	    callback(err,session);
	});
    } else if (session.agent == "facebook") {
        _eventHandlerFB(session,message,function(err,session) {
            callback(err,session);
	});
    }
}

// Facebookイベント処理
function _eventHandlerFB( session, message, callback) {
    session.inputMsg = message.getText();
    //session.replyMsg = session.recvMsg;
    //bot.sendTextMessage(session.user_id, session.replyMsg);
    // Watson API をコールして応答を返す
    wn.messageReply(session, function (err,session) {
        //bot.replyMessage(message.events[0].replyToken, session.outputMsg);
	bot.sendTextMessage(session.user_id, session.outputMsg);
        callback(err, session);
    });
    //callback(null, session);
}

// LINEイベント処理
function _eventHandlerLINE( session,message, callback) {
    // DUMMY
    callback(null, session);
}

// エラー処理 共通
function errorHandler(agent, userId, message, errorMessage, err) {
    console.log("エラー処理 ");
    if (agent == "LINE") {
	// DUMMY
    } else if (session.agent == "facebook") {
	bot.sendTextMessage( userId, errorMessage);
    }
}


// Bluemix で稼働する場合はポート番号を取得
var portno = process.env.PORT || 9080;
console.log("Listening on port ", portno);

server.listen(portno);


