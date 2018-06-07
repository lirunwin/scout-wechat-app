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

module.exports = {
  formatTime,
  navigater,
  replaceNull
}