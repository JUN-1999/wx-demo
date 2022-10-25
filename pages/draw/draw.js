// pages/draw/draw.js
const io = require('../../utils/weapp.socket.io');
const util = require('../../utils/util');
const W = wx.getSystemInfoSync().windowWidth;
const H = wx.getSystemInfoSync().windowHeight;
let canvas = null;
let ctx = null;

let canvas2 = null;
let ctx2 = null;
let socket = null; //长链接
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: 'JUN-1999', //用户信息

    color: '#008000',
    lineWidth: 5,
    ctxLineWidth: 0,
    toolType: 2, // 2 画笔 3 橡皮檫
    userID: 332527,
    nowUserID: 332527,
    colorList: ['red', 'green', 'yellow', 'blue', 'black'],
    showColor: false,
    inputValue: '', //输入内容
    textareaVale: [], //富文本呢框的内容
    scrollLast: null, //滚动的id
  },
  getScollBottom() {
    this.setData({
      scrollLast: 'item' + (this.data.textareaVale.length - 1)
    })
  },
  // 输入内容
  input(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 画笔按下
  bindtouchstart(e) {
    console.log(ctx.lineWidth);
    ctx.beginPath(); //重置路径
    ctx.moveTo(e.touches[0].x, e.touches[0].y); //从哪个位置开始
  },
  // 画笔移动
  bindtouchmove(e) {
    ctx.lineTo(e.touches[0].x, e.touches[0].y);
    ctx.stroke();
    // 生成图片
    this.createImg();
  },
  // 画笔弹起
  bindtouchend(e) {

  },
  // 生成图片
  createImg() {
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // ctx2.putImageData(imgData, 0, 0);
  },

  /* 工具 ： 清空 选颜色 橡皮檫 */
  // 清空
  clearRect() {
    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(0, 0, W, H);
    ctx.beginPath(); //重置路径
    this.createImg();
    this.setData({
      showColor: false
    })
  },
  // 橡皮檫
  eraser() {
    if (this.data.toolType != 3) {
      ctx.strokeStyle = '#f2f2f2';
      ctx.lineWidth = 20;

      this.setData({
        toolType: 3,
        showColor: false,
        ctxLineWidth: ctx.lineWidth
      })
    } else {
      ctx.strokeStyle = this.data.color;
      ctx.lineWidth = this.data.lineWidth;
      this.setData({
        toolType: 2,
        showColor: false
      })
    }

  },
  // 显示颜色选择颜色
  showChangeColor() {
    ctx.lineWidth = this.data.lineWidth;
    ctx.strokeStyle = this.data.color;
    this.setData({
      showColor: !this.data.showColor,
      toolType: 2,
    })
  },
  // 确认颜色选择
  chengColor(e) {
    ctx.strokeStyle = e.currentTarget.dataset.color;
    this.setData({
      color: e.currentTarget.dataset.color,
      showColor: false
    })
  },

  // 初始化 - canvas
  canvasInit() {
    wx.createSelectorQuery()
      .selectAll('.myCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec(res => {

        // 绘画画布
        canvas = res[0][0].node
        ctx = canvas.getContext('2d')
        canvas.width = W
        canvas.height = H * 0.6

        // 展示画布
        // canvas2 = res[0][1].node
        // ctx2 = canvas2.getContext('2d')
        // canvas2.width = W
        // canvas2.height = H * 0.6
        // ctx2.fillStyle = "#E1FFFF";
        // ctx2.fillRect(0, 0, W, H);

        //底色填充
        ctx.fillStyle = "#f2f2f2";
        ctx.fillRect(0, 0, W, H);

        ctx.beginPath(); //重置路径
        ctx.lineWidth = this.data.lineWidth; // 线条宽度
        ctx.strokeStyle = this.data.color; // 线条颜色

        this.setData({
          ctxLineWidth: ctx.lineWidth
        })
        // 绘画流程
        /* 
          ctx.moveTo(50, 50); //从哪个位置开始
          ctx.lineTo(70, 90); //移动到哪个位置
          ctx.lineTo(150, 150);
          ctx.lineTo(50, 150);
          ctx.stroke(); //将这些位置绘制出来

          ctx.moveTo(180, 160); //从哪个位置开始
          ctx.lineTo(170, 190); //移动到哪个位置
          ctx.lineTo(250, 250);
          ctx.lineTo(150, 250);
          ctx.stroke(); //将这些位置绘制出来
        */



      })
  },
  // 初始化 - websocket
  websocketInit() {
    // let url = 'wss://junstar.top:3291'; //线上
    // let url = 'https://junstar.top:3291'; //线上
    let url = 'http://127.0.0.1:3290' // 本地
    socket = io(url, {
      transports: ['websocket'], // 此项必须设置
      reconnectionAttempts: 3, // 失败后重新连接次数，一直失败总共尝试四次
      reconnectionDelay: 2000, // 重新连接间隔时间毫秒
      forceNew: true,
    });
    console.log(socket);


    socket.on('opend', (data) => {
      console.log('opend:', data);
      // 链接成功之后进入房间
      socket.emit('room', {
        nickname: this.data.name,
        room: 123
      });
    });
    socket.on('connect', (data) => {
      console.log('connection created.', data)
    });
    // 进入房间
    socket.on('room', (data) => {
      console.log('room', data);
    });
    // 接受到消息
    socket.on('message', (data) => {
      console.log('message', data);
      let nickname = data.nickname;
      let message = data.message;
      let date = util.timestampToTime(Date.now() / 1000, 'h:m:s');
      this.data.textareaVale.push({
        nickname,
        message,
        date
      })
      this.setData({
        textareaVale: this.data.textareaVale
      })
      this.getScollBottom();
    });
  },



  // 发送需求
  setmessage() {
    if (this.data.inputValue == '') {
      wx.showToast({
        title: '内容为空不能发送',
        icon: 'none'
      })
      return false
    }
    socket.emit('message', {
      nickname: this.data.name,
      message: this.data.inputValue,
      room: 123
    });
    this.setData({
      inputValue: ''
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
    // 画布操作
    this.canvasInit();
    setTimeout(() => {
      // websocket链接
      this.websocketInit();
    }, 0);

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