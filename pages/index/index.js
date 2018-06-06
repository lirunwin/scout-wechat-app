// pages/index/index.js
import jobService from '../../service/job.js';
import locationService from '../../service/location.js';
import commonService from '../../service/common.js';
const Promise = require('../../utils/es6-promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: {
      imgUrls: [
        '../../images/swiper1@2x.png',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
      ],
      indicatorDots: true,
      indicatorColor: 'rgba(255, 255, 255, .4)',
      indicatorActiveColor: 'rgba(255, 255, 255, 1)',
      autoplay: true,
      interval: 5000,
      duration: 1000

    },
    constant: null,
    jobList: [],
    currentCity: '',
    cityInfo:'',
    jobFilter: {
      'pageIndex': 1,
      'pageSize': 10,
      'filter': 'RECOMMEND'
    },
    jobEnd: false,
    currentPosition:{
      name:'职位类型'
    },
    areaIndex: 0,
    area: null,
    sortTypeIndex: 0,
    sortType: jobService.constant.sort,
    toView: '',
    scroll: {
      done: false
    }
  },
  scroll(e) {    
    if (!this.data.scroll.done) {
      this.setData({
        toView: 'main',
        scroll: {
          done: true,
          active: true
        }
      })      
    } else {
     
    }
  },
  handlescrolltoupper(e){
    
  },
  handletouchmove(e){
    console.log(e)
  },
  switchJobNature(e) {
    let index = e.target.dataset.index
    let constant = Object.keys(jobService.constant.jobNature);
    if(index < 0) {
      delete this.data.jobFilter.nature;
    } else {
      this.data.jobFilter.nature = constant[index];
    }
    this.changeFilter();
    this.getJobList();
  },
  setArea() {
    let currentCity = getApp().globalData.currentCity;
    if(currentCity) {
      this.data.jobFilter.cityId = currentCity.id;
      let area = currentCity.counties
      let noArea = area.pop();
      noArea.id = '-1';
      area.unshift(noArea);
      this.setData({
        area
      });
    }
  },
  setDftArea(cities) {
    let cityInfo = getApp().globalData.cityInfo
    let cityId = cityInfo.adcode.substr(0, 4);
    this.data.jobFilter.cityId = cityId;
    let area = cities.filter(city => city.pid === cityId);
    let noArea = area.pop();
    noArea.id = '-1';
    area.unshift(noArea);
    this.setData({
      area
    })
  },
  bindAreaPicker(e){
    let index = e.detail.value;
    this.setData({
      areaIndex: index
    })
    if(index < 0) {
      delete this.data.jobFilter.countyId
    } else {
      this.data.jobFilter.countyId = this.data.area[index].id
    }
    this.changeFilter();
    this.getJobList();
  },
  bindSortPiker(e) {
    let index = e.detail.value;
    this.setData({
      sortTypeIndex: index
    });
    this.data.jobFilter.sort = this.data.sortType[index].label;
    this.changeFilter();
    this.getJobList();
  },
  getCity() {
    return locationService.getLocation()
      .then(res => locationService.getCityInfoByLocation(res.latitude, res.longitude))
      .then(res => {
        let cityInfo = res.result.ad_info;
        getApp().globalData.cityInfo = cityInfo;
        this.data.cityInfo = cityInfo;
        this.setCurrentCity();
      })
  },
  setCurrentCity() {
    let currentCity = getApp().globalData.currentCity
    currentCity.id ? this.setData({
      currentCity
    }) : this.setData({
        currentCity: {
          name: this.data.cityInfo.city
        }
    });
  },
  setCurrentPosition() {
    let currentPosition = getApp().globalData.currentPosition;
    if (currentPosition.id) {
      this.setData({
        currentPosition
      });
      this.data.jobFilter.positionId = currentPosition.id;
      this.changeFilter();
      this.getJobList();
    } 
  },
  navigateToPosition() {
    wx.showNavigationBarLoading();
    wx.navigateTo({
      url: '../position/position',
    })
  },
  navigateToCity() {
    wx.showNavigationBarLoading();
    wx.navigateTo({
      url: '../city/city',
    })
  },
  getJobList(filter = this.data.jobFilter) {
    console.log({filter})
    jobService.query(filter).then(res => {
      res.data.length === 0 ? this.data.jobEnd = true :
        this.setData({
          jobList: this.data.jobList.concat(res.data)
        });
    });
  },

  // getApp().api.post('job/query', filter)
  getJobListNextPage() {
    if (this.data.jobEnd) return;
    let filter = this.data.jobFilter;
    filter.pageIndex += 1;
    this.getJobList(filter);
  },
  changeFilter() {
    // 当改变查询条件必须调用此方法（翻页不算改变）,方便追踪是否翻到了最后一页。
    this.setData({
      jobList: []
    });
    this.data.jobFilter.pageIndex = 1
    this.data.jobEnd = false;
  },
  getCities() {
    return commonService.getArea().then(res => {
      let cities = res.data.map(city => {
        return {
          id: city.id,
          name: city.areaName,
          pid: city.pid,
        }
      });
      getApp().globalData.cities = cities;
      return cities;
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().api.checkLogin();
    this.getJobList();
    Promise.all([this.getCity(), this.getCities()]).then(res => {
      // console.log({res})
      this.setDftArea(res[1])
    });
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
    this.setCurrentCity();
    this.setCurrentPosition();
    this.setArea();
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
  handlescrolltolower() {
    this.getJobListNextPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  
});
