'use client';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import clsx from 'clsx';

export default function Header({ needSideNav = false }) {
  return (
    <div
      className={clsx(
        'fixed top-0 z-[50] flex h-80 w-full items-center justify-between px-32 text-white',
        {
          'bg-black': needSideNav,
        },
      )}
    >
      <Link to="/">
        <img src="/imgs/logo.svg" alt="logo" />
      </Link>
    </div>
  );
}
