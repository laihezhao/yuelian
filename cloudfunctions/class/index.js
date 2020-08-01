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

  app.router('classlist', async (ctx, next) => {
    ctx.body = await db.collection('classlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy("range", "asc")
      .get()
      .then(res => {
        console.log(res)
        return res
      })
      .catch(err => {
        console.log(err)
      })
  })

  return app.serve()
}