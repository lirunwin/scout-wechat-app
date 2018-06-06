// pages/me/contact.js
import userService from '../../service/user.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact: '',
    form: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData)
    this.getContactInfo();
  },
  getContactInfo() {
    let profile = getApp().globalData.profile;
    let contact = {};
    profile.contactinfo ? this.setData({ contact: profile.contactinfo, form: profile.contactinfo }) : userService.getProfile().then(res => {
      contact = res.data.contactinfo;
      this.setData({
        contact,
        form: contact
      });
    });
  },
  bindinput(e) {
    this.data.form[e.currentTarget.dataset.name] = e.detail.value
    console.log(this.data.form)
  },
  saveContact() {
    userService.saveContact(this.data.form).then(res => wx.showToast({
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