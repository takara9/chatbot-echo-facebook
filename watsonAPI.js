//
//  Watson API
//    Author: Maho Takara
//

const cloudant = require("./sharedlib_cloudant.js");
const nlc = require("./nlc/sharedlib_nlc.js");

// メッセージの意味判別と応答
exports.messageReply = function(session, callback) {
    getClassifierId( function(err,cid) {
	params = {
	    text: session.inputMsg,
	    classifier_id: cid
	}
    
	nlc.classify( params, function(err, resp) {
	    if (err) {
		console.log(err);
		session.outputMsg = "内部エラー発生";
		callback(err,session);
	    } else {
		//console.log(JSON.stringify(resp, null, 2));
		session.outputMsg = "(分類結果:" + resp.classes[0].class_name;
		session.confidence = parseInt(resp.classes[0].confidence * 100);
		session.outputMsg = session.outputMsg + " 確信度=" + session.confidence + "％)"
		// 確信度が低い場合の対応
		if (session.confidence < 60) {
		    session.outputMsg = "わかりません" + "\n" + session.outputMsg;
		    callback(null,session);
		} else {
		    // 応答取得
		    getReplyMsg(resp.classes[0].class_name, function(err,rsp) {
			session.outputMsg = rsp + "\n" + session.outputMsg;
			callback(null,session);
		    });
		}
	    }
	});
    });
}

// 受信した意味に対応する応答文検索
function getReplyMsg(className, callback) {
    var cdb = cloudant.db.use("reply");
    query = {
	"selector": {
            "class_name": className
	},
	"fields": [
            "_id",
            "class_name",
	    "reply_message"
	]
    }
    //console.log("search: ", className);
    cdb.find(query,function(err, body) {
	if (err) console.log(err);
	//console.log("Hits:",body.docs.length);
	if (body.docs.length > 0) {
	    callback(null, body.docs[0].reply_message);
	}
    });
}


// 受信した意味に対応する応答文検索
function getClassifierId(callback) {
    var cdb = cloudant.db.use("nlcid");
    var key = 'current_classifier_id';
    cdb.get(key, function(err,data) {
	callback(err, data.classifier_id);
    });
}


