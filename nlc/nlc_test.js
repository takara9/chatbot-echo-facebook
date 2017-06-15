#!/usr/bin/env node
//
//
// Watson NLCのインスタンスをテストする
//
//

const nlc = require("./sharedlib_nlc.js");
const cdb = require("./sharedlib_cdb.js");

if (process.argv.length != 3) {
    console.log("Usage: ./nlc_test.js classifier_id");
    process.exit();
}

// テスト文を入力して判定
var rl = require('readline');
var rli = rl.createInterface(process.stdin, process.stdout);
rli.setPrompt('NLC> ');

rli.on('line', function(input) {
    if (input == "z") {
	rli.close();
    } else {
	params = {
	    text: input,
	    classifier_id: process.argv[2]
	}
	nlc.classify( params, function(err, response) {
	    if (err) {
		console.log(err);
		rli.close();
	    } else {
		console.log(JSON.stringify(response, null, 2));
		rli.prompt();
	    }
	});
    }
}).on('close', function () {
    process.stdin.destroy();
    process.exit();
});

rli.prompt();


