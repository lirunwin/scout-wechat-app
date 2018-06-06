const api = require('./utils/api.js');
import config from './utils/config.js';
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    let logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    this.globalData.token = wx.getStorageSync('token') || '';
    
    this.getSystemInfo();

    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              getApp().globalData.wechatInfo = res.userInfo;
            }
          })
        }
      }
    })
    // wx.login({
    //   success: function (res) {
    //     if (res.code) {
    //       console.log(res.code)
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // });
    
  },
  globalData: {
    wechatInfo:'',
    profile: '',
    systemInfo: null,
    pr: 2,
    currentCity: '',
    cityInfo:'',
    cities:'',
    token:'',
    currentPosition:'',
  },
  getSystemInfo() {
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res;
        this.globalData.pr = res.pixelRatio;
      }
    });
  },
  api,
  config
});
