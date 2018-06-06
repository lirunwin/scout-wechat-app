export default {
  baseUrl: 'https://sapi.s-cout.com/zcb-api/',
  imageBaseUrl: '',
  telRegExp: /^1[34578]\d{9}$/,
  smsLength: 5,
  passwordMinlength: 6,
  birthDayStartDate: '1970-01-01',
  birthDayEndDate: '2018-05-10',
  mapKey: 'CQFBZ-ZK2W5-2OEIE-QZUWK-DB2U7-U5FEI', // 腾讯地图key
  constant: { // 常量配置
    job: {
      wageClearing: {
        DAY: '元/天',
        MONTH: ['元/月', '月结'],
      },
      wageMode: {
        BASEWAGE_COMMISSION: '底薪+提成',
        BASEWAGE: '底薪',
        COMMISSION: '提成'
      },
      jobNature: {
        PARTTIME: '兼职',
        PRACTICE: '实习',
        FULLTIME: '全职'
      },
      noEndTime: '长期', // 无结束时间
      sort: [ 
        {
          label: 'RECOMMEND',
          name: '推荐排序'
        },
        { 
          label: 'NEWRELEASE',
          name: '最新发布'
        },
        { label: 'WAGEHIGH',
          name :'工资最高'
        }
      ]
    },
    profile: {
      identityType: {
        STUDENT: '学生'
      },
      education: {
        LEVEL_7: '博士及以上',
        LEVEL_6: '硕士研究生',
        LEVEL_5: '大学本科',
        LEVEL_4: '大学专科',
        LEVEL_3: '高中/高职',
        LEVEL_2: '初中/中专',
        LEVEL_1: '小学及小学以下',
        LEVEL_0: '未受过教育'
      }
    }
  },
  api: {
    job: {
      query: 'job/query', // 招聘信息查询（搜索、已投递、收藏列表）
      history: 'job/history', // 招聘信息查看历史记录
      recruitmentInfo: 'job/getRecruitmentInfo', // 查看招聘信息详细
      addCollection: 'job/addCollection', // 添加收藏
      removeCollection: 'job/removeCollection', // 取消收藏
      addDelivery: 'job/addDelivery', // 投递简历申请
      addEvaluation: 'job/addEvaluation', // 添加评价
      resume: 'job/detaild', // 获取用户简历信息
      saveBaseInfo: 'job/saveBaseInfo', // 保存简历基本信息
    },
    common: {
      getPosition: 'common/getPosition', // 获取职位信息
      getArea: 'common/getArea', // 获取区域信息
    },
    user: {
      getProfile: 'user/detaild', // 获取用户信息
      saveEducation: 'user/saveEducation', // 保存学历信息 
      saveContact: 'user/saveContact', // 保存联系信息
      saveSelfEvaluation: 'user/saveSelfEvaluation', // 保存自我评价
      saveAbilityPpecialty: 'user/saveAbilityPpecialty', // 保存能力及特长
    }
  }
};
