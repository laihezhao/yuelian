// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

const rp = require('request-promise')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.use(async (ctx, next) => {
    ctx.data = {}
    await next()
  })

  app.router('musiclist', async (ctx, next) => {
    ctx.body = await db.collection('musiclist')
      .where({
        range: event.range
      })
      .skip(event.start)
      .limit(event.count)
      .orderBy('id', 'asc')
      .get()
      .then(res => {
        console.log(res)
        return res
      })
      .catch(err => {
        console.log(err)
      })
  })

  app.router('musicUrl', async (ctx, next) => {
    ctx.body = await rp(event.musicId).then(res => {
      return res
    })
  })

  return app.serve()
}