import { getIsKol, transformObj } from './utils';

export const COOKIE_KEY_KOL = 'userinfo_kol';
export const COOKIE_KEY_PROJECT = 'userinfo_project';
export const GET_COOKIE_KEY = () =>
  getIsKol() ? COOKIE_KEY_KOL : COOKIE_KEY_PROJECT;

export const PlatformFee = 0.05;
export const blockchainMap = {
  1: 'Ethereum',
  56: 'BNB Chain',
  // 42161: 'Arbitrum',
};

export const tokenMap = {
  0: 'USDT',
};
export const taskStatusMap = {
  0: 'Applied',
  1: 'Cancel',
  2: 'Pending',
  3: 'Declined',
  4: 'Accepted',
  5: 'Upload',
  6: 'Withhold',
  7: 'Finished',
  8: 'Closed',
  9: 'LockPending',
  10: 'CancelPending',
  11: 'SettlePending',
  12: 'DelegateSettlePending',
  13: 'UploadTimeoutCancelPending',
  14: 'UploadTimeoutCancel',
};
export const statusTagMap = {
  Applied: {
    bg: '#D1FAE5',
    color: '#065F46',
  },
  Upload: {
    bg: '#D1FAE5',
    color: '#065F46',
    text: 'Task Uploaded',
  },
  Declined: {
    bg: '#FEE2E2',
    color: '#991B1B',
  },
  Cancel: {
    bg: '#FEE2E2',
    color: '#991B1B',
  },
  Accepted: {
    bg: '#DBEAFE',
    color: '#1E40AF',
  },
  Pending: {
    bg: '#FEF3C7',
    color: '#92400E',
    text: 'Processing',
  },
  Withhold: {
    bg: '#FEE2E2',
    color: '#991B1B',
    text: 'Task Rejected',
  },
  Finished: {
    bg: '#F3F4F6',
    color: '#1F2937',
    text: 'Task Completed',
  },
  Closed: {
    bg: '#F3F4F6',
    color: '#1F2937',
    text: 'Task Closed',
  },
  LockPending: {
    bg: '#FEF3C7',
    color: '#92400E',
    text: 'Processing',
  },
  CancelPending: {
    bg: '#FEF3C7',
    color: '#92400E',
    text: 'Processing',
  },
  SettlePending: {
    bg: '#FEF3C7',
    color: '#92400E',
    text: 'Processing',
  },
  DelegateSettlePending: {
    bg: '#FEF3C7',
    color: '#92400E',
    text: 'Processing',
  },
  UploadTimeoutCancelPending: {
    bg: '#FEF3C7',
    color: '#92400E',
    text: 'Processing',
  },
  UploadTimeoutCancel: {
    bg: '#FEE2E2',
    color: '#991B1B',
    text: 'Task Failed',
  },
};
export const blockchainArr = Object.entries(blockchainMap).map(
  ([id, name]) => ({ id: Number(id), name }),
);
export const tokenArr = Object.entries(tokenMap).map(([id, name]) => ({
  id: Number(id),
  name,
}));
export const taskStatusArr = Object.entries(taskStatusMap).map(
  ([id, name]) => ({ id: Number(id), name }),
);
export const channel_list = {
  X: 0,
  Youtube: 1,
};
export const region_list = {
  // All: 0,
  Europe: 1,
  'Middle East': 2,
  'North America': 3,
  'Southeast Asia': 4,
  'Eastern Asia': 5,
  Africa: 6,
  Latam: 7,
  Others: 99,
};
export const language_list = {
  // All: 0,
  English: 1,
  French: 2,
  Chinese: 3,
  Spanish: 4,
  German: 5,
  Russian: 6,
  Portuguese: 7,
  Hindi: 8,
  Turkish: 9,
  Filipino: 10,
  Indonesian: 11,
  Vietnamese: 12,
  Arabic: 13,
  Japanese: 14,
  Thai: 15,
  // Pakistan: 16,
  Italian: 17,
  Ukranian: 18,
  Urdu: 19,
  Others: 99,
};
export const category_list = {
  // All: 0,
  GameFi: 1,
  SocialFi: 2,
  DEX: 3,
  CEX: 4,
  DeFi: 5,
  InFra: 6,
  Safety: 7,
  DAO: 8,
  Tool: 9,
  AI: 10,
  RWA: 11,
  Meme: 12,
  DePin: 13,
  Others: 99,
};
export const channel_arr = transformObj(channel_list);
export const region_arr = transformObj(region_list);
export const language_arr = transformObj(language_list);
export const category_arr = transformObj(category_list);
export const getCategoryKeyByValue = (value, listName = 'category') => {
  const list = {
    category: category_list,
    language: language_list,
    region: region_list,
  }[listName];
  return Object.keys(list).find((key) => list[key] === +value);
};

export const getCategory = (arr, listName) => {
  return String(arr)
    .split(',')
    .map((item) => getCategoryKeyByValue(item, listName))
    .filter((item) => item !== undefined);
};
export const chainsList = [
  // {
  //   id: 1,
  //   token: 'ETH',
  //   rpcUrl: 'http://120.55.165.46:8545',
  //   USDT: '0x97789F1dEA6510D56FbC8EBd44f8F5d6EE1fc7fD',
  //   contract: '0xD7aAdD7BD1d12ee13E1f4Db8BB56458882796bE4',
  // },
  {
    id: 1,
    token: 'ETH',
    rpcUrl:
      'https://eth-mainnet.nodereal.io/v1/7a5eca2f07be48d586a09275ea2f687c',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    contract: '0x3eE926ad4dEBDaBbc32c6450697203884E5CfE53',
  },
  {
    id: 56,
    token: 'BNB',
    rpcUrl: 'https://bsc-dataseed1.ninicoin.io',
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    contract: '0x0BDBb9EBaDBA7e4061e56E533fAb06D10e90aE96',
  },
  {
    id: 42161,
    label: 'Arbitrum',
    token: 'ETH',
    rpcUrl: 'https://arbitrum.meowrpc.com',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    contract: '0xD7aAdD7BD1d12ee13E1f4Db8BB56458882796bE4',
  },
];
