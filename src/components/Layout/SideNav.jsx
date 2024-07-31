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
    label: '市场分析',
  },
  {
    key: '2',
    icon: <SettingOutlined />,
    label: '独立站搭建',
    children: [
      {
        key: '21',
        label: '创建独立站',
      },
      {
        key: '22',
        label: '管理独立站',
      },
    ],
  },
  {
    key: '3',
    icon: <AppstoreOutlined />,
    label: '智能营销助手',
    children: [
      {
        key: '/seo',
        label: 'SEO优化助手',
      },
      {
        key: '/ailist',
        label: 'AI助手',
      },
      {
        key: '/flow',
        label: '流程图',
      },
      {
        key: '32',
        label: '社交媒体助手',
      },
      {
        key: '33',
        label: '广告投放助手',
      },
      {
        key: '34',
        label: 'B2B销售线索助手',
      },
    ],
  },
  {
    key: '4',
    icon: <SettingOutlined />,
    label: '数据分析助手',
    children: [
      {
        key: '41',
        label: '数据分析',
      },
    ],
  },
  {
    key: '5',
    icon: <SettingOutlined />,
    label: '工作流自定义',
    children: [
      {
        key: '51',
        label: '自定义工作流',
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
