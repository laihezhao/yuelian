// components/date/date.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  observers: {
    'day': function(day) {
      let val = day < 10?'0'+day:day
      this.setData({
        _index_day: val,
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    months: [
      '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月',
      '十二月'
    ],
    year: 0,
    month: '',
    day: 1,
    _index_day: '1'
  },

  attached() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()

    this.setData({
      year,
      month:this.data.months[month],
      day
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
