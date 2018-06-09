// pages/signin/phoneCheck.js
import config from '../../utils/config';
import commonService from '../../service/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: '',
    sms: '',
    disableSmsBtn: true,
    smsMsg:'',
    disableSubmit: true,
    recommendUserId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.recommendUserId) {
      this.setData({
        recommendUserId: options.recommendUserId
      })
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
      codeType: 'USER_REGISTER'
    }).then(res => {
      console.log(res);
      this.smsCounting();
    });
  },
  valiTel(tel = this.data.tel) {
    return config.telRegExp.test(tel);
  },
  formSubmit() {
    commonService.checkTelCode({
      tel: this.data.tel,
      codeType: 'USER_REGISTER',
      code: this.data.sms
    }).then(res => {
      console.log()
      wx.navigateTo({
        url: `signin?checkSign=${res.data}&recommendUserId=${this.data.recommendUserId}&tel=${this.data.tel}&sms=${this.data.sms}`
      })
    });
  },
  smsCounting() {
    let msg = 90; 
    this.setData({
      disableSmsBtn: true,
      smsMsg: '（'+ msg + '）'
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
  }
})