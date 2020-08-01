// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('queryUser', async (ctx, next) => {
    ctx.data = {}
    ctx.data.openid = event.userInfo.openId

    ctx.body = await db.collection('user')
      .where({
        openid: ctx.data.openid
      })
      .get()
      .then(res => {
        return res
      })
      .catch(err => {
        console.log(err)
      })
  })

  app.router('addUser', async (ctx, next) => {
    ctx.data = {}
    ctx.data.openid = event.userInfo.openId

    ctx.body = await db.collection('user')
      .add({
        data: {
          openid: ctx.data.openid,
          range: 0,
          onlinetime: 0
        }
      })
      .then(res => {
        return res
      })
      .catch(err => {
        console(err)
      })

      ctx.data.range = 0
      ctx.data.onlinetime = 0
      ctx.body = {
        data: ctx.data
      }
  })

  return app.serve()
}