#!/usr/bin/env node
//
//
// Watson NLCのインスタンスの状態を取得する
//
//

const nlc = require("./sharedlib_nlc.js");
const cdb = require("./sharedlib_cdb.js");

// NLC分類器の状態リスト
cdb.list(function(err, body) {
    if (err) throw err;
    body.rows.forEach(function(doc) {
	if (doc.key != 'current_classifier_id') {
	    cdb.get(doc.key, function(err,data) {
		if (err) throw err;
		nlc.status(data, function(err,response) {
		    if (!err) {
			console.log(JSON.stringify(response, null, 2));
		    }
		});
	    });
	}
    });
});


