import { Handle, Position } from '@xyflow/react';
import { Card, Input } from 'antd';

import { useContextPage } from '@/lib/BaseContext';

export default function Node({ data, id }) {
  const { pageData, setPageData } = useContextPage();

  const handleChange = (evt) => {
    console.log(evt.target.value, id);
    const res = evt.target.value;
    setPageData({ [id]: res });
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Card title="输入关键词" bordered={false} className="w-100">
        <Input
          // value={pageData[id]}
          onChange={handleChange}
          className="nodrag"
        />
      </Card>

      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
