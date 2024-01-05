// activityCube/pages/index/components/userAvatarAndName/userAvatarAndName.js
const ossUploadFile = require('../../utils/oss-upload-file');
const WXAPI = require("../../utils/api");

const app = getApp();
let timer = null;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    phoneAuthStatus: {
      type: Number,
      value: 1
    }
  },
  observers: {
    show: function (newVal) {
      this.init(newVal);
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    avatar: '',
    value: '',
    company_applet_name: '', // 小程序名称
    company_logo: '', // 小程序logo
    popup_show: false,// 下拉框弹窗
    inform_show: false,// 授权弹窗
    phone_show: false,// 手机号弹窗
    userinfo: {},//用户信息
    title: '昵称和头像',
  },
  lifetimes: {
    attached() {
      this.getCompanyInfo();
    },
    detached() {
      clearInterval(timer);
      timer = null;
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async init(newVal) {
      if (newVal) {
        // 判断是否登录
        const app = getApp();
        if (await app.globalData.isLogin2()) {
          // 已经登录不做处理
          return false
        }
        let { title } = this.data;
        let userinfo = wx.getStorageSync('userInfo');
        // 如果 用户昵称已经授权 手机号没授权
        if (userinfo.is_auth_userinfo == 0) {
          title = '昵称和头像'
        } else {
          title = '手机号'
        }
        this.setData({
          title, userinfo,
          inform_show: true,
          popup_show: false
        })
      } else {
        this.setData({
          inform_show: false,
          popup_show: false
        })
      }
    },
    getCompanyInfo() {
      // 跟Storage内容更新同步
      timer = setInterval(() => {
        const companyInfo = wx.getStorageSync('companyInfo');
        if (JSON.stringify(companyInfo.applet_name) !== JSON.stringify(this.data.company_applet_name)) {
          this.setData({
            company_applet_name: companyInfo.applet_name,
            company_logo: companyInfo.logo
          })
        }
      }, 1000);
    },
    async onChooseAvatar(e) {
      let avatarUrl = e.detail.avatarUrl;

      if (getApp().platform == 'IOS' || getApp().platform == 'ios' || getApp().platform == 'android') {
        avatarUrl = await new Promise((resolve, reject) => {
          // 裁剪图片
          wx.cropImage({
            src: avatarUrl,
            cropScale: '1:1',
            success(res) {
              if (res.tempFilePath.indexOf('wxfile://') != -1) {
                resolve(res.tempFilePath)
              } else {
                resolve(avatarUrl)
                wx.showToast({
                  title: '暂不支持裁剪',
                  icon: 'none'
                })
              }
            },
            fail(err) {
              console.log(err);
              resolve(avatarUrl)
            },
          })
        })
      }
      this.setAvatar(avatarUrl);
    },
    // 设置头像
    async setAvatar(avatarUrl) {
      const newimg = await wx.compressImage({
        src: avatarUrl,
        quality: 65,
        compressedWidth: '1000'
      })
      let tempFilePaths = newimg.tempFilePath;

      const res = await ossUploadFile.uploadFile(tempFilePaths);
      this.setData({
        avatar: res.data.url,
      })
    },
    // 输入框改变
    inputChange(e) {
      this.setData({
        value: e.detail.value
      })
    },
    textChange(e) {
      this.setData({
        value: e.detail.value
      })
    },
    // 获取手机号回调
    getPhoneNumber(event) {
      const that = this;
      if (event.detail.errMsg == "getPhoneNumber:ok") {

        WXAPI.getUserPhone({
          code: event.detail.code
        }).then(function (res) {
          if (res.status == 1) {
            wx.setStorageSync('userInfo', res.data)
            wx.showShareMenu({
              menus: ['shareAppMessage', 'shareTimeline']
            });
            that.setData({
              phone_show: false,
              popup_show: false,
            })
            that.onConfirmClose();
          }
        })
      }
    },
    // 提交数据
    onSubmit(e) {
      let name = null;
      if (e) {
        name = e.detail.value.nickname;
      }
      let that = this;
      WXAPI.setUserInfo2({
        avatar: this.data.avatar,
        username: name || this.data.value,
      }).then(function (res) {
        if (res.status === 1) {
          wx.setStorageSync('userInfo', res.data)
          if (res.data.is_auth == 0 && that.properties.phoneAuthStatus == 1) {
            that.setData({
              phone_show: true,
              popup_show: false,
            })
          } else {
            that.onConfirmClose();
          }
        }
      })
    },
    // 关闭弹窗
    onConfirmClose() {
      this.setData({
        popup_show: false,
        inform_show: false,
        phone_show: false,
      })
      this.triggerEvent('confirmCallBack')
    },

    // 授权取消按钮
    onCancelClose() {
      this.setData({
        popup_show: false,
        inform_show: false,
        phone_show: false,
      })
      this.triggerEvent('cancleCallBack')
    },
    informConfirm() {
      let { inform_show, popup_show } = this.data;
      inform_show = !inform_show;
      popup_show = !popup_show;
      this.setData({
        inform_show, popup_show
      })
    },
  }
})
