import Api from 'api.js';
import config from '../utils/config.js';
const job = config.api.job;
export default {

  constant: config.constant.job,

  query: (data) => Api.post(job.query, data), // 招聘信息查询（搜索、已投递、收藏列表）

  history: (data) => Api.post("job/history", data), // 招聘信息查看历史记录

  getRecruitmentInfo: (data) => Api.get(job.recruitmentInfo, { rid: data }), // 查看招聘信息详细

  addCollection: (data) => Api.get(job.addCollection, { rid: data }), // 添加收藏

  removeCollection: (data) => Api.get(job.removeCollection, { rid: data }), // 取消收藏

  addDelivery: (data) => Api.get(job.addDelivery, { rid: data }), // 投递简历申请

  addEvaluation: (data) => Api.post(job.addEvaluation, data), // 添加评价  

  saveBaseInfo: (data) => Api.post(job.saveBaseInfo, data), // 保存简历基本信息

  saveContact: (data) => Api.post(job.saveContact, data), // 保存工作经验

};
