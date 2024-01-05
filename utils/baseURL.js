const env = wx.getAccountInfoSync().miniProgram.envVersion

const baseApi = {
  // 开发版
  // develop: "http://www.mxadmin.com",
  develop: "https://app-test.yanxiaokakoucai.com",
  // 体验版
  // trial: "http://www.mxadmin.com",
  trial: "https://app-test.yanxiaokakoucai.com",
  // 正式版
  release: "https://app.yanxiaokakoucai.com"
};

const api = baseApi[env]
export default api;

