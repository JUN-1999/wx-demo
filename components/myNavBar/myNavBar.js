// components/myNavBar/myNavBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题
    title: {
      type: String,
      value: ''
    },
    // 导航栏样式-背景色
    barStyle: {
      type: String,
      value: ''
    },
    // 文字颜色和返回按钮
    color: {
      type: String,
      value: '#000'
    },
    // 返回边框和分割线颜色
    otherColor: {
      type: String,
      value: ''
    },
    // 是否显示返回按钮
    isBack: {
      type: Boolean,
      value: true
    },
    type:{
      type:String,
      value:'leftAndHome'
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

  }
})
