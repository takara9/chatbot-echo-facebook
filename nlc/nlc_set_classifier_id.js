#!/usr/bin/env node
//
// Watson NLCのインスタンスを作成する
//
//

const nlc = require("./sharedlib_nlc.js");
const cdb = require("./sharedlib_cdb.js");

function showUsage() {
    console.log("Usage ./nlc_create.js [set|del] classifier_id");
}

if (process.argv.length < 3) {
    showUsage();
    process.exit();
}

// NLC分類器のセット
var new_doc = {
    classifier_id: process.argv[3]
}

var key = 'current_classifier_id';
if ( process.argv[2] == "set") {
    cdb.get(key, function(err,doc) {
	if (!err) {
	    doc.classifier_id = process.argv[3];
	    cdb.insert(doc, key, function(err) {
		if (err) throw err;
		console.log('更新完了');
	    });
	} else if (err.error == 'not_found') {
	    cdb.insert(new_doc, key, function(err) {
		if (err) throw err;
		console.log('新規セット完了');
	    });
	} else {
	    throw err;
	}
    });
} else if (process.argv[2] == "del") {
    cdb.get(key, function(err,data) {
	cdb.destroy(data._id, data._rev, function(err, body, header) {
	    if (err) throw err;
	});
    });
} else {
    showUsage();
}


