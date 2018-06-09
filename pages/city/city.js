// pages/city/city.js
import locationService from '../../service/location.js';
import commonService from '../../service/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities: [],
    provinces: [],
    hotCities: [],
    location: '',
    currentCounties: [],
    activePid: '-1'
  },

  getArea() {
    let processCities = (cities) => {
      console.log(cities)
      cities = cities.map(city => ({
        id: city.id,
        name: city.areaName,
        pid: city.pid,
        open: city.openStatus.toUpperCase().indexOf("OPEN") > -1,
        hot: city.openStatus.toUpperCase().indexOf("HOT") > -1,
      }));
      let hotCities = cities.filter(city => city.hot);
      let provinces = cities.filter(city => city.pid === '0');
      this.setData({
        cities,
        provinces,
        hotCities,
        currentCounties: hotCities
      });      
    }

    let cities = getApp().globalData.cities || '';
    if(cities === '') {
      commonService.getArea().then(res => {
        processCities(res.data)
      })
    } else {
      processCities(cities);
    }    
  },
  displayCounty(e) {
    let pid = e.currentTarget.dataset.id;
    if (pid) {
      if (pid === '-1') {
        this.setData({
          currentCounties: this.data.hotCities,
          activePid: pid
        });
      } else {
        let cities = this.data.cities.filter(city => city.pid === pid);
        this.setData({
          currentCounties: cities,
          activePid: pid
        });
      }
    }
  },
  setLocation(e) {
    let id = e.currentTarget.dataset.id;
    let city = this.data.cities.find(city => city.id === id);
    city.counties = this.data.cities.filter(city => city.pid === id);
    getApp().globalData.currentCity = city;
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArea();
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
    let currentCity = getApp().globalData.currentCity;
    this.setData({
      location: currentCity.name ? currentCity.name : '定位中...'
    })
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