export default {
  // baseUrl: 'https://sapi.s-cout.com/zcb-api/',
  baseUrl: 'http://tapi.free.ngrok.cc/',
  imageBaseUrl: '',
  telRegExp: /^1[34578]\d{9}$/,
  smsLength: 5,
  passwordMinlength: 6,
  birthDayStartDate: '1970-01-01',
  birthDayEndDate: '2018-05-10',
  mapKey: 'CQFBZ-ZK2W5-2OEIE-QZUWK-DB2U7-U5FEI', // 腾讯地图key
  constant: { // 常量配置
    job: {
      wechatStorageName: 'searchHistoryArray',
      wageClearing: {
        DAY: ['元/天', '日结'],
        WEEK: ['元/周', '周结'],
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
      sort: [ // 排序方式
        {
          label: 'RECOMMEND',
          name: '推荐排序'
        },
        {
          label: 'NEWRELEASE',
          name: '最新发布'
        },
        {
          label: 'WAGEHIGH',
          name: '工资最高'
        }
      ],
      filterShortcut: [ //首页中间 图标
        {
          label: 'LONGTIME',
          name: '长期兼职',
          icon: '../../images/icon3@2x.png'
        },
        {
          label: 'IMMEDIATELY',
          name: '立即上岗',
          icon: '../../images/icon4@2x.png'
        },
        {
          label: 'ALLLOCATIOS',
          name: '在家可做',
          icon: '../../images/icon2@2x.png'
        }
      ],
      apply: { // 我的报名
        DELIVERY: { label: '全部', color: 'dark' },
        AGREE: { label: '同意', color: 'success' },
        REFUSE: { label: '拒绝', color: 'danger' },
        WAIT_CONFIRM: { label: '待确认', color: 'muted' }
        // WAIT_EVALUATION: '待评价'
      }
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
      getHotKeywords: 'common/getHotKeyword', //热门关键字
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
