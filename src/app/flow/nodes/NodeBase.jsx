import { useEffect } from 'react';

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

export default function Node(props) {
  const { data, id, children } = props;
  const {
    pageData,
    setPageData,
    next: _next,
    ...restPageData
  } = useContextPage();
  const item = pageData[id]?.data || {};
  // console.log('props', props);
  const prevValue = pageData[Number(id) - 1]?.data;
  const status = item.status || 'waiting';
  const loading = status === 'loading';
  const success = status === 'success';
  const waiting = status === 'waiting';
  const title = data.title;
  const setData = (data = {}) => {
    const newData = pageData;
    newData[id].data = {
      ...item,
      ...data,
    };
    setPageData(newData);
  };
  const next = () => {
    _next(id);
  };

  useEffect(() => {
    if (!loading) return;
    console.log(id, '开始');
  }, [loading, id]);
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Card title={title} className="w-300" extra={<NodeTag status={status} />}>
        {/* {success && children(item, setData)} */}
        {!waiting &&
          children({ item, setData, next, prevValue, ...restPageData })}
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
