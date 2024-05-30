import axios, { baseImgURL, baseURL } from './axios';
// import { default as post } from './fetchApi';

const post = axios.post;

export const wiki = (e) => post(`/wiki`, e);
export const google = (e) => post(`/google`, e);
