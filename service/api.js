const Promise = require('../utils/es6-promise');
import config from '../utils/config';
import util from '../utils/util.js';

const wxPromisify = (fn) => (obj = {}) => {
  return new Promise((resolve, reject) => {
    obj.success = res => {
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
        let d = util.replaceNull(res.data);
        console.log(d);
        resolve(d);
      } else {
        resolve(res)
      }
      
    };
    obj.fail = res => {
      wx.hideLoading();
      reject(res);
    };
    fn(obj);
  });
};

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => {
      return value;
    }),
    reason => P.resolve(callback()).then(() => { throw reason; })
  );
};

const get = (url, data, text = '加载中...') => {
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
      // 'user_author': 'GN+02d3+xUUvt3kX4OWA73EvE2r+Hf0cDqy4ad1uiZs2sk6II3wHNp/C+gRXkxtsKHkGDCSca3VWwB6OB2A+qw==',
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

const post = (url, data, text = '加载中...') => {
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

const showToast = (data) => wxPromisify(wx.showToast)(data);

const getLocation = () => wxPromisify(wx.getLocation)({ type: 'wgs84' });

const getCityInfoByLocation = (lat, lng) => wxPromisify(wx.request)({ url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=${config.mapKey}` });

const saveToken = (token) => wx.setStorageSync('token', token);

const getToken = () => wx.getStorageSync('token');

const checkLogin = () => {
  let token = wx.getStorageSync('token');
  if (!token.length) {
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
  checkLogin,
  wxPromisify
};
