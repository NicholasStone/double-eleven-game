"use strict";
exports.__esModule = true;
var js_sha256_1 = require("js-sha256");
var config_1 = require("../config");
function generateTokenService(key) {
    return js_sha256_1.sha256(key + config_1["default"].secretKey).substring(0, 10);
}
exports["default"] = generateTokenService;
