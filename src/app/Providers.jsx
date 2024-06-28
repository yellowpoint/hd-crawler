'use client';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, theme } from 'antd';
import clsx from 'clsx';

// import Header from '@/components/Layout/Header';
import SideNav from '@/components/Layout/SideNav';

const AntdProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#FCE566',
          colorTextLightSolid: '#000',
          controlHeightLG: 48,
          borderRadius: 16,
          fontFamily: 'Urbanist, sans-serif',
        },
        components: {
          Button: {
            // paddingBlockLG:
            contentFontSizeLG: 24,
            contentLineHeightLG: 1,
            paddingInlineLG: 32,
            colorPrimary: '#FCE566',
            algorithm: false, // 不启用算法
            controlHeight: 40,
            borderRadius: 20,
            borderRadiusSM: 20,
            paddingInline: 24,
            colorLink: '#FCE566',
            colorLinkActive: '#e8dc83',
            colorLinkHover: '#e8dc83',
          },
          Input: {
            colorTextPlaceholder: '#404040',
            colorBgContainer: 'transparent',
            controlHeight: 38,
            borderRadius: 16,
          },
          InputNumber: {
            controlHeight: 38,
            borderRadius: 16,
          },
          Select: {
            borderRadius: 16,
            controlHeight: 38,
          },
          DatePicker: {
            borderRadius: 16,
            controlHeight: 38,
          },
          Tooltip: {
            colorText: '#fff',
            colorTextLightSolid: '#fff',
          },
        },
      }}
    >
      <StyleProvider hashPriority="high">{children}</StyleProvider>
    </ConfigProvider>
  );
};
const BaseProvider = ({ children }) => {
  return children;
  return <AntdProvider />;
};
export default function Providers({ children }) {
  const { pathname } = useLocation();
  const isRoot = ['/'].includes(pathname);
  const needHeader = !['/'].includes(pathname);
  const needSideNav = !['/'].includes(pathname);

  return (
    <BaseProvider>
      {/* {needHeader && (
        <div
          className={clsx('flex-none', {
            'mb-16 h-80': needSideNav,
          })}
        >
          {<Header needSideNav={needSideNav} />}
        </div>
      )} */}
      <div
        className={clsx('relative flex flex-1 bg-slate-100', {
          'p-16 pl-0': needSideNav,
        })}
      >
        {needSideNav && (
          <div className="mr-16 w-150 flex-none">
            <SideNav pathname={pathname} />
          </div>
        )}
        <div className="relative w-[calc(100%-96px)]">{children}</div>
      </div>
    </BaseProvider>
  );
}
