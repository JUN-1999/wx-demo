// pages/words/words.js
let plugin = requirePlugin("WechatSI");
let innerAudioContext = wx.createInnerAudioContext({
  useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
});
let Index = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    inputValue: '',
    showIMG: '', //展示的内容
    showWord: '', //展示的内容
    words: [{
        img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.pp-sp.com%2FUploadFiles%2Fimg_2_2697025287_2803361259_26.jpg&refer=http%3A%2F%2Fwww.pp-sp.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1667618106&t=e1035aab26cde596d33a5d18d2c5de89',
        word: '鸭'
      },
      {
        img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jianbihua.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fphoto640x425logofull%2Fpublic%2Fimages%2F2020-02%2F20200218164444_112235.jpg&refer=http%3A%2F%2Fimg.jianbihua.com&app=2002&size=f10000,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1667618138&t=25b0faffc26dc0563ccd878bb1caf925',
        word: '鱼'
      },
      {
        img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jianbihua.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fphoto640x425logofull%2Fpublic%2Fimages%2F2020-03%2F20200314092338_326582.jpg&refer=http%3A%2F%2Fimg.jianbihua.com&app=2002&size=f10000,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1667618163&t=7a000d66b8c3eedd294e2b06cc13ba82',
        word: '狗'
      },

    ],
  },
  inputChange(value) {

    this.setData({
      inputValue: value.detail.value
    })
  },
  sound(index) {

    let that = this;

    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: this.data.words[index].word,
      success: function (res) {
        console.log("succ tts", res.filename)
        that.setData({
          src: res.filename
        })
        that.createInnerAudioContext();
      },
      fail: function (res) {

        console.log("fail tts", res)
      }
    })
  },
  createInnerAudioContext() {
    innerAudioContext.src = this.data.src
  },
  play() {
    innerAudioContext.play() // 播放
  },
  pause() {
    innerAudioContext.pause() // 暂停
  },
  stop() {
    innerAudioContext.stop() // 停止
  },

  randomIndex() {

    let showIMG = this.data.words[Index].img;
    let showWord = this.data.words[Index].word;
    this.sound(Index);
    this.setData({
      showIMG,
      showWord
    })
    Index++;
    if (Index > this.data.words.length - 1) Index = 0;
  },
  nextBtn() {
    this.randomIndex();
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
    plugin = requirePlugin("WechatSI");
    innerAudioContext = wx.createInnerAudioContext({
      useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
    });
    innerAudioContext.onPlay(() => {
      console.log('播放了');
    })
    innerAudioContext.onError(() => {
      console.log('出错了');
    })
    innerAudioContext.onCanplay(() => {
      console.log('监听音频进入可以播放状态的事件。但不保证后面可以流畅播放');
    })
    innerAudioContext.onWaiting(() => {
      console.log('监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发');
    })
    this.nextBtn();
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
    innerAudioContext.destroy()
    innerAudioContext = null;
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