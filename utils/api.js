const Promise = require('es6-promise.js');
import config from 'config';

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        wx.hideLoading();
        let data = res.data;
        if (data) {
          console.log({ data })
          if (data.code === 4000004 || data.code === 100002) {
            let modal = wxPromisify(wx.showModal);
            modal({
              title: '温馨提示',
              content: '您的登录状态已变更，请重新登录'
            }).then(() => {
              wx.redirectTo({
                url: '../login/login',
              })
            })
          } else if (data.msg && data.code !== 1) {
            wx.showToast({
              title: data.msg,
              icon: 'none'
            });
            return;
          }
        }
        resolve(res);
      };
      obj.fail = function (res) {
        wx.hideLoading();
        reject(res);
      };
      fn(obj);
    });
  };
}

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => {
      return value;
    }),
    reason => P.resolve(callback()).then(() => { throw reason; })
  );
};

function get(url, data, text = '加载中...') {
  wx.showLoading({
    title: text,
  });
  let getRequest = wxPromisify(wx.request);
  return getRequest({
    url: config.baseUrl + url,
    method: 'GET',
    data: data,
    header: {
      'Content-Type': 'application/json;charset=UTF-8',
      'user_author': getToken(),
      'X-Requested-With': 'WX_APPLETS'
    }
  }).catch(error => {
    wx.showToast({
      title: '网络异常',
      image: '../../images/failure.png',
      duration: 3000
    });
  });
}

function post(url, data, text = '加载中...') {
  wx.showLoading({
    title: text,
  });
  var postRequest = wxPromisify(wx.request);
  return postRequest({
    url: config.baseUrl + url,
    method: 'POST',
    data: data,
    header: {
      'Content-Type': 'application/json;charset=UTF-8',
      'user_author': getToken(),
      'X-Requested-With': 'WX_APPLETS'
    },
  }).catch(error => {
    wx.showToast({
      title: '网络异常',
      image: '../../images/failure.png',
      duration: 3000
    });
  });
}

function showToast(data) {
  let toast = wxPromisify(wx.showToast);
  return toast(data);
}

function getLocation() {
  let getLocation = wxPromisify(wx.getLocation);
  return getLocation({
    type: 'wgs84'
  });
}

function getCityInfoByLocation(lat, lng) {
  let cityInfo = wxPromisify(wx.request);
  return cityInfo({
    url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=${config.mapKey}`,
  });
}

function saveToken(token) {
  wx.setStorageSync('token', token);
}
function getToken() {
  return wx.getStorageSync('token');
}

function checkLogin() {
  // wx.setStorageSync('token', 'dasijduoaiqwepodpoasidopiasodipoasiodpisapo'); // 强制重新登录,测试用
  
  let token = wx.getStorageSync('token');
  if (token && !token.length) {
    wx.redirectTo({
      url: '../login/login',
    })
    return;
  }
}
module.exports = {
  post,
  get,
  showToast,
  getLocation,
  getCityInfoByLocation,
  saveToken,
  checkLogin
};
