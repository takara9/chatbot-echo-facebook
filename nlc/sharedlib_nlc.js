#!/usr/bin/env node
//
//
// Watson NLC と接続する
//
//
const appEnv = require("../sharedlib_vcap.js");

// Watson NLC への接続 と NLC作成
var nlc;
if (appEnv.services['natural_language_classifier']) {
    var Watson = require('watson-developer-cloud');
    appEnv.services['natural_language_classifier'][0].credentials.version = "v1";
    nlc = Watson.natural_language_classifier(appEnv.services['natural_language_classifier'][0].credentials);
}

module.exports = nlc;
