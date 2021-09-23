"use strict";
exports.__esModule = true;
var Koa = require("koa");
var logger = require("koa-logger");
var json = require("koa-json");
var bodyParser = require("koa-bodyparser");
// import * as views from 'koa-views'
var router_1 = require("./router");
var app = new Koa();
// const render = views('../views')
// app.use(render)
// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());
// Routes
app.use(router_1["default"].routes()).use(router_1["default"].allowedMethods());
app.listen(3000, function () {
    console.log('Koa started at 3000');
});
