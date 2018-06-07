// pages/apply/apply.js
import jobService from '../../service/job.js';

Page({
  data: {
    jobList: [],
    jobFilter: {
      'pageIndex': 1,
      'pageSize': 10,
      'filter': 'RECOMMEND'
    },
    jobEnd: false,
    apply: true,
    filtedJobList: [],
    activeStatus: -1
  },
  getJobList(filter = this.data.jobFilter) {
    jobService.query(filter).then(res => {
      let jobList = this.data.jobList.concat(res.data.map(job => {
        job.status = job.id % 4; // 暂无状态 造了一个
        return job;
      }));

      let status = this.data.activeStatus;

      let filtedJobList = status === -1 ?
        jobList :
        jobList.filter(job => job.status === status);

      res.data.length === 0 ? this.data.jobEnd = true :
        this.setData({
          jobList,
          filtedJobList
        });
    });
  },
  filter(e) {
    let status = e.target.dataset.status;
    let filtedJobList = Number(status) === -1 ?
      this.data.jobList :
      this.data.jobList.filter(job => job.status === Number(status));
    this.setData({
      filtedJobList,
      activeStatus: Number(status)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getJobList();
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
    this.getJobListNextPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})