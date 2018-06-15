// pages/index/index.js
import jobService from '../../service/job.js';
import locationService from '../../service/location.js';
import commonService from '../../service/common.js';
const Promise = require('../../utils/es6-promise.js');
import { formatTime } from '../../utils/util.js';
Page({
  data: {
    swiper: {
      banner: [],
      indicatorDots: true,
      indicatorColor: 'rgba(255, 255, 255, .4)',
      indicatorActiveColor: 'rgba(255, 255, 255, 1)',
      autoplay: true,
      interval: 5000,
      duration: 1000
    },
    constant: jobService.constant,
    jobList: null,
    currentCity: '',
    cityInfo: '',
    jobFilter: {
      'pageIndex': 1,
      'pageSize': 10,
      'filter': 'RECOMMEND'
    },
    jobFilterTemp: {},
    jobEnd: false,
    currentPosition: {
      name: '职位类型',
      firstTime: true
    },
    areaIndex: 0,
    area: null,
    sortTypeIndex: 0,
    sortType: jobService.constant.sort,
    toView: '',
    scroll: {
      done: false
    },
    jobDate: {
      start: '',
      end: ''
    },
    wageModeConst: null,
    filterBtnActivity: {
      wageMode: '-1',
      wageClearing: '-1'
    },
    salaryRange: {
      start: '',
      end: ''
    },
    moreFilter: false,
    moreFilterFixed: false,
    hideTop: false, //暂时没用
    searchBoxFocusing: false,
    hotKeywords: null,
    searchHistory: null,
    keyword: '',
    enableDataLimit: true,
    isFirstTimeLoading: true,
    jobListToShort: false
  },
  searchInput(e) {
    let keyword = e.detail.value;
    this.setData({
      keyword
    });
  },
  searchInputComfirm(e) {
    let keyword = e.detail.value;
    this.setData({
      searchBoxFocusing: false,
      keyword
    });
    this.search(keyword);
  },
  saveSearchHistory(keyword) {
    let keywords = wx.getStorageSync(jobService.constant.wechatStorageName);
    if (!keywords) {
      keywords = []
    }
    let exist = keywords.find(word => word === keyword);
    if (!exist) {
      if (keywords.length >= 10) {
        keywords.shift();
      }
      keywords.push(keyword);
      wx.setStorageSync(jobService.constant.wechatStorageName, keywords)
    } else {

    }
  },
  clearSearchHistroy() {
    wx.setStorageSync(jobService.constant.wechatStorageName, []);
    this.setData({
      searchHistory: []
    })
  },
  searchShortcut(e) {
    let keyword = e.target.dataset.keyword;
    this.setData({
      searchBoxFocusing: false,
      keyword
    })
    this.search(keyword);
  },
  filterShortcut(e) {
    this.setData({
      toView: 'main'
    })
    this.data.jobFilter = {
      'pageIndex': 1,
      'pageSize': 10,
      'filter': e.target.dataset.shortcut || e.currentTarget.dataset.shortcut,
      'cityId': this.data.currentCity.id
    };
    this.changeFilter();
    this.getJobList();
  },
  search(keyword) {
    this.saveSearchHistory(keyword);
    this.data.jobFilter = {
      'pageIndex': 1,
      'pageSize': 10,
      'keyword': keyword,
      'cityId': this.data.currentCity.id
    };
    this.changeFilter();
    this.getJobList();
  },
  handlescrolltoupper(e) {
    this.hideTop(false);
    this.setData({
      moreFilterFixed: false
    });
  },
  handlescroll(e) {
    // console.log(e.detail.scrollTop)
    if (!this.data.moreFilterFixed && e.detail.scrollTop >= 295) {
      this.setData({
        moreFilterFixed: true
      })
    }
  },
  searchBoxFocusing() {
    this.setData({
      searchBoxFocusing: true
    })
    this.getSearchHistory();
  },
  switchJobNature(e) {
    let jobFilter = {
      'pageIndex': 1,
      'pageSize': 10,
      'filter': 'RECOMMEND',
      'cityId': this.data.currentCity.id
    };
    let index = e.target.dataset.index
    let constant = Object.keys(jobService.constant.jobNature);
    if (index > -1) {
      jobFilter.nature = constant[index];
    } 
    this.changeFilter();
    this.getJobList(jobFilter);
  },
  setArea() {
    let currentCity = getApp().globalData.currentCity;
    if (currentCity) {
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
    let cityInfo = getApp().globalData.cityInfo;
    getApp().globalData.cities = cities;    
    let cityId = cityInfo.adcode.substr(0, 4);
    this.data.jobFilter.cityId = cityId;
    let currentCity = this.data.currentCity;
    currentCity.id = cityId;
    this.setData({
      currentCity
    })
    let area = cities.filter(city => city.pid === cityId);
    let noArea = area.pop();
    if (noArea) {
      noArea.id = '-1';
      area.unshift(noArea);
      this.setData({
        area
      })
    } else {
      this.setData({
        area
      });
    }
  },
  bindAreaPicker(e) {
    let index = e.detail.value;
    this.setData({
      areaIndex: index
    })
    // console.log(index)
    let countyId = this.data.area[index].id
    if (countyId === '-1') {
      delete this.data.jobFilter.countyId
    } else {
      this.data.jobFilter.countyId = countyId
    }
    this.data.jobFilter.filter = 'RECOMMEND';
    this.changeFilter();
    this.getJobList();
  },
  bindSortPiker(e) {
    let index = e.detail.value;
    this.setData({
      sortTypeIndex: index,
      toView: 'main'
    });
    this.data.jobFilter.sort = this.data.sortType[index].label;
    this.data.jobFilter.filter = 'RECOMMEND';
    this.changeFilter();
    this.getJobList();
  },
  getCity() {
    return locationService.getLocationAuth()
      .then(auth => {
        let locationAuth = auth.authSetting['scope.userLocation'];
        if(locationAuth) {
          return locationService.getLocation()
            .then(res => locationService.getCityInfoByLocation(res.latitude, res.longitude))
            .then(res => {
              let cityInfo = res.result.ad_info;
              
              return cityInfo
            })
        } else {
          return {
            "nation_code": "156",
            "adcode": "510107",
            "city_code": "156510100",
            "name": "中国,四川省,成都市,武侯区",
            "location": {
              "lat": 30.5702,
              "lng": 104.064758
            },
            "nation": "中国",
            "province": "四川省",
            "city": "成都市",
            "district": "武侯区"
          }
        }
      })
      .then(cityInfo => {
        getApp().globalData.cityInfo = cityInfo;
        this.data.cityInfo = cityInfo;
        this.setCurrentCity();
        console.log({ cityInfo })
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
    let currentPosition = getApp().globalData.currentPosition || null;
    if (currentPosition !== null) {
      this.setData({
        currentPosition
      });
      this.data.jobFilter.positionId = currentPosition.id;
      this.data.jobFilter.filter = 'RECOMMEND'
      this.changeFilter();
      this.getJobList();
    } else {
      delete this.data.jobFilter.positionId;
      if (!this.data.currentPosition.firstTime) {
        this.changeFilter();
        this.getJobList();
      }    
      this.setData({
        currentPosition: { name: '职位类型' }
      });
      console.log(this.data.jobFilter)
    }
   
  },
  navigateToPosition() {
    wx.showNavigationBarLoading();
    wx.navigateTo({
      url: '../position/position'
    })
  },
  navigateToCity() {
    wx.showNavigationBarLoading();
    wx.navigateTo({
      url: '../city/city'
    })
  },
  switchToApply() {
    wx.showNavigationBarLoading();
    getApp().globalData.switchTabParams.apply = {
      tab: 'AGREE'
    };
    wx.switchTab({
      url: '../apply/apply'
    })
  },
  getJobList(filter = this.data.jobFilter) {
    console.log("filter", filter);
    return jobService.query(filter).then(res => {
      let jobList = () => {
        let lastJobList = this.data.jobList || [];
        if (this.data.needRestJobList) {
          this.data.needRestJobList = false;
          return res.data;
        } else {
          return lastJobList.concat(res.data)
        }
      }

      let list = jobList();
      // console.log(list.length,'length')
      if(list.length < 5) {
        this.setData({
          jobListToShort: !this.data.jobListToShort
        });
      }
      res.data.length === 0 ? this.setData({
        jobEnd: true,
        moreFilterFixed: false,
        jobList: list
      }) :
        this.setData({
          jobList: list
        });
      return jobList();
    });
  },
  getSearchHistory() {
    let histroy = wx.getStorageSync(jobService.constant.wechatStorageName);
    this.setData({
      searchHistory: histroy
    });
  },
  getHotKeywords() {
    commonService.getHotKeywords().then(res => {
      this.setData({
        hotKeywords: res.data
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
    this.data.needRestJobList = true;
    this.data.jobFilter.pageIndex = 1
    this.data.jobEnd = false;
  },
  getCities() {
    return commonService.getArea().then(res => {
      let cities = res.data;
      // console.log('怎么会没数据', getApp().config.citiesStorageName);
      getApp().globalData.cities = cities;
      wx.setStorage({
        key: getApp().config.citiesStorageName,
        data: cities
      });
      return cities;
    });
  },
  setDftDate() {
    let startDate = formatTime(new Date(), 'yyyy-MM-dd');
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);
    endDate = formatTime(endDate, 'yyyy-MM-dd');
    // this.data.jobFilterTemp.jobBeginTime = startDate;
    // this.data.jobFilterTemp.jobEndTime = endDate;
    this.setData({
      jobDate: {
        startDftDate: startDate,
        endDftDate: endDate,
        startDate,
        endDate
      }
    });
  },
  bindJobBeginTimeChange(e) {
    let date = e.detail.value;
    let jobDate = this.data.jobDate;
    jobDate.startDate = date;
    this.setData({
      jobDate
    });
    // this.data.jobFilterTemp.jobBeginTime = date;
    this.enableDataLimit();
    console.log(this.data.jobFilterTemp);
  },
  bindJobEndTimeChange(e) {
    let date = e.detail.value;
    // if (date.replace(/\D/g, '') < this.data.jobDate.startDate.replace(/\D/g, '')) {
    //   wx.showToast({
    //     title: '结束时间不能小于开始时间',
    //     icon: 'none'
    //   });
    //   return;
    // }
    let jobDate = this.data.jobDate;
    jobDate.endDate = e.detail.value
    this.setData({
      jobDate
    });
    // this.data.jobFilterTemp.jobEndTime = date;
    this.enableDataLimit();
    console.log(this.data.jobFilterTemp);
  },
  setConstant() {
    this.setData({
      wageModeConst: Object.entries(jobService.constant.wageMode),
      wageClearingConst: Object.entries(jobService.constant.wageClearing),
    });
  },
  changeWageFilter(e) {
    let data = e.target.dataset;
    let property = data.property;
    data.id === '-1' ? delete this.data.jobFilterTemp[property] : this.data.jobFilterTemp[property] = data.id;
    let filterBtnActivity = this.data.filterBtnActivity;
    filterBtnActivity[property] = data.index
    this.setData({
      filterBtnActivity
    });
    console.log(this.data.jobFilterTemp);
  },
  changeSalaryRange(e) {
    let val = e.detail.value;
    let rangeType = e.target.dataset.type;
    const constant = {
      start: 'wageBegin',
      end: 'wageEnd'
    }
    this.data.jobFilterTemp[constant[rangeType]] = val;

    console.log(this.data.jobFilterTemp);
  },
  resetJobFilterTemp() {
    this.data.jobFilterTemp = {};
    this.setData({
      filterBtnActivity: {
        wageMode: '-1',
        wageClearing: '-1'
      },
      salaryRange: {
        start: '',
        end: ''
      }
    });
    this.setDftDate();
    let filter = this.data.jobFilter;
    delete filter.jobBeginTime;
    delete filter.jobEndTime;
    delete filter.wageBegin;
    delete filter.wageEnd;
    delete filter.wageMode;
    delete filter.wageClearing;
    console.log(this.data.jobFilter);
  },
  assignJobFilter() {
    let jobFilter = this.data.jobFilter;
    delete jobFilter.jobBeginTime;
    delete jobFilter.jobEndTime;
    delete jobFilter.wageBegin;
    delete jobFilter.wageEnd;
    delete jobFilter.wageMode;
    delete jobFilter.wageClearing;
    Object.assign(jobFilter, this.data.jobFilterTemp);

    this.setData({
      moreFilter: false
    })
    this.changeFilter();
    this.getJobList();
  },
  hideTop(state = true) {
      this.setData({
        hideTop: state
      })
  },
  activeMoreFilter() {
    this.hideTop();
    if (!this.data.moreFilter && !this.data.moreFilterFixed) { 
      setTimeout(() => {
        this.setData({
          moreFilter: !this.data.moreFilter,
          moreFilterFixed: true
        });  
      }, 300);
    } else {
      this.setData({
        moreFilter: !this.data.moreFilter
      });
      console.log('down');
    }
  },
  // handelFilterTouchend(e){
  //   console.log("end:",e);
  // },
  // handelFilterTouchStart(e) {
  //   console.log("start:",e);
  // },
  // handelFilterTouchMove(e) {
  //   console.log("moving",e);
  // },
  handelDataLimitChange(e) {
    this.enableDataLimit(!!e.detail.value[0]);
  },
  enableDataLimit(isDisable = false) {
    if (isDisable) {
      delete this.data.jobFilterTemp.jobBeginTime;
      delete this.data.jobFilterTemp.jobEndTime;
      this.setData({
        enableDataLimit: true
      })
    } else {
      this.data.jobFilterTemp.jobBeginTime = this.data.jobDate.startDate;
      this.data.jobFilterTemp.jobEndTime = this.data.jobDate.endDate;
      this.setData({
        enableDataLimit: false
      })
    }
    console.log(this.data.jobFilterTemp)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  doneLoading() {
    wx.showTabBar();
    this.setData({ isFirstTimeLoading: false });
  },
  getBanner() {
    commonService.getBanner().then(res => {
      let swiper = this.data.swiper;
      swiper.banner = res.data;
      this.setData({
        swiper
      });
    })
  },
  onLoad: function (options) {
    wx.hideTabBar();
    let isLogedIn = commonService.checkLogin();
    if (isLogedIn) {
      this.getBanner();
      let cities = () => Promise.resolve(wx.getStorageSync(getApp().config.citiesStorageName) || this.getCities());
      Promise.all([
        cities(),
        this.getCity(),
        // this.getHotKeywords()
      ]).then(res => {
        this.setDftArea(res[0]);
        this.getJobList()
        this.doneLoading();
      });
      this.setDftDate();
      this.setConstant();
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
    wx.hideNavigationBarLoading();
    this.setCurrentCity();
    this.setCurrentPosition();
    this.setArea();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      searchBoxFocusing: false
    })
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
