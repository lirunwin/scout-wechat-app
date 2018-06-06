// pages/job/jobInfo.js
import jobService from '../../service/job.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobInfo: '',
    config: jobService.constant,
    markers: []
  },
  getJobInfo(id) {
    jobService.getRecruitmentInfo(id).then(res => this.setData({
      jobInfo: res.data,
      markers: [{
        id: 0,
        latitude: res.data.latitude,
        longitude: res.data.longitude,
        title: res.data.address
      }]
    }));
  },
  follow(e) {
    jobService.addCollection(e.currentTarget.dataset.id).then(res => wx.showToast({
      title: res.msg
    }));
  },
  join(e) {
    jobService.addDelivery(e.currentTarget.dataset.id).then(res => wx.showToast({
      title: res.msg
    }));
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getJobInfo(options.id);
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