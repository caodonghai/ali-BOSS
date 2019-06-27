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

export const calculateExpiredTime = (end: string): number => {
  const currentTime = new Date().getTime();
  const endTime = new Date(end).getTime();
  return Math.floor((endTime - currentTime) / (24 * 3600 * 1000));
};

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
