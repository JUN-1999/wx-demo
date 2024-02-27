// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: 0,// 0：还有数据没有在请求状态 1:加载中 2:没有更多
    list: [],
    page: 1,
    pageSize: 10
  },
  // 触底事件
  scrolltolower() {
    console.log('列表触底');
    let { page } = this.data;
    this.setData({
      page: page + 1
    })
    this.getList();
  },
  getList() {
    let { list, page, pageSize } = this.data;
    let post_list = [];
    if (page == 6) {
      debugger
      post_list = [1, 2, 3]
    } else {
      for (let i = 0; i < pageSize; i++) {
        post_list.push(parseInt(i * Math.random() * 100));
      }
    }


    this.setData({
      list: [...list, ...post_list],
      loading: post_list.length < pageSize ? 2 : 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})