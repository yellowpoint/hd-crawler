import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Handle, Position } from '@xyflow/react';
import { Card, Spin, Tag } from 'antd';

import { useContextPage } from '@/lib/BaseContext';

export const NodeTag = ({ status }) => {
  const statusMap = {
    waiting: {
      icon: <ClockCircleOutlined />,
      color: 'default',
      text: 'waiting',
    },
    loading: {
      icon: <SyncOutlined spin />,
      color: 'processing',
      text: 'processing',
    },
    success: {
      icon: <CheckCircleOutlined />,
      color: 'success',
      text: 'success',
    },
    error: {
      icon: <CloseCircleOutlined />,
      color: 'error',
      text: 'error',
    },
    warning: {
      icon: <ExclamationCircleOutlined />,
      color: 'warning',
      text: 'warning',
    },
    stop: {
      icon: <MinusCircleOutlined />,
      color: 'default',
      text: 'stop',
    },
  };

  const { icon, color, text } = statusMap[status] || {};

  return icon && color && text ? (
    <Tag icon={icon} color={color} className="!m-0">
      {text}
    </Tag>
  ) : null;
};

export default function Node({ data, id, children }) {
  const { pageData, setPageData } = useContextPage();

  const item = pageData[id] || {};
  const loading = item.status === 'loading';
  const success = item.status === 'success';
  const title = data.title;
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Card
        title={title}
        className="w-300"
        extra={<NodeTag status={item.status || 'waiting'} />}
      >
        {success && children(item)}
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
