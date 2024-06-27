import styles from '@/lib/antd.module.less';

import Providers from './Providers';

export default function RootLayout({ children }) {
  return (
    <div className={`flex h-screen flex-col  ${styles.page}`}>
      <Providers>{children}</Providers>
    </div>
  );
}
