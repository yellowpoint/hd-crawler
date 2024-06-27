import { Link } from 'react-router-dom';

import clsx from 'clsx';

import { getIsKol } from '@/lib/utils';
import { routerList } from '@/router';

export default function SideNav({ pathname }) {
  const linkList = routerList.filter((i) => i.side);

  return (
    <div className="fixed bottom-16 left-0 top-0 z-[50] pt-16">
      <div className="group flex h-full w-150 flex-col gap-16 rounded-24 bg-[#181818] p-12 text-white transition-all">
        {linkList.map(({ icon, side, path, show }, index) => {
          if (show === false) return null;
          const isAct = pathname === path;
          const iconUrl = icon + (isAct ? '2' : '');
          return (
            <Link to={path} key={index}>
              <div
                className={clsx(
                  'flex h-40 items-center gap-8 rounded-16  pl-8 hover:bg-tr-5',
                  { 'bg-tr-5': isAct },
                )}
              >
                {/* <img
                  src={`/icons/${iconUrl}.svg`}
                  className="w-24"
                  alt={name}
                /> */}
                <div
                  className={clsx('overflow-hidden text-nowrap text-12 ', {
                    ' font-bold text-main': isAct,
                  })}
                >
                  {side}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
