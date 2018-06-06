const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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