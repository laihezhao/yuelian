//app.js
App({
  onLaunch: function (options) {
    this.checkUpate()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-025n9',
        traceUser: true,
      })
    }
    this.globalData = {
      playingMusicId: -1,
      openid: '',
      range: 0,
      onlinetime: 0,
      isPlaying: false
    }
    this.checkUser()
  },
  
  onShow(options){
    // onLaunch 后执行
  },

  setIsPlaying(n) {
    if (n == 0) {
      this.globalData.isPlaying = false
    } else {
      this.globalData.isPlaying = true
    }
  },

  getIsPlaying() {
    return this.globalData.isPlaying
  },

  setPlayMusicId(musicId) {
    this.globalData.playingMusicId = musicId
  },
  
  getPlayMusicId() {
    return this.globalData.playingMusicId
  },

  setOnlinetime() {
    this.globalData.onlinetime = this.globalData.onlinetime + 1
    this.setOnlinetimeStore()
  },

  getOnlinetime() {
    return this.globalData.onlinetime
  },

  setOnlinetimeStore() {
    wx.setStorage({
      data: this.getOnlinetime(),
      key: 'onlinetime',
    })
  },

  checkUser() {
    wx.cloud.callFunction({
      name: 'user',
      data: {
        $url: 'queryUser'
      }
    }).then(res => {
      if (res.result.data.length > 0) {
        console.log(res.result.data[0])
        this.globalData.openid = res.result.data[0].openid
        this.globalData.range = res.result.data[0].range
        this.globalData.onlinetime = res.result.data[0].onlinetime
        // wx.setStorageSync(this.globalData.openid, res.result.data[0])
        wx.setStorage({
          data: this.globalData.onlinetime,
          key: 'onlinetime',
        })
      } else {
        wx.cloud.callFunction({
          name: 'user',
          data: {
            $url: 'addUser'
          }
        }).then(res => {
          this.getOpenid()
        }).catch(err => {
          console.log(err)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },

  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const openid = res.result.openid
      this.globalData.openid = openid
      if (wx.getStorageSync(openid) == '') {
        wx.setStorageSync(openid, [])
      }
    }).catch(err => {
      console.log(err)
    })
  },

  checkUpate(){
    const updateManager = wx.getUpdateManager()
    // 检测版本更新
    updateManager.onCheckForUpdate((res)=>{
      if (res.hasUpdate){
        updateManager.onUpdateReady(()=>{
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用',
            success(res){
              if(res.confirm){
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
  },
})
