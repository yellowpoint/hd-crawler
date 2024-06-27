// 页面路由
import { lazy } from 'react';

const lazyLoad = (page) => lazy(() => import(`@/app/${page}/page.jsx`));

// 有side则出现在侧边栏
export const routerList = [
  {
    path: '/',
    notNeedLogin: true,
    component: lazyLoad('home'),
  },
  {
    path: '/google',
    notNeedLogin: true,
    component: lazyLoad('google'),
    side: 'google 关键词',
  },
  {
    path: '/crawler',
    notNeedLogin: true,
    component: lazyLoad('crawler'),
    side: '基础爬取',
  },
  {
    path: '/ai',
    notNeedLogin: true,
    component: lazyLoad('ai'),
    // side: 'ai',
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
