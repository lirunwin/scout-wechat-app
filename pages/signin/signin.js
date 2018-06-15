// pages/signin/signin.js

import config from '../../utils/config';
import userService from '../../service/user.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password:'',
    repassword:'',
    name:'',
    gender: ['男', '女'],
    genderIndex: 0,
    identityType: [
      {
        name: 'STUDENT',
        label: '学生用户'
      },
      {
        name: 'OTHER',
        label: '非学生'
      }
    ],
    identityIndex: 0,
    birthday:'',
    checkSign: "",
    disableSubmit: true,
    birthDayStartDate: config.birthDayStartDate,
    birthDayEndDate: config.birthDayEndDate,
    recommendUserId:'',
    sms:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.checkSign) {
      this.setData({
        checkSign: options.checkSign
      })
    } 
    if (options.recommendUserId) {
      this.setData({
        recommendUserId: options.recommendUserId
      })
    }
    if (options.tel && options.sms) {
      this.setData({
        tel: options.tel,
        sms: options.sms
      })
    } else {
      // getApp().api.showToast({
      //   title: '获取手机号码有误，请重新填写',
      //   icon:'none'
      // }).then(() => {
      //   wx.navigateTo({
      //     url: 'phoneCheck'
      //   })
      // })
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
  bindPassInput(e) {
    this.setData({
      password: e.detail.value
    })
  }, 
  bindRePassInput(e) {
    this.setData({
      repassword: e.detail.value
    })
  }, 
  bindNameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  bindGenderChange: function (e) {
    this.setData({
      genderIndex: e.detail.value
    })
  },
  bindIdentityTypeChange: function (e) {
    this.setData({
      identityIndex: e.detail.value
    })
  },
  formSubmit() {
    if(this.vali()){
      userService.register({
        checkSign: this.data.checkSign,
        tel: this.data.tel,
        password: this.data.password,
        veryCode: this.data.sms,
        name: this.data.name,
        identityType: this.data.identityType[this.data.identityIndex].name,
        recommendUserId: this.data.recommendUserId
      }).then(res => {
        if(res.code === 1) {
          userService.saveToken(res.data);
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          });
          wx.switchTab({
            url: '../index/index'
          });
        } else {
          wx.showToast({
            title: '注册失败,请重新注册',
            icon: 'none'
          });
        }
      });
    }
  },
  vali() {
    let data = this.data;
    if (data.password.length < config.passwordMinlength) {
      wx.showToast({
        title: `密码不能小于${config.passwordMinlength}位数`,
        icon: 'none'
      })
      return false;
    } else if (data.password !== data.repassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      })
      return false;
    } else if (data.name.trim().length < 2) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
      return false;
    } else if (!(data.genderIndex > -1 && data.identityIndex > -1 && data.date !== '')) {
      return false;
    }
    return true;   
  }
})