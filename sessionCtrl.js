//
//  SessionCtrl
//    Author: Maho Takara
//
var uuid = require('uuid');
const cloudant = require("./sharedlib_cloudant.js");

var dbName = 'session';
cloudant.db.create(dbName, function(err, data) {
    if(!err) 
	console.log("Created database: " + dbName);
});
dbSession = cloudant.db.use(dbName);    



// 放置されたセッションを削除する
const SessionTimeOut  = 60*60*48; // 2 days
const PruningInterval = 60*60;    // by 1 hour
var timer = setTimeout( function() {
    date = new Date();
    sessionPruning(date.getTime() - 1000 * SessionTimeOut);
}, 1000 * PruningInterval);


// タイムアウトセッションの刈り取り
var sessionPruning = function(timeout) {
    query = {
	"selector": {
	    "last_unixTime": {
		"$lt": timeout
	    }
	},
	"fields": [
	    "_id",
	    "_rev"
	]
    }

    dbSession.find(query,function(err, body) {
	if (err) {
	    throw err;
	}
	console.log("Hits:",body.docs.length);
	for (var i = 0; i < body.docs.length; i++) {
	    dbSession.destroy(body.docs[i]._id, body.docs[i]._rev);
	}

	date = new Date();
	var timer = setTimeout( function() {
	    sessionPruning(date.getTime() - 1000*SessionTimeOut);
	},1000 * PruningInterval);
    });

};



//  セッション管理
//　　複数の端末と同時並行で処理する
exports.sessionCtrl = function(agent, userId, message, callback) {
    // ユーザーIDでセッションの存在をチェック
    dbSession.get(userId, function(err,session) {
	if (err) {
	    if (err.error == 'not_found') {
		// セッション開始
		sessionOpen(agent, userId, message, function(err, session) {
		    callback(err, session);
		});
	    } else {
		callback(err,session);
	    }
	} else {
	    callback(err, session);
	}
    });
}


// 新規セッションの作成
function sessionOpen(agent, userId, message, callback) {
    console.log("セッション OPEN");
    var date = new Date()
    var strTime = date.toLocaleString();
    var replyTo = null;
    if (agent == "LINE"){
        replyTo = message.events[0].replyToken
    } else if (agent == "facebook") {
        replyTo = message.getSenderId();
    }

    // セッションDOC 作成
    var doc = {
	session_id: uuid.v4(),
	user_id: userId,
	agent: agent,
	reply: replyTo,
	profile: {},
	context: {},
	count: 0,
	start_time: strTime,
	last_time: strTime,
	start_unixTime: date.getTime(),
	last_unixTime: date.getTime()
    };

    // セッション登録
    dbSession.insert(doc, userId, function(err,res) {
	doc._id = res.id;
	doc._rev = res.rev;
	callback(err,doc);
    });
    
}

// セッション更新
function sessionUpdate(session, callback) {
    console.log("セッション UPDATE");
    date = new Date();
    session.last_unixTime = date.getTime();
    session.count++;
    dbSession.insert(session,session.user_id, function(err, res) {
	callback(err,session);
    });
}

exports.sessionUpdate = function(session, callback) {
    sessionUpdate(session,function(err,session) {
	callback(err,session);
    });
}


// セッション終了
function sessionClose(session, callback) {
    console.log("セッション CLOSE");
    dbSession.get(session.user_id, function(err,session) {
	if (err) {
	    callback(err,session);
	} else {
	    dbSession.destroy(session.user_id, session._rev, function(err, body, header) {
		callback(err,body);
	    });
	}
    });
}


