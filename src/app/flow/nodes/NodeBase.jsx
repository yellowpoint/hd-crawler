import { Handle, Position } from '@xyflow/react';
import { Card, Spin } from 'antd';

import { useContextPage } from '@/lib/BaseContext';

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
        extra={<Spin size="small" spinning={loading} />}
      >
        {success && children(item)}
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
