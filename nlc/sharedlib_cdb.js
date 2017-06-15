#!/usr/bin/env node
//
// Cloudant と接続して、データベースを指定する
//
const appEnv = require("../sharedlib_vcap.js");
const cloudant = require("../sharedlib_cloudant.js");

var dbName = 'nlcid';
cloudant.db.create(dbName, function(err, data) {
    if(!err) 
	console.log("Created database: " + dbName);
});
cdb = cloudant.db.use(dbName);    

module.exports = cdb;
