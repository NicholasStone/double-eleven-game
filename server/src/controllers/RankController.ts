import Router from '@koa/router'
import { PlayerRequest, RankRequest } from '@/types'
import generateTokenService from '../service/GenerateTokenService'
import Rank from '../models/rank'
import encryptor from '../service/EncryptService'

export const postPlayer: Router.Middleware = async (ctx, next) => {
  const player = ctx.request.body as PlayerRequest
  const token = generateTokenService(Date.now().toString())
  const [data] = await Rank.findOrCreate({
    where: player,
    defaults: {
      token
    }
  })

  data.token = token

  await data.save()

  ctx.response.body = {
    token,
    id: data.id
  }
}

export const postRank: Router.Middleware = async (ctx, next) => {
  const body = ctx.request.body as { data: string }

  /* decrypt */
  const message = JSON.parse(encryptor.decrypt(body.data, 'utf8')) as RankRequest

  // ctx.response.body = { message }
  // await next()

  /* update database */
  const record = await Rank.findByPk(message.id)

  if (!record) {
    ctx.response.status = 404

    await next()
    return
  }

  if (record.score < message.score) {
    record.score = message.score
    await record.save()
  }

  const records = await Rank.findAll({
    attributes: ['player1', 'player2', 'score'],
    order: [['score', 'DESC']],
    limit: 10
  })

  ctx.response.body = { records }

  await next()
}
