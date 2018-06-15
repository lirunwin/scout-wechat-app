import Api from 'api';
import config from '../utils/config.js';

export default {


  getLocationAuth: () => Api.wxPromisify(wx.getSetting)(),

  getLocation: (type = 'wgs84') => Api.wxPromisify(wx.getLocation)({ type }),

  getCityInfoByLocation: (lat, lng) => Api.wxPromisify(wx.request)({ url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=${config.mapKey}` }),

};
