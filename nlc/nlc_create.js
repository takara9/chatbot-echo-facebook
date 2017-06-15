#!/usr/bin/env node
//
// Watson NLCのインスタンスを作成する
//
//

var fs = require('fs');
const nlc = require("./sharedlib_nlc.js");
const cdb = require("./sharedlib_cdb.js");

if (process.argv.length != 5) {
    console.log("Usage ./nlc_create.js language name filename");
    console.log("example  ./nlc_create.js ja greetings ./greetings.csv"); 
    process.exit();
}

// NLC分類器の作成
var params = {
    language: process.argv[2],
    name: process.argv[3],
    training_data: fs.createReadStream(process.argv[4])
};

nlc.create(params, function(err, resp) {
    if (err) {
	throw err;
    } else {
	cdb.insert( resp, resp.classifier_id, function(err) {
	    if (err) throw err;
	    console.log('NLC 登録完了', JSON.stringify(resp,null,'  '));
	});
    }
});

