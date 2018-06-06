import Api from 'api.js';
import config from '../utils/config.js';
const common = config.api.common;

export default {

  getPosition: () => Api.get(common.getPosition), // 行业职位

  getArea: () => Api.get(common.getArea), // 行业职位

};
