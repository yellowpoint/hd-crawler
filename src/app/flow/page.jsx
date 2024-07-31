import React, { useCallback, useState } from 'react';

import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { useSetState } from 'ahooks';

import '@xyflow/react/dist/style.css';

import { ContextPage } from '@/lib/BaseContext.jsx';

import nodeTypes from './nodes';

const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { value: '1' },
    type: 'NodeInput',
  },
  {
    id: '2',
    position: { x: 0, y: 300 },
    data: { label: '2' },
    type: 'NodeText',
  },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: '1-2', animated: true },
];

export default function Flow() {
  const [pageData, setPageData] = useSetState({});

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  return (
    <ContextPage.Provider value={{ pageData, setPageData }}>
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          // fitView
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ContextPage.Provider>
  );
}
