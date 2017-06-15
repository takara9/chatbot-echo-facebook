#!/usr/bin/env node
//
//
// Watson NLCのインスタンスをリストする
//
//

const nlc = require("./sharedlib_nlc.js");

//  NLC分類器のリスト
var params = {
    language: 'ja',
    name: "greetings"
};

nlc.list(params, function(err,response) {
    if (err)
	console.log('error:', err);
    else
	console.log(JSON.stringify(response, null, 2));
});







