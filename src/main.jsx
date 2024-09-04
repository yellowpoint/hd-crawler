import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import '@/lib/iconify';
import { message } from 'antd';
import ReactDOM from 'react-dom/client';

import './assets/globals.css';
import { PageLoading } from '@/components';

import RootLayout from './app/layout';
import RoutesComport from './router'; // 路由组件

// 修改title
const DomTitle = ({ item }) => {
  if (item.title) {
    document.title = item.title;
  }
  return <item.component />;
};

const isDev = import.meta.env.DEV;
const basename = '/';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode在开发时useEffect执行两次
  // <React.StrictMode>
  <BrowserRouter basename={basename}>
    <RootLayout>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {RoutesComport.map((item, index) => {
            return (
              <Route
                key={`routers${index}`}
                exact
                path={item.path}
                element={<DomTitle item={item} />}
              />
            );
          })}
        </Routes>
      </Suspense>
    </RootLayout>
  </BrowserRouter>,
  // </React.StrictMode>,
);
