import axios, { baseImgURL, baseURL } from './axios';
// import { default as post } from './fetchApi';

const post = axios.post;
export const POST = (...e) => post(...e);

export { axios, baseImgURL, baseURL };
export const wiki = (e) => post(`/wiki`, e);
export const googleAdd = (e) => post(`/google/add`, e);
export const googleAddws = (e) => post(`/google/addws`, e);
export const googleAll = (e) => post(`/google/all`, e);
export const googleGet = (e) => post(`/google/get`, e);
export const googleAddImg = (e) => post(`/google/addImg`, e);

export const baseAll = (e) => post(`/crawler/all`, e);

export const crud = (e) => post(`/crud`, e);
export const gkp = (e) => post(`/gkp`, e);
