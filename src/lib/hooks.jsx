import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useRequest } from 'ahooks';

import API from '@/lib/api';
import { notNeedLoginPaths } from '@/router';

export const useBeforeUnload = () => {
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = '';
  };
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};

export const useNotNeedLogin = () => {
  const { pathname } = useLocation();
  const isNotNeedLogin = notNeedLoginPaths.includes(pathname);
  return isNotNeedLogin;
};
