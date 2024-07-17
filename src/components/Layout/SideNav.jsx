import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';

const items = [
  {
    key: '1',
    icon: <AppstoreOutlined />,
    label: 'SEO',
    children: [
      {
        key: '/seo',
        label: 'SEO',
      },
      // {
      //   key: '12',
      //   label: '文章优化',
      // },
    ],
  },
  {
    key: '2',
    icon: <SettingOutlined />,
    label: 'Navigation Two',
    children: [
      {
        key: '21',
        label: 'Option 1',
      },
      {
        key: '22',
        label: 'Option 2',
      },
    ],
  },
];
export default function SideNav({ pathname }) {
  const navigate = useNavigate();
  console.log('pathname', pathname);
  const onClick = (e) => {
    const { item, key, keyPath } = e;
    console.log('onClick', e);
    if (key.startsWith('/')) {
      navigate(key);
    }
    // if (item.props.path) {
    //   navigate(item.props.path);
    // }
  };
  return (
    <div className="fixed bottom-0 left-0 top-0 z-[50] w-200 bg-white pt-16">
      <Menu
        onClick={onClick}
        mode="inline"
        defaultSelectedKeys={[pathname]}
        defaultOpenKeys={['1']}
        className="w-full"
        items={items}
      />
    </div>
  );
}
