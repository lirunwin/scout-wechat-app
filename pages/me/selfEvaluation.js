// pages/me/selfEvaluation.js
import userService from '../../service/user.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selfevaluation: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSelfEvaluation();
  },
  getSelfEvaluation() {
    let profile = getApp().globalData.profile;
    profile.selfevaluation ? this.setData({
      selfevaluation: profile.selfevaluation      
    }) : userService.getProfile().then(res => {
      this.setData({
        selfevaluation: res.data.selfevaluation
      });
    });
  },
  bindinput(e) {
    this.data.selfevaluation = e.detail.value
  },
  saveSelfEvaluation() {
    userService.saveSelfEvaluation(this.data.selfevaluation).then(res => wx.showToast({
      title: res.msg
    }));
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

  }
})