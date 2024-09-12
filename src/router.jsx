// 页面路由
import { lazy } from 'react';

const lazyLoad = (page) => {
  // https://github.com/vitejs/vite/issues/4945
  // 多级目录不能直接导入
  const splitName = page.split('/');
  if (splitName.length === 1) {
    return lazy(() => import(`@/app/${splitName[0]}/page.jsx`));
  }
  if (splitName.length === 2) {
    return lazy(() => import(`@/app/${splitName[0]}/${splitName[1]}/page.jsx`));
  }
  if (splitName.length === 3) {
    return lazy(
      () =>
        import(
          `@/app/${splitName[0]}/${splitName[1]}/${splitName[2]}/page.jsx`
        ),
    );
  }
};

// 有side则出现在侧边栏
export const routerList = [
  {
    path: '/',
    notNeedLogin: true,
    component: lazyLoad('home'),
  },
  {
    path: '/seo',
    notNeedLogin: true,
    component: lazyLoad('seo'),
    side: 'SEO',
  },
  {
    path: '/flow',
    notNeedLogin: true,
    component: lazyLoad('flowList'),
  },
  {
    path: '/input',
    notNeedLogin: true,
    component: lazyLoad('input'),
  },
  {
    path: '/flow/:id',
    notNeedLogin: true,
    component: lazyLoad('flow'),
  },
  {
    path: '/prompt',
    notNeedLogin: true,
    component: lazyLoad('prompt'),
  },
  {
    path: '/google',
    notNeedLogin: true,
    component: lazyLoad('google'),
    // side: 'google 关键词',
  },
  {
    path: '/google/:id',
    notNeedLogin: true,
    component: lazyLoad('googleId'),
  },
  {
    path: '/crawler',
    notNeedLogin: true,
    component: lazyLoad('crawler'),
  },
  {
    path: '/crawler/:id',
    notNeedLogin: true,
    component: lazyLoad('crawler/[id]'),
  },
  {
    path: '/ai',
    notNeedLogin: true,
    component: lazyLoad('(ai)/ai'),
    // side: 'ai',
  },
  {
    path: '/ailist',
    notNeedLogin: true,
    component: lazyLoad('(ai)/aiList'),
    // side: 'ai',
  },
  {
    path: '/ai/:id',
    notNeedLogin: true,
    component: lazyLoad('(ai)/aiId'),
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
