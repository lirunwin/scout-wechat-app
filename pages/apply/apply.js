// pages/apply/apply.js
import jobService from '../../service/job.js';

Page({
  data: {
    jobList: [],
    jobFilter: {
      'pageIndex': 1,
      'pageSize': 20,
      'filter': 'DELIVERY'
    },
    jobEnd: false,
    apply: jobService.constant.apply,
    constant: jobService.constant,
    filtedJobList: [],
    activeStatus: 'DELIVERY'
  },
  getJobList(filter = this.data.jobFilter) {
    jobService.query(filter).then(res => {
      let jobList = this.data.jobList.concat(res.data);
      let status = this.data.activeStatus;

      let filtedJobList = status === 'DELIVERY' ?
        jobList :
        jobList.filter(job => job.deliveryStatus === status);

      res.data.length === 0 ? this.data.jobEnd = true :
        this.setData({
          jobList,
          filtedJobList
        });
    });
  },
  filterTypeChange(e) {
    this.filter(e.target.dataset.status)
  },
  filter(status) {
    let filtedJobList = status === 'DELIVERY' ?
      this.data.jobList :
      this.data.jobList.filter(job => job.deliveryStatus === status);
    this.setData({
      filtedJobList,
      activeStatus: status
    });
    console.log(filtedJobList.length)
  },
  getJobListNextPage() {
    if (this.data.jobEnd) return;
    let filter = this.data.jobFilter;
    filter.pageIndex += 1;
    this.getJobList(filter);
  },
  changeFilter() {
    // 当改变查询条件必须调用此方法（翻页不算改变）,方便追踪是否翻到了最后一页。
    this.data.jobEnd = false;
  },
  newPost(e) {
    console.log(e)
  },
  showAgree(tab) {
    this.getJobList({
      'pageIndex': 1,
      'pageSize': 20,
      'filter': tab
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getJobList();
    let indexToApplyDftTap = getApp().globalData.switchTabParams.apply;
    if (indexToApplyDftTap && indexToApplyDftTap.tab) {
      let tab = indexToApplyDftTap.tab;
      this.setData({
        activeStatus: tab
      });
      this.filter(tab)
      getApp().globalData.switchTabParams.apply = null;
    }
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
    // this.getJobListNextPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})