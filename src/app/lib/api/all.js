import axios, { baseImgURL, baseURL } from './axios';
// import { default as post } from './fetchApi';

const post = axios.post;

export const crawl = (e) => post(`/crawl`, e);
