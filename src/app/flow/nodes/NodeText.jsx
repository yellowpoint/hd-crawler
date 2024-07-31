import { useCallback, useEffect, useState } from 'react';

import { Handle, Position } from '@xyflow/react';
import { Card, Spin } from 'antd';

import { useContextPage } from '@/lib/BaseContext';

export default function Node({ data, id }) {
  const { pageData, setPageData } = useContextPage();

  const [loading, setLoading] = useState(false);
  const inputValue = pageData[1];

  useEffect(() => {
    if (inputValue === undefined) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [inputValue]);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Card
        title="结果是"
        className="w-300"
        extra={<Spin size="small" spinning={loading} />}
      >
        <div className="flex flex-col gap-8">{inputValue}</div>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
