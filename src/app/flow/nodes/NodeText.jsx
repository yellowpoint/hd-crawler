import { useCallback } from 'react';

import { Handle, Position } from '@xyflow/react';

import { useContextPage } from '@/lib/BaseContext';

export default function Node({ data, id }) {
  const { pageData, setPageData } = useContextPage();

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>结果是{pageData[1]}</div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
