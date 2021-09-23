"use strict";
exports.__esModule = true;
var Router = require("@koa/router");
// import { promises as fsp } from 'fs'
// import { resolve } from 'path'
var RankController_1 = require("../controllers/RankController");
// const { readFile } = fsp
var router = new Router();
// router.get('/', async (ctx, next) => {
//   ctx.response.body = await readFile(resolve(__dirname, '../views/index.html'), {
//     encoding: 'utf-8'
//   })
//
//   await next()
// })
router.post('/api/player', RankController_1.postPlayer);
router.post('/api/ranks', RankController_1.postRank);
exports["default"] = router;
