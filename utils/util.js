const formatTime = (date, fmt) => {
  var o = {
    "M+": date.getMonth() + 1,                 //月份 
    "d+": date.getDate(),                    //日 
    "h+": date.getHours(),                   //小时 
    "m+": date.getMinutes(),                 //分 
    "s+": date.getSeconds(),                 //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds()             //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }

  return fmt; 
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const navigater = e => {
  let url = e.currentTarget.dataset.url;
  wx.showNavigationBarLoading()
  url ? wx.navigateTo({
    url,
  }) : wx.hideNavigationBarLoading();
}
const replaceNull = obj => {
  typeof obj === 'object' ?
    Object.keys(obj).map(key => {
      let val = obj[key]
      typeof val === 'object' && val === null ? obj[key] = '' : obj[key] = replaceNull(val);
      typeof val === 'string' ? obj[key] = val.replace(' 00:00:00','') : '';
    }) : '';
  return obj;

}
const starPhoneNumber = (phoneNumber) => {
  return !phoneNumber || phoneNumber === '' ? ''
    : phoneNumber.substring(0, 3)+  '****' + phoneNumber.substring(7, 11);
}
module.exports = {
  formatTime,
  navigater,
  replaceNull,
  starPhoneNumber,
  touches
}

const touches = (evt) => {
  var startX = 0,
    startY = 0;
  function touchStart(evt) {
    try {
      var touch = evt.touches[0], //获取第一个触点
        x = Number(touch.pageX), //页面触点X坐标
        y = Number(touch.pageY); //页面触点Y坐标
      //记录触点初始位置
      startX = x;
      startY = y;
    } catch (e) {
      console.log(e.message)
    }
  }

  function touchMove(evt) {
    try {
      var touch = evt.touches[0], //获取第一个触点
        x = Number(touch.pageX), //页面触点X坐标
        y = Number(touch.pageY); //页面触点Y坐标
      //判断滑动方向
      if (y - startY > 0) {
        console.log('下滑了！');
      } else {
        console.log('上滑了！');
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  function touchEnd(evt) {
    try {
      var touch = evt.touches[0], //获取第一个触点
        x = Number(touch.pageX), //页面触点X坐标
        y = Number(touch.pageY); //页面触点Y坐标
      //判断滑动方向
      if (y - startY > 0) {
        return ('下滑了！');
      } else {
        return('上滑了！');
      }
    } catch (e) {
      console.log(e.message)
    }
  }
}