const Promise = require('../utils/es6-promise');
import config from '../utils/config';
import util from '../utils/util.js';

const wxPromisify = (fn) => (obj = {}) => {
  return new Promise((resolve, reject) => {
    obj.success = res => {
      wx.hideLoading();
      let data = res.data;
      if (data) {
        // console.log({ data })
        if (data.code === 4000004 || data.code === 100002) {
          let modal = wxPromisify(wx.showModal);
          modal({
            title: '温馨提示',
            content: data.code === 100002 ? '用户名或密码错误' : '登录超时请重新登录，请重新登录'
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
      console.log('fail:', res)
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
      // 'user_author': 'ZImaTkKDBj+2z06JA9MGba6s/QwoOQgkv0B9npN++lwHCAgJH2HPrvJm+79UmUAaO00HuloK5mjCbfh3RDX5Jg==',
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
      // 'user_author': 'ZImaTkKDBj+2z06JA9MGba6s/QwoOQgkv0B9npN++lwHCAgJH2HPrvJm+79UmUAaO00HuloK5mjCbfh3RDX5Jg==',
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

const saveToken = (token) => wx.setStorageSync(config.tokenName, token);

const getToken = () => wx.getStorageSync(config.tokenName);

const checkLogin = () => {
  let token = wx.getStorageSync(config.tokenName);
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
