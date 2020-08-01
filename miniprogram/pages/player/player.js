// miniprogram/pages/player/player.js
let timerID = 0
// 全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()

Page({
  data: {
    musicId: '',
    musicName: '',
    musiclist: [],
    musicUrl: '',
    isPlaying: false,
    nowPlayingIndex: 1,
    currentTime: '00:00',
    isSame: false, // 是否为同一首歌
  },

  onLoad: function (options) {
    // 缓存在线时间
    app.setOnlinetimeStore()

    this.getRealTime()
    this.setIntervalTimeout()
    this.setData({
      nowPlayingIndex: parseInt(options.id)
    })
    this.data.musiclist = wx.getStorageSync('musiclist')
    this.loadMusicDetail(this.data.nowPlayingIndex)
  },

  loadMusicDetail(id) {
    if (id == app.getPlayMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    wx.showLoading({
      title: '歌曲加载中',
    })
    // 遍历播放列表
    let len = this.data.musiclist.length
    for (let i = 0; i < len; i++) {
      if (id == this.data.musiclist[i].id) {
        this.setData({
          musicUrl: this.data.musiclist[i].musicurl,
          musicName: this.data.musiclist[i].name
        })
        break
      }
    }
    wx.setNavigationBarTitle({
      title: this.data.musicName,
    })
    if (!this.data.isSame) {
      backgroundAudioManager.src = this.data.musicUrl
      backgroundAudioManager.title = this.data.musicName
      this.setData({
        isPlaying: true
      })
      app.setIsPlaying(1)
    } else {
      // 保持原理的状态
      this.setData({
        isPlaying: app.getIsPlaying()
      })
    }

    // 设置全局唯一的musicId
    app.setPlayMusicId(id)

    wx.hideLoading()
  },

  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
      app.setIsPlaying(0)
    } else {
      backgroundAudioManager.play()
      app.setIsPlaying(1)
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  onPrev() {
    console.log("上一首")
    this.data.nowPlayingIndex--
    console.log(this.data.nowPlayingIndex)
    if (this.data.nowPlayingIndex == 0) {
      this.data.nowPlayingIndex = this.data.musiclist.length
    }
    this.loadMusicDetail(this.data.nowPlayingIndex)
  },

  onNext() {
    console.log("下一首")
    this.data.nowPlayingIndex++
    if (this.data.nowPlayingIndex > this.data.musiclist.length) {
      this.data.nowPlayingIndex = 1
    }
    console.log(this.data.nowPlayingIndex)
    this.loadMusicDetail(this.data.nowPlayingIndex)
  },

  onPlay() {
    this.setData({
      isPlaying: true
    })
  },

  onPause() {
    this.setData({
      isPlaying: false
    })
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
    // 回收计时器
    clearInterval(timerID)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 回收定时器
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