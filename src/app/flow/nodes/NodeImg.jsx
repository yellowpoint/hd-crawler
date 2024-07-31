import { useCallback } from 'react';

import { Handle, Position } from '@xyflow/react';

import { useContextPage } from '@/lib/BaseContext';

export default function Node({ data, id }) {
  const { pageData, setPageData } = useContextPage();

  const handleChange = (evt) => {
    console.log(evt.target.value, id);
    // onChange();
    const res = evt.target.value;
    setPageData({ [id]: res });
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Text:</label>
        <input
          id="text"
          name="text"
          // value={pageData[id]}
          onChange={handleChange}
          className="nodrag"
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
