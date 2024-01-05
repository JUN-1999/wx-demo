
/* 
  授权弹窗
  scope:需要判断的scope 
  modaltext:拒绝授权之后引导的文字
  callback:回调函数
 */
const fooAuthorize = (scope, callback, modaltext = '需要授权对应权限才能下一步操作') => {
  const foo = function () {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          // 未发送过授权
          wx.authorize({
            scope: scope,
            success() {
              // 发起授权
              callback();
            },
            fail(err) {
              // 用户拒绝请求
              wx.showModal({
                title: '提示',
                content: modaltext,
                complete: (res) => {
                  if (res.cancel) {
                    // 还是不同意授权
                  }
                  if (res.confirm) {
                    // 同意授权
                    wx.openSetting();
                  }
                }
              })
            }
          })
        } else {
          callback();
        }
      },
      fail(err) {
        wx.showModal({
          title: '报错',
          content: JSON.stringify(err),
          complete: (res) => {
            if (res.cancel) {
            }
            if (res.confirm) {
            }
          }
        })
      }
    })
  }
  wx.getPrivacySetting({
    success: res => {
      console.log(res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
      if (res.needAuthorization) {
        // 需要弹出隐私协议
        wx.requirePrivacyAuthorize({
          success: () => {
            // 用户同意授权
            // 继续小程序逻辑
            foo();
          },
          fail: () => {
            console.log('用户拒绝了 不做处理');
          }, // 用户拒绝授权
          complete: () => { }
        })
      } else {
        // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用隐私接口
        foo();
      }
    },
    fail: () => { },
    complete: () => { }
  })
}

function getWeekDay(date) {
  var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return weekdays[date.getDay()];
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 十位 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */

function timestampToTime(timestamp, format = 'Y-m-d H:i:s') {
  if (timestamp === undefined) {
    timestamp = 0;
  }
  var date = new Date(timestamp * 1000);
  var formatChars = {
    'Y': function () { return date.getFullYear(); },
    'm': function () { return String(date.getMonth() + 1).padStart(2, 0); },
    'd': function () { return String(date.getDate()).padStart(2, 0); },
    'H': function () { return String(date.getHours()).padStart(2, 0); },
    'i': function () { return String(date.getMinutes()).padStart(2, 0); },
    's': function () { return String(date.getSeconds()).padStart(2, 0); },
    'w': function () { return String(date.getDay()).padStart(2, 0); }, // 'w' 代表星期
    'W': function () { return getWeekDay(date); }// 大写W 代表汉字的星期
  };

  var formatted = '';
  for (var i = 0; i < format.length; i++) {
    var ch = format[i];
    if (formatChars[ch]) {
      formatted += formatChars[ch]();
    } else {
      formatted += ch;
    }
  }

  return formatted;
}

module.exports = {
  formatTime,
  timestampToTime,
  fooAuthorize
}