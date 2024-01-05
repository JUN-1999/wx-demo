// components/goBack/goBack.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    color: {
      type: String,
      value: '#333'
    },
    otherColor: {
      type: String,
      value: '#333'
    },
    type: {
      type: String,
      value: 'leftAndHome'
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
    back() {
      wx.navigateBack({
        delta: 1,
        fail() {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      });
    },
    home() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})
