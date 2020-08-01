// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1 // 当前播放的秒数
let durationTotal = 0 // 当前播放的总时长，秒单位
let timerID = 0
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    progress: 0,
    movableDis: 0
  },

  lifetimes: {
    ready() {
      if (this.properties.isSame && this.data.showTime.totalTime == '00:00') {
        this.setTime()
      }
      this.getMovableDis()
      this.bindBGMEvent()
    }
  },

  detached() {
    clearInterval(timerID)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(rect => {
        // console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        console.log(movableAreaWidth, movableViewWidth)
      })
    },

    bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        this.triggerEvent('musicPlay')
      })

      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })

      backgroundAudioManager.onPause(() => {
        console.log('onPause')
        this.triggerEvent('musicPause')
      })

      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })

      backgroundAudioManager.onCanplay(() => {
        console.log('onCanPlay')
        console.log(backgroundAudioManager.duration)
        // 概率事件
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this.setTime()
        } else {
          // 小程序的坑
          // 等待一秒再去获取
          timerID = setInterval(() => {
            this.setTime()
          }, 1000)
        }
      })

      backgroundAudioManager.onTimeUpdate(() => {
        const currentTime = backgroundAudioManager.currentTime
        const duration = backgroundAudioManager.duration
        const currentTimeFmt = this.dateFormat(currentTime)

        const sec = currentTime.toString().split('.')[0]
        if (sec != currentSec) {
          this.setData({
            movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
            progress: currentTime / duration * 100,
            ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
          })
          currentSec = sec
          // 统计用户在线听音乐时长
          app.setOnlinetime()
          console.log('ontimeupdate')
        }
      })

      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
        this.triggerEvent('musicEnd')
      })

      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误:' + res.errCode,
        })
      })
    },

    setTime() {
      const duration = backgroundAudioManager.duration
      const durationFmt = this.dateFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
      durationTotal = duration // 设置总时长
    },

    dateFormat(sec) {
      const minute = Math.floor(sec / 60)
      const second = Math.floor(sec % 60)
      return {
        'min': this.pase0(minute),
        'sec': this.pase0(second)
      }
    },

    pase0(src) {
      return src < 10 ? '0' + src : src
    }
  }
})
