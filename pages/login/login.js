// pages/login/login.js

import config from '../../utils/config';
import userService from '../../service/user.js';
import commonService from '../../service/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    password:'',
    loginBySMS: false,
    tel:'',
    sms:''
  },
  comfirmInput() {
    this.login();
  },
  loginBySMS() {
    let sms = !this.data.loginBySMS;
    wx.setNavigationBarTitle({
      title: sms ? '短信登录' : '账号登录'
    });
    this.setData({
      loginBySMS: sms 
    });
  },
  bindTelInput(e) {
    let tel = e.detail.value;
    this.setData({
      tel,
      disableSmsBtn: !this.valiTel(tel)
    });
  },
  bindSmsInput(e) {
    let sms = e.detail.value;
    this.setData({
      sms,
      disableSubmit: !(sms.length === config.smsLength)
    })
  },
  getSmsCode() {
    if (!this.valiTel()) {
      console.log('电话格式有误！');
      return;
    }
    commonService.getTelCode({
      tel: this.data.tel,
      codeType: 'USER_LOGIN'
    }).then(res => {
      console.log(res);
      this.smsCounting();
    });
  },
  valiTel(tel = this.data.tel) {
    return config.telRegExp.test(tel);
  },  
  smsCounting() {
    let msg = 90;
    this.setData({
      disableSmsBtn: true,
      smsMsg: '（' + msg + '）'
    });
    let timer = setInterval(() => {
      this.setData({
        smsMsg: '（' + msg-- + '）'
      });
      if (msg === 0) {
        this.setData({
          disableSmsBtn: false,
          smsMsg: ''
        });
        clearInterval(timer)
      }
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    if (options.type && options.type.toUpperCase() === 'SMS') {
      console.log(options.type.toUpperCase())
      this.setData({
        loginBySMS: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  }, 
  bindPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  }, 
  login() {
    let params = {};
    if (!this.data.loginBySMS) {
      params = {
        account: this.data.username,
        password: this.data.password,
        loginType: 'PASSWORD'
      }
    } else {
      params = {
        account: this.data.tel,
        password: this.data.sms,
        loginType: 'TELCODE'
      }      
    }
    userService.login(params).then(res =>{
      if (res.code === 1) {
        userService.saveToken(res.data);
        wx.switchTab({
          url: '../index/index'
        })
      }
    })
  }
})