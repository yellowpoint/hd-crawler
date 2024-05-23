// 页面路由
import { lazy } from 'react';

const lazyLoad = (page) => lazy(() => import(`@/app/${page}/page.jsx`));

const routerList = [
  {
    path: '/',
    notNeedLogin: true,
    component: lazyLoad('home'),
  },

 
  {
    path: '*',
    title: '404',
    notNeedLogin: true,
    component: lazyLoad('NotFound'),
  },
];
export const notNeedLoginPaths = routerList
  .filter((item) => item.notNeedLogin)
  .map((item) => item.path);

export default routerList;
