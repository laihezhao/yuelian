// miniprogram/pages/classlist/classlist.js
const app = getApp()
let tempClasslist = []
const MAX_LIMIT = 3

Page({

  /**
   * 页面的初始数据
   */
  data: {
    onlinetime: '00:00:00',
    classlist: [],
    range: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 缓存在线时间
    app.setOnlinetimeStore()
    
    this.setData({
      range: app.globalData.range,
    })
    let onlinetime = app.getOnlinetime()
    this.setData({
      onlinetime: this._onlinetimeFmt(onlinetime)
    })

    if (this._getClasslistStore() == '') {
      console.log("课程加载中")
      this._getTempClasslist()
    } else {
      this.setData({
        classlist: this._getClasslistStore()
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
    let onlinetime = app.getOnlinetime()
    this.setData({
      onlinetime: this._onlinetimeFmt(onlinetime)
    })
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
      classlist: []
    })
    tempClasslist = []
    this._setClasslistStore()
    this._getTempClasslist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this._getTempClasslist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  _getTempClasslist() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'class',
      data: {
        start: this.data.classlist.length,
        count: MAX_LIMIT,
        $url: 'classlist',
      }
    }).then((res) => {
      tempClasslist = tempClasslist.concat(res.result.data)
      this._getClasslistUrl()
      wx.stopPullDownRefresh()
    })
  },

  _setClasslistStore() {
    wx.setStorageSync('classlist', this.data.classlist)
  },

  _getClasslistStore() {
    return wx.getStorageSync('classlist')
  },

  async _getClasslistUrl() {
    this.setData({
      classlist: []
    })
    let len = tempClasslist.length
    for (let i = 0; i < len; i++) {
      let list = {}
      let data = tempClasslist[i]
      list.url1 = await this._getTempFileUrl(data.finished_fileid)
      list.url2 = await this._getTempFileUrl(data.unfinished_fileid)
      list.desc = data.desc
      list.range = data.range
      list.classid = data.classid
      this.setData({
        classlist: this.data.classlist.concat(list)
      })
    }
    console.log(this.data.classlist)
    this._setClasslistStore()
    wx.hideLoading()

  },

  // TODO: 错误处理
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

  _parse0(src) {
    return src < 10 ? '0' + src : src
  },

  _onlinetimeFmt(src) {
    let hour = Math.floor(src / 3600)
    let hour_2 = Math.floor(src % 3600)
    let minute = Math.floor(hour_2 / 60)
    let second = Math.floor(hour_2 % 60)
    return this._parse0(hour) + ':' + this._parse0(minute) + ':' + this._parse0(second)
  }
})