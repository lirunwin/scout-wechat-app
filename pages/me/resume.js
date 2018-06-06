// pages/me/resume.js

import userService from '../../service/user.js'
import utils from '../../utils/util.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    profile: '',
    config: userService.constant
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideNavigationBarLoading();
    this.getProfile();
  },
  getProfile() {
    let profile = getApp().globalData.profile;
    profile.baseinfo ? this.setData({ profile }) : userService.getProfile().then(res => 
      this.setData({ profile: res.data })
    );
  },
  navigateToPage(e){
    utils.navigater(e)
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
    wx.hideNavigationBarLoading();
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

  }
})