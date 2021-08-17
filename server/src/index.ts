import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as json from 'koa-json'
import * as bodyParser from 'koa-bodyparser'
// import * as views from 'koa-views'
import router from './router'

const app = new Koa()

// const render = views('../views')

// app.use(render)

// Middlewares
app.use(json())
app.use(logger())
app.use(bodyParser())

// Routes
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  console.log('Koa started at 3000')
})
