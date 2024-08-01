import { useState } from 'react';

import { Handle, Position } from '@xyflow/react';
import { Button, Card, Input } from 'antd';

import { useContextPage } from '@/lib/BaseContext';

export default function Node({ data, id }) {
  const { pageData, setPageData } = useContextPage();
  const [inputValue, setInputValue] = useState(pageData[id].value || '');

  const handleChange = (evt) => {
    const res = evt.target.value;
    setInputValue(res);
  };

  const handleClick = () => {
    setPageData({ [id]: inputValue });
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Card title="输入关键词" className="w-300">
        <div className="flex flex-col gap-8">
          <Input
            value={inputValue}
            onChange={handleChange}
            className="nodrag"
            placeholder="请输入关键词"
          />
          <Button type="primary" onClick={handleClick}>
            分析
          </Button>
        </div>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
