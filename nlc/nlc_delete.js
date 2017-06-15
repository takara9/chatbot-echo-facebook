#!/usr/bin/env node
//
//
// Watson NLCのインスタンスを削除する
//
//

const nlc = require("./sharedlib_nlc.js");
const cdb = require("./sharedlib_cdb.js");

if (process.argv.length < 3) {
    console.log("Usage: ./nlc_delete.js classifier_id...");
    process.exit();
}

// 引数のリスト
var classifier_id = [], j = 0;
for(var i = 2;i < process.argv.length; i++){
    classifier_id[j++] = process.argv[i];
}

for (var j = 0;j < classifier_id.length; j++) {
    var params = {
	classifier_id: classifier_id[j]
    }

    
    // Delete Cloudant
    cdb.get(classifier_id[j], function(err,data) {
	if (!err) 
	    cdb.destroy(data._id, data._rev, function(err, body, header) {
		//if (err) throw err;
	    });
    });

    // Delete Watson nlc
    nlc.remove(params, function(err, status) {
	//if (err) throw err;
	console.log("err = ", err);
	console.log("destroy = ", classifier_id[j]);
    });

}


