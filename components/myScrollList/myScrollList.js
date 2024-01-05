// components/scrollList/scrollList.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    scrollTopHeight: {
      type: String,
      value: '0rpx'
    },
    loading: { // 0 未加载 1 请求中 2 没有更多了
      type: Number,
      value: 0
    },
    bottombtn: {
      type: Boolean,
      value: false
    },
    listIsEmpty: {
      type: Boolean,
      value: false,
    },
    emptyTitle: {
      type: String,
      value: '暂无数据',
    },
    style: {
      type: String,
      value: ''
    }
  },
  lifetimes: {
    attached() { }
  },
  pageLifetimes: {
    // show() {
    //   const app = getApp();

    //   this.setData({
    //     scrollHeight1: `calc(100vh - ${app.globalData.navBarHeight}px - ${this.properties.scrollTopHeight} ${this.properties.bottombtn ? '- 120rpx - constant(safe-area-inset-bottom)' : ''})`,
    //     scrollHeight2: `calc(100vh - ${app.globalData.navBarHeight}px - ${this.properties.scrollTopHeight} ${this.properties.bottombtn ? '- 120rpx - env(safe-area-inset-bottom)' : ''})`
    //   })
    // }
  },
  observers: {
    loading(newVal) {
      this.setData({
        load: newVal
      })
    },
    bottombtn(newVal) {
      const app = getApp();
      this.setData({
        scrollHeight1: `calc(100vh - ${app.globalData.navBarHeight}px - ${this.properties.scrollTopHeight} - ${newVal ? '120rpx' : '0px'} - constant(safe-area-inset-bottom))`,
        scrollHeight2: `calc(100vh - ${app.globalData.navBarHeight}px - ${this.properties.scrollTopHeight} - ${newVal ? '120rpx' : '0px'} - env(safe-area-inset-bottom))`
      })
    }

  },
  /**
   * 组件的初始数据
   */
  data: {
    load: 0,
    scrollHeight1: '',
    scrollHeight2: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scrolltolower() {
      if (this.data.load !== 2) {
        this.triggerEvent('scrolltolower');
      }
    }
  }
})
