import Api from 'api.js';
import config from '../utils/config.js';
const common = config.api.common;

export default {

  getPosition: () => Api.get(common.getPosition), // 行业职位

  getArea: () => Api.get(common.getArea), // 城市信息

  getHotKeywords: () => Api.get(common.getHotKeywords), // 热门关键字

  getBanner: () => Api.get(common.getBanner), // 获取banner

  getTelCode: (data) => Api.get(common.getTelCode, data), // 获取验证码

  checkTelCode: (data) => Api.get(common.checkTelCode, data), //验证手机验证码

  checkLogin: () => {
    let token = wx.getStorageSync(config.tokenName) || '';
    if (token === '') {
      wx.redirectTo({
        url: '../login/login',
      })
      return false;
    } else {
      return true;
    }
  }

};
