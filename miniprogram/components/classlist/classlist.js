// components/classlist/classlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classlist: {
      type: Object
    },
    range: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToMusiclist() {
      if (this.properties.range >= this.properties.classlist.range) { 
        wx.navigateTo({
          url: `../../pages/musiclist/musiclist`,
        })
      }
    },
  }
})
