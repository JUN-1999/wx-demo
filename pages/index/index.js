Page({
  data: {
    tabs: [
      { title: '前往词塘', url: '/pages/words/words' },
      { title: '你画我猜', url: '/pages/draw/draw' },
      { title: '上传文件', foo: 'uploadFile' },
      { title: '开启扫一扫', foo: 'scanCode' },
      { title: '树结构', url: '/pages/tree/tree' },
      { title: '列表', url: '/pages/list/list' }
    ]
  },
  foo(e) {
    const { item } = e.currentTarget.dataset;
    // 跳转
    if (item.url) {
      wx.navigateTo({
        url: item.url,
      })
    }
    // 自定义事件
    if (item.foo) {
      this[item.foo]();
    }
  },

  onLoad() {

  },

  // 上传文件
  uploadFile() {
    let fs = wx.getFileSystemManager()

    // 可从会话端获取文件
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['.mp3'],
      success: function (res) {
        console.log(res);
      }
    })
  },
  // 唤起扫一扫
  scanCode() {
    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })
  }
})