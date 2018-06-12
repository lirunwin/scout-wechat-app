import Api from 'api';
import config from '../utils/config.js';
const user = config.api.user;
export default {

  constant: config.constant.profile,

  getProfile: () => Api.get(user.getProfile), // 获取用户信息

  saveEducation: (data) => Api.post(user.saveEducation, data), // 保存学历信息

  saveContact: (data) => Api.post(user.saveContact, data), // 保存联系信息

  saveSelfEvaluation: (data) => Api.post(user.saveSelfEvaluation, data), // 保存自我评价

  saveSkill: (data) => Api.post(user.saveAbilityPpecialty, data), // 保存能力及特长

  login: (data) => Api.post(user.login, data),

  saveToken: (token) => wx.setStorageSync(config.tokenName, token),

  getToken: () => wx.getStorageSync(config.tokenName),

  register: (data) => {
    let checkSign = data.checkSign;
    delete data.checkSign;
    return Api.post(user.register + '?checkSign=' + checkSign, data);
  },

  logout: () => {
    Api.get(user.logout);
    wx.setStorageSync(config.tokenName, '');
    wx.redirectTo({
      url: '../login/login',
    })
  }

}
