//
//  sharedlib_cloudant.js
//    Author: Maho Takara
//

const appEnv = require("./sharedlib_vcap.js");

// クラウダントへの接続
var cloudant;
if (appEnv.services['cloudantNoSQLDB']) {
    var Cloudant = require('cloudant');
    cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
}
module.exports = cloudant;


