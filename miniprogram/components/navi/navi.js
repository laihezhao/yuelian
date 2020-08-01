// components/navi/navi.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1
  },

  pageLifetimes: {
    show() {
      this.setData({
        playingId: app.getPlayMusicId()
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToPlayer(event) {
      console.log(event)
      let musicid = event.currentTarget.dataset.musicid
      console.log(this.data.playingId)
      console.log(musicid)
      this.setData({
        playingId: musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?id=${musicid}`,
      })
    },
  }
})

