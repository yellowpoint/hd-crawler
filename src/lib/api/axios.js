import { message } from 'antd';
import axios from 'axios';

const isDev = process.env.NODE_ENV === 'development';
const proUrl = '//120.27.141.74/api';

export const isTest = isDev && false;
const devUrl = isTest ? '//120.27.141.74/api' : '//localhost:4000/api';

export const baseURL = isDev ? devUrl : proUrl;
export const baseImgURL = proUrl;

const api = axios.create({
  baseURL,
});

let isLoading = false;
const messageKey = 'apiLoading';
// 请求拦截器
api.interceptors.request.use(
  (config) => {
    if (!isLoading && !config?.noLoading) {
      isLoading = true;
      message.loading({
        key: messageKey,
        content: 'loading…',
        duration: 0,
      });
    }
    // 过滤掉null和字符串，否则后端接口报错
    if (config.method === 'post' && config.data) {
      Object.keys(config.data).forEach((key) => {
        if (config.data[key] === '' || config.data[key] === null) {
          delete config.data[key];
        }
      });
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  },
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const responseData = response.data;
    if (isLoading) {
      message.destroy(messageKey);
      isLoading = false;
    }
    // 检查 code 是否为 0
    if (responseData.code !== 0) {
      message.error({
        content:
          responseData.data ||
          responseData.message ||
          'code：' + responseData.code,
      });
      return Promise.reject(responseData.code);
    }
    // 处理成功的响应
    return responseData.data;
  },
  (error) => {
    if (isLoading) {
      message.destroy(messageKey);
      isLoading = false;
    }
    // 处理响应错误
    message.error({
      content: error.message,
    });

    return Promise.reject(error);
  },
);
export default api;
