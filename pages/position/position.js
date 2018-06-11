// pages/position/position.js

import commonService from '../../service/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    positions:[],
    positionsOrigin:[],
    choosedPosition:{}
  },

  getPosition() {
    commonService.getPosition().then(res => {
      let data = res.data;
      let positions = data.filter(p => p.pid === '0').map(first =>{
        return {
          title: first,
          list: data.filter(item => item.pid === first.id)
        }
      })
      this.setData({
        positions,
        positionsOrigin: data
      });
    })
  },
  
  setPosition(e) {
    let id = e.currentTarget.dataset.id;
    let position = this.data.positionsOrigin.find(pos => pos.id === id);
    let choosedPosition = this.data.choosedPosition;
    if (choosedPosition && position.id === choosedPosition.id) {
      getApp().globalData.currentPosition = null;
    } else {
      getApp().globalData.currentPosition = position;      
    }
    // wx.switchTab({
    //   url: '../index/index'
    // })

    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPosition();
    this.setData({
      choosedPosition: getApp().globalData.currentPosition
    })
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