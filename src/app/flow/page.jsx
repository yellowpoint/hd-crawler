import React, { useCallback, useState, useEffect } from 'react';

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
    id: 'img',
    position: { x: 0, y: 0 },
    data: { title: '商品图' },
    type: 'NodeImg',
  },
  {
    id: 'keyword',
    position: { x: 0, y: 400 },
    data: { title: '关键词' },
    type: 'NodeKeyword',
  },
  {
    id: 'text',
    position: { x: 0, y: 600 },
    data: { title: '分析结果' },
    type: 'NodeText',
  },
];
const initialEdges = [
  {
    id: 'e1-2',
    source: 'img',
    target: 'keyword',
    label: '1-2',
    animated: true,
  },
  {
    id: 'e2-3',
    source: 'keyword',
    target: 'text',
    label: '1-2',
    animated: true,
  },
];

export default function Flow() {
  const [pageData, setPageData] = useSetState({
    img: {
      status: 'loading', // init loading success error
    },
    keyword: {},
    text: {},
  });

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

  useEffect(() => {
    setTimeout(() => {
      setPageData({
        img: {
          status: 'success',
          value: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
        },
        keyword: {
          status: 'loading',
        },
      });
    }, 1000);
    setTimeout(() => {
      setPageData({
        keyword: {
          status: 'success',
          value: 'aaa',
        },
        text: {
          status: 'loading',
        },
      });
    }, 2000);
    setTimeout(() => {
      setPageData({
        keyword: {
          status: 'success',
          value: 'aaa',
        },
        text: {
          status: 'success',
          value: 'abababababababababaab',
        },
      });
    }, 3000);
  }, []);

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
