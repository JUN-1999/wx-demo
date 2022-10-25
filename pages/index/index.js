// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,

  },

  onLoad() {

  },
  words() {
    wx.navigateTo({
      url: '/pages/words/words',
    })
  },
  draw() {
    wx.navigateTo({
      url: '/pages/draw/draw',
    })
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
      success (res) {
        console.log(res)
      }
    })
  }
})