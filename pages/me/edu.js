// pages/me/edu.js

import userService from '../../service/user.js'
import jobService from '../../service/job.js'
import commonService from '../../service/common.js';
const Promise = require('../../utils/es6-promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    highestEdu: {},
    config: userService.constant,
    cities: '',
    objectMultiArray: [],
    multiIndex: [0, 0],
    currentProvince: '',
    currentCity: '',
    form: {},
    eduList: [],
    eduListIndex: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideNavigationBarLoading();
    Promise.all([
      this.setEduList(),
      this.getProfile()
    ]).then(res => {
      let nowEduType = this.data.eduList.find(edu => edu.label === this.data.highestEdu.educationtype);

      if (nowEduType) {
        let nowIndex = this.data.eduList.indexOf(nowEduType);
        this.setData({
          eduListIndex: nowIndex
        });
      }
    });
  },
  setEduList() {
    let eduObj = userService.constant.education;
    let eduList = Object.keys(eduObj).map(key => {
      return {
        label: key,
        name: eduObj[key]
      }
    })
    this.setData({ eduList });
    this.data.form.educationType = eduList[this.data.eduListIndex].label
  },
  getProfile() {
    let profile = getApp().globalData.profile;
    profile.baseinfo ? this.getEdu() : userService.getProfile().then(res => {
      this.getEdu(res.data);
    });
  },
  getEdu(profile = getApp().globalData.profile) {
    let educations = this.data.educations = profile.educations.sort((a, b) => {
      return a.educationtype.replace(/\D/g, '') < b.educationtype.replace(/\D/g, '')
    });
    let highestEdu = educations[0];
    if (!highestEdu) {
      wx.showToast({
        title: '未设置学历信息',
        icon: 'none'
      });
      this.setData({
        highestEdu: {
          cityid: '1101',
          provinceid: '11'
        }
      });
    } else {
      this.setData({ highestEdu });
      this.setFormData(profile, highestEdu);
    }
    this.getCity();
  },
  getCity() {
    let cities = getApp().globalData.cities;
    console.log({ cities })
    if (!cities) {
      commonService.getArea().then(res => {
        cities = res.data.filter(city => city.id.length <= 4).map(city => {
          return {
            id: city.id,
            name: city.areaName,
            pid: city.pid,
          }
        })
        this.setData({ cities });
        this.setCity(cities);
      });
    } else {
      this.setCity();
    }
  },
  setCity(cities = getApp().globalData.cities) {
    let originCityInfo = {
      cityid: this.data.highestEdu.cityid,
      provinceid: this.data.highestEdu.provinceid
    }

    let city = cities.find(city => city.id === originCityInfo.cityid);
    let province = cities.find(city => city.id === originCityInfo.provinceid);
    let filtedProvince = cities.filter(res => res.pid === '0');
    let filtedCities = cities.filter(res => res.pid === originCityInfo.provinceid);
    this.setData({
      objectMultiArray: [filtedProvince, filtedCities],
      multiIndex: [filtedProvince.indexOf(province), filtedCities.indexOf(city)],
      currentProvince: province,
      currentCity: city
    });
    this.data.form.provinceId = originCityInfo.provinceid,
      this.data.form.cityId = originCityInfo.cityid
  },
  bindMultiPickerColumnChange(e) {
    e.detail.column === 0 ? this.changeCity(e.detail.value) : '';
  },
  changeCity(index) {
    let data = {
      objectMultiArray: this.data.objectMultiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex = [index, 0];
    data.objectMultiArray[1] = this.data.cities.filter(city => city.pid === this.data.objectMultiArray[0][index].id);
    this.setData(data);
  },
  bindMultiPickerChange(e) {
    let multiIndex = e.detail.value;
    let currentProvince = this.data.objectMultiArray[0][multiIndex[0]];
    let currentCity = this.data.objectMultiArray[1][multiIndex[1]];
    this.data.form.provinceId = currentProvince.id;
    this.data.form.cityId = currentCity.id;
    this.setData({
      currentProvince,
      currentCity,
      multiIndex: e.detail.value
    });
  },
  setFormData(profile, edu) {
    // console.log({ profile }, { edu });
    this.data.form = {
      id: edu.id,
      educationType: edu.educationtype,
      provinceId: edu.provinceid,
      cityId: edu.cityid,
      schoolName: edu.schoolname,
      professionName: edu.professionname
    }
  },
  bindinput(e) {
    this.data.form[e.currentTarget.dataset.name] = e.detail.value;
  },
  bindPickerChange(e) {
    this.data.form[e.currentTarget.dataset.name] = this.data.eduList[e.detail.value].label;
    this.setData({
      eduListIndex: e.detail.value
    })
  },
  saveEdu() {
    let edu = this.data.form;
    userService.saveEducation(edu).then(res => {
      wx.showToast({
        title: res.msg
      });
      if (res.code === 1) {
        let educations = this.data.educations;
        let he = educations[0];
        let profile = {};
        if (!he) {
          he = {};
          he.educationtype = edu.educationType;
          he.provinceid = edu.provinceId;
          he.cityid = edu.cityId;
          he.schoolname = edu.schoolName;
          he.professionname = edu.professionName;
          profile = getApp().globalData.profile
          this.data.form.id = res.data;
          he.id = res.data;
          educations[0] = he
        }
        profile.educations = educations;
        getApp().globalData.profile = profile;
      }
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
    console.log('global_edu', getApp().globalData)
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