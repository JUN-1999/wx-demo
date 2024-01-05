// 小程序开发api接口统一配置
import API_BASE_URL from './baseURL';
let isRefreshing = true;
let pendings = [];


export function request(url, method, data, loading) {
  let _url = API_BASE_URL + url;

  if (loading) {
    wx.showLoading({
      title: '加载中',
      mask: true // 设置为true，页面中的内容将不可点击
    })
  }


  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        "appid": wx.getStorageSync('openID'),
        // "companyId": wx.getStorageSync('companyID'),
        "token": wx.getStorageSync('loginToken'), //点评ofX90xBtBPxYvLlvQQTr1gxxH9us //ofX90xBUgi3Xk-Chj9WXi0AV54vI
        // "token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5YW54aWFrYTIyMyIsImF1ZCI6IiIsImlhdCI6MTY2MzAzODU4NSwibmJmIjoxNjYzMDM4NTg4LCJleHAiOjE2NjMwNDU3ODUsImRhdGEiOnsiaWQiOjkwMH19.S9VXr9qoliDx9FFciYkquewQW08wiZviMhJhERtTTZY', //点评ofX90xBtBPxYvLlvQQTr1gxxH9us //ofX90xBUgi3Xk-Chj9WXi0AV54vI
      },
      success(res) {
        // console.log('request_success', res);
        if (loading) {
          wx.hideLoading()
        }

        // 接口处理

        if (res.data.status === 1) {
          res.data.status = 200;
        }
        if (res.data.status === 200) {
          resolve(res.data);
          return true;
        } else if (res.data.status === 110002) {

          wx.navigateTo({
            url: '/pages/login/login',
          })
          resolve(res.data)
          return false;
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
          resolve(res.data)
          return false;
        }

      },
      fail(error) {
        // console.log('request_fail', res);
        reject(error)
      }
    })
  })
}
/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.final = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}
function refreshTokenRequst() {
  login()
}
function onAccessTokenFetched() {
  pendings.forEach((callback) => {
    callback();
  })
  pendings = [];
}
let login = () => {
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        let path = '';
        const loginType = wx.getStorageSync('loginType');
        // 登录请求接口
        path = loginType == 'student' ? '/emis/wxCodeLogin' : '/emis/teacher/wxCodeLogin';
        wx.request({
          url: API_BASE_URL + path,
          method: 'post',
          data: {
            code: res.code
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          success(wxCodeLoginRes) {
            let data = wxCodeLoginRes.data.data;
            if (data.login_status == 1) {
              // 已经授权登录
              const { token, openid, user } = data;
              wx.setStorageSync('openID', openid)
              wx.setStorageSync('loginToken', token)
              wx.setStorageSync('user', user)
              onAccessTokenFetched();
              isRefreshing = true;
            } else {
              // 没有授权，跳转到手机号登录页
              var pages = getCurrentPages(); // 获取页面指针数组
              var currentPage = pages[pages.length - 1]; // 获取当前页

              if (currentPage.route != 'pages/login/login') {
                wx.redirectTo({
                  url: '/pages/login/login',
                  fail: function () {
                    console.log('跳转失败');
                  }
                })
              }
            }
          },
          fail(error) {
            reject(error)
          },
          complete(res) { }
        })
      } else {
        var pages = getCurrentPages(); // 获取页面指针数组
        var currentPage = pages[pages.length - 1]; // 获取当前页
        if (currentPage.route != 'pages/login/login') {
          wx.redirectTo({
            url: '/pages/login/login',
            fail: function () {
              console.log('跳转失败');
            }
          })
        }
      }
    }
  })
}
