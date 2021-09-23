"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.postRank = exports.postPlayer = void 0;
var GenerateTokenService_1 = require("../service/GenerateTokenService");
var rank_1 = require("../models/rank");
var EncryptService_1 = require("../service/EncryptService");
var postPlayer = function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var player, token, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                player = ctx.request.body;
                console.log(player);
                token = GenerateTokenService_1["default"](Date.now().toString());
                return [4 /*yield*/, rank_1["default"].findOrCreate({
                        where: player,
                        defaults: {
                            token: token
                        }
                    })];
            case 1:
                data = (_a.sent())[0];
                data.token = token;
                return [4 /*yield*/, data.save()];
            case 2:
                _a.sent();
                ctx.response.body = {
                    token: token,
                    id: data.id
                };
                return [2 /*return*/];
        }
    });
}); };
exports.postPlayer = postPlayer;
var postRank = function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var body, message, record, records;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = ctx.request.body;
                message = JSON.parse(EncryptService_1["default"].decrypt(body.data, 'utf8'));
                return [4 /*yield*/, rank_1["default"].findByPk(message.id)];
            case 1:
                record = _a.sent();
                if (!!record) return [3 /*break*/, 3];
                ctx.response.status = 404;
                return [4 /*yield*/, next()];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3:
                if (!(record.score < message.score)) return [3 /*break*/, 5];
                record.score = message.score;
                return [4 /*yield*/, record.save()];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [4 /*yield*/, rank_1["default"].findAll({
                    attributes: ['player1', 'player2', 'score'],
                    order: [['score', 'DESC']],
                    limit: 10
                })];
            case 6:
                records = _a.sent();
                ctx.response.body = { records: records };
                return [4 /*yield*/, next()];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.postRank = postRank;
