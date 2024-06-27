import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function isObject(val) {
  return (
    val !== null &&
    typeof val === 'object' &&
    Object.prototype.toString.call(val) === '[object Object]'
  );
}
export function getUuid(prefix = '') {
  return (
    prefix +
    Date.now().toString() +
    Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, '0')
  );
}

export const storage = {
  getItem: (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: (key, value) => {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
};
export const getParam = (key) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};
export function isBrowser() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}
export function formatNumber(number) {
  if (number === undefined) return;
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return number.toString();
  }
}
export const hostnameProject = 'kolink.io';
export const hostnameKol = 'kol.kolink.io';
export const getIsKol = () => {
  const hostname = window.location.hostname;

  // 优先判断域名来确定是否为kol
  if ([hostnameProject].includes(hostname)) {
    return false;
  }
  if ([hostnameKol].includes(hostname)) {
    return true;
  }

  return storage?.getItem('isKol') === '1';
};

export const setIsKol = (isKol) => {
  // const isKol = getParam('from') === 'kol';
  storage?.setItem('isKol', isKol ? '1' : '0');
};
// 获取登录后的页面
export const getLogin = (navigate) => {
  if (getIsKol()) return navigate('/verify');
  navigate('/create');
};
export const getAfterLogin = (navigate, options) => {
  if (getIsKol()) return navigate('/tasks', options);
  navigate('/task', options);
};

export const transformObj = (data) => {
  const itemList = Object.entries(data).map(([name, id]) => ({
    id,
    name,
  }));
  const sortedItemList = itemList.sort((a, b) => a.id - b.id);
  return sortedItemList;
};
export const transformConfig = (data, type) => {
  if (typeof data !== 'object' || data === null) {
    console.log('transformConfig 方法的参数必须是一个对象', data);
    return;
  }

  if (type === 'obj') {
    const ret = {};
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const itemList = Object.entries(data[key]).map(([name, id]) => ({
          id,
          name,
        }));
        ret[key] = itemList;
      }
    }
    return ret;
  }

  const sortedLists = [];

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      sortedLists.push({
        key,
        list: transformObj(data[key]),
      });
    }
  }

  return sortedLists;
};

export const getAcceptCount = (data) => {
  return data?.application_num || 0;
};
// 申请名额是否满了
export const getIsFull = (data) => {
  const { kol_max } = data;
  if (!kol_max) return false;
  const acceptCount = getAcceptCount(data);
  // kol 还未通过且没有申请名额则禁止
  const isFull = acceptCount >= kol_max && !(data.status >= 4);
  return isFull;
};

export const getCardImg = (item) => {
  const { backgroud_image, id } = item || {};
  return backgroud_image || `/imgs/task/${(id % 8) + 1}.png`;
};

export const dayjsFormat = (value) => {
  let res;
  if (typeof value === 'number') {
    res = dayjs.unix(value);
  } else {
    res = dayjs(value);
  }

  return `${res.format('YYYY-MM-DD HH:mm:ss [(UTC ]Z[)]')}`;
};

export const getKolScore = (data = {}) => {
  return [
    {
      name: 'Identity Score',
      max: 20,
      value: data.monetary_score,
      tips: 'Analysis of on-chain activities: on-chain interaction volume & frequency; NFT engagements.',
    },
    {
      name: 'Popularity Score',
      max: 70,
      value: data.engagement_score,
      tips: 'Determined by fan base & engagement metrics such as retweets, likes, comments, and bookmarkings.',
    },
    {
      name: 'Age Score',
      max: 10,
      value: data.age_score,
      tips: `Determined by the "age" of crypto wallet & social accounts' existence & first activities.`,
    },
  ];
};

export const getUserName = (data = {}) => {
  const { twitter_user_name, youtube_user_name } = data;
  return twitter_user_name || youtube_user_name || '';
};
export const getUserAvatar = (data) => {
  const { twitter_avatar, youtube_avatar, logo } = data || {};
  return twitter_avatar || youtube_avatar || logo || '';
};
