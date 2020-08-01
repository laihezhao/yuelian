// miniprogram/pages/profile/profile.js
let timerID = 0
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: '00:00',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 缓存在线时间
    app.setOnlinetimeStore()

    this.getRealTime()
    this.setIntervalTimeout()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getRealTime()
    this.setIntervalTimeout()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 回收计时器
    clearInterval(timerID)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 回收计时器
    clearInterval(timerID)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  setIntervalTimeout() {
    timerID = setInterval(() => {
      this.getRealTime()
    }, 1000)
  },

  getRealTime() {
    let date = new Date()
    let hour = this.parse0(date.getHours())
    let minute = this.parse0(date.getMinutes())
    this.setData({
      currentTime: hour + ':' + minute
    })
  },

  parse0(src) {
    return src < 10 ? '0' + src : src
  },
})
