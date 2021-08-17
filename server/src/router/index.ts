import * as Router from '@koa/router'
// import { promises as fsp } from 'fs'
// import { resolve } from 'path'
import { postPlayer, postRank } from '../controllers/RankController'

// const { readFile } = fsp

const router = new Router()

// router.get('/', async (ctx, next) => {
//   ctx.response.body = await readFile(resolve(__dirname, '../views/index.html'), {
//     encoding: 'utf-8'
//   })
//
//   await next()
// })

router.post('/api/player', postPlayer)

router.post('/api/ranks', postRank)

export default router
