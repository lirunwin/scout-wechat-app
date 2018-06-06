// pages/me/history.js

import jobService from '../../service/job.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: ''
  },
  getHistory() {
    jobService.history({
      "pageIndex": "1",
      "pageSize": "10"
    }).then(res => this.setData({ history: res.data }));
  },
  delete(e) {
    let id = e.currentTarget.dataset.id;
    let collection = this.data.collection;
    id ? jobService.removeCollection(id).then(res => {
      collection.splice(collection.indexOf(collection.find(job => job.id === id)), 1);
      collection.length === 0 ? wx.navigateBack() : '';
      this.setData({ collection });
    }) : '';
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistory();
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