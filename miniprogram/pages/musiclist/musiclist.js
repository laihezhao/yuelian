// miniprogram/pages/musiclist/musiclist.js
let tempMusiclist = []
const app = getApp()
const MAX_LIMIT = 10

Page({

  /**
   * 页面的初始数据
   */
  data: {
    range: 0,
    musiclist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 缓存在线时间
    app.setOnlinetimeStore()

    if (this._getMusiclistStore().length == 0) {
      this._getTempMusiclist()
    } else {
      this.setData({
        musiclist: this._getMusiclistStore()
      })
    }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      musiclist: []
    })
    tempMusiclist = []
    this._setMusiclistStore()
    this._getTempMusiclist()
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

  _getTempMusiclist() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.musiclist.length,
        count: MAX_LIMIT,
        range: 0,
        $url: 'musiclist',
        
      }
    }).then(res => {
      console.log(res.result.data)
      tempMusiclist = res.result.data
      this._getMusiclistUrl()
      wx.stopPullDownRefresh()
    }).catch(err => {
      console.log(err)
    })
  },

  async _getMusiclistUrl() {
    this.setData({
      musiclist: []
    })
    let len = tempMusiclist.length
    for (let i = 0; i < len; i++) {
      let list = {}
      let data = tempMusiclist[i]
      list.musicurl = await this._getTempFileUrl(data.musicurl)
      list.playurl = await this._getTempFileUrl(data.playurl)
      list.pauseurl = await this._getTempFileUrl(data.pauseurl)
      list.name = data.name
      list.length = data.length
      list.range = data.range
      list.id = data.id
      this.setData({
        musiclist: this.data.musiclist.concat(list)
      })
    }
    wx.hideLoading()
    this._setMusiclistStore()
  },

  _getTempFileUrl(options) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'tempFileUrl',
        data: {
          fileId: options
        }
      }).then(res => {
        resolve(res.result)
      }).catch(err => {
        console.log(err)
        reject('')
      })
    })
  },

  _setMusiclistStore() {
    wx.setStorageSync('musiclist', this.data.musiclist)
  },

  _getMusiclistStore() {
    return wx.getStorageSync('musiclist')
  }
})