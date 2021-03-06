/**
 * 格式化日期，返回'YYYY-mm-DD HH:mm:SS'
 */
export const formatDateTime = (date): string => {
  const year = date.getYear();
  let month = date.getMonth();
  if (month < 10) {
    month = '0' + month;
  }
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  let hour = date.getHours();
  if (hour < 10) {
    hour = '0' + hour;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = '0' + minute;
  }
  let second = date.getSeconds();
  if (second < 10) {
    second = '0' + second;
  }
  return `${year + 1900}-${month}-${day} ${hour}:${minute}:${second}`;
};


/**
 * 计算过期时间，截止时间，预当前时间比较，返回天数
 * @param {string} end
 * @returns {number}
 */
export const calculateExpiredTime = (end: string): number => {
  const currentTime = new Date().getTime();
  const endTime = new Date(end).getTime();
  return Math.floor((endTime - currentTime) / (24 * 3600 * 1000));
};


/**
 * 格式化时间，返回'HH:mm:SS'
 */
export const formatDate = (date): string => {
  const year = date.getYear();
  let month = date.getMonth();
  if (month < 10) {
    month = '0' + month;
  }
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  return `${year + 1900}-${month}-${day}`;
};
