#!/usr/bin/env node
//
//  Smaple code 
//    Author: Maho Takara
//

const cfenv = require("cfenv");
var vcapLocal;
try {
    vcapLocal = require("./vcap-local.json");
} catch (err) {
    throw err;
}
const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}
const appEnv = cfenv.getAppEnv(appEnvOpts);

module.exports = appEnv;
