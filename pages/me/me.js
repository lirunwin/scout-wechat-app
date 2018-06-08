// pages/me/me.js
import userService from '../../service/user.js'
import utils from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    resumePercentage: '25%',
    profile: null,
    constent: utils.profile,
    avatar: ''
  },
  share(){
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  getProfile() {
    userService.getProfile().then( res => {
      this.setData({
        profile: res.data
      })

      getApp().globalData.profile = res.data;
    });
  }, 
  makeCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  navigateToPage(e) {
     return utils.navigater(e);
  },
  drawCircle: function (step) {
    var ctx = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    
    ctx.setLineWidth(4);// 设置圆环的宽度
    ctx.setStrokeStyle('#ffffff'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    ctx.arc(25, 25, 20, -Math.PI / 2, step * 2 * Math.PI - Math.PI / 2, false);
    ctx.stroke();
    ctx.draw()
  },
  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(4);// 设置圆环的宽度
    ctx.setStrokeStyle('rgba(255,255,255,0.5)'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(25, 25, 20, 0, 2 * Math.PI, false);
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProfile();
    this.setData({
      avatar: getApp().globalData.wechatInfo.avatarUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawProgressbg();
    this.drawCircle(0.25);
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
    return {
      title: '侦察兵兼职招聘',
      desc: '一个最方便兼职招聘的平台',
      path: '/page/user?id=123'
    }
  }
})